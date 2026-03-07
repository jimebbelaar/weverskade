"use client";

import Image from "next/image";
import { useParallax } from "@/hooks/useParallax";
import { useEffect, useState } from "react";

interface HeroData {
  title?: string;
  subtitle?: string;
  backgroundImage?: string;
}

export default function Hero({ data }: { data?: HeroData } = {}) {
  const { bgRef, heroRef } = useParallax();
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setAnimate(true);
      return;
    }

    if (window.__pageTransitioning) {
      const timer = setTimeout(() => setAnimate(true), 550);
      return () => clearTimeout(timer);
    }

    // Direct load — animate after paint
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
    <section
      ref={heroRef}
      className="relative w-full h-dvh overflow-hidden"
    >
      {/* Background — zoom-out entrance on the wrapper, parallax on the image */}
      <div
        className="absolute inset-0 z-0 will-change-transform"
        style={{
          transform: animate ? "scale(1)" : "scale(1.15)",
          transition: animate
            ? "transform 1.8s cubic-bezier(0.16, 1, 0.3, 1)"
            : "none",
        }}
      >
        <Image
          ref={bgRef}
          src={data?.backgroundImage ?? "/images/hero-bg.png"}
          alt="Weverskade gebouw"
          fill
          sizes="100vw"
          quality={100}
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-off-black opacity-30" />
      </div>

      {/* Hero Title — line reveal */}
      <div className="absolute z-2 inset-0 flex items-center pointer-events-none">
        <div className="w-full px-[2.431vw] max-md:px-5 overflow-hidden">
          <h1
            className="w-full flex justify-between items-baseline font-heading font-normal text-[2.847vw] leading-[3.194vw] text-off-white tracking-[0.01em] max-md:text-[21px] max-md:leading-[46px] will-change-transform"
            style={{
              transform: animate ? "translateY(0)" : "translateY(110%)",
              transition: animate
                ? "transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.15s"
                : "none",
            }}
          >
            {(data?.title ?? "Aandacht voor ruimte").split(" ").map((word, i, arr) => (
              <span key={i} className={i === Math.floor(arr.length / 2) ? "text-center" : i === arr.length - 1 ? "text-right" : ""}>
                {word}
              </span>
            ))}
          </h1>
        </div>
      </div>
    </section>
  );
}
