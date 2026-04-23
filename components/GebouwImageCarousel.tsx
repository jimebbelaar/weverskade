"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

interface Props {
  images: string[];
  projectName: string;
}

/**
 * Building (gebouw) image carousel.
 *
 * This is a fully-custom physics-based slider rather than a thin layer over
 * native `overflow-x: scroll`. The native scroll primitive can't do
 * rubber-band overscroll, momentum, or spring snap — all of which are part of
 * what gives a "premium" carousel its solid, fluid feel.
 *
 * Every gesture (touch, mouse drag, trackpad wheel, keyboard) drives a single
 * `position` value. That value is rendered as a GPU-accelerated
 * `transform: translate3d(...)` on the track so we get jank-free 60fps+.
 *
 * Behaviour summary:
 *   - 1:1 cursor/finger tracking during drag.
 *   - Rubber-band resistance when dragging past either edge (iOS-style).
 *   - Release: velocity captured from last ~100ms of pointer samples,
 *     projected forward, snapped to the nearest item start in that direction,
 *     then animated with a critically-damped spring (no overshoot, no
 *     mechanical-feeling easing curve).
 *   - Trackpad / wheel: horizontal delta scrolls; debounced spring snap on
 *     idle.
 *   - Keyboard: ←/→ steps one item, Home/End to extremes.
 *   - Layout: 2 items per view on desktop, 1 on mobile (matching the
 *     original two-column row).
 *   - Affordance: thin progress bar below, click-to-scrub. Always visible
 *     when the gallery is wider than the viewport.
 */
export default function GebouwImageCarousel({ images, projectName }: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressTrackRef = useRef<HTMLDivElement>(null);
  const progressThumbRef = useRef<HTMLDivElement>(null);

  // Physics state — kept in refs so updates don't re-render React.
  const posRef = useRef(0); // px scrolled from start (>=0, <=max ideally)
  const targetRef = useRef(0);
  const velRef = useRef(0); // px/sec
  const maxRef = useRef(0);
  const snapsRef = useRef<number[]>([]); // item left offsets
  const draggingRef = useRef(false);
  const animRafRef = useRef(0);
  const wheelIdleRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sampleRef = useRef<{ x: number; t: number }[]>([]);

  const [scrollable, setScrollable] = useState(false);
  const [itemWidth, setItemWidth] = useState(0);
  const [gapPx, setGapPx] = useState(0);

  // ─── Render position to DOM ────────────────────────────────────────────
  const apply = useCallback(() => {
    const track = trackRef.current;
    if (track) {
      track.style.transform = `translate3d(${-posRef.current}px, 0, 0)`;
    }
    // Progress bar (direct DOM writes so we don't re-render React per frame).
    const wrapper = wrapperRef.current;
    const barEl = progressTrackRef.current;
    const thumb = progressThumbRef.current;
    if (wrapper && barEl && thumb && maxRef.current > 0) {
      const wrapW = wrapper.clientWidth;
      const trackTotalW = wrapW + maxRef.current; // == track.scrollWidth
      const barW = barEl.clientWidth;
      // Thumb width is proportional to the visible / total ratio.
      const thumbW = Math.max(20, (wrapW / trackTotalW) * barW);
      thumb.style.width = `${thumbW}px`;
      // Clamp to [0, max] so rubber-band overshoot doesn't push the thumb past the ends.
      const clampedPos = Math.max(0, Math.min(maxRef.current, posRef.current));
      const progress = clampedPos / maxRef.current;
      const left = progress * (barW - thumbW);
      thumb.style.transform = `translate3d(${left}px, 0, 0)`;
    }
  }, []);

  // ─── Layout (item width, max position, snap points) ────────────────────
  const recalcLayout = useCallback(() => {
    const wrap = wrapperRef.current;
    const track = trackRef.current;
    if (!wrap || !track) return;

    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const w = wrap.clientWidth;
    // Match the original gap values: 1.389vw desktop, 12px mobile (gap-3).
    const gap = isMobile ? 12 : window.innerWidth * 0.01389;
    const perView = isMobile ? 1 : 2;
    const iw = (w - gap * (perView - 1)) / perView;

    setItemWidth(iw);
    setGapPx(gap);

    // Defer snap/max computation until React commits the new item widths.
    requestAnimationFrame(() => {
      if (!trackRef.current || !wrapperRef.current) return;
      const t = trackRef.current;
      const wp = wrapperRef.current;
      const items = Array.from(t.children) as HTMLElement[];
      snapsRef.current = items.map((it) => it.offsetLeft);
      const trackWidth = t.scrollWidth;
      maxRef.current = Math.max(0, trackWidth - wp.clientWidth);
      setScrollable(maxRef.current > 1);
      // Clamp current position
      if (posRef.current > maxRef.current) {
        posRef.current = maxRef.current;
        targetRef.current = maxRef.current;
      } else if (posRef.current < 0) {
        posRef.current = 0;
        targetRef.current = 0;
      }
      apply();
    });
  }, [apply]);

  useEffect(() => {
    recalcLayout();
    const onResize = () => recalcLayout();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [recalcLayout, images.length]);

  // After `scrollable` flips on, the progress bar elements mount — paint the
  // thumb immediately (sets width + position) so it's not stuck at width: 0
  // until the next interaction.
  useEffect(() => {
    if (scrollable) apply();
  }, [scrollable, apply]);

  // ─── Critically-damped spring animation toward `target` ────────────────
  const springTo = useCallback(
    (target: number, initialVel = velRef.current) => {
      cancelAnimationFrame(animRafRef.current);
      targetRef.current = target;
      velRef.current = initialVel;

      // Tune for a fluid but quick feel. omega = sqrt(stiffness/mass).
      // Critically-damped: damping = 2 * sqrt(stiffness * mass).
      const stiffness = 170; // 1/s²
      const damping = 26; // 1/s — slightly under critical for a tiny bit of glide
      let last = performance.now();

      const tick = (now: number) => {
        const dt = Math.min(0.032, (now - last) / 1000);
        last = now;

        const displacement = posRef.current - targetRef.current;
        const accel = -stiffness * displacement - damping * velRef.current;
        velRef.current += accel * dt;
        posRef.current += velRef.current * dt;

        apply();

        if (Math.abs(displacement) < 0.4 && Math.abs(velRef.current) < 0.5) {
          posRef.current = targetRef.current;
          velRef.current = 0;
          apply();
          return;
        }
        animRafRef.current = requestAnimationFrame(tick);
      };
      animRafRef.current = requestAnimationFrame(tick);
    },
    [apply]
  );

  // Pick snap target with momentum projection.
  const snapTarget = useCallback((velocityPxPerSec: number) => {
    const snaps = snapsRef.current;
    if (!snaps.length) return posRef.current;
    // Project where momentum would carry us (with friction). 0.18s of coast
    // approximates the natural feel of a flick.
    const projected = posRef.current + velocityPxPerSec * 0.18;
    const clampedProjection = Math.max(0, Math.min(maxRef.current, projected));

    let best = snaps[0];
    let bestDist = Infinity;
    for (const s of snaps) {
      const c = Math.min(maxRef.current, s);
      const d = Math.abs(c - clampedProjection);
      if (d < bestDist) {
        bestDist = d;
        best = c;
      }
    }
    return best;
  }, []);

  // ─── Pointer drag (handles touch + mouse + pen) ────────────────────────
  useEffect(() => {
    const wrap = wrapperRef.current;
    if (!wrap || !scrollable) return;

    // iOS-style elastic resistance when dragged past an edge.
    const rubber = (overshoot: number) => {
      const softness = 220;
      const sign = Math.sign(overshoot);
      const mag = Math.abs(overshoot);
      return sign * ((mag * softness) / (softness + mag));
    };

    let startPos = 0;
    let startX = 0;
    let pointerId = -1;
    let moved = false;
    let direction: "horizontal" | "vertical" | "unknown" = "unknown";

    const onDown = (e: PointerEvent) => {
      // Ignore right/middle clicks
      if (e.button !== 0 && e.pointerType === "mouse") return;
      cancelAnimationFrame(animRafRef.current);
      draggingRef.current = true;
      moved = false;
      direction = "unknown";
      startPos = posRef.current;
      startX = e.clientX;
      const startY = e.clientY;
      pointerId = e.pointerId;
      sampleRef.current = [{ x: e.clientX, t: performance.now() }];
      // We keep `direction` per-pointer in a closure — store startY too.
      (onDown as any)._startY = startY;
      try {
        wrap.setPointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
      if (e.pointerType === "mouse") {
        wrap.style.cursor = "grabbing";
      }
    };

    const onMove = (e: PointerEvent) => {
      if (!draggingRef.current) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - (onDown as any)._startY;

      // Lock to horizontal once intent is clear (prevents fighting page scroll
      // on touch when the user is actually scrolling vertically).
      if (direction === "unknown") {
        if (Math.abs(dx) > 6 || Math.abs(dy) > 6) {
          direction = Math.abs(dx) > Math.abs(dy) ? "horizontal" : "vertical";
        }
      }
      if (direction === "vertical") {
        // Cancel horizontal drag — let page scroll win.
        draggingRef.current = false;
        try {
          wrap.releasePointerCapture(pointerId);
        } catch {
          /* ignore */
        }
        if (e.pointerType === "mouse") wrap.style.cursor = "grab";
        return;
      }

      if (Math.abs(dx) > 3) moved = true;
      if (e.pointerType === "touch" && direction === "horizontal" && e.cancelable) {
        e.preventDefault();
      }

      let raw = startPos - dx;
      // Apply rubber band when past either edge.
      if (raw < 0) raw = -rubber(-raw);
      else if (raw > maxRef.current) raw = maxRef.current + rubber(raw - maxRef.current);

      posRef.current = raw;
      apply();

      // Track samples for velocity (last 100ms).
      sampleRef.current.push({ x: e.clientX, t: performance.now() });
      const cutoff = performance.now() - 100;
      while (sampleRef.current.length > 2 && sampleRef.current[0].t < cutoff) {
        sampleRef.current.shift();
      }
    };

    const onUp = (e: PointerEvent) => {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      try {
        if (pointerId >= 0) wrap.releasePointerCapture(pointerId);
      } catch {
        /* ignore */
      }
      pointerId = -1;
      if (e.pointerType === "mouse") wrap.style.cursor = "grab";

      // Velocity in px/sec from samples.
      let vel = 0;
      const samples = sampleRef.current;
      if (samples.length >= 2) {
        const first = samples[0];
        const last = samples[samples.length - 1];
        const dt = (last.t - first.t) / 1000;
        if (dt > 0.005) {
          vel = -((last.x - first.x) / dt);
        }
      }

      const target = snapTarget(vel);
      springTo(target, vel);

      if (moved) {
        const suppress = (ev: Event) => {
          ev.stopPropagation();
          ev.preventDefault();
        };
        wrap.addEventListener("click", suppress, { capture: true, once: true });
      }
    };

    wrap.addEventListener("pointerdown", onDown);
    wrap.addEventListener("pointermove", onMove);
    wrap.addEventListener("pointerup", onUp);
    wrap.addEventListener("pointercancel", onUp);
    return () => {
      wrap.removeEventListener("pointerdown", onDown);
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerup", onUp);
      wrap.removeEventListener("pointercancel", onUp);
    };
  }, [apply, scrollable, snapTarget, springTo]);

  // ─── Wheel / trackpad ──────────────────────────────────────────────────
  useEffect(() => {
    const wrap = wrapperRef.current;
    if (!wrap || !scrollable) return;

    const onWheel = (e: WheelEvent) => {
      // Use horizontal delta if dominant; otherwise let vertical scroll the page.
      const horizontal = Math.abs(e.deltaX) >= Math.abs(e.deltaY);
      if (!horizontal) return;

      e.preventDefault();
      cancelAnimationFrame(animRafRef.current);
      let next = posRef.current + e.deltaX;
      // Soft clamping at edges (no rubber band on wheel — feels weird).
      next = Math.max(0, Math.min(maxRef.current, next));
      posRef.current = next;
      velRef.current = 0;
      apply();

      if (wheelIdleRef.current) clearTimeout(wheelIdleRef.current);
      wheelIdleRef.current = setTimeout(() => {
        const target = snapTarget(0);
        springTo(target, 0);
      }, 120);
    };

    wrap.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      wrap.removeEventListener("wheel", onWheel);
      if (wheelIdleRef.current) clearTimeout(wheelIdleRef.current);
    };
  }, [apply, scrollable, snapTarget, springTo]);

  // ─── Keyboard ──────────────────────────────────────────────────────────
  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!scrollable) return;
    const snaps = snapsRef.current;
    if (!snaps.length) return;
    // Find current index (closest snap to current position)
    let idx = 0;
    let bestDist = Infinity;
    for (let i = 0; i < snaps.length; i++) {
      const d = Math.abs(snaps[i] - posRef.current);
      if (d < bestDist) {
        bestDist = d;
        idx = i;
      }
    }
    let nextIdx = idx;
    if (e.key === "ArrowRight") nextIdx = Math.min(snaps.length - 1, idx + 1);
    else if (e.key === "ArrowLeft") nextIdx = Math.max(0, idx - 1);
    else if (e.key === "Home") nextIdx = 0;
    else if (e.key === "End") nextIdx = snaps.length - 1;
    else return;
    e.preventDefault();
    const target = Math.min(maxRef.current, snaps[nextIdx]);
    springTo(target, 0);
  };

  // ─── Progress bar scrub ────────────────────────────────────────────────
  const onScrubPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const trackEl = progressTrackRef.current;
    if (!trackEl) return;
    const rect = trackEl.getBoundingClientRect();

    const seek = (clientX: number) => {
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const target = ratio * maxRef.current;
      // Find nearest snap to target
      let best = target;
      let bestDist = Infinity;
      for (const s of snapsRef.current) {
        const c = Math.min(maxRef.current, s);
        const d = Math.abs(c - target);
        if (d < bestDist) {
          bestDist = d;
          best = c;
        }
      }
      springTo(best, 0);
    };

    seek(e.clientX);
    const onMove = (ev: PointerEvent) => seek(ev.clientX);
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  return (
    <div className="px-[2.431vw] mt-[1.389vw] max-md:px-5 max-md:mt-3">
      <div
        ref={wrapperRef}
        tabIndex={scrollable ? 0 : -1}
        role={scrollable ? "region" : undefined}
        aria-label={
          scrollable ? `${projectName} galerij — sleep, swipe of gebruik pijltjestoetsen` : undefined
        }
        onKeyDown={onKeyDown}
        className={[
          "relative overflow-hidden outline-none",
          // touch-action: pan-y lets the page scroll vertically while we
          // capture horizontal swipes. Critical on mobile.
          "touch-pan-y",
          scrollable ? "cursor-grab select-none" : "",
        ].join(" ")}
      >
        <div
          ref={trackRef}
          className="flex will-change-transform"
          style={{
            gap: `${gapPx}px`,
            transform: "translate3d(0, 0, 0)",
          }}
        >
          {images.map((img, i) => (
            <div
              key={`${img}-${i}`}
              className="relative shrink-0 overflow-hidden h-[31.111vw] max-md:h-[60vw]"
              style={{ width: itemWidth ? `${itemWidth}px` : undefined }}
            >
              {itemWidth > 0 && (
                <Image
                  src={img}
                  alt={`${projectName} detail ${i + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 47vw"
                  className="object-cover pointer-events-none"
                  quality={100}
                  draggable={false}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {scrollable && (
        <div
          ref={progressTrackRef}
          onPointerDown={onScrubPointerDown}
          role="scrollbar"
          aria-orientation="horizontal"
          aria-label={`${projectName} galerij positie`}
          className="relative h-[2px] bg-off-black/15 cursor-pointer mt-[1.111vw] max-md:mt-3"
        >
          <div
            ref={progressThumbRef}
            className="absolute top-0 left-0 h-full bg-off-black will-change-transform"
            style={{ width: 0, transform: "translate3d(0,0,0)" }}
          />
        </div>
      )}
    </div>
  );
}
