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

    // Word-level measurement. See ScrollHeroLineSplit for the rationale —
    // the earlier character-by-character scan could slice a word in half
    // when sub-pixel rounding shifted one character's top value.
    const tokens: { text: string; start: number; end: number; isWhitespace: boolean }[] = [];
    const tokenRe = /\s+|\S+/g;
    let m: RegExpExecArray | null;
    while ((m = tokenRe.exec(text)) !== null) {
      tokens.push({
        text: m[0],
        start: m.index,
        end: m.index + m[0].length,
        isWhitespace: /^\s+$/.test(m[0]),
      });
    }

    const range = document.createRange();
    const lineArray: string[] = [];
    let currentLine = "";
    let currentTop: number | null = null;

    for (const tok of tokens) {
      if (tok.isWhitespace) continue;
      range.setStart(textNode, tok.start);
      range.setEnd(textNode, tok.end);
      const rects = range.getClientRects();
      const rect = rects.length > 0 ? rects[0] : range.getBoundingClientRect();
      const top = Math.round(rect.top);

      if (currentTop === null || top === currentTop) {
        currentLine = currentLine ? `${currentLine} ${tok.text}` : tok.text;
        currentTop = top;
      } else {
        lineArray.push(currentLine);
        currentLine = tok.text;
        currentTop = top;
      }
    }
    if (currentLine) lineArray.push(currentLine);

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
