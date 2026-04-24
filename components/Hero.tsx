"use client";

import Image from "next/image";
import VimeoBackground from "@/components/VimeoBackground";
import { useParallax } from "@/hooks/useParallax";
import { useEffect, useLayoutEffect, useState } from "react";

interface HeroData {
  title?: string;
  subtitle?: string;
  backgroundImage?: string;
  videoUrl?: string;
}

export default function Hero({ data }: { data?: HeroData } = {}) {
  const { bgRef, heroRef } = useParallax();
  const [animate, setAnimate] = useState(false);
  const heroVideoUrl = data?.videoUrl ?? "https://vimeo.com/1184821093";
  const heroImage = data?.backgroundImage ?? "/images/hero-bg.webp";

  // On direct load, set a flag so the Navbar knows to start hidden
  useLayoutEffect(() => {
    if (!window.__pageTransitioning) {
      window.__navInitialHidden = true;
    }
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setAnimate(true);
      window.dispatchEvent(new Event("page-transition-end"));
      return;
    }

    if (window.__pageTransitioning) {
      const timer = setTimeout(() => setAnimate(true), 550);
      return () => clearTimeout(timer);
    }

    // Direct load — animate nav in first, then hero content
    const navTimer = setTimeout(() => {
      window.dispatchEvent(new Event("page-transition-end"));
    }, 150);
    const wordTimer = setTimeout(() => {
      setAnimate(true);
    }, 350);

    return () => {
      clearTimeout(navTimer);
      clearTimeout(wordTimer);
    };
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative w-full h-dvh overflow-hidden"
    >
      {/* Background — zoom-out entrance on the wrapper, parallax on the inner layer */}
      <div
        className="absolute inset-0 z-0 will-change-transform"
        style={{
          transform: animate ? "scale(1)" : "scale(1.3)",
          transition: animate
            ? "transform 3s cubic-bezier(0.16, 1, 0.3, 1)"
            : "none",
        }}
      >
        <div
          ref={bgRef as unknown as React.RefObject<HTMLDivElement>}
          className="absolute inset-0 will-change-transform"
        >
          {heroVideoUrl ? (
            <VimeoBackground url={heroVideoUrl} poster={heroImage} fit="cover" />
          ) : (
            <Image
              src={heroImage}
              alt="Weverskade gebouw"
              fill
              sizes="100vw"
              quality={100}
              className="object-cover object-center"
              priority
            />
          )}
        </div>
        <div className="absolute inset-0 bg-off-black opacity-30" />
      </div>

      {/* Hero Title — staggered word reveal */}
      <div className="absolute z-2 inset-0 flex items-center pointer-events-none">
        <div className="w-full px-[2.431vw] max-md:px-5">
          <h1
            className="w-full flex justify-between items-end font-heading font-normal text-[2.847vw] leading-[3.194vw] text-off-white tracking-[0.01em] max-md:text-[21px] max-md:leading-[28px]"
          >
            {(data?.title ?? "Aandacht voor ruimte").split(" ").map((word, i) => (
              <span
                key={i}
                className="overflow-hidden inline-block pb-[0.1em] -mb-[0.1em] align-bottom"
              >
                <span
                  className="inline-block will-change-transform"
                  style={{
                    transform: animate ? "translateY(0)" : "translateY(110%)",
                    transition: animate
                      ? `transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) ${0.15 + i * 0.12}s`
                      : "none",
                  }}
                >
                  {word}
                </span>
              </span>
            ))}
          </h1>
        </div>
      </div>
    </section>
  );
}
