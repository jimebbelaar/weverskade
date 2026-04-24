"use client";

import { useEffect, useRef, useState } from "react";

interface UseInViewOptions {
  /** Fraction of the target that must be visible before triggering. */
  threshold?: number;
  /** IntersectionObserver rootMargin. */
  rootMargin?: string;
  /** If true, the hook disconnects after the first intersection. */
  once?: boolean;
}

/**
 * Returns a [ref, inView] tuple. The ref should be attached to the element
 * being observed. `inView` flips true when the element enters the viewport.
 *
 * If `prefers-reduced-motion: reduce` is set, or IntersectionObserver is
 * unavailable, `inView` is true from the start so content is never hidden.
 */
export function useInView<T extends HTMLElement = HTMLDivElement>(
  options: UseInViewOptions = {}
): [React.RefObject<T | null>, boolean] {
  const { threshold = 0.15, rootMargin = "0px 0px -10% 0px", once = true } =
    options;
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (
      typeof window === "undefined" ||
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            if (once) observer.disconnect();
          } else if (!once) {
            setInView(false);
          }
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return [ref, inView];
}
