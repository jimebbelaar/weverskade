"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

export default function AerialParallax() {
  const sectionRef = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const img = imgRef.current;
    if (!section || !img) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    let ticking = false;

    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          const rect = section!.getBoundingClientRect();
          const viewH = window.innerHeight;

          // 0 when section bottom enters viewport, 1 when section top leaves
          const progress = Math.max(
            0,
            Math.min(1, (viewH - rect.top) / (viewH + rect.height))
          );

          // Image travels from -10% to +10% (slides down through the mask)
          const translate = (progress - 0.5) * 20;
          img!.style.transform = `translateY(${translate}%)`;

          ticking = false;
        });
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-[62.986vw] overflow-hidden max-md:h-[75vw]"
    >
      <Image
        ref={imgRef}
        src="/images/about-aerial.png"
        alt="Luchtfoto vastgoed"
        width={2400}
        height={1800}
        sizes="100vw"
        className="absolute inset-0 w-full h-[120%] object-cover will-change-transform"
        style={{ transform: "translateY(-10%)" }}
      />

      {/* Bottom-left Weverskade icon */}
      <svg
        viewBox="0 0 97 51"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute bottom-[4.097vw] left-[2.639vw] w-[6.736vw] h-[3.542vw] z-1 max-md:w-[10vw] max-md:h-[5.3vw] max-md:bottom-[3vw] max-md:left-[5vw]"
      >
        <path
          d="M0 16.955L37.5384 51H97V34.045H37.5384L0 0V16.955Z"
          fill="#F7F5F0"
        />
      </svg>

      {/* Top-right Weverskade icon */}
      <svg
        viewBox="0 0 97 51"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute top-[3.681vw] right-[2.431vw] w-[6.736vw] h-[3.542vw] z-1 max-md:w-[10vw] max-md:h-[5.3vw] max-md:top-[3vw] max-md:right-[5vw]"
      >
        <path
          d="M0 0V16.9401H59.4616L97 51V34.015L59.4616 0H0Z"
          fill="#F7F5F0"
        />
      </svg>
    </section>
  );
}
