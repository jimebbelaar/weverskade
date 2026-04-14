"use client";

import { useState, useEffect } from "react";
import LineSplit from "@/components/LineSplit";
import { usePageNavigation } from "@/hooks/usePageNavigation";
import { vacatures as defaultVacatures } from "@/data/vacatures";

interface WerkenBijVacature {
  slug: string;
  title: string;
  shortDescription: string;
}

interface WerkenBijPageData {
  heroTitle?: string;
  vacatures?: WerkenBijVacature[];
}

export default function WerkenBijPage({ data }: { data?: WerkenBijPageData } = {}) {
  const vacatures = data?.vacatures ?? defaultVacatures;
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

  // Each vacature row gets enough time for its content to cascade in
  // before the next row starts — keeps it fluid and sequential
  const rowStagger = 0.25;
  const rowBaseDelay = 0.25;

  return (
    <section className="bg-off-white min-h-screen">
      {/* Hero title */}
      <div className="pt-[13.194vw] pl-[18.542vw] pr-[2.431vw] pb-[6.944vw] max-md:pt-[28vw] max-md:px-5 max-md:pb-10">
        <div className="overflow-hidden">
          <h1
            className="font-heading font-normal text-[5.556vw] leading-[1.05] tracking-[-0.111vw] text-off-black max-md:text-[40px] max-md:leading-[42px] max-md:tracking-[-0.8px] will-change-transform"
            style={{
              transform: animate ? "translateY(0)" : "translateY(110%)",
              transition: animate
                ? "transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.15s"
                : "none",
            }}
          >
            {data?.heroTitle ?? "Werken bij Weverskade"}
          </h1>
        </div>
      </div>

      {/* Vacatures table */}
      <div className="pl-[19.028vw] pr-[14.514vw] max-md:px-5">
        {/* Column headers */}
        <div className="flex max-md:hidden">
          <div className="w-[48%]">
            <p
              className="font-body font-medium text-[1.389vw] leading-normal text-off-black will-change-transform"
              style={{
                opacity: animate ? 1 : 0,
                transform: animate ? "translateY(0)" : "translateY(1.389vw)",
                transition: animate
                  ? "opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.2s, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.2s"
                  : "none",
              }}
            >
              Vacature titel
            </p>
          </div>
          <div className="flex-1">
            <p
              className="font-body font-medium text-[1.389vw] leading-normal text-off-black will-change-transform"
              style={{
                opacity: animate ? 1 : 0,
                transform: animate ? "translateY(0)" : "translateY(1.389vw)",
                transition: animate
                  ? "opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.3s, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.3s"
                  : "none",
              }}
            >
              Omschrijving
            </p>
          </div>
        </div>

        {/* Vacature rows */}
        <div className="mt-[2.083vw] max-md:mt-4">
          {vacatures.map((vacature, index) => {
            const delay = rowBaseDelay + index * rowStagger;
            const isLast = index === vacatures.length - 1;

            return (
              <div key={vacature.slug} className="relative">
                {/* Animated top line */}
                <div
                  className="h-px bg-off-black/20 origin-left will-change-transform"
                  style={{
                    transform: animate ? "scaleX(1)" : "scaleX(0)",
                    transition: animate
                      ? `transform 1.4s cubic-bezier(0.08, 0.82, 0.17, 1) ${delay}s`
                      : "none",
                  }}
                />

                <div className="flex py-[2.778vw] max-md:flex-col max-md:py-6">
                  {/* Vacature title */}
                  <div className="w-[48%] max-md:w-full max-md:mb-4">
                    <div className="overflow-hidden">
                      <p
                        className="font-heading font-normal text-[1.389vw] leading-normal text-off-black max-md:text-[20px] will-change-transform"
                        style={{
                          transform: animate
                            ? "translateY(0)"
                            : "translateY(110%)",
                          transition: animate
                            ? `transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) ${delay + 0.08}s`
                            : "none",
                        }}
                      >
                        {vacature.title}
                      </p>
                    </div>
                  </div>

                  {/* Description + link */}
                  <div className="flex-1">
                    <LineSplit
                      animate={animate}
                      delay={delay + 0.12}
                      stagger={0.06}
                      className="font-body font-medium text-[1.25vw] leading-[1.528vw] text-off-black max-w-[31.389vw] max-md:text-[16px] max-md:leading-[22px] max-md:max-w-none"
                    >
                      {vacature.shortDescription}
                    </LineSplit>

                    <div className="mt-[1.389vw] max-md:mt-4">
                      <a
                        href={`/werken-bij/${vacature.slug}`}
                        onClick={(e) =>
                          navigate(e, `/werken-bij/${vacature.slug}`)
                        }
                        className="link-underline font-body font-medium text-[0.972vw] leading-normal text-off-black pb-[0.347vw] max-md:text-[14px] max-md:pb-1"
                        style={{
                          opacity: animate ? 1 : 0,
                          transition: animate
                            ? `opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay + 0.22}s`
                            : "none",
                        }}
                      >
                        Naar vacature
                      </a>
                    </div>
                  </div>
                </div>

                {/* Animated bottom line (last row only) */}
                {isLast && (
                  <div
                    className="h-px bg-off-black/20 origin-left will-change-transform"
                    style={{
                      transform: animate ? "scaleX(1)" : "scaleX(0)",
                      transition: animate
                        ? `transform 1.4s cubic-bezier(0.08, 0.82, 0.17, 1) ${delay + 0.15}s`
                        : "none",
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom spacing */}
      <div className="pb-[11.111vw] max-md:pb-16" />
    </section>
  );
}
