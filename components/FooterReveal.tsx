"use client";

import { useEffect, useRef } from "react";

export default function FooterReveal({
  children,
}: {
  children: React.ReactNode;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let ticking = false;

    function update() {
      const rect = wrap!.getBoundingClientRect();
      const windowH = window.innerHeight;

      const progress = Math.max(
        0,
        Math.min(1, (windowH - rect.top) / windowH)
      );

      // Dramatic parallax: from -35% to 0%
      const yOffset = (1 - progress) * -35;
      inner!.style.transform = `translateY(${yOffset}%)`;

      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    update();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div ref={wrapRef} className="relative overflow-hidden">
      <div ref={innerRef} className="will-change-transform">
        {children}
      </div>
    </div>
  );
}
