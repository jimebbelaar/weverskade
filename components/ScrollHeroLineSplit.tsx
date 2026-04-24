"use client";

import { useEffect, useRef, useState, useCallback } from "react";

/**
 * Splits text into its visually-rendered lines and animates each line with a
 * mask-slide reveal. Bulletproof against the two failure modes that plagued
 * the previous implementation:
 *
 * 1. **Font-swap drift** — measurement defers to `document.fonts.ready` and
 *    re-measures on the `loadingdone` event so we never measure with fallback
 *    metrics.
 *
 * 2. **Intrinsic-width feedback loop** — the previous implementation reused
 *    one `<p>` for measurement and rendering. After the split, that `<p>`'s
 *    intrinsic max-content shrank (each line is `nowrap` and shorter than the
 *    full text). When the parent was a flex item with `align-items: flex-start`
 *    it shrank to that smaller width, which fired ResizeObserver, which
 *    re-measured at the new width, which produced different lines, which…
 *    infinite flicker.
 *
 *    Fix: render TWO elements — a permanently-present, invisible "layout"
 *    element holding the original text (its max-content never changes) and a
 *    `position: absolute` overlay holding the animated split lines (out of
 *    flow, so it cannot influence parent sizing).
 *
 * Plus: 200ms debounced resize (GSAP SplitText's number) and `nowrap` on
 * every rendered line as a last-resort guarantee.
 */
export default function ScrollHeroLineSplit({
  text,
  indent = "0",
  delay = 0.15,
  stagger = 0.08,
  duration = 0.9,
  className = "",
  tag: Tag = "h2",
}: {
  text: string;
  indent?: string;
  delay?: number;
  stagger?: number;
  duration?: number;
  className?: string;
  tag?: "h1" | "h2" | "h3" | "p";
}) {
  const layoutRef = useRef<HTMLElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [lines, setLines] = useState<string[] | null>(null);
  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  /**
   * Gate the transition behind one paint of the initial `translateY(110%)`.
   * Prevents the animation from being "missed" if `visible` flips to true
   * before the overlay has mounted (can happen on cold load when fonts.ready
   * resolves after the intersection trigger has already fired).
   */
  const [overlayPrimed, setOverlayPrimed] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const effectiveIndent = isMobile ? "0" : indent;

  const splitLines = useCallback(() => {
    const el = layoutRef.current;
    if (!el) return;

    // Find the text node (the layout element contains exactly the original text)
    const textNode = el.firstChild;
    if (!textNode || textNode.nodeType !== Node.TEXT_NODE) return;

    const text = textNode.textContent || "";
    if (!text.trim()) return;

    // Word-level measurement. The previous character-by-character approach
    // could split mid-word when sub-pixel rounding made a character's
    // `rect.top` drift from the previous one ("Weverskade" → "Weve" /
    // "rskade"). By measuring one word at a time and grouping words with the
    // same `top`, mid-word splits are structurally impossible.
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
      // Use the *first* client rect of the word. If a word itself wraps
      // (extremely long word in a narrow container), this treats it as
      // belonging to the line where it starts.
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
      // Debounce — borrowed from GSAP SplitText's autoSplit. Width changes
      // during scroll/orientation/animation can fire many entries; we only
      // care about the settled state.
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

  // Re-measure when indent flips (mobile/desktop boundary)
  useEffect(() => {
    requestAnimationFrame(() => splitLines());
  }, [effectiveIndent, splitLines]);

  // Intersection observer for scroll-triggered reveal
  useEffect(() => {
    if (lines === null) return;
    const el = sentinelRef.current;
    if (!el) return;
    let raf1 = 0;
    let raf2 = 0;
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setVisible(true);
              observer.disconnect();
            }
          },
          { threshold: 0.15 }
        );
        observer.observe(el);
      });
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [lines]);

  // Prime the overlay: render once at translateY(110%) then flip on the
  // next frame so the transition always plays, even on cold loads where
  // `visible` may already be true when lines finish computing.
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

  const play = visible && overlayPrimed;

  return (
    <div ref={sentinelRef} className="relative">
      {/* Layout element: always in flow, always invisible. Holds the original
          text so the parent's intrinsic size is stable across split/unsplit
          renders. Also serves as the measurement target. */}
      <Tag
        ref={layoutRef as any}
        className={className}
        aria-hidden="true"
        style={{
          visibility: "hidden",
          textIndent: effectiveIndent,
        }}
      >
        {text}
      </Tag>

      {/* Split overlay: absolutely positioned, out of flow — cannot influence
          parent intrinsic width, so no feedback loop. */}
      {lines !== null && (
        <Tag
          className={`${className} absolute inset-0`}
          aria-label={text.trim()}
        >
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
                  ...(i === 0 ? { paddingLeft: effectiveIndent } : {}),
                }}
              >
                {line}
              </span>
            </span>
          ))}
        </Tag>
      )}
    </div>
  );
}
