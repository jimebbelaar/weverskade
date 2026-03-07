"use client";

import Image from "next/image";
import { usePortfolioSlider } from "@/hooks/usePortfolioSlider";

const defaultProjects = [
  {
    image: "/images/portfolio-1.png",
    title: "Nieuwemarkt Rotterdam",
    subtitle: "In het hart van de stad",
  },
  {
    image: "/images/portfolio-2.png",
    title: "The new citizen",
    subtitle: "Dichtbij alles",
  },
  {
    image: "/images/portfolio-3.png",
    title: "De Drie Lelies",
    subtitle: "Historie in het Maaslands erfgoed",
  },
];

interface PortfolioData {
  label?: string;
  heading?: string;
  linkText?: string;
  linkUrl?: string;
  projects?: { image: string; title: string; subtitle: string }[];
}

export default function Portfolio({ data }: { data?: PortfolioData } = {}) {
  const projects = data?.projects ?? defaultProjects;
  // 3 pages of the same projects (matching original)
  const cards = [...projects, ...projects, ...projects];
  const { currentPage, totalPages, trackRef, nextPage } =
    usePortfolioSlider(cards.length);

  return (
    <section className="bg-off-white px-[2.431vw] pb-[13.194vw] overflow-hidden max-md:px-5 max-md:pb-16">
      {/* Header row */}
      <div className="flex justify-between items-baseline pt-[1.389vw] pb-[1.806vw] max-md:hidden">
        <a
          href="#"
          className="link-underline font-body font-medium text-[1.389vw] leading-[1.2] text-off-black pb-[0.486vw]"
        >
          {data?.linkText ?? "Bekijk gehele portefeuille"}
        </a>
        <div className="flex items-center gap-[1.389vw]">
          <span className="font-body font-medium text-[1.389vw] leading-[1.2] text-off-black">
            Pagina {currentPage + 1} /{totalPages}
          </span>
          <button
            className="w-[3.403vw] h-[1.042vw] text-off-black cursor-pointer transition-opacity duration-200 ease-in-out hover:opacity-60"
            aria-label="Volgende pagina"
            onClick={nextPage}
          >
            <svg
              viewBox="0 0 49 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full"
            >
              <line
                x1="0"
                y1="7.5"
                x2="46"
                y2="7.5"
                stroke="currentColor"
                strokeWidth="1.2"
              />
              <polyline
                points="39,1 47,7.5 39,14"
                stroke="currentColor"
                strokeWidth="1.2"
                fill="none"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Slider track */}
      <div className="overflow-hidden cursor-grab active:cursor-grabbing select-none">
        <div
          ref={trackRef}
          className="grid grid-cols-[repeat(9,30.787vw)] gap-[1.389vw] transition-transform duration-600 ease-[cubic-bezier(0.25,0.1,0.25,1)] max-md:grid-cols-[repeat(9,calc(100vw-40px))] max-md:gap-5"
        >
          {cards.map((card, i) => (
            <div key={i} data-card>
              <div className="w-full aspect-[443/479] overflow-hidden max-md:aspect-[362/340]">
                <Image
                  src={card.image}
                  alt={card.title}
                  width={2400}
                  height={1800}
                  sizes="(max-width: 768px) calc(100vw - 40px), 30.787vw"
                  quality={100}
                  draggable={false}
                  className="w-full h-full object-cover object-center pointer-events-none"
                />
              </div>
              <div className="pt-[0.486vw] max-md:pt-2">
                <p className="font-body font-medium text-[1.389vw] leading-[1.597vw] text-off-black max-md:text-[20px] max-md:leading-normal">
                  {card.title}
                </p>
                <p className="font-body font-medium text-[1.389vw] leading-[1.597vw] text-off-black max-md:text-[20px] max-md:leading-normal">
                  {card.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile pagination — below slider */}
      <div className="hidden max-md:flex justify-between items-center pt-4">
        <span className="font-body font-medium text-[20px] leading-normal text-off-black">
          Pagina {currentPage + 1} /{totalPages}
        </span>
        <button
          className="w-[49px] h-[15px] text-off-black cursor-pointer transition-opacity duration-200 ease-in-out hover:opacity-60"
          aria-label="Volgende pagina"
          onClick={nextPage}
        >
          <svg
            viewBox="0 0 49 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            <line
              x1="0"
              y1="7.5"
              x2="46"
              y2="7.5"
              stroke="currentColor"
              strokeWidth="1.2"
            />
            <polyline
              points="39,1 47,7.5 39,14"
              stroke="currentColor"
              strokeWidth="1.2"
              fill="none"
            />
          </svg>
        </button>
      </div>
    </section>
  );
}
