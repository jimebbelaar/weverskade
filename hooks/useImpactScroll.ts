"use client";

import { useEffect, useRef } from "react";

export function useImpactScroll() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const wheelTrackRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const scrollEl = scrollRef.current;
    const inner = innerRef.current;
    const wheelTrack = wheelTrackRef.current;
    const circle = circleRef.current;

    if (!scrollEl || !inner || !wheelTrack || !circle) return;

    const totalPhases = 3;
    let displayedPhase = 0;
    let targetPhase = 0;
    let stepTimer: ReturnType<typeof setTimeout> | null = null;
    const STEP_DELAY = 1000; // slightly longer than longest CSS transition (900ms)
    let lastTouchY = 0;

    // Content bounds in vw units (from Figma desktop layout)
    const CONTENT_TOP_VW = 13.333; // top of label
    const CONTENT_BOTTOM_VW = 59; // bottom of circle stamp + content

    function isMobile() {
      return window.innerWidth <= 768;
    }

    function updateLayout() {
      if (isMobile()) {
        // On mobile, clear desktop scale/translate so CSS positioning works directly
        inner!.style.transform = "";
        return;
      }

      const vw = window.innerWidth / 100;
      const vh = window.innerHeight;

      const contentTopPx = CONTENT_TOP_VW * vw;
      const contentBottomPx = CONTENT_BOTTOM_VW * vw;
      const contentHeightPx = contentBottomPx - contentTopPx;

      const availableHeight = vh * 0.85;
      const scale = Math.min(1, availableHeight / contentHeightPx);

      const scaledTop = contentTopPx * scale;
      const scaledBottom = contentBottomPx * scale;
      const scaledCenter = (scaledTop + scaledBottom) / 2;

      const translateY = vh / 2 - scaledCenter;

      inner!.style.transform = `translateY(${translateY}px) scale(${scale})`;
    }

    function applyPhase(phase: number) {
      displayedPhase = phase;

      // 1. Word wheel — step must match the block height of each word in the
      // track. Desktop word is `h-[5.056vw]`; mobile override is `h-[22px]`.
      // Using a single vw step on mobile would drift a few px per phase (on
      // 375px, 5.056vw ≈ 19px vs the real 22px block), nudging "mens" and
      // "ruimte" a little low relative to the neighbouring "voor" word.
      const step = isMobile()
        ? `-${phase * 22}px`
        : `-${phase * 5.056}vw`;
      wheelTrack!.style.transform = `translateY(${step})`;

      const words =
        wheelTrack!.querySelectorAll<HTMLElement>("[data-wheel-word]");
      words.forEach((word, i) => {
        const dist = i - phase;
        if (dist < 0) word.style.opacity = "0";
        else if (dist === 0) word.style.opacity = "1";
        else if (dist === 1) word.style.opacity = "0.21";
        else word.style.opacity = "0.09";
      });

      // 2. Circle stamp
      circle!.style.transform = `rotate(${phase * 120}deg)`;

      // 3. Image layers
      const layers =
        scrollEl!.querySelectorAll<HTMLElement>("[data-img-layer]");
      layers.forEach((layer) => {
        const idx = parseInt(layer.dataset.imgLayer || "0");
        const img = layer.querySelector<HTMLElement>("img");

        if (img) {
          img.style.transform = `scale(${1 + (totalPhases - 1 - phase) * 0.08})`;
        }

        if (idx <= phase) {
          layer.style.clipPath = "inset(0 0 0 0)";
        } else {
          layer.style.clipPath = "inset(0 0 100% 0)";
        }
      });
    }

    function scheduleNext() {
      // A step is already pending — wait for it
      if (stepTimer !== null) return;
      // Already at target — nothing to do
      if (displayedPhase === targetPhase) return;

      // Advance one phase toward target
      const next =
        displayedPhase < targetPhase
          ? displayedPhase + 1
          : displayedPhase - 1;

      applyPhase(next);

      // Lock until CSS transition completes, then try the next step
      stepTimer = setTimeout(() => {
        stepTimer = null;
        scheduleNext();
      }, STEP_DELAY);
    }

    function onScroll() {
      const rect = scrollEl!.getBoundingClientRect();
      const scrollTop = -rect.top;
      const scrollHeight = scrollEl!.offsetHeight - window.innerHeight;

      if (scrollTop < 0 || scrollTop > scrollHeight) return;

      const progress = scrollTop / scrollHeight;
      const phase = Math.min(
        totalPhases - 1,
        Math.floor(progress * totalPhases)
      );

      targetPhase = phase;
      scheduleNext();
    }

    /** Block downward scroll if the animation hasn't caught up */
    function shouldBlockScroll(): boolean {
      if (displayedPhase >= totalPhases - 1) return false;

      const rect = scrollEl!.getBoundingClientRect();
      const scrollTop = -rect.top;
      const scrollHeight = scrollEl!.offsetHeight - window.innerHeight;

      if (scrollTop < 0 || scrollTop > scrollHeight || scrollHeight <= 0)
        return false;

      const progress = scrollTop / scrollHeight;
      // Allow scrolling slightly past the phase boundary so the next phase triggers,
      // but not far enough to skip ahead
      const maxProgress = (displayedPhase + 1) / totalPhases + 0.05;

      return progress >= maxProgress;
    }

    function onWheel(e: WheelEvent) {
      if (e.deltaY > 0 && shouldBlockScroll()) {
        e.preventDefault();
      }
    }

    function onTouchStart(e: TouchEvent) {
      lastTouchY = e.touches[0].clientY;
    }

    function onTouchMove(e: TouchEvent) {
      const currentY = e.touches[0].clientY;
      const deltaY = lastTouchY - currentY; // positive = scroll down
      if (deltaY > 0 && shouldBlockScroll()) {
        e.preventDefault();
      }
      lastTouchY = currentY;
    }

    // Run on both desktop and mobile — updateLayout handles the difference
    window.addEventListener("resize", updateLayout);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    updateLayout();
    onScroll();

    return () => {
      window.removeEventListener("resize", updateLayout);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      if (stepTimer !== null) clearTimeout(stepTimer);
    };
  }, []);

  return { scrollRef, innerRef, wheelTrackRef, circleRef };
}
