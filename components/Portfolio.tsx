"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { usePortfolioSlider } from "@/hooks/usePortfolioSlider";
import { usePageNavigation } from "@/hooks/usePageNavigation";

const defaultProjects = [
  {
    image: "/images/portfolio-1.webp",
    title: "Nieuwemarkt Rotterdam",
    subtitle: "In het hart van de stad",
    slug: "nieuwemarkt-rotterdam",
  },
  {
    image: "/images/portfolio-2.webp",
    title: "The new citizen",
    subtitle: "Dichtbij alles",
    slug: "the-new-citizen",
  },
  {
    image: "/images/portfolio-3.webp",
    title: "De Drie Lelies",
    subtitle: "Historie in het Maaslands erfgoed",
    slug: "de-drie-lelies",
  },
];

interface PortfolioData {
  label?: string;
  heading?: string;
  linkText?: string;
  linkUrl?: string;
  projects?: { image: string; title: string; subtitle: string; slug?: string }[];
}

export default function Portfolio({ data }: { data?: PortfolioData } = {}) {
  const projects = data?.projects ?? defaultProjects;
  // 3 pages of the same projects (matching original)
  const cards = [...projects, ...projects, ...projects];
  const { currentPage, totalPages, trackRef, nextPage } =
    usePortfolioSlider(cards.length);
  const navigate = usePageNavigation();
  const draggedRef = useRef(false);
  const pointerStartRef = useRef({ x: 0, y: 0 });
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const portfolioUrl = data?.linkUrl ?? "/portefeuille";

  return (
    <section className="bg-off-white px-[2.431vw] pb-[13.194vw] overflow-hidden max-md:px-5 max-md:pb-16">
      {/* Header row */}
      <div className="flex justify-between items-baseline pt-[1.389vw] pb-[1.806vw] max-md:hidden">
        <a
          href={portfolioUrl}
          onClick={(e) => navigate(e, portfolioUrl)}
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
          {cards.map((card, i) => {
            const cardUrl = card.slug ? `/gebouw/${card.slug}` : undefined;
            return (
              <a
                key={i}
                data-card
                href={cardUrl ?? "#"}
                onClick={(e) => {
                  if (!cardUrl || draggedRef.current) {
                    e.preventDefault();
                    return;
                  }
                  navigate(e, cardUrl);
                }}
                onPointerDown={(e) => {
                  draggedRef.current = false;
                  pointerStartRef.current = { x: e.clientX, y: e.clientY };
                }}
                onPointerMove={(e) => {
                  const dx = Math.abs(e.clientX - pointerStartRef.current.x);
                  const dy = Math.abs(e.clientY - pointerStartRef.current.y);
                  if (dx > 5 || dy > 5) draggedRef.current = true;
                }}
                className="block cursor-pointer"
                draggable={false}
              >
                <div
                  className="relative w-full aspect-[443/479] overflow-hidden max-md:aspect-[362/340]"
                  onMouseEnter={() => setHoveredCard(i)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <Image
                    src={card.image}
                    alt={card.title}
                    width={2400}
                    height={1800}
                    sizes="(max-width: 768px) calc(100vw - 40px), 30.787vw"
                    quality={100}
                    draggable={false}
                    className="w-full h-full object-cover object-center pointer-events-none transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                    style={{
                      transform: hoveredCard === i ? "scale(1.05)" : "scale(1)",
                    }}
                  />
                  <div
                    className={`absolute inset-0 bg-off-black transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      hoveredCard === i ? "opacity-57" : "opacity-0"
                    }`}
                  />
                  <div
                    className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      hoveredCard === i ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <svg
                      width="43"
                      height="23"
                      viewBox="0 0 43 23"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="absolute top-[1.389vw] right-[1.389vw] w-[2.986vw] h-[1.597vw] max-md:top-3 max-md:right-3 max-md:w-[24px] max-md:h-[13px] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                      style={{
                        transform: hoveredCard === i
                          ? "translate(0, 0) rotate(0deg)"
                          : "translate(-2vw, 2vw) rotate(-8deg)",
                      }}
                    >
                      <path d="M0 0V7.63965H26.3593L43 23V15.3401L26.3593 0H0Z" fill="#F7F5F0" />
                    </svg>
                    <svg
                      width="42"
                      height="23"
                      viewBox="0 0 42 23"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="absolute bottom-[1.389vw] left-[1.389vw] w-[2.917vw] h-[1.597vw] max-md:bottom-3 max-md:left-3 max-md:w-[24px] max-md:h-[13px] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                      style={{
                        transform: hoveredCard === i
                          ? "rotate(180deg) translate(0, 0)"
                          : "rotate(180deg) translate(-2vw, 2vw) rotate(-8deg)",
                      }}
                    >
                      <path d="M0 0V7.63965H25.7462L42 23V15.3401L25.7462 0H0Z" fill="#F7F5F0" />
                    </svg>
                    <span className="font-body font-medium text-[1.944vw] text-off-white underline decoration-solid max-md:text-[14px]">
                      Bekijk project
                    </span>
                  </div>
                </div>
                <div className="pt-[0.486vw] max-md:pt-2">
                  <p className="font-body font-medium text-[1.389vw] leading-[1.597vw] text-off-black max-md:text-[20px] max-md:leading-normal">
                    {card.title}
                  </p>
                  <p className="font-body font-medium text-[1.389vw] leading-[1.597vw] text-off-black max-md:text-[20px] max-md:leading-normal">
                    {card.subtitle}
                  </p>
                </div>
              </a>
            );
          })}
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
