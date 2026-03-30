"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import ScrollHeroLineSplit from "@/components/ScrollHeroLineSplit";

interface IntroData {
  heading?: string;
  text?: string;
  linkText?: string;
  linkUrl?: string;
  image?: string;
}

export default function Intro({ data }: { data?: IntroData } = {}) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [imageVisible, setImageVisible] = useState(false);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setImageVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="bg-off-white pt-[3.611vw] px-[2.639vw] pb-[10.625vw] max-md:pt-10 max-md:px-5 max-md:pb-16">
      {/* Plant image — hidden on mobile */}
      <div ref={sentinelRef} className="max-md:hidden">
      <div
        className="w-[12.847vw] h-[16.389vw] ml-[32.083vw] overflow-hidden"
        style={{
          clipPath: imageVisible ? "inset(0 0 0 0)" : "inset(100% 0 0 0)",
          transition: imageVisible
            ? "clip-path 1.1s cubic-bezier(0.16, 1, 0.3, 1) 0.05s"
            : "none",
        }}
      >
        <Image
          src={data?.image ?? "/images/small-plant.webp"}
          alt="Groene plant"
          width={1373}
          height={800}
          sizes="12.847vw"
          quality={100}
          className="w-full h-full object-cover object-center will-change-transform"
          style={{
            transform: imageVisible ? "scale(1)" : "scale(1.2)",
            transition: imageVisible
              ? "transform 1.6s cubic-bezier(0.16, 1, 0.3, 1) 0.05s"
              : "none",
          }}
        />
      </div>
      </div>

      {/* Large heading */}
      <div className="mt-[7.153vw] max-md:mt-0">
        <ScrollHeroLineSplit
          text={data?.heading ?? "Weverskade is een ontwikkelende belegger in woningen en commercieel vastgoed. Door zelf te ontwikkelen en te beheren, maken we keuzes die verder kijken dan de vraag van nu."}
          indent="32.083vw"
          className="font-body font-medium text-[4.028vw] leading-[4.097vw] text-off-black max-md:text-[28px] max-md:leading-[30px]"
        />
      </div>

      {/* About row */}
      <div className="flex items-start mt-[5.556vw] gap-[2.778vw] max-md:flex-col max-md:mt-8 max-md:gap-0">
        <p className="font-heading font-normal not-italic text-[1.389vw] leading-[1.2] text-off-black shrink-0 w-[calc(33.33%_-_1.389vw)] max-md:hidden">
          Over ons
        </p>
        <div className="max-w-[45.486vw] max-md:max-w-none">
          <p className="font-body font-medium text-[1.597vw] leading-[2.153vw] tracking-[-0.032vw] text-off-black max-md:text-[17px] max-md:leading-[22px] max-md:tracking-[-0.34px]">
            {data?.text ?? "Sinds 2010 werken we met een betrokken team aan de groei van onze duurzame vastgoedportefeuille. Door zelf te ontwikkelen én te beheren blijven we dicht bij onze gebouwen en hun omgeving. Zo creëren we met aandacht voor ruimte plekken die vandaag werken en morgen nog steeds kloppen."}
          </p>
          <a
            href={data?.linkUrl ?? "/over-ons"}
            className="link-underline mt-[3.611vw] font-body font-medium text-[1.389vw] leading-[1.2] text-off-black pb-[0.486vw] max-md:text-[17px] max-md:mt-8 max-md:pb-1.5"
          >
            {data?.linkText ?? "Meer over ons"}
          </a>
        </div>
      </div>
    </section>
  );
}
