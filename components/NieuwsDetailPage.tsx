"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";

interface NewsArticle {
  title: string;
  date: string;
  category: string;
  image: string;
  body: string[];
}

const defaultArticle: NewsArticle = {
  title: "Weverskade geselecteerd als ontwikkelaar van De Kuip.",
  date: "30 januari, 2026",
  category: "Nieuws",
  image: "/images/news-placeholder.png",
  body: [
    "Weverskade is geselecteerd als ontwikkelaar voor de herontwikkeling van stadion De Kuip en de directe omgeving. Na een langlopend tendertraject is gekozen voor een plan waarin behoud, vernieuwing en de toekomst van het gebied zorgvuldig samenkomen.",
    "De herontwikkeling richt zich op het versterken van de plek in de stad, met ruimte voor wonen, werken en voorzieningen, terwijl het karakter van het stadion en zijn omgeving behouden blijft. In samenwerking met betrokken partijen wordt de komende periode gewerkt aan een plan dat aansluit bij de geschiedenis van De Kuip en de toekomst van Rotterdam-Zuid.",
    "Voor Weverskade betekent de selectie een bijzondere stap. De Kuip is een plek met een sterke betekenis voor de stad en haar bewoners. De opgave vraagt om zorgvuldigheid, lange termijn betrokkenheid en respect voor wat er al is.",
    "\u201CDe Kuip is meer dan een gebouw. Het is een plek die diep in de stad verankerd is. We voelen ons verantwoordelijk om hier met aandacht en respect aan te werken, en tegelijkertijd ruimte te maken voor een nieuwe toekomst,\u201D zegt het team van Weverskade.",
    "De komende periode wordt het plan verder uitgewerkt in nauwe samenwerking met gemeente, partners en gebruikers van het gebied.",
  ],
};

interface NieuwsDetailData {
  title?: string;
  date?: string;
  category?: string;
  heroImage?: string;
  body?: any[];
}

/* ── HeroLineSplit — identical to WonenBijPage ── */
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

/* ── Page component ── */
export default function NieuwsDetailPage({ data }: { data?: NieuwsDetailData } = {}) {
  const article: NewsArticle = {
    title: data?.title ?? defaultArticle.title,
    date: data?.date ?? defaultArticle.date,
    category: data?.category ?? defaultArticle.category,
    image: data?.heroImage ?? defaultArticle.image,
    body: data?.body
      ? data.body.map((block: any) =>
          typeof block === 'string' ? block : block.children?.map((c: any) => c.text).join('') ?? ''
        )
      : defaultArticle.body,
  };
  const [animate, setAnimate] = useState(false);

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

  const imageDelay = 0.05;

  return (
    <section className="bg-off-white min-h-screen">
      {/* Title — line-split entrance like Wonen Bij */}
      <div className="pt-[16.736vw] pl-[18.056vw] pr-[2.431vw] max-md:pt-[28vw] max-md:px-5">
        <HeroLineSplit
          text={article.title}
          animate={animate}
          indent="18.75vw"
          delay={0.15}
          stagger={0.08}
          className="font-heading font-normal text-[4.931vw] leading-[5.278vw] tracking-[-0.099vw] text-off-black max-md:text-[32px] max-md:leading-[36px] max-md:tracking-[-0.64px]"
        />
      </div>

      {/* Hero image — clip-path reveal */}
      <div className="pl-[18.542vw] pr-[2.431vw] mt-[2.5vw] max-md:px-5 max-md:mt-6">
        <div
          className="relative w-[62.847vw] h-[35.625vw] overflow-hidden max-md:w-full max-md:h-[60vw]"
          style={{
            clipPath: animate ? "inset(0 0 0 0)" : "inset(100% 0 0 0)",
            transition: animate
              ? `clip-path 1.1s cubic-bezier(0.16, 1, 0.3, 1) ${imageDelay}s`
              : "none",
          }}
        >
          <Image
            src={article.image}
            alt={article.title}
            fill
            sizes="(max-width: 768px) 100vw, 62.847vw"
            className="object-cover will-change-transform"
            style={{
              transform: animate ? "scale(1)" : "scale(1.2)",
              transition: animate
                ? `transform 1.6s cubic-bezier(0.16, 1, 0.3, 1) ${imageDelay}s`
                : "none",
            }}
          />
        </div>
      </div>

      {/* Article content — two columns */}
      <div className="flex pl-[18.542vw] pr-[2.431vw] mt-[2.5vw] max-md:flex-col max-md:px-5 max-md:mt-6">
        {/* Meta column */}
        <div className="shrink-0 w-[16.042vw] pt-[0.764vw] max-md:w-auto max-md:pt-0 max-md:mb-4">
          <p className="font-body font-medium text-[1.389vw] leading-normal text-off-black max-md:text-[15px]">
            {article.category}
          </p>
          <p className="font-body font-medium text-[1.389vw] leading-normal text-off-black max-md:text-[15px]">
            {article.date}
          </p>
        </div>

        {/* Body column */}
        <div className="max-w-[46.806vw] max-md:max-w-none">
          {article.body.map((paragraph, i) => (
            <p
              key={i}
              className="font-body font-medium text-[1.597vw] leading-[2.153vw] text-off-black mb-[2.153vw] last:mb-0 max-md:text-[17px] max-md:leading-[24px] max-md:mb-6"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      {/* Back link */}
      <div className="pl-[34.583vw] mt-[8.333vw] pb-[13.472vw] max-md:px-5 max-md:mt-10 max-md:pb-16">
        <a
          href="/nieuws"
          className="link-underline font-body font-medium text-[0.972vw] leading-normal text-off-black pb-[0.417vw] max-md:text-[14px] max-md:pb-1.5"
        >
          Terug naar het overzicht
        </a>
      </div>
    </section>
  );
}
