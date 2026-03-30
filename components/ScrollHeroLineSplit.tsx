"use client";

import { useEffect, useRef, useState, useCallback } from "react";

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
  const measureRef = useRef<HTMLElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [lines, setLines] = useState<string[] | null>(null);
  const [visible, setVisible] = useState(false);

  const splitLines = useCallback(() => {
    const el = measureRef.current;
    if (!el) return;

    const content = el.textContent || "";
    if (!content.trim()) return;

    const textNode = el.firstChild;
    if (!textNode || textNode.nodeType !== Node.TEXT_NODE) return;

    const range = document.createRange();
    const lineArray: string[] = [];
    let lastTop = -1;
    let lineStart = 0;

    for (let i = 0; i <= content.length; i++) {
      range.setStart(textNode, i === content.length ? Math.max(0, i - 1) : i);
      range.setEnd(textNode, i === content.length ? i : i + 1);
      const rect = range.getBoundingClientRect();
      const top = Math.round(rect.top);

      if (lastTop !== -1 && top !== lastTop && i > lineStart) {
        lineArray.push(content.slice(lineStart, i).trimEnd());
        lineStart = i;
        while (lineStart < content.length && content[lineStart] === " ") {
          lineStart++;
          i = lineStart;
        }
      }
      lastTop = top;
    }

    const lastLine = content.slice(lineStart).trimEnd();
    if (lastLine) lineArray.push(lastLine);

    setLines(lineArray);
  }, []);

  useEffect(() => {
    splitLines();
    const onResize = () => setLines(null);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [splitLines]);

  useEffect(() => {
    if (lines === null) {
      requestAnimationFrame(() => splitLines());
    }
  }, [lines, splitLines]);

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

  if (lines === null) {
    return (
      <Tag
        ref={measureRef as any}
        className={className}
        style={{ visibility: "hidden", textIndent: indent }}
      >
        {text}
      </Tag>
    );
  }

  return (
    <div ref={sentinelRef}>
      <Tag className={className} aria-label={text.trim()}>
        {lines.map((line, i) => (
          <span key={i} className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
            <span
              className="block will-change-transform"
              style={{
                transform: visible ? "translateY(0)" : "translateY(110%)",
                transition: visible
                  ? `transform ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay + i * stagger}s`
                  : "none",
                ...(i === 0 ? { paddingLeft: indent } : {}),
              }}
            >
              {line}
            </span>
          </span>
        ))}
      </Tag>
    </div>
  );
}
