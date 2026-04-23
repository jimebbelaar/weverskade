"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Image from "next/image";
import CTASection from "@/components/CTASection";
import LineSplit from "@/components/LineSplit";
import VimeoBackground from "@/components/VimeoBackground";
import { usePageNavigation } from "@/hooks/usePageNavigation";


interface PortfolioProject {
  id: number;
  slug: string;
  name: string;
  tagline: string;
  type: string;
  location: string;
  image: string;
}

interface PortfolioPageData {
  heroLabel?: string;
  heroTitle?: string;
  heroImages?: string[];
  heroVideoUrl?: string;
  ctaLabel?: string;
  ctaHeading?: string;
  ctaLinkText?: string;
  ctaLinkUrl?: string;
  projects?: PortfolioProject[];
}

const defaultProjects: PortfolioProject[] = [
  // Eigendom (6)
  {
    id: 1,
    slug: "de-nieuwe-markt-rotterdam",
    name: "De Nieuwe Markt Rotterdam",
    tagline: "In het hart van de stad",
    type: "Eigendom",
    location: "Rotterdam",
    image: "/images/portfolio-card-1.webp",
  },
  {
    id: 2,
    slug: "weverstede",
    name: "Weverstede",
    tagline: "Wonen aan het water",
    type: "Eigendom",
    location: "Nieuwegein",
    image: "/images/portfolio-card-2.webp",
  },
  {
    id: 3,
    slug: "de-drie-lelies",
    name: "De Drie Lelies",
    tagline: "Historie in het Maaslands erfgoed",
    type: "Eigendom",
    location: "Maassluis",
    image: "/images/portfolio-card-3.webp",
  },
  {
    id: 4,
    slug: "lely-campus",
    name: "Lely Campus",
    tagline: "Werken met uitzicht",
    type: "Eigendom",
    location: "Maassluis",
    image: "/images/portfolio-1.webp",
  },
  {
    id: 5,
    slug: "harbour-view",
    name: "Harbour View",
    tagline: "Aan de Scheveningse haven",
    type: "Eigendom",
    location: "Amsterdam",
    image: "/images/portfolio-card-1.webp",
  },
  {
    id: 6,
    slug: "het-weversplein",
    name: "Het Weversplein",
    tagline: "Ontmoeten in Delft",
    type: "Eigendom",
    location: "Delft",
    image: "/images/portfolio-card-2.webp",
  },
  // In ontwikkeling (3)
  {
    id: 7,
    slug: "the-new-citizen",
    name: "The New Citizen",
    tagline: "Dichtbij alles",
    type: "In ontwikkeling",
    location: "Heereveen",
    image: "/images/portfolio-card-3.webp",
  },
  {
    id: 8,
    slug: "parkzicht",
    name: "Parkzicht",
    tagline: "Wonen in het groen",
    type: "In ontwikkeling",
    location: "Heereveen",
    image: "/images/portfolio-2.webp",
  },
  {
    id: 9,
    slug: "maaspoort",
    name: "Maaspoort",
    tagline: "Nieuwbouw aan de Maas",
    type: "In ontwikkeling",
    location: "Maassluis",
    image: "/images/portfolio-card-1.webp",
  },
  // Facility Management (4)
  {
    id: 10,
    slug: "stadskwartier",
    name: "Stadskwartier",
    tagline: "Leven in het centrum",
    type: "Facility Management",
    location: "Heereveen",
    image: "/images/portfolio-3.webp",
  },
  {
    id: 11,
    slug: "de-horizon",
    name: "De Horizon",
    tagline: "Vergezichten over Friesland",
    type: "Facility Management",
    location: "Heereveen",
    image: "/images/portfolio-card-3.webp",
  },
  {
    id: 12,
    slug: "pella-business-park",
    name: "Pella Business Park",
    tagline: "Dutch heritage in Iowa",
    type: "Facility Management",
    location: "Pella (US)",
    image: "/images/portfolio-card-2.webp",
  },
  {
    id: 13,
    slug: "nieuwegein-centrum",
    name: "Nieuwegein Centrum",
    tagline: "Hart van de stad",
    type: "Facility Management",
    location: "Nieuwegein",
    image: "/images/portfolio-card-1.webp",
  },
];

export default function PortfolioPage({ data }: { data?: PortfolioPageData } = {}) {
  const projects = data?.projects ?? defaultProjects;
  const heroVideoUrl = data?.heroVideoUrl ?? "https://vimeo.com/1184821093";
  // Hero slideshow (fallback when no video URL): hero image first, then all unique project images
  const heroSlides = data?.heroImages ?? [
    "/images/portfolio-hero.webp",
    ...defaultProjects
      .map((p) => p.image)
      .filter((img, i, arr) => arr.indexOf(img) === i),
  ];
  const [animate, setAnimate] = useState(false);
  const [activeType, setActiveType] = useState("Alle");
  const [activeLocation, setActiveLocation] = useState("Alle");
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [typeOpen, setTypeOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
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

  // Start hero slideshow after entrance animation completes (only if no video)
  useEffect(() => {
    if (!animate || heroVideoUrl) return;
    // Wait for clip-path reveal to finish (~1.2s) before starting cycle
    const startDelay = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        setSlideIndex((prev) => (prev + 1) % heroSlides.length);
      }, 200);
    }, 1200);
    return () => {
      clearTimeout(startDelay);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [animate, heroVideoUrl]);

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
      {/* Hero */}
      <div className="pt-[24.375vw] px-[2.431vw] flex items-start max-md:flex-col max-md:pt-[30vw] max-md:px-5">
        {/* Left: title + subtitle */}
        <div className="shrink-0 max-w-[36.042vw] max-md:max-w-full">
          {/* ── Title mask-slide ── */}
          <h1 className="font-heading font-normal text-[5.556vw] leading-[1.05] tracking-[-0.111vw] text-off-black max-md:text-[40px] max-md:leading-[42px] max-md:tracking-[-0.8px] overflow-hidden">
            <span
              className="inline-block will-change-transform"
              style={{
                transform: animate ? "translateY(0)" : "translateY(110%)",
                transition: animate
                  ? "transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.15s"
                  : "none",
              }}
            >
              Portefeuille
            </span>
          </h1>

          {/* ── Paragraph line-by-line mask-slide ── */}
          <div className="mt-[3.125vw] max-md:mt-4">
            <LineSplit
              animate={animate}
              delay={0.3}
              stagger={0.08}
              className="font-body font-medium text-[1.597vw] leading-[2.153vw] tracking-[-0.032vw] text-off-black max-md:text-[17px] max-md:leading-[24px]"
            >
              Een selectie van woningen en commercieel vastgoed binnen de portefeuille van Weverskade. Actief in verschillende steden en landen, in eigendom, ontwikkeling en beheer.
            </LineSplit>
          </div>
        </div>

        {/* Right: featured image + caption */}
        <div className="ml-auto mt-[0.764vw] max-md:mt-8 max-md:ml-0 max-md:w-full">
          {/* ── Image clip-path reveal + slideshow ── */}
          <div
            className="relative w-[46.875vw] h-[28.958vw] overflow-hidden max-md:w-full max-md:h-[60vw]"
            style={{
              clipPath: animate ? "inset(0 0 0 0)" : "inset(100% 0 0 0)",
              transition: animate
                ? "clip-path 1.1s cubic-bezier(0.16, 1, 0.3, 1) 0.05s"
                : "none",
            }}
          >
            {heroVideoUrl ? (
              <div
                className="absolute inset-0 will-change-transform"
                style={{
                  transform: animate ? "scale(1)" : "scale(1.2)",
                  transition: animate
                    ? `transform 1.6s cubic-bezier(0.16, 1, 0.3, 1) 0.05s`
                    : "none",
                }}
              >
                <VimeoBackground url={heroVideoUrl} poster={heroSlides[0]} />
              </div>
            ) : (
              heroSlides.map((src, i) => (
                <Image
                  key={src}
                  src={src}
                  alt="Portefeuille overzicht"
                  fill
                  sizes="(max-width: 768px) 100vw, 46.875vw"
                  className="object-cover will-change-transform"
                  style={{
                    opacity: slideIndex === i ? 1 : 0,
                    transform: animate ? "scale(1)" : "scale(1.2)",
                    transition: animate
                      ? `transform 1.6s cubic-bezier(0.16, 1, 0.3, 1) 0.05s`
                      : "none",
                  }}
                  priority={i === 0}
                />
              ))
            )}
          </div>
          {/* ── Caption mask-slide ── */}
          <span className="block overflow-hidden">
            <p
              className="font-body font-medium text-[1.597vw] leading-[2.153vw] tracking-[-0.032vw] text-off-black mt-[1.25vw] will-change-transform max-md:text-[15px] max-md:mt-2"
              style={{
                transform: animate ? "translateY(0)" : "translateY(110%)",
                transition: animate
                  ? "transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.6s"
                  : "none",
              }}
            >
              Project slideshow
            </p>
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="px-[2.431vw] mt-[7.847vw] max-md:mt-10 max-md:px-5">
        <div className="grid grid-cols-3 max-md:grid-cols-1 max-md:gap-8">
          {/* Type filters */}
          <div className="col-span-1 max-md:col-span-1">
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
              <div className="overflow-hidden pb-[2vw] -mb-[2vw] max-md:pb-[16px] max-md:-mb-[16px]">
                <div className="flex flex-wrap gap-x-[0.444vw] gap-y-[1.111vw] max-md:gap-x-[10px] max-md:gap-y-[6px]">
                  {typeOptions.map((opt, i) => (
                    <span key={opt.label} className="overflow-hidden block pt-[0.4vw] pb-[2vw] -mt-[0.4vw] -mb-[2vw] max-md:pt-[2px] max-md:pb-[16px] max-md:-mt-[2px] max-md:-mb-[16px]">
                      <button
                        onClick={() => setActiveType(opt.label)}
                        className="font-heading font-normal tracking-[-0.056vw] text-off-black cursor-pointer bg-transparent border-none p-0 text-left will-change-transform"
                        style={{
                          transform: typeOpen ? "translateY(0)" : "translateY(200%)",
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
              <div className="overflow-hidden pb-[2vw] -mb-[2vw] max-md:pb-[16px] max-md:-mb-[16px]">
                <div className="flex flex-wrap gap-x-[0.444vw] gap-y-[1.111vw] max-md:gap-x-[10px] max-md:gap-y-[6px]">
                  {locationOptions.map((opt, i) => (
                    <span key={opt.label} className="overflow-hidden block pt-[0.4vw] pb-[2vw] -mt-[0.4vw] -mb-[2vw] max-md:pt-[2px] max-md:pb-[16px] max-md:-mt-[2px] max-md:-mb-[16px]">
                      <button
                        onClick={() => setActiveLocation(opt.label)}
                        className="font-heading font-normal tracking-[-0.056vw] text-off-black cursor-pointer bg-transparent border-none p-0 text-left will-change-transform"
                        style={{
                          transform: locationOpen ? "translateY(0)" : "translateY(200%)",
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
