"use client";

import Image from "next/image";
import { useImpactScroll } from "@/hooks/useImpactScroll";

const fallbackImages = [
  { src: "/images/portfolio-3.png", index: 0 },
  { src: "/images/portfolio-2.png", index: 1 },
  { src: "/images/nature.jpg", index: 2 },
];

const defaultWords = ["natuur", "mens", "ruimte"];

interface ImpactData {
  label?: string;
  heading?: string;
  words?: string[];
  description?: string;
  linkText?: string;
  linkUrl?: string;
  images?: { src: string; index: number }[];
}

export default function Impact({ data }: { data?: ImpactData } = {}) {
  const images = data?.images ?? fallbackImages;
  const words = data?.words ?? defaultWords;
  const { scrollRef, innerRef, wheelTrackRef, circleRef } = useImpactScroll();

  return (
    <div ref={scrollRef} className="h-[200vh] relative">
      <section className="sticky top-0 h-dvh w-full overflow-hidden">
        {/* Green background */}
        <div className="absolute inset-0 bg-green z-0" />

        <div
          ref={innerRef}
          className="absolute inset-0 z-1 origin-[0_0]"
        >
          {/* Left label */}
          <p className="absolute z-2 top-[13.333vw] left-[10.486vw] font-body font-medium text-[1.389vw] leading-[1.2] text-off-white max-md:top-[6.5%] max-md:left-[6.2vw] max-md:text-[17px]">
            {data?.label ?? <>Maatschappelijk en<br />sociaal betrokken</>}
          </p>

          {/* Image stack */}
          <div className="absolute z-1 top-[14.653vw] left-[34.653vw] w-[30.764vw] h-[37.569vw] overflow-hidden max-md:top-[18.5%] max-md:left-[26.9vw] max-md:w-[43.5vw] max-md:h-[53.2vw]">
            {images.map((img) => (
              <div
                key={img.index}
                data-img-layer={img.index}
                className="absolute inset-0 transition-[clip-path] duration-900 ease-[cubic-bezier(0.65,0,0.35,1)]"
                style={
                  img.index > 0
                    ? { clipPath: "inset(0 0 100% 0)" }
                    : undefined
                }
              >
                <Image
                  src={img.src}
                  alt=""
                  width={2400}
                  height={1800}
                  sizes="(max-width: 768px) 43.5vw, 30.764vw"
                  quality={100}
                  className="w-full h-full object-cover object-center transition-transform duration-900 ease-[cubic-bezier(0.65,0,0.35,1)]"
                />
              </div>
            ))}
          </div>

          {/* Title — "Aandacht" */}
          <span className="absolute z-3 top-[24.861vw] left-[10.486vw] font-heading font-normal text-[6.319vw] leading-[6.319vw] text-off-white pointer-events-none whitespace-nowrap max-md:top-[30.7%] max-md:left-[5vw] max-md:text-[31px] max-md:leading-[27px]">
            {(data?.heading ?? "Aandacht voor").split(" ")[0] ?? "Aandacht"}
          </span>

          {/* Title — "voor" */}
          <span className="absolute z-3 top-[24.861vw] left-[59vw] font-heading font-normal text-[6.319vw] leading-[6.319vw] text-off-white pointer-events-none whitespace-nowrap max-md:top-[30.7%] max-md:left-[54vw] max-md:text-[31px] max-md:leading-[27px]">
            {(data?.heading ?? "Aandacht voor").split(" ").slice(1).join(" ") ?? "voor"}
          </span>

          {/* Word rotation wheel — natuur / mens / ruimte all left-aligned */}
          <div className="absolute z-3 top-[24.861vw] left-[73.611vw] pointer-events-none max-md:top-[30.7%] max-md:left-[74.4vw]">
            <div
              ref={wheelTrackRef}
              className="transition-transform duration-800 ease-[cubic-bezier(0.65,0,0.35,1)]"
            >
              {words.map((word, i) => (
                <span
                  key={word}
                  data-wheel-word
                  className="block font-heading font-normal text-[6.319vw] leading-[6.319vw] h-[5.056vw] text-off-white whitespace-nowrap transition-opacity duration-800 ease-in-out max-md:text-[31px] max-md:leading-[27px] max-md:h-[22px]"
                  style={{
                    opacity: i === 0 ? 1 : i === 1 ? 0.21 : 0.09,
                  }}
                >
                  {word}
                </span>
              ))}
            </div>
          </div>

          {/* Circle stamp */}
          <Image
            ref={circleRef}
            src="/images/weverskade-cirkel.svg"
            alt=""
            width={203}
            height={208}
            unoptimized
            className="absolute z-2 top-[44.306vw] left-[27.847vw] w-[14.097vw] h-[14.444vw] transition-transform duration-800 ease-[cubic-bezier(0.65,0,0.35,1)] max-md:top-[42.1%] max-md:left-[19.2vw] max-md:w-[21.1vw] max-md:h-[21.9vw]"
          />

          {/* Content — right on desktop, bottom-left on mobile */}
          <div className="absolute z-3 top-[47.569vw] left-[69.375vw] w-[25.347vw] max-md:top-[61%] max-md:left-[5.2vw] max-md:w-[74.4vw]">
            <p className="font-body font-medium text-[1.319vw] leading-[1.875vw] tracking-[-0.026vw] text-off-white max-md:text-[17px] max-md:leading-[22px] max-md:tracking-[-0.34px]">
              {data?.description ?? "We maken keuzes die bijdragen aan een gezonde en toekomstbestendige leefomgeving."}
            </p>
            <a
              href={data?.linkUrl ?? "/maatschappelijk"}
              className="link-underline mt-[4.028vw] font-body font-medium text-[1.389vw] leading-[1.2] text-off-white pb-[0.486vw] max-md:mt-8 max-md:text-[17px] max-md:pb-1 max-md:whitespace-nowrap"
            >
              {data?.linkText ?? "Onze maatschappelijke betrokkenheid"}
            </a>
          </div>

        </div>
      </section>
    </div>
  );
}
