"use client";

import { useState } from "react";

const topRowWidths = [
  "w-[14.722vw] max-md:w-[calc(50%-6px)]",
  "w-[22.639vw] max-md:w-[calc(50%-6px)]",
  "w-[14.583vw] max-md:w-[calc(50%-6px)]",
  "w-[22.708vw] max-md:w-[calc(50%-6px)]",
  "w-[14.306vw] max-md:w-[calc(50%-6px)]",
];

const bottomRowWidths = [
  "w-[22.639vw] max-md:w-[calc(50%-6px)]",
  "w-[22.708vw] max-md:w-[calc(50%-6px)]",
  "w-[22.778vw] max-md:w-[calc(50%-6px)]",
  "w-[22.708vw] max-md:w-[calc(50%-6px)]",
];

const images = {
  top: [
    "/images/about-team-1.jpg",
    "/images/about-team-2.jpg",
    "/images/about-team-3.jpg",
    "/images/about-team-4.jpg",
    "/images/about-team-5.jpg",
  ],
  bottom: [
    "/images/about-team-6.jpg",
    "/images/about-team-7.jpg",
    "/images/about-team-8.jpg",
    "/images/about-team-9.jpg",
  ],
};

const TOTAL_PAGES = 3;

interface TeamMemberData {
  name: string;
  function?: string;
  image: string;
}

function TeamMember({
  src,
  widthClass,
  name,
  role,
}: {
  src: string;
  widthClass: string;
  name?: string;
  role?: string;
}) {
  return (
    <div
      className={`group relative ${widthClass} h-[21.875vw] overflow-hidden shrink-0 bg-brown max-md:h-auto max-md:aspect-[3/4]`}
    >
      <img
        src={src}
        alt={name ?? "Teamlid"}
        decoding="async"
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]" />
      <div className="absolute bottom-0 left-0 right-0 px-[0.833vw] pb-[1.389vw] max-md:px-2 max-md:pb-3 z-1">
        {[name ?? "Teamlid", role ?? ""].filter(Boolean).map((line, i) => (
          <span key={i} className="block overflow-hidden">
            <span
              className="block font-body font-medium text-[1.389vw] leading-[1.6] text-off-white max-md:text-[15px] translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{ transitionDelay: `${i * 0.08}s` }}
            >
              {line}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function TeamGrid({ members }: { members?: TeamMemberData[] } = {}) {
  const [currentPage, setCurrentPage] = useState(0);

  function nextPage() {
    setCurrentPage((p) => (p >= TOTAL_PAGES - 1 ? 0 : p + 1));
  }

  return (
    <>
      {/* Header row */}
      <div className="flex justify-between items-center mb-[1.667vw] max-md:hidden">
        <p className="font-body font-medium text-[1.389vw] leading-[1.2] text-off-white">
          Weverskade
        </p>
        <div className="flex items-center gap-[1.389vw]">
          <p className="font-body font-medium text-[1.389vw] leading-[1.2] text-off-white">
            Pagina {currentPage + 1} /{TOTAL_PAGES}
          </p>
          <button
            className="w-[3.403vw] h-[1.042vw] text-off-white cursor-pointer transition-opacity duration-200 ease-in-out hover:opacity-60"
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

      {/* Desktop paginated slider */}
      <div className="overflow-hidden max-md:hidden">
        <div
          className="flex transition-transform duration-600 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
          style={{ transform: `translateX(-${currentPage * 100}%)` }}
        >
          {Array.from({ length: TOTAL_PAGES }).map((_, pageIndex) => (
            <div key={pageIndex} className="w-full shrink-0">
              <div className="flex gap-[1.389vw]">
                {(members ? members.slice(0, 5) : images.top).map((item, i) => (
                  <TeamMember
                    key={`${pageIndex}-top-${i}`}
                    src={typeof item === 'string' ? item : item.image}
                    widthClass={topRowWidths[i] ?? topRowWidths[0]}
                    name={typeof item === 'string' ? undefined : item.name}
                    role={typeof item === 'string' ? undefined : item.function}
                  />
                ))}
              </div>
              <div className="flex gap-[1.389vw] mt-[1.111vw]">
                {(members ? members.slice(5, 9) : images.bottom).map((item, i) => (
                  <TeamMember
                    key={`${pageIndex}-bottom-${i}`}
                    src={typeof item === 'string' ? item : item.image}
                    widthClass={bottomRowWidths[i] ?? bottomRowWidths[0]}
                    name={typeof item === 'string' ? undefined : item.name}
                    role={typeof item === 'string' ? undefined : item.function}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile — single page, wrapped grid */}
      <div className="hidden max-md:flex max-md:flex-wrap max-md:gap-3">
        {(members ?? [...images.top, ...images.bottom].map((src) => ({ image: src, name: "Teamlid", function: "" }))).map((item, i) => (
          <TeamMember
            key={`mobile-${i}`}
            src={typeof item === 'string' ? item : item.image}
            widthClass="max-md:w-[calc(50%-6px)]"
            name={typeof item === 'string' ? undefined : item.name}
            role={typeof item === 'string' ? undefined : (item as any).function}
          />
        ))}
      </div>
    </>
  );
}
