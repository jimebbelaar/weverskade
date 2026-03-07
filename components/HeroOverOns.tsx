"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface HeroOverOnsProps {
  title?: string;
  image?: string;
}

export default function HeroOverOns({ title, image }: HeroOverOnsProps = {}) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Respect reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setAnimate(true);
      return;
    }

    if (window.__pageTransitioning) {
      // Page is sliding up (1s, aggressive ease-out).
      // Wait until the page has mostly settled before revealing content.
      const timer = setTimeout(() => setAnimate(true), 550);
      return () => clearTimeout(timer);
    }

    // Direct load / no transition — animate after paint
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
    <section className="bg-off-white pt-[19.375vw] px-[2.431vw] pb-[7.778vw] max-md:pt-24 max-md:px-5 max-md:pb-8">
      <div className="flex items-start">
        {/* ── Line mask reveal ── */}
        <div className="overflow-hidden mt-[5vw]">
          <h1
            className="font-heading font-normal text-[5.556vw] leading-normal tracking-[-0.111vw] text-off-black max-md:text-[9vw] max-md:leading-none max-md:tracking-[-0.3vw] max-md:whitespace-nowrap will-change-transform"
            style={{
              transform: animate ? "translateY(0)" : "translateY(110%)",
              transition: animate
                ? "transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.15s"
                : "none",
            }}
          >
            {title ?? "Over ons"}
          </h1>
        </div>

        {/* ── Image clip-path reveal ── */}
        <div
          className="w-[22.639vw] h-[28.889vw] overflow-hidden shrink-0 ml-auto mr-[16.181vw] max-md:w-[48vw] max-md:h-[62vw] max-md:mr-0"
          style={{
            clipPath: animate ? "inset(0 0 0 0)" : "inset(100% 0 0 0)",
            transition: animate
              ? "clip-path 1.1s cubic-bezier(0.16, 1, 0.3, 1) 0.05s"
              : "none",
          }}
        >
          <Image
            src={image ?? "/images/about-ds1.jpg"}
            alt="Weverskade kantoor"
            width={1373}
            height={800}
            sizes="(max-width: 768px) 55vw, 22.639vw"
            className="w-full h-full object-cover will-change-transform"
            style={{
              transform: animate ? "scale(1)" : "scale(1.2)",
              transition: animate
                ? "transform 1.6s cubic-bezier(0.16, 1, 0.3, 1) 0.05s"
                : "none",
            }}
          />
        </div>
      </div>
    </section>
  );
}
