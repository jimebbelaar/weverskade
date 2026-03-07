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
 * Splits a block of text into its visually-rendered lines and animates
 * each line with a mask-slide reveal (translateY from below).
 *
 * Works by measuring actual line breaks in the DOM using Range/getClientRects,
 * then re-rendering as individually-wrapped lines.
 */
export default function LineSplit({
  children,
  animate,
  delay = 0.3,
  stagger = 0.08,
  duration = 0.9,
  className = "",
}: LineSplitProps) {
  const measureRef = useRef<HTMLParagraphElement>(null);
  const [lines, setLines] = useState<string[] | null>(null);

  const splitLines = useCallback(() => {
    const el = measureRef.current;
    if (!el) return;

    const text = el.textContent || "";
    if (!text.trim()) return;

    // Use a Range across the entire text node to detect line breaks
    const textNode = el.firstChild;
    if (!textNode || textNode.nodeType !== Node.TEXT_NODE) return;

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
        // New line detected — capture previous line
        lineArray.push(text.slice(lineStart, i).trimEnd());
        lineStart = i;
        // skip leading spaces on the new line
        while (lineStart < text.length && text[lineStart] === " ") {
          lineStart++;
          i = lineStart;
        }
      }
      lastTop = top;
    }

    // Push the final line
    const lastLine = text.slice(lineStart).trimEnd();
    if (lastLine) lineArray.push(lastLine);

    setLines(lineArray);
  }, []);

  useEffect(() => {
    splitLines();

    // Re-split on resize
    const onResize = () => {
      setLines(null); // go back to unsplit to re-measure
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [splitLines]);

  // After lines reset to null, re-measure on next frame
  useEffect(() => {
    if (lines === null) {
      requestAnimationFrame(() => splitLines());
    }
  }, [lines, splitLines]);

  // Before lines are measured, render invisible text for measurement
  if (lines === null) {
    return (
      <p ref={measureRef} className={className} style={{ visibility: "hidden" }}>
        {children}
      </p>
    );
  }

  return (
    <p className={className} aria-label={children}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
          <span
            className="block will-change-transform"
            style={{
              transform: animate ? "translateY(0)" : "translateY(110%)",
              transition: animate
                ? `transform ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay + i * stagger}s`
                : "none",
            }}
          >
            {line}
          </span>
        </span>
      ))}
    </p>
  );
}
