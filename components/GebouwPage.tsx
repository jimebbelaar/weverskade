"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import LineSplit from "@/components/LineSplit";
import CTASection from "@/components/CTASection";
import GebouwMap from "@/components/GebouwMap";
import type { GebouwProject } from "@/data/gebouwen";

interface GebouwPageProps {
  project: GebouwProject;
}

/* ─── Detail line mask-slide helper ─── */
function DetailLine({
  children,
  animate,
  delay,
}: {
  children: React.ReactNode;
  animate: boolean;
  delay: number;
}) {
  return (
    <span className="block overflow-hidden">
      <span
        className="block will-change-transform"
        style={{
          transform: animate ? "translateY(0)" : "translateY(110%)",
          transition: animate
            ? `transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`
            : "none",
        }}
      >
        {children}
      </span>
    </span>
  );
}

/* ─── Quote with scroll-triggered line entrance ─── */
function QuoteLineSplit({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const measureRef = useRef<HTMLParagraphElement>(null);
  const [lines, setLines] = useState<string[] | null>(null);
  const [visible, setVisible] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

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
        while (lineStart < content.length && content[lineStart] === " ") {
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

  // Intersection observer for scroll-triggered reveal
  useEffect(() => {
    if (lines === null) return; // sentinel not in DOM yet
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [lines]);

  if (lines === null) {
    return (
      <p ref={measureRef} className={className} style={{ visibility: "hidden" }}>
        {text}
      </p>
    );
  }

  return (
    <div ref={sentinelRef}>
      <p className={className} aria-label={text.trim()}>
        {lines.map((line, i) => (
          <span key={i} className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
            <span
              className="block will-change-transform"
              style={{
                transform: visible ? "translateY(0)" : "translateY(110%)",
                transition: visible
                  ? `transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) ${0.15 + i * 0.08}s`
                  : "none",
              }}
            >
              {line}
            </span>
          </span>
        ))}
      </p>
    </div>
  );
}

/* ─── Scroll-triggered LineSplit wrapper ─── */
function ScrollLineSplit({
  children,
  delay = 0.3,
  stagger = 0.08,
  className = "",
}: {
  children: string;
  delay?: number;
  stagger?: number;
  className?: string;
}) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref}>
      <LineSplit
        animate={visible}
        delay={delay}
        stagger={stagger}
        className={className}
      >
        {children}
      </LineSplit>
    </div>
  );
}

export default function GebouwPage({ project }: GebouwPageProps) {
  const [animate, setAnimate] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    agreed: false,
  });

  // Parallax for hero image
  const heroSectionRef = useRef<HTMLDivElement>(null);
  const heroImgRef = useRef<HTMLImageElement>(null);

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

  // Hero image parallax (same as AerialParallax — progress-based -10% to +10%)
  useEffect(() => {
    const section = heroSectionRef.current;
    const img = heroImgRef.current;
    if (!section || !img) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let ticking = false;

    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          const rect = section!.getBoundingClientRect();
          const viewH = window.innerHeight;
          const progress = Math.max(
            0,
            Math.min(1, (viewH - rect.top) / (viewH + rect.height))
          );
          const translate = (progress - 0.5) * 20;
          img!.style.transform = `translateY(${translate}%)`;
          ticking = false;
        });
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  // Build detail lines array for staggered animation
  const detailLines: string[] = [];
  if (project.wonenBeschikbaar) {
    detailLines.push(project.address, project.status, project.wonenSize || project.size);
    if (project.epc) detailLines.push(project.epc);
  } else {
    detailLines.push(project.address, project.type, project.status, project.size);
    if (project.breeam) detailLines.push(project.breeam);
    if (project.epc) detailLines.push(project.epc);
  }

  const partnerLines: string[] = [];
  if (project.partners) partnerLines.push(project.partners);
  partnerLines.push(project.year);

  const BASE_DETAIL_DELAY = 0.35;
  const DETAIL_STAGGER = 0.06;

  return (
    <section className="bg-off-white min-h-screen">
      {/* ─── Hero: Name + Tagline ─── */}
      <div className="pt-[25.139vw] px-[2.431vw] max-md:pt-[30vw] max-md:px-5">
        <div className="grid grid-cols-2 max-md:grid-cols-1 max-md:gap-2">
          {/* Project name — mask-slide */}
          <div className="overflow-hidden">
            <h1
              className="font-body font-medium text-[4.931vw] leading-normal tracking-[-0.099vw] text-off-black will-change-transform max-md:text-[36px] max-md:tracking-[-0.72px]"
              style={{
                transform: animate ? "translateY(0)" : "translateY(110%)",
                transition: animate
                  ? "transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.15s"
                  : "none",
              }}
            >
              {project.name}
            </h1>
          </div>
          {/* Tagline — same grid column as details below */}
          <div className="overflow-hidden">
            <p
              className="font-heading font-normal text-[4.931vw] leading-normal tracking-[-0.099vw] text-off-black will-change-transform max-md:text-[36px] max-md:tracking-[-0.72px]"
              style={{
                transform: animate ? "translateY(0)" : "translateY(110%)",
                transition: animate
                  ? "transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.25s"
                  : "none",
              }}
            >
              {project.tagline}
            </p>
          </div>
        </div>
      </div>

      {/* ─── Details block — left-aligned with tagline at 50% ─── */}
      <div className="px-[2.431vw] mt-[12.292vw] max-md:mt-10 max-md:px-5">
        <div className="grid grid-cols-2 max-md:grid-cols-1 max-md:gap-6">
          {/* Left column — wonen pill or empty */}
          <div>
            {project.wonenBeschikbaar && (
              <div className="overflow-hidden mt-[8.125vw] max-md:mt-0">
                <div
                  className="will-change-transform"
                  style={{
                    transform: animate ? "translateY(0)" : "translateY(110%)",
                    transition: animate
                      ? "transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.35s"
                      : "none",
                  }}
                >
                  <span className="inline-block bg-green text-off-white font-heading font-normal text-[1.181vw] tracking-[-0.024vw] px-[1.667vw] py-[0.694vw] rounded-full max-md:text-[15px] max-md:px-6 max-md:py-2">
                    Woningen beschikbaar
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Right column — details, left-aligned at same 50% as tagline */}
          <div className="flex gap-[8.333vw] max-md:flex-col max-md:gap-4">
            {/* Main details column */}
            <div className="font-body font-medium text-[1.597vw] leading-[2.153vw] tracking-[-0.032vw] text-off-black max-md:text-[17px] max-md:leading-[24px]">
              {detailLines.map((line, i) => (
                <DetailLine
                  key={i}
                  animate={animate}
                  delay={BASE_DETAIL_DELAY + i * DETAIL_STAGGER}
                >
                  {line}
                </DetailLine>
              ))}
            </div>
            {/* Partners / year column — aligned at bottom */}
            <div className="font-body font-medium text-[1.597vw] leading-[2.153vw] tracking-[-0.032vw] text-off-black max-md:text-[17px] max-md:leading-[24px] flex flex-col justify-end max-md:justify-start">
              {partnerLines.map((line, i) => (
                <DetailLine
                  key={i}
                  animate={animate}
                  delay={BASE_DETAIL_DELAY + (detailLines.length - partnerLines.length + i) * DETAIL_STAGGER}
                >
                  {line}
                </DetailLine>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ─── Hero image — clip-path reveal + parallax ─── */}
      <div className="px-[2.361vw] mt-[4.861vw] max-md:px-5 max-md:mt-6">
        <div
          ref={heroSectionRef}
          className="relative w-full h-[52.083vw] overflow-hidden max-md:h-[70vw]"
          style={{
            clipPath: animate ? "inset(0 0 0 0)" : "inset(100% 0 0 0)",
            transition: animate
              ? "clip-path 1.1s cubic-bezier(0.16, 1, 0.3, 1) 0.05s"
              : "none",
          }}
        >
          <Image
            ref={heroImgRef}
            src={project.heroImage}
            alt={project.name}
            width={2400}
            height={1800}
            sizes="95vw"
            className="absolute inset-0 w-full h-[120%] object-cover will-change-transform"
            style={{ transform: "translateY(-10%)" }}
            priority
          />
        </div>
      </div>

      {/* ─── Over het project ─── */}
      <div className="px-[2.361vw] mt-[4.861vw] max-md:px-5 max-md:mt-8">
        <div className="grid grid-cols-12 gap-[1.389vw] max-md:grid-cols-1 max-md:gap-6">
          {/* Label */}
          <div className="col-span-4 max-md:col-span-1">
            <p className="font-body font-medium text-[1.389vw] leading-normal text-off-black max-md:text-[17px]">
              Over het project
            </p>
          </div>
          {/* Description col 1 */}
          <div className="col-span-4 max-md:col-span-1">
            <p className="font-body font-medium text-[1.597vw] leading-[2.153vw] tracking-[-0.032vw] text-off-black max-md:text-[17px] max-md:leading-[24px]">
              {project.descriptionLeft}
            </p>
          </div>
          {/* Description col 2 */}
          <div className="col-span-4 max-md:col-span-1">
            <p className="font-body font-medium text-[1.597vw] leading-[2.153vw] tracking-[-0.032vw] text-off-black max-md:text-[17px] max-md:leading-[24px]">
              {project.descriptionRight}
            </p>
          </div>
        </div>
      </div>

      {/* ─── Full-width image ─── */}
      <div className="px-[2.431vw] mt-[6.944vw] max-md:px-5 max-md:mt-8">
        <div className="relative w-full h-[52.153vw] overflow-hidden max-md:h-[70vw]">
          <Image
            src={project.fullWidthImage}
            alt={`${project.name} overzicht`}
            fill
            sizes="95vw"
            className="object-cover"
            quality={100}
          />
        </div>
      </div>

      {/* ─── Two side-by-side images ─── */}
      <div className="px-[2.431vw] mt-[1.389vw] flex gap-[1.389vw] max-md:px-5 max-md:mt-3 max-md:flex-col max-md:gap-3">
        <div className="relative flex-1 h-[31.111vw] overflow-hidden max-md:h-[60vw]">
          <Image
            src={project.smallImages[0]}
            alt={`${project.name} detail 1`}
            fill
            sizes="(max-width: 768px) 100vw, 47vw"
            className="object-cover"
            quality={100}
          />
        </div>
        <div className="relative flex-1 h-[31.042vw] overflow-hidden max-md:h-[60vw]">
          <Image
            src={project.smallImages[1]}
            alt={`${project.name} detail 2`}
            fill
            sizes="(max-width: 768px) 100vw, 47vw"
            className="object-cover"
            quality={100}
          />
        </div>
      </div>

      {/* ─── Google Map ─── */}
      <div className="px-[2.431vw] mt-[4.167vw] max-md:px-5 max-md:mt-6">
        <div className="relative w-full h-[53.194vw] overflow-hidden max-md:h-[80vw]">
          <GebouwMap
            lat={project.mapCoordinates.lat}
            lng={project.mapCoordinates.lng}
            projectName={project.name}
          />
        </div>
      </div>

      {/* ─── Quote section (non-wonen) OR Contact form (wonen) ─── */}
      {project.wonenBeschikbaar ? (
        <WonenFormSection project={project} onSubmit={handleSubmit} formData={formData} setFormData={setFormData} />
      ) : (
        <QuoteSection project={project} />
      )}
    </section>
  );
}

/* ─── Quote section — blue background with scroll-triggered line animation ─── */
function QuoteSection({ project }: { project: GebouwProject }) {
  return (
    <>
      <div className="mt-[4.167vw] bg-blue py-[11.528vw] px-[2.431vw] max-md:mt-6 max-md:py-16 max-md:px-5">
        <div className="flex flex-col items-center">
          {project.quote && (
            <QuoteLineSplit
              text={project.quote}
              className="font-heading font-normal text-[4.028vw] leading-[4.097vw] text-off-white text-center max-w-[70.139vw] max-md:text-[28px] max-md:leading-[32px] max-md:max-w-none"
            />
          )}
          {project.quoteAuthorImage && (
            <div className="relative w-[14.583vw] h-[18.403vw] overflow-hidden mt-[4.167vw] max-md:w-[140px] max-md:h-[180px] max-md:mt-8">
              <Image
                src={project.quoteAuthorImage}
                alt={project.quoteAuthor || ""}
                fill
                sizes="(max-width: 768px) 140px, 14.583vw"
                className="object-cover"
              />
            </div>
          )}
          {project.quoteAuthor && (
            <p className="font-heading font-normal text-[1.597vw] leading-[2.153vw] tracking-[-0.032vw] text-off-white mt-[1.528vw] max-md:text-[17px] max-md:mt-3">
              {project.quoteAuthor}
            </p>
          )}
        </div>
      </div>

      {/* CTA */}
      <div className="px-[2.431vw] mt-[8.125vw] pb-[16.875vw] max-md:px-5 max-md:mt-16 max-md:pb-16">
        <CTASection
          label="Neem contact op"
          linkText="Naar de contactpagina"
          linkHref="/contact"
          labelClassName="pl-[8.333vw] max-md:pl-0"
          headingClassName="font-body font-medium text-[3.75vw] leading-[3.681vw] text-off-black max-w-[62.569vw] mb-[2.778vw] max-md:text-[28px] max-md:leading-[32px] max-md:max-w-none max-md:mb-6"
        >
          Heeft u een vraag over dit project of wilt u meer informatie over onze
          werkzaamheden? Stuur een email naar{" "}
          <a
            href="mailto:info@weverskade.com"
            className="text-off-black underline decoration-solid"
          >
            info@weverskade.com
          </a>{" "}
          of klik op onderstaande link.
        </CTASection>
      </div>
    </>
  );
}

/* ─── Wonen form section ─── */
function WonenFormSection({
  project,
  onSubmit,
  formData,
  setFormData,
}: {
  project: GebouwProject;
  onSubmit: (e: React.FormEvent) => void;
  formData: { name: string; email: string; message: string; agreed: boolean };
  setFormData: React.Dispatch<
    React.SetStateAction<{ name: string; email: string; message: string; agreed: boolean }>
  >;
}) {
  return (
    <div className="px-[2.431vw] mt-[8.125vw] pb-[16.875vw] max-md:px-5 max-md:mt-16 max-md:pb-16">
      <div className="flex items-start max-md:flex-col max-md:gap-4">
        <p className="font-heading font-normal text-[1.389vw] leading-[1.2] text-off-black shrink-0 w-[31.458vw] pl-[8.333vw] max-md:w-auto max-md:text-[17px] max-md:pl-0">
          Woningen beschikbaar
        </p>
        <div className="flex-1 max-md:w-full">
          <h2 className="font-body font-medium text-[3.75vw] leading-[3.681vw] text-off-black max-w-[54.931vw] mb-[2.778vw] max-md:text-[28px] max-md:leading-[32px] max-md:max-w-none max-md:mb-6">
            Heeft u interesse in een appartement binnen dit project? Laat uw
            gegevens achter en we nemen contact met u op.
          </h2>

          <form onSubmit={onSubmit} className="max-w-[46.944vw] max-md:max-w-none">
            <div className="grid grid-cols-2 gap-x-[2.431vw] gap-y-[2.083vw] max-md:grid-cols-1 max-md:gap-y-6">
              {/* Name */}
              <div>
                <label className="block font-body font-medium text-[1.319vw] text-off-black mb-[0.694vw] max-md:text-[15px] max-md:mb-2">
                  Naam
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                  className="w-full bg-transparent border-b border-off-black pb-[0.694vw] font-body font-medium text-[1.319vw] text-off-black outline-none max-md:text-[15px] max-md:pb-2"
                />
              </div>
              {/* Email */}
              <div>
                <label className="block font-body font-medium text-[1.319vw] text-off-black mb-[0.694vw] max-md:text-[15px] max-md:mb-2">
                  Emailadres
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                  className="w-full bg-transparent border-b border-off-black pb-[0.694vw] font-body font-medium text-[1.319vw] text-off-black outline-none max-md:text-[15px] max-md:pb-2"
                />
              </div>
            </div>

            {/* Message */}
            <div className="mt-[2.083vw] max-md:mt-6">
              <label className="block font-body font-medium text-[1.319vw] text-off-black mb-[0.694vw] max-md:text-[15px] max-md:mb-2">
                Eventuele vraag of opmerking
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))}
                rows={1}
                className="w-full bg-transparent border-b border-off-black pb-[0.694vw] font-body font-medium text-[1.319vw] text-off-black outline-none resize-none max-md:text-[15px] max-md:pb-2"
              />
            </div>

            {/* Checkbox + Submit */}
            <div className="flex items-start justify-between mt-[2.083vw] max-md:flex-col max-md:gap-6 max-md:mt-6">
              <label className="flex items-start gap-[0.694vw] cursor-pointer max-md:gap-3">
                <input
                  type="checkbox"
                  checked={formData.agreed}
                  onChange={(e) => setFormData((p) => ({ ...p, agreed: e.target.checked }))}
                  className="mt-[0.208vw] w-[0.764vw] h-[0.764vw] border border-off-black appearance-none checked:bg-green checked:border-green cursor-pointer max-md:w-[14px] max-md:h-[14px] max-md:mt-0.5"
                />
                <span className="font-body font-normal text-[0.764vw] leading-normal text-off-black max-w-[27.431vw] max-md:text-[11px] max-md:max-w-none">
                  Ik ga akkoord met de{" "}
                  <a href="/voorwaarden" className="underline decoration-solid">
                    algemene voorwaarden
                  </a>{" "}
                  en het gebruiken van mijn gegevens gebruiken om contact met op
                  te nemen.
                </span>
              </label>
              <button
                type="submit"
                className="bg-green text-off-white font-heading font-normal text-[1.181vw] tracking-[-0.024vw] px-[1.667vw] py-[0.694vw] rounded-full cursor-pointer border-none max-md:text-[15px] max-md:px-6 max-md:py-2.5"
              >
                Formulier versturen
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
