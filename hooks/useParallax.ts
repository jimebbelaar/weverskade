"use client";

import { useEffect, useRef } from "react";

export function useParallax() {
  const bgRef = useRef<HTMLImageElement>(null);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const bg = bgRef.current;
    const hero = heroRef.current;
    if (!bg || !hero) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    function onScroll() {
      const scrollY = window.scrollY;
      const heroHeight = hero!.offsetHeight;
      if (scrollY <= heroHeight) {
        bg!.style.transform = `translateY(${scrollY * 0.3}px)`;
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return { bgRef, heroRef };
}
