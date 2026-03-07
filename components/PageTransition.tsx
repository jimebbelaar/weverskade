"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect, useEffect, useState, useRef } from "react";

type Phase = "idle" | "frozen" | "animating";

// Shared stores for cross-component coordination
declare global {
  interface Window {
    __pageSnapshot?: { html: string; scrollY: number };
    __pageTransitioning?: boolean;
  }
}

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>("idle");
  const [snapshot, setSnapshot] = useState<{
    html: string;
    scrollY: number;
  } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const prevPathname = useRef(pathname);
  const rafRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useLayoutEffect(() => {
    if (pathname === prevPathname.current) return;
    prevPathname.current = pathname;

    // Cancel any ongoing transition
    cancelAnimationFrame(rafRef.current);
    if (timerRef.current) clearTimeout(timerRef.current);

    // Reduced motion — instant swap
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      window.__pageSnapshot = undefined;
      window.scrollTo(0, 0);
      return;
    }

    // Read the pre-captured snapshot (set by Menu before navigation)
    const captured = window.__pageSnapshot;
    window.__pageSnapshot = undefined;

    if (!captured) {
      // No snapshot (e.g. browser back/forward) — skip transition
      window.scrollTo(0, 0);
      return;
    }

    document.body.style.overflow = "hidden";
    window.__pageTransitioning = true;
    setSnapshot(captured);
    setPhase("frozen");

    window.dispatchEvent(new CustomEvent("page-transition-start"));

    // Double rAF: paint frozen frame, then start animation
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = requestAnimationFrame(() => {
        setPhase("animating");

        timerRef.current = setTimeout(() => {
          setSnapshot(null);
          setPhase("idle");
          window.__pageTransitioning = false;
          window.scrollTo(0, 0);
          document.body.style.overflow = "";
          window.dispatchEvent(new CustomEvent("page-transition-end"));
        }, 1000);
      });
    });
  }, [pathname]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current);
      if (timerRef.current) clearTimeout(timerRef.current);
      document.body.style.overflow = "";
    };
  }, []);

  const easing = "cubic-bezier(0.7, 0.05, 0.13, 1)";
  const dur = "1s";
  const active = phase !== "idle" && snapshot;

  // Single return — children always at the same tree position so React
  // never unmounts/remounts them across phase changes.
  return (
    <div style={active ? { position: "fixed", inset: 0, overflow: "hidden" } : undefined}>
      {/* New page — always first child for stable React tree identity */}
      <div
        ref={containerRef}
        data-page-content
        style={
          active
            ? {
                position: "absolute",
                zIndex: 2,
                top: 0,
                left: 0,
                right: 0,
                minHeight: "100vh",
                backgroundColor: "#F7F5F0",
                transform:
                  phase === "animating"
                    ? "translateY(0)"
                    : "translateY(100vh)",
                transition:
                  phase === "animating"
                    ? `transform ${dur} ${easing}`
                    : "none",
              }
            : undefined
        }
      >
        {children}
      </div>

      {/* Old page + overlay — rendered after children, layered behind with z-index */}
      {active && (
        <>
          <div
            style={{
              position: "absolute",
              zIndex: 0,
              top: -snapshot.scrollY,
              left: 0,
              right: 0,
              transform:
                phase === "animating"
                  ? "translateY(-25vh)"
                  : "translateY(0)",
              transition:
                phase === "animating"
                  ? `transform ${dur} ${easing}`
                  : "none",
            }}
            dangerouslySetInnerHTML={{ __html: snapshot.html }}
          />
          <div
            style={{
              position: "absolute",
              zIndex: 1,
              inset: 0,
              backgroundColor: "#1D1F1A",
              opacity: phase === "animating" ? 0.5 : 0,
              transition:
                phase === "animating"
                  ? `opacity 0.8s ${easing}`
                  : "none",
              pointerEvents: "none",
            }}
          />
        </>
      )}
    </div>
  );
}
