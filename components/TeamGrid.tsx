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

const fallbackImages = {
  top: [
    "/images/about-team-1.webp",
    "/images/about-team-2.webp",
    "/images/about-team-3.webp",
    "/images/about-team-4.webp",
    "/images/about-team-5.webp",
  ],
  bottom: [
    "/images/about-team-6.webp",
    "/images/about-team-7.webp",
    "/images/about-team-8.webp",
    "/images/about-team-9.webp",
  ],
};

const PAGE_SIZE = 9;
const TOP_ROW_SIZE = 5;

interface TeamMemberData {
  name: string;
  function?: string;
  image: string;
  imageSrcSet?: string;
}

const CARD_SIZES = "(max-width: 768px) 50vw, 23vw";

function TeamMember({
  src,
  srcSet,
  widthClass,
  name,
  role,
}: {
  src: string;
  srcSet?: string;
  widthClass: string;
  name?: string;
  role?: string;
}) {
  const lines: { text: string; isRole: boolean }[] = [
    { text: name ?? "Teamlid", isRole: false },
  ];
  if (role) lines.push({ text: role, isRole: true });

  return (
    <div
      className={`group relative ${widthClass} h-[21.875vw] overflow-hidden shrink-0 bg-brown max-md:h-auto max-md:aspect-[3/4]`}
    >
      <img
        src={src}
        srcSet={srcSet}
        sizes={srcSet ? CARD_SIZES : undefined}
        alt={name ?? "Teamlid"}
        decoding="async"
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]" />
      <div className="absolute bottom-0 left-0 right-0 px-[0.833vw] pb-[1.389vw] max-md:px-2 max-md:pb-3 z-1">
        {lines.map((line, i) => (
          <span key={i} className="block overflow-hidden">
            <span
              className={`block font-body font-medium text-off-white break-words hyphens-auto translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                line.isRole
                  ? "text-[0.972vw] leading-[1.5] max-md:text-[11px]"
                  : "text-[1.389vw] leading-[1.6] max-md:text-[15px]"
              }`}
              style={{ transitionDelay: `${i * 0.08}s` }}
              lang="nl"
            >
              {line.text}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function TeamGrid({ members }: { members?: TeamMemberData[] } = {}) {
  const totalPages = members && members.length > 0
    ? Math.max(1, Math.ceil(members.length / PAGE_SIZE))
    : 1;
  const [currentPage, setCurrentPage] = useState(0);

  function nextPage() {
    setCurrentPage((p) => (p >= totalPages - 1 ? 0 : p + 1));
  }

  return (
    <>
      {/* Header row */}
      <div className="flex justify-between items-center mb-[1.667vw] max-md:hidden">
        <p className="font-body font-medium text-[1.389vw] leading-[1.2] text-off-white">
          Weverskade
        </p>
        {totalPages > 1 && (
          <div className="flex items-center gap-[1.389vw]">
            <p className="font-body font-medium text-[1.389vw] leading-[1.2] text-off-white">
              Pagina {currentPage + 1} /{totalPages}
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
        )}
      </div>

      {/* Desktop paginated slider */}
      <div className="overflow-hidden max-md:hidden">
        <div
          className="flex transition-transform duration-600 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
          style={{ transform: `translateX(-${currentPage * 100}%)` }}
        >
          {Array.from({ length: totalPages }).map((_, pageIndex) => {
            const pageStart = pageIndex * PAGE_SIZE;
            const topMembers = members
              ? members.slice(pageStart, pageStart + TOP_ROW_SIZE)
              : null;
            const bottomMembers = members
              ? members.slice(pageStart + TOP_ROW_SIZE, pageStart + PAGE_SIZE)
              : null;
            return (
              <div key={pageIndex} className="w-full shrink-0">
                <div className="flex gap-[1.389vw]">
                  {(topMembers ?? fallbackImages.top.map((src) => ({ image: src, name: undefined as string | undefined, function: undefined as string | undefined, imageSrcSet: undefined as string | undefined }))).map((item, i) => (
                    <TeamMember
                      key={`${pageIndex}-top-${i}`}
                      src={typeof item === 'string' ? item : item.image}
                      srcSet={typeof item === 'string' ? undefined : item.imageSrcSet}
                      widthClass={topRowWidths[i] ?? topRowWidths[0]}
                      name={typeof item === 'string' ? undefined : item.name}
                      role={typeof item === 'string' ? undefined : item.function}
                    />
                  ))}
                </div>
                {(bottomMembers === null || bottomMembers.length > 0) && (
                  <div className="flex gap-[1.389vw] mt-[1.111vw]">
                    {(bottomMembers ?? fallbackImages.bottom.map((src) => ({ image: src, name: undefined as string | undefined, function: undefined as string | undefined, imageSrcSet: undefined as string | undefined }))).map((item, i) => (
                      <TeamMember
                        key={`${pageIndex}-bottom-${i}`}
                        src={typeof item === 'string' ? item : item.image}
                        srcSet={typeof item === 'string' ? undefined : item.imageSrcSet}
                        widthClass={bottomRowWidths[i] ?? bottomRowWidths[0]}
                        name={typeof item === 'string' ? undefined : item.name}
                        role={typeof item === 'string' ? undefined : item.function}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile — single page, wrapped grid */}
      <div className="hidden max-md:flex max-md:flex-wrap max-md:gap-3">
        {(members ?? [...fallbackImages.top, ...fallbackImages.bottom].map((src) => ({ image: src, name: "Teamlid", function: "", imageSrcSet: undefined as string | undefined }))).map((item, i) => (
          <TeamMember
            key={`mobile-${i}`}
            src={typeof item === 'string' ? item : item.image}
            srcSet={typeof item === 'string' ? undefined : (item as any).imageSrcSet}
            widthClass="max-md:w-[calc(50%-6px)]"
            name={typeof item === 'string' ? undefined : item.name}
            role={typeof item === 'string' ? undefined : (item as any).function}
          />
        ))}
      </div>
    </>
  );
}
