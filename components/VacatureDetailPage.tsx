"use client";

import { useState, useEffect } from "react";
import LineSplit from "@/components/LineSplit";
import { usePageNavigation } from "@/hooks/usePageNavigation";
import type { Vacature } from "@/data/vacatures";

interface VacatureDetailPageProps {
  vacature: Vacature;
}

export default function VacatureDetailPage({
  vacature,
}: VacatureDetailPageProps) {
  const [animate, setAnimate] = useState(false);
  const navigate = usePageNavigation();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setAnimate(true);
      return;
    }

    if (window.__pageTransitioning) {
      const timer = setTimeout(() => setAnimate(true), 550);
      return () => clearTimeout(timer);
    }

    let rafOuter = 0;
    let rafInner = 0;
    rafOuter = requestAnimationFrame(() => {
      rafInner = requestAnimationFrame(() => setAnimate(true));
    });
    return () => {
      cancelAnimationFrame(rafOuter);
      cancelAnimationFrame(rafInner);
    };
  }, []);

  return (
    <section className="bg-off-white min-h-screen">
      {/* Label + Title */}
      <div className="flex items-start pt-[19.375vw] px-[2.431vw] max-md:flex-col max-md:pt-[28vw] max-md:px-5">
        {/* Left label */}
        <div className="shrink-0 w-[22.569vw] max-md:w-auto max-md:mb-4">
          <div className="overflow-hidden">
            <p
              className="font-body font-medium text-[1.389vw] leading-normal text-off-black max-md:text-[15px] will-change-transform"
              style={{
                transform: animate ? "translateY(0)" : "translateY(110%)",
                transition: animate
                  ? "transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.15s"
                  : "none",
              }}
            >
              Vacature
            </p>
          </div>
        </div>

        {/* Title */}
        <div className="overflow-hidden">
          <h1
            className="font-heading font-normal text-[3.472vw] leading-normal tracking-[-0.069vw] text-off-black max-md:text-[32px] max-md:tracking-[-0.64px] will-change-transform"
            style={{
              transform: animate ? "translateY(0)" : "translateY(110%)",
              transition: animate
                ? "transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.15s"
                : "none",
            }}
          >
            {vacature.title}
          </h1>
        </div>
      </div>

      {/* Body content */}
      <div className="pl-[25.069vw] pr-[2.431vw] mt-[5.556vw] max-md:px-5 max-md:mt-8">
        <div className="max-w-[46.806vw] max-md:max-w-none">
          {vacature.body.map((block, i) => {
            // Each block staggers in sequentially — headings get a slightly
            // longer gap so they feel like section breaks
            const blockDelay = 0.2 + i * 0.1;

            if (block.type === "heading") {
              return (
                <div key={i} className="overflow-hidden mt-[2.153vw] mb-[2.153vw] max-md:mt-6 max-md:mb-6">
                  <p
                    className="font-body font-semibold text-[1.597vw] leading-[2.153vw] text-off-black max-md:text-[17px] max-md:leading-[24px] will-change-transform"
                    style={{
                      transform: animate ? "translateY(0)" : "translateY(110%)",
                      transition: animate
                        ? `transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) ${blockDelay}s`
                        : "none",
                    }}
                  >
                    {block.text}
                  </p>
                </div>
              );
            }

            return (
              <LineSplit
                key={i}
                animate={animate}
                delay={blockDelay}
                stagger={0.05}
                className="font-body font-medium text-[1.597vw] leading-[2.153vw] text-off-black mb-[2.153vw] last:mb-0 max-md:text-[17px] max-md:leading-[24px] max-md:mb-6"
              >
                {block.text}
              </LineSplit>
            );
          })}
        </div>

        {/* Email link */}
        <div className="mt-[5.556vw] max-md:mt-10">
          <a
            href="mailto:werkenbij@weverskade.com"
            className="link-underline font-body font-medium text-[0.972vw] leading-normal text-off-black pb-[0.347vw] max-md:text-[14px] max-md:pb-1"
            style={{
              opacity: animate ? 1 : 0,
              transition: animate
                ? `opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${0.2 + vacature.body.length * 0.1 + 0.1}s`
                : "none",
            }}
          >
            Stuur ons een email
          </a>
        </div>
      </div>

      {/* Bottom spacing */}
      <div className="pb-[11.111vw] max-md:pb-16" />
    </section>
  );
}
