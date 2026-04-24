"use client";

import { useEffect, useState } from "react";
import LineSplit from "@/components/LineSplit";
import { useInView } from "@/hooks/useInView";

/**
 * Privacybeleid (privacy policy) page — static Dutch content, rendered with
 * the same hero/typography rhythm as ContactPage so it reads as part of the
 * same design system.
 */
export default function PrivacyPage() {
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

  return (
    <section className="bg-off-white min-h-screen">
      {/* Hero title */}
      <div className="pt-[24.375vw] pl-[2.431vw] pr-[2.431vw] max-md:pt-[28vw] max-md:px-5">
        <div className="overflow-hidden">
          <h1
            className="font-heading font-normal text-[5.556vw] leading-[1.05] tracking-[-0.111vw] text-off-black max-md:text-[40px] max-md:leading-[42px] max-md:tracking-[-0.8px] will-change-transform"
            style={{
              transform: animate ? "translateY(0)" : "translateY(110%)",
              transition: animate
                ? "transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.15s"
                : "none",
            }}
          >
            Privacybeleid
          </h1>
        </div>
      </div>

      {/* Body */}
      <div className="px-[2.431vw] mt-[6.25vw] pb-[16.875vw] max-md:px-5 max-md:mt-10 max-md:pb-20">
        {/* Content column: left edge aligns with the H1 above. Capped width on
            desktop for readability, full-width on mobile. */}
        <div className="max-w-[58.333vw] max-md:max-w-none">
          {/* Intro paragraph — animated line-by-line */}
          <LineSplit
            animate={animate}
            delay={0.25}
            stagger={0.05}
            className="font-body font-medium text-[1.597vw] leading-[2.153vw] tracking-[-0.016vw] text-off-black max-md:text-[17px] max-md:leading-[24px]"
          >
            {`Weverskade B.V. is verantwoordelijk voor de juiste opslag en verwerking van uw persoonsgegevens. Sinds 25 mei 2018 geldt de Algemene Verordening Persoonsgegevens (AVG). Wij vinden het belangrijk om zorgvuldig en legaal met uw persoonsgegevens om te gaan. Hierom informeren wij u graag over het gebruik van uw persoonsgegevens.`}
          </LineSplit>

          {/* Section: Gebruik van persoonsgegevens */}
          <Section title="Gebruik van persoonsgegevens">
            <Paragraph>
              Persoonsgegevens zijn alle gegevens die informatie kunnen verschaffen om een
              persoon te kunnen identificeren. Wij vragen en verwerken uw gegevens door middel
              van ons inschrijfformulier en ons contactformulier. Wij dragen zorg voor een goede
              beveiliging van uw gegevens. Uw persoonsgegevens worden niet gebruikt voor andere
              doeleinden dan aangegeven en worden niet langer opgeslagen dan nodig.
            </Paragraph>
          </Section>

          {/* Section: 1.1 Inschrijfformulier */}
          <Section title="1.1 Inschrijfformulier">
            <Paragraph>
              Als klant geeft u persoonsgegevens op in ons inschrijfformulier. Wij vragen de
              volgende persoonsgegevens:
            </Paragraph>
            <BulletList
              items={[
                "Voornaam",
                "Tussenvoegsel",
                "Achternaam",
                "E-mailadres",
                "Adres",
                "Postcode",
                "Plaats",
                "Huidige woonsituatie",
                "Leeftijd(categorie)",
                "Werkzame sector",
                "Indicatie bruto jaarinkomen",
                "Maatschappelijke betrokkenheid tot het Westland",
                "Voorkeur type woning",
                "Voorkeur verdieping",
              ]}
            />
            <Paragraph>
              Uw gegevens worden door Weverskade B.V. opgeslagen ten behoeve van een juiste match
              tussen woning, huurder en verhuurder.
            </Paragraph>
          </Section>

          {/* Section: 1.2 Contactformulier */}
          <Section title="1.2 Contactformulier">
            <Paragraph>
              Als klant geeft u persoonsgegevens op in ons contactformulier. Wij vragen de
              volgende persoonsgegevens:
            </Paragraph>
            <BulletList
              items={[
                "Voornaam",
                "Tussenvoegsel",
                "Achternaam",
                "E-mailadres",
                "Telefoonnummer",
              ]}
            />
            <Paragraph>
              Uw gegevens worden door Weverskade B.V. opgeslagen ten behoeve van contact over
              vragen over het huurproces van de Dirigent.
            </Paragraph>
          </Section>

          {/* Section: Het gebruik van cookies */}
          <Section title="Het gebruik van cookies">
            <Paragraph>
              Naast het opslaan van persoonsgegevens maken wij ook gebruik van technische en
              functionele cookies. Dit zijn kleine tekstbestanden die uw gedrag op de websites
              herkennen bij volgende bezoeken. De cookies worden gebruikt om de website goed te
              laten functioneren en voor uw gebruiksgemak. U kunt zich te allen tijde afmelden
              voor het gebruik van cookies op onze website.
            </Paragraph>
          </Section>

          {/* Section: Rechten van de klant */}
          <Section title="Rechten van de klant">
            <Paragraph>
              Als klant heeft u een aantal rechten m.b.t. uw privacy en gegevensgebruik. U heeft
              bijvoorbeeld recht op:
            </Paragraph>
            <BulletList
              items={[
                "het inzien, aanpassen en verwijderen van uw persoonsgegevens",
                "uw toestemming deels of compleet in te trekken",
                <>
                  een klacht in te dienen bij de Autoriteit Persoonsgegevens op de site{" "}
                  <a
                    href="https://autoriteitpersoonsgegevens.nl"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-solid underline-offset-[0.2em] hover:opacity-70 transition-opacity"
                  >
                    autoriteitpersoonsgegevens.nl
                  </a>
                </>,
              ]}
            />
          </Section>

          {/* Section: Contactgegevens */}
          <Section title="Contactgegevens">
            <Paragraph>
              Indien u een verzoek wilt indienen om uw persoonsgegevens op te vragen of te
              wijzigen, kunt u ons bereiken via:
            </Paragraph>
            <p className="font-body font-medium text-[1.319vw] leading-[2vw] text-off-black mt-[1.389vw] max-md:text-[15px] max-md:leading-[22px] max-md:mt-4">
              <a
                href="mailto:info@weverskade.com"
                className="underline decoration-solid underline-offset-[0.2em] hover:opacity-70 transition-opacity"
              >
                info@weverskade.com
              </a>
            </p>
          </Section>
        </div>
      </div>
    </section>
  );
}

/* ───── Internals ───── */

const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const [ref, inView] = useInView<HTMLDivElement>();
  return (
    <div ref={ref} className="mt-[5.556vw] max-md:mt-12">
      <div className="overflow-hidden">
        <h2
          className="font-heading font-normal text-[2.778vw] leading-[1.15] tracking-[-0.056vw] text-off-black max-md:text-[22px] max-md:leading-[26px] will-change-transform"
          style={{
            transform: inView ? "translateY(0)" : "translateY(110%)",
            transition: inView
              ? `transform 0.9s ${EASE} 0s`
              : "none",
          }}
        >
          {title}
        </h2>
      </div>
      <div
        className="mt-[1.944vw] max-md:mt-5 will-change-transform"
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(16px)",
          transition: inView
            ? `opacity 0.8s ease-out 0.2s, transform 0.9s ${EASE} 0.2s`
            : "none",
        }}
      >
        {children}
      </div>
    </div>
  );
}

function Paragraph({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-body font-medium text-[1.319vw] leading-[2vw] text-off-black mt-[1.389vw] first:mt-0 max-md:text-[15px] max-md:leading-[22px] max-md:mt-4">
      {children}
    </p>
  );
}

function BulletList({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="mt-[1.389vw] max-md:mt-4 list-disc pl-[1.4vw] max-md:pl-5 marker:text-off-black">
      {items.map((item, i) => (
        <li
          key={i}
          className="font-body font-medium text-[1.319vw] leading-[2vw] text-off-black mt-[0.347vw] first:mt-0 max-md:text-[15px] max-md:leading-[22px] max-md:mt-1"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}
