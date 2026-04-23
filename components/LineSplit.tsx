"use client";

import { useRef, useState, useEffect, useCallback } from "react";

interface LineSplitProps {
  children: string;
  animate: boolean;
  /** Base delay in seconds before the first line starts */
  delay?: number;
  /** Stagger between each line in seconds */
  stagger?: number;
  /** Duration of each line animation in seconds */
  duration?: number;
  className?: string;
}

/**
 * Splits a block of text into its visually-rendered lines and animates each
 * line with a mask-slide reveal. See ScrollHeroLineSplit for the design notes
 * on the two-element overlay pattern that prevents the intrinsic-width
 * feedback loop and the font-swap reflow.
 */
export default function LineSplit({
  children,
  animate,
  delay = 0.3,
  stagger = 0.08,
  duration = 0.9,
  className = "",
}: LineSplitProps) {
  const layoutRef = useRef<HTMLParagraphElement>(null);
  const [lines, setLines] = useState<string[] | null>(null);
  /**
   * Gate the `animate` transition behind one paint of the initial
   * `translateY(110%)` state. Without this, if `animate` is already true by
   * the time the overlay mounts (common on a cold load when
   * `document.fonts.ready` resolves after the page transition finishes),
   * the overlay's very first render jumps straight to `translateY(0)` with
   * no transition — the animation is "missed" and the text just appears.
   */
  const [overlayPrimed, setOverlayPrimed] = useState(false);

  const splitLines = useCallback(() => {
    const el = layoutRef.current;
    if (!el) return;

    const textNode = el.firstChild;
    if (!textNode || textNode.nodeType !== Node.TEXT_NODE) return;

    const text = textNode.textContent || "";
    if (!text.trim()) return;

    const range = document.createRange();
    const lineArray: string[] = [];
    let lastTop = -1;
    let lineStart = 0;

    for (let i = 0; i <= text.length; i++) {
      range.setStart(textNode, i === text.length ? Math.max(0, i - 1) : i);
      range.setEnd(textNode, i === text.length ? i : i + 1);
      const rect = range.getBoundingClientRect();
      const top = Math.round(rect.top);

      if (lastTop !== -1 && top !== lastTop && i > lineStart) {
        lineArray.push(text.slice(lineStart, i).trimEnd());
        lineStart = i;
        while (lineStart < text.length && text[lineStart] === " ") {
          lineStart++;
          i = lineStart;
        }
      }
      lastTop = top;
    }

    const lastLine = text.slice(lineStart).trimEnd();
    if (lastLine) lineArray.push(lastLine);

    setLines((prev) => {
      if (prev && prev.length === lineArray.length && prev.every((l, i) => l === lineArray[i])) {
        return prev;
      }
      return lineArray;
    });
  }, []);

  useEffect(() => {
    let cancelled = false;
    let lastWidth = 0;
    let debounceTimer: ReturnType<typeof setTimeout> | null = null;

    const scheduleMeasure = () => {
      if (cancelled) return;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (cancelled) return;
          splitLines();
        });
      });
    };

    const fontsReady =
      typeof document !== "undefined" && document.fonts
        ? document.fonts.ready
        : Promise.resolve();

    fontsReady.then(() => {
      if (cancelled) return;
      lastWidth = layoutRef.current?.getBoundingClientRect().width ?? 0;
      scheduleMeasure();
    });

    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width ?? 0;
      if (Math.abs(w - lastWidth) < 0.5) return;
      lastWidth = w;
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        scheduleMeasure();
      }, 200);
    });
    if (layoutRef.current) ro.observe(layoutRef.current);

    const onLoadingDone = () => scheduleMeasure();
    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.addEventListener?.("loadingdone", onLoadingDone);
    }

    return () => {
      cancelled = true;
      if (debounceTimer) clearTimeout(debounceTimer);
      ro.disconnect();
      if (typeof document !== "undefined" && document.fonts) {
        document.fonts.removeEventListener?.("loadingdone", onLoadingDone);
      }
    };
  }, [splitLines]);

  // After the overlay mounts, paint one frame at translateY(110%) then flip
  // `overlayPrimed` so the transition from 110% → 0% actually animates, even
  // if `animate` was already true at mount time.
  useEffect(() => {
    if (lines === null) return;
    let raf1 = 0;
    let raf2 = 0;
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setOverlayPrimed(true));
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [lines]);

  const play = animate && overlayPrimed;

  return (
    <div className="relative">
      {/* Layout element: always present, invisible. Holds the original text so
          parent intrinsic sizing is stable. Also the measurement target. */}
      <p
        ref={layoutRef}
        className={className}
        aria-hidden="true"
        style={{ visibility: "hidden" }}
      >
        {children}
      </p>

      {/* Split overlay: absolutely positioned, out of flow. */}
      {lines !== null && (
        <p className={`${className} absolute inset-0`} aria-label={children}>
          {lines.map((line, i) => (
            <span key={i} className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
              <span
                className="block will-change-transform"
                style={{
                  whiteSpace: "nowrap",
                  transform: play ? "translateY(0)" : "translateY(110%)",
                  transition: play
                    ? `transform ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay + i * stagger}s`
                    : "none",
                }}
              >
                {line}
              </span>
            </span>
          ))}
        </p>
      )}
    </div>
  );
}
