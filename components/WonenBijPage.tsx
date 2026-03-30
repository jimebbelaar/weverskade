"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import CTASection from "@/components/CTASection";
import { usePageNavigation } from "@/hooks/usePageNavigation";

interface WonenProject {
  id: number;
  slug: string;
  name: string;
  tagline: string;
  type: string;
  location: string;
  image: string;
}

interface WonenBijPageData {
  heroLabel?: string;
  heroTitle?: string;
  ctaLabel?: string;
  ctaHeading?: string;
  ctaLinkText?: string;
  ctaLinkUrl?: string;
  projects?: WonenProject[];
}

const defaultProjects: WonenProject[] = [
  {
    id: 1,
    slug: "nieuwemarkt-rotterdam",
    name: "Nieuwemarkt Rotterdam",
    tagline: "In het hart van de stad",
    type: "Beschikbaar",
    location: "Rotterdam",
    image: "/images/portfolio-card-1.webp",
  },
  {
    id: 2,
    slug: "the-new-citizen",
    name: "The new citizen",
    tagline: "Dichtbij alles",
    type: "Beschikbaar",
    location: "Heereveen",
    image: "/images/portfolio-card-2.webp",
  },
  {
    id: 3,
    slug: "de-drie-lelies",
    name: "De Drie Lelies",
    tagline: "Historie in het Maaslands erfgoed",
    type: "Beschikbaar",
    location: "Maassluis",
    image: "/images/portfolio-card-3.webp",
  },
  {
    id: 4,
    slug: "weverstede",
    name: "Weverstede",
    tagline: "Wonen aan het water",
    type: "In ontwikkeling",
    location: "Nieuwegein",
    image: "/images/portfolio-card-1.webp",
  },
  {
    id: 5,
    slug: "parkzicht",
    name: "Parkzicht",
    tagline: "Wonen in het groen",
    type: "In ontwikkeling",
    location: "Heereveen",
    image: "/images/portfolio-card-2.webp",
  },
  {
    id: 6,
    slug: "maaspoort",
    name: "Maaspoort",
    tagline: "Nieuwbouw aan de Maas",
    type: "In ontwikkeling",
    location: "Maassluis",
    image: "/images/portfolio-card-3.webp",
  },
];

const DEFAULT_HERO_TEXT =
  "Onze woningprojecten zijn plekken waar mensen zich thuis kunnen voelen. Hier vindt u een overzicht van woningen in ontwikkeling en in eigendom, met aandacht voor kwaliteit, comfort en de omgeving waarin ze staan.";

function HeroLineSplit({
  text,
  animate,
  indent = "0",
  delay = 0.3,
  stagger = 0.08,
  duration = 0.9,
  className = "",
}: {
  text: string;
  animate: boolean;
  indent?: string;
  delay?: number;
  stagger?: number;
  duration?: number;
  className?: string;
}) {
  const measureRef = useRef<HTMLHeadingElement>(null);
  const [lines, setLines] = useState<string[] | null>(null);

  const splitLines = useCallback(() => {
    const el = measureRef.current;
    if (!el) return;

    const content = el.textContent || "";
    if (!content.trim()) return;

    const textNode = el.firstChild;
    if (!textNode || textNode.nodeType !== Node.TEXT_NODE) return;

    const range = document.createRange();
    const lineArray: string[] = [];
    let lastTop = -1;
    let lineStart = 0;

    for (let i = 0; i <= content.length; i++) {
      range.setStart(
        textNode,
        i === content.length ? Math.max(0, i - 1) : i
      );
      range.setEnd(textNode, i === content.length ? i : i + 1);
      const rect = range.getBoundingClientRect();
      const top = Math.round(rect.top);

      if (lastTop !== -1 && top !== lastTop && i > lineStart) {
        lineArray.push(content.slice(lineStart, i).trimEnd());
        lineStart = i;
        // Only skip regular spaces, not em-spaces used for indent
        while (
          lineStart < content.length &&
          content[lineStart] === " "
        ) {
          lineStart++;
          i = lineStart;
        }
      }
      lastTop = top;
    }

    const lastLine = content.slice(lineStart).trimEnd();
    if (lastLine) lineArray.push(lastLine);

    setLines(lineArray);
  }, []);

  useEffect(() => {
    splitLines();
    const onResize = () => setLines(null);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [splitLines]);

  useEffect(() => {
    if (lines === null) {
      requestAnimationFrame(() => splitLines());
    }
  }, [lines, splitLines]);

  if (lines === null) {
    return (
      <h1
        ref={measureRef}
        className={className}
        style={{ visibility: "hidden", textIndent: indent }}
      >
        {text}
      </h1>
    );
  }

  return (
    <h1 className={className} aria-label={text.trim()}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
          <span
            className="block will-change-transform"
            style={{
              transform: animate ? "translateY(0)" : "translateY(110%)",
              transition: animate
                ? `transform ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay + i * stagger}s`
                : "none",
              ...(i === 0 ? { paddingLeft: indent } : {}),
            }}
          >
            {line}
          </span>
        </span>
      ))}
    </h1>
  );
}

export default function WonenBijPage({ data }: { data?: WonenBijPageData } = {}) {
  const projects = data?.projects ?? defaultProjects;
  const [animate, setAnimate] = useState(false);
  const [activeType, setActiveType] = useState("Alle");
  const [activeLocation, setActiveLocation] = useState("Alle");
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [typeOpen, setTypeOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
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

  const typeOptions = useMemo(() => {
    const types = [...new Set(projects.map((p) => p.type))];
    return [
      { label: "Alle", count: projects.length },
      ...types.map((t) => ({
        label: t,
        count: projects.filter((p) => p.type === t).length,
      })),
    ];
  }, []);

  const locationOptions = useMemo(() => {
    const locations = [...new Set(projects.map((p) => p.location))];
    return [
      { label: "Alle", count: projects.length },
      ...locations.map((l) => ({
        label: l,
        count: projects.filter((p) => p.location === l).length,
      })),
    ];
  }, []);

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const typeMatch = activeType === "Alle" || p.type === activeType;
      const locationMatch =
        activeLocation === "Alle" || p.location === activeLocation;
      return typeMatch && locationMatch;
    });
  }, [activeType, activeLocation]);

  return (
    <section className="bg-off-white min-h-screen">
      {/* Hero — text only */}
      <div className="pt-[24.375vw] pb-[6.944vw] px-[2.083vw] max-md:pt-[30vw] max-md:pb-10 max-md:px-5">
        <HeroLineSplit
          text={data?.heroTitle ?? DEFAULT_HERO_TEXT}
          animate={animate}
          indent="10vw"
          delay={0.15}
          stagger={0.08}
          className="font-body font-medium text-[4.028vw] leading-[4.097vw] text-off-black max-md:text-[28px] max-md:leading-[30px]"
        />
      </div>

      {/* Filters */}
      <div className="px-[2.431vw] max-md:px-5">
        <div className="grid grid-cols-3 max-md:grid-cols-1 max-md:gap-8">
          {/* Type filters */}
          <div className="col-span-1">
            <button
              onClick={() => setTypeOpen((v) => { if (v) setActiveType("Alle"); return !v; })}
              className="flex items-center gap-[0.556vw] mb-[1.389vw] max-md:mb-3 cursor-pointer bg-transparent border-none p-0"
            >
              <p className="font-body font-medium text-[1.25vw] leading-[2.153vw] tracking-[-0.025vw] text-off-black max-md:text-[15px]">
                Type
              </p>
              <svg
                width="14"
                height="12"
                viewBox="0 0 14 12"
                fill="none"
                className="w-[0.972vw] h-[0.833vw] max-md:w-[14px] max-md:h-[12px]"
              >
                <path d="M1 0V2.32511H8.96908L14 7V4.66872L8.96908 0H1Z" fill="currentColor" />
                <path d="M13 12L13 9.67489L5.03092 9.67489L6.11959e-07 5L4.08153e-07 7.33128L5.03092 12L13 12Z" fill="currentColor" />
              </svg>
            </button>
            <div
              className="grid"
              style={{
                gridTemplateRows: typeOpen ? "1fr" : "0fr",
                transition: "grid-template-rows 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              <div className="overflow-hidden">
                <div className="flex flex-wrap gap-x-[0.556vw] gap-y-[1.389vw] max-md:gap-x-3 max-md:gap-y-2">
                  {typeOptions.map((opt, i) => (
                    <span key={opt.label} className="overflow-hidden block py-[0.4vw] -my-[0.4vw] max-md:py-[2px] max-md:-my-[2px]">
                      <button
                        onClick={() => setActiveType(opt.label)}
                        className="font-heading font-normal tracking-[-0.056vw] text-off-black cursor-pointer bg-transparent border-none p-0 text-left will-change-transform"
                        style={{
                          transform: typeOpen ? "translateY(0)" : "translateY(110%)",
                          transition: typeOpen
                            ? `transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) ${0.05 + i * 0.08}s`
                            : "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
                        }}
                      >
                        <span
                          className={`text-[2.778vw] leading-[2.153vw] max-md:text-[28px] max-md:leading-normal ${
                            activeType === opt.label
                              ? "underline decoration-solid"
                              : ""
                          }`}
                        >
                          {opt.label}
                        </span>
                        <span className="text-[1.792vw] leading-[2.153vw] max-md:text-[18px] max-md:leading-normal">
                          {` (${opt.count})`}
                        </span>
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Locatie filters */}
          <div className="col-start-2 col-span-1 max-md:col-span-1 max-md:col-start-1">
            <button
              onClick={() => setLocationOpen((v) => { if (v) setActiveLocation("Alle"); return !v; })}
              className="flex items-center gap-[0.556vw] mb-[1.389vw] max-md:mb-3 cursor-pointer bg-transparent border-none p-0"
            >
              <p className="font-body font-medium text-[1.25vw] leading-[2.153vw] tracking-[-0.025vw] text-off-black max-md:text-[15px]">
                Locatie
              </p>
              <svg
                width="14"
                height="12"
                viewBox="0 0 14 12"
                fill="none"
                className="w-[0.972vw] h-[0.833vw] max-md:w-[14px] max-md:h-[12px]"
              >
                <path d="M1 0V2.32511H8.96908L14 7V4.66872L8.96908 0H1Z" fill="currentColor" />
                <path d="M13 12L13 9.67489L5.03092 9.67489L6.11959e-07 5L4.08153e-07 7.33128L5.03092 12L13 12Z" fill="currentColor" />
              </svg>
            </button>
            <div
              className="grid"
              style={{
                gridTemplateRows: locationOpen ? "1fr" : "0fr",
                transition: "grid-template-rows 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              <div className="overflow-hidden">
                <div className="flex flex-wrap gap-x-[0.556vw] gap-y-[1.389vw] max-md:gap-x-3 max-md:gap-y-2">
                  {locationOptions.map((opt, i) => (
                    <span key={opt.label} className="overflow-hidden block py-[0.4vw] -my-[0.4vw] max-md:py-[2px] max-md:-my-[2px]">
                      <button
                        onClick={() => setActiveLocation(opt.label)}
                        className="font-heading font-normal tracking-[-0.056vw] text-off-black cursor-pointer bg-transparent border-none p-0 text-left will-change-transform"
                        style={{
                          transform: locationOpen ? "translateY(0)" : "translateY(110%)",
                          transition: locationOpen
                            ? `transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) ${0.05 + i * 0.08}s`
                            : "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
                        }}
                      >
                        <span
                          className={`text-[2.778vw] leading-[2.153vw] max-md:text-[28px] max-md:leading-normal ${
                            activeLocation === opt.label
                              ? "underline decoration-solid"
                              : ""
                          }`}
                        >
                          {opt.label}
                        </span>
                        <span className="text-[1.792vw] leading-[2.153vw] max-md:text-[18px] max-md:leading-normal">
                          {` (${opt.count})`}
                        </span>
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Project grid */}
      <div className="px-[2.431vw] mt-[1vw] max-md:px-5 max-md:mt-8">
        <div className="grid grid-cols-3 gap-x-[1.389vw] max-md:grid-cols-1">
          {filteredProjects.map((project) => (
            <a
              key={project.id}
              href={`/gebouw/${project.slug}`}
              onClick={(e) => navigate(e, `/gebouw/${project.slug}`)}
              className="block mb-[3.333vw] max-md:mb-6 no-underline"
            >
              {/* Card image with hover overlay */}
              <div
                className="relative w-full h-[33.264vw] overflow-hidden cursor-pointer max-md:h-[80vw]"
                onMouseEnter={() => setHoveredCard(project.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <Image
                  src={project.image}
                  alt={project.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 30vw"
                  className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{
                    transform: hoveredCard === project.id ? "scale(1.05)" : "scale(1)",
                  }}
                />
                {/* Hover overlay */}
                <div
                  className={`absolute inset-0 bg-off-black transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    hoveredCard === project.id ? "opacity-57" : "opacity-0"
                  }`}
                />
                <div
                  className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    hoveredCard === project.id ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {/* Top-right arrow */}
                  <svg
                    width="43"
                    height="23"
                    viewBox="0 0 43 23"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute top-[1.389vw] right-[1.389vw] w-[2.986vw] h-[1.597vw] max-md:top-4 max-md:right-4 max-md:w-[32px] max-md:h-[17px] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                    style={{
                      transform: hoveredCard === project.id
                        ? "translate(0, 0) rotate(0deg)"
                        : "translate(-2vw, 2vw) rotate(-8deg)",
                    }}
                  >
                    <path d="M0 0V7.63965H26.3593L43 23V15.3401L26.3593 0H0Z" fill="#F7F5F0" />
                  </svg>
                  {/* Bottom-left arrow */}
                  <svg
                    width="42"
                    height="23"
                    viewBox="0 0 42 23"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute bottom-[1.389vw] left-[1.389vw] w-[2.917vw] h-[1.597vw] max-md:bottom-4 max-md:left-4 max-md:w-[32px] max-md:h-[17px] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                    style={{
                      transform: hoveredCard === project.id
                        ? "rotate(180deg) translate(0, 0)"
                        : "rotate(180deg) translate(-2vw, 2vw) rotate(-8deg)",
                    }}
                  >
                    <path d="M0 0V7.63965H25.7462L42 23V15.3401L25.7462 0H0Z" fill="#F7F5F0" />
                  </svg>
                  <span className="font-body font-medium text-[1.944vw] text-off-white underline decoration-solid max-md:text-[20px]">
                    Naar project pagina
                  </span>
                </div>
              </div>
              {/* Card text */}
              <div className="mt-[0.486vw] max-md:mt-2">
                <p className="font-body font-medium text-[1.389vw] leading-[1.2] text-off-black max-md:text-[16px]">
                  {project.name}
                </p>
                <p className="font-body font-medium text-[1.389vw] leading-[1.2] text-off-black max-md:text-[16px]">
                  {project.tagline}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Contact CTA */}
      <div className="px-[2.431vw] mt-[8.125vw] pb-[16.875vw] max-md:px-5 max-md:mt-16 max-md:pb-16">
        <CTASection
          label="Neem contact op"
          linkText="Naar de contactpagina"
          linkHref="/contact"
          labelClassName="pl-[8.333vw] max-md:pl-0"
          headingClassName="font-body font-medium text-[3.75vw] leading-[3.681vw] text-off-black max-w-[62.569vw] mb-[2.778vw] max-md:text-[28px] max-md:leading-[32px] max-md:max-w-none max-md:mb-6"
        >
          Heeft u een vraag over een specifiek project of wilt u meer
          informatie over onze werkzaamheden? Stuur een email naar{" "}
          <a
            href="mailto:info@weverskade.com"
            className="text-off-black underline decoration-solid"
          >
            info@weverskade.com
          </a>{" "}
          of klik op onderstaande link.
        </CTASection>
      </div>
    </section>
  );
}
