import Image from "next/image";
import Footer from "@/components/Footer";
import FooterReveal from "@/components/FooterReveal";
import Impact from "@/components/Impact";
import AerialParallax from "@/components/AerialParallax";
import CTASection from "@/components/CTASection";
import HeroOverOns from "@/components/HeroOverOns";
import ScrollHeroLineSplit from "@/components/ScrollHeroLineSplit";
import TeamGrid from "@/components/TeamGrid";
import { sanityFetch } from "@/sanity/lib/fetch";
import {
  OVER_ONS_PAGE_QUERY,
  ALL_TEAM_QUERY,
  FOOTER_QUERY,
} from "@/sanity/lib/queries";
import { sanityImageUrl } from "@/sanity/lib/helpers";

export const metadata = {
  title: "Over ons | Weverskade",
  description:
    "Weverskade ontwikkelt en beheert vastgoed met aandacht voor ruimte.",
};

export default async function OverOns() {
  const [pageData, teamData, footerData] = await Promise.all([
    sanityFetch<any>({ query: OVER_ONS_PAGE_QUERY, tags: ["overOnsPage"] }),
    sanityFetch<any[]>({ query: ALL_TEAM_QUERY, tags: ["teamLid"] }),
    sanityFetch<any>({ query: FOOTER_QUERY, tags: ["footer"] }),
  ]);

  const heroTitle = pageData?.heroTitle ?? "Over ons";
  const heroImage = sanityImageUrl(pageData?.heroImage, "/images/about-ds1.webp");
  const storyHeading = pageData?.storyHeading ?? "Weverskade ontwikkelt en beheert vastgoed met aandacht voor ruimte. We kijken verder dan de vraag van het moment en investeren in plekken die blijven werken, vandaag en op lange termijn.";
  const storyText = pageData?.storyText;
  const storyImage = sanityImageUrl(pageData?.storyImage, "/images/about-story.webp");
  const mvLabel = pageData?.mvLabel ?? "Missie & Visie";
  const mvHeading = pageData?.mvHeading ?? "Bij Weverskade geloven we in het goed doen. Ook als niemand daarom vraagt.";
  const missionText = pageData?.missionText ?? "Met vastgoed willen we bijdragen aan een omgeving die goed is voor mens en natuur. We creëren plekken waar wonen en werken vanzelf goed voelt en waar kwaliteit en gezondheid vanzelfsprekend zijn. Vanuit die verantwoordelijkheid investeren we ook in maatschappelijke en duurzame initiatieven.";
  const visionText = pageData?.visionText ?? "We bouwen aan een portefeuille die financieel sterk is én bijdraagt aan de samenleving en het milieu. Onze lange termijn richt zich op CO₂-neutraliteit in 2050 en op investeringen die waarde toevoegen voor gebruikers, omgeving en toekomst.";
  const wwdItems = pageData?.wwdItems ?? [
    { title: "Beleggen", description: "We bouwen aan een portefeuille die blijft werken en met de tijd beter wordt. Door betrokken te blijven bij onze gebouwen en hun omgeving investeren we in duurzame waarde op lange termijn." },
    { title: "Ontwikkelen", description: "We ontwikkelen woningen en commercieel vastgoed met oog voor de plek en de lange termijn. Van eerste idee tot realisatie maken we keuzes die bijdragen aan kwaliteit en toekomstwaarde." },
    { title: "Hospitality & Services", description: "We zorgen voor het dagelijks functioneren van onze gebouwen en de ruimte eromheen. Met aandacht voor onderhoud, techniek en gebruikers houden we plekken gezond, prettig en toekomstbestendig." },
  ];
  const stats = pageData?.stats ?? [
    { value: "150.000 m²", label: "Vierkante meters vastgoed ontwikkeld sinds 2010" },
    { value: "00.000 m²", label: "Vierkante meters vastgoed in beheer voor diverse gebruikers" },
    { value: "88,32%", label: "Hoogste BREEAM score voor de Lely Campus in Maassluis." },
    { value: "25", label: "Een team van 25 gedreven professionals." },
    { value: "4 landen", label: "Weverskade is actief in Nederland, België, Groot-Brittannië en de VS." },
    { value: "x", label: "Hier ruimte voor nog een feit" },
  ];

  const teamMembers = teamData?.map((t: any) => ({
    name: t.name,
    function: t.function,
    image: sanityImageUrl(t.image, "/images/team-placeholder.webp"),
  }));

  const impactData = pageData
    ? {
        label: pageData.impactHeading ? undefined : undefined,
        images: pageData.impactImages?.map((img: any, i: number) => ({
          src: sanityImageUrl(img, ["/images/about-nature.webp", "/images/about-aerial.webp", "/images/about-story.webp"][i]),
          index: i,
        })),
      }
    : undefined;

  const ctaData = pageData?.cta;

  const footerProps = footerData
    ? {
        companyName: footerData.companyName,
        address: footerData.address,
        postalCode: footerData.postalCode,
        country: footerData.country,
        phone: footerData.phone,
        email: footerData.email,
        links: footerData.links,
      }
    : undefined;

  return (
    <>
      {/* Hero */}
      <div data-nav-theme="light">
        <HeroOverOns title={heroTitle} image={heroImage} />
      </div>

      {/* Intro text + story */}
      <div data-nav-theme="light">
        <section className="bg-off-white px-[2.639vw] pb-[14.167vw] max-md:px-0 max-md:pb-16">
          <ScrollHeroLineSplit
            text={storyHeading}
            indent="15.278vw"
            className="font-body font-medium text-[3.958vw] leading-[4.097vw] text-off-black max-md:text-[28px] max-md:leading-[30px] max-md:px-5"
          />

          <div className="flex items-start mt-[13.056vw] gap-[5.972vw] max-md:flex-col max-md:mt-8 max-md:gap-8">
            <div className="w-[42.083vw] h-[50.347vw] overflow-hidden shrink-0 max-md:w-full max-md:h-[130vw]">
              <Image
                src={storyImage}
                alt="Weverskade team"
                width={2731}
                height={4096}
                sizes="(max-width: 768px) 100vw, 42.083vw"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col justify-between h-[50.347vw] max-md:h-auto max-md:px-5">
              <p className="font-body font-medium text-[1.597vw] leading-[2.153vw] tracking-[-0.032vw] text-off-black max-md:text-[17px] max-md:leading-[22px] max-md:tracking-[-0.34px] max-md:mb-6">
                Ons verhaal
              </p>
              <div className="max-w-[31.458vw] max-md:max-w-none">
                <p className="font-body font-medium text-[1.597vw] leading-[2.153vw] tracking-[-0.032vw] text-off-black mb-[2.083vw] max-md:text-[17px] max-md:leading-[22px] max-md:tracking-[-0.34px]">
                  {storyText?.split('\n\n')[0] ?? "Weverskade werkt met een gedreven team aan een portefeuille van woningen en commercieel vastgoed. Vanuit die basis bouwen we stap voor stap aan plekken die blijven werken en met de tijd beter worden."}
                </p>
                <p className="font-body font-medium text-[1.597vw] leading-[2.153vw] tracking-[-0.032vw] text-off-black max-md:text-[17px] max-md:leading-[22px] max-md:tracking-[-0.34px]">
                  {storyText?.split('\n\n')[1] ?? "We kijken met aandacht naar de ruimte in en om onze gebouwen en nemen verantwoordelijkheid voor hoe deze functioneren, vandaag en op lange termijn. Naast ontwikkeling en beheer verzorgen we ook de services die nodig zijn om gebouwen goed te laten draaien en hun kwaliteit te behouden."}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Aerial photo */}
      <div data-nav-theme="light">
        <AerialParallax />
      </div>

      {/* Missie & Visie */}
      <div data-nav-theme="green" className="bg-green">
        <section className="pt-[8.819vw] pb-[8.333vw] px-[2.431vw] relative overflow-visible max-md:pt-12 max-md:pb-10 max-md:px-5">
          <h2 className="absolute left-0 right-0 -top-[6.597vw] font-heading font-normal text-[10.417vw] leading-[11.042vw] tracking-[-0.313vw] text-off-white text-center pointer-events-none max-md:text-[13vw] max-md:leading-[14vw] max-md:-top-[8vw] max-md:tracking-[-0.4vw]">
            {mvLabel}
          </h2>

          <h3 className="font-body font-medium text-[4.028vw] leading-[4.097vw] text-off-white indent-[32.083vw] mb-[5.556vw] max-md:text-[28px] max-md:leading-[30px] max-md:indent-0 max-md:mb-8">
            {mvHeading}
          </h3>

          <div className="flex items-start max-md:flex-col max-md:gap-3">
            <p className="font-body font-medium text-[1.389vw] leading-[1.2] text-off-white shrink-0 w-[32.222vw] max-md:w-auto max-md:text-[17px]">
              Missie
            </p>
            <p className="font-body font-medium text-[1.597vw] leading-[2.153vw] tracking-[-0.032vw] text-off-white max-w-[45.486vw] max-md:text-[17px] max-md:leading-[22px] max-md:tracking-[-0.34px] max-md:max-w-none">
              {missionText}
            </p>
          </div>

          <div className="flex items-start mt-[5.556vw] max-md:flex-col max-md:gap-3 max-md:mt-10">
            <p className="font-body font-medium text-[1.389vw] leading-[1.2] text-off-white shrink-0 w-[32.222vw] max-md:w-auto max-md:text-[17px]">
              Visie
            </p>
            <p className="font-body font-medium text-[1.597vw] leading-[2.153vw] tracking-[-0.032vw] text-off-white max-w-[45.486vw] max-md:text-[17px] max-md:leading-[22px] max-md:tracking-[-0.34px] max-md:max-w-none">
              {visionText}
            </p>
          </div>
        </section>
      </div>

      {/* Wat we doen */}
      <div data-nav-theme="light">
        <section className="bg-off-white pt-[8.333vw] pb-[16.944vw] px-[2.431vw] max-md:pt-12 max-md:pb-16 max-md:px-5">
          <h2 className="font-body font-medium text-[5.556vw] leading-normal text-off-black max-md:text-[28px]">
            {pageData?.wwdHeading ?? "Wat we doen"}
          </h2>
          <div className="grid grid-cols-3 gap-x-[1.389vw] mt-[4.792vw] max-md:grid-cols-1 max-md:gap-x-5 max-md:gap-y-10 max-md:mt-8">
            {wwdItems.map((item: any, i: number) => (
              <div key={item.title}>
                <p className="font-heading font-normal text-[1.806vw] leading-[2.153vw] tracking-[-0.036vw] text-off-black mb-[0.833vw] max-md:text-[20px] max-md:leading-normal max-md:tracking-normal max-md:mb-2">
                  {item.title}
                </p>
                <div className="w-full h-[24.583vw] overflow-hidden mb-[1.111vw] max-md:h-[55vw] max-md:mb-3">
                  <Image
                    src={item.image ? sanityImageUrl(item.image, ["/images/about-beleggen.webp", "/images/about-ontwikkelen.webp", "/images/about-ds1.webp"][i]) : ["/images/about-beleggen.webp", "/images/about-ontwikkelen.webp", "/images/about-ds1.webp"][i]}
                    alt={item.title}
                    width={800}
                    height={600}
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="font-body font-medium text-[1.389vw] leading-[1.2] text-off-black max-md:text-[15px] max-md:leading-[20px]">
                  {item.description ?? item.text}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Het team */}
      <div data-nav-theme="brown" className="bg-brown" style={{ transform: "translate3d(0,0,0)" }}>
        <section className="pt-[6.042vw] pb-[10.556vw] px-[2.431vw] max-md:pt-10 max-md:pb-12 max-md:px-5">
          <h2 className="font-body font-medium text-[5.556vw] leading-normal text-off-white mb-[4.583vw] max-md:text-[28px] max-md:mb-6">
            {pageData?.teamHeading ?? "Het team"}
          </h2>
          <TeamGrid members={teamMembers} />
        </section>
      </div>

      {/* Feiten en cijfers */}
      <div data-nav-theme="light">
        <section className="bg-off-white pt-[9.167vw] pb-[9.236vw] px-[2.431vw] max-md:pt-10 max-md:pb-10 max-md:px-5">
          <div className="flex items-start max-md:flex-col max-md:gap-6">
            <p className="font-heading font-normal text-[1.389vw] leading-[1.2] text-off-black shrink-0 w-[32.222vw] max-md:w-auto max-md:text-[17px]">
              {pageData?.factsLabel ?? "Feiten en cijfers"}
            </p>
            <div className="grid grid-cols-[22.708vw_22.708vw] gap-x-[1.389vw] gap-y-[4.583vw] max-md:grid-cols-2 max-md:gap-x-5 max-md:gap-y-8">
              {stats.map((item: any) => (
                <div key={item.value + item.label}>
                  <p className="font-heading font-normal text-[3.194vw] leading-[2.153vw] tracking-[-0.064vw] text-off-black mb-[1.389vw] max-md:text-[28px] max-md:leading-normal max-md:tracking-[-0.56px] max-md:mb-2">
                    {item.value}
                  </p>
                  <p className="font-body font-medium text-[1.389vw] leading-[1.875vw] tracking-[-0.028vw] text-off-black max-md:text-[15px] max-md:leading-[20px] max-md:tracking-[-0.3px]">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Maatschappelijk */}
      <div data-nav-theme="green">
        <Impact
          data={impactData ?? {
            images: [
              { src: "/images/about-nature.webp", index: 0 },
              { src: "/images/about-aerial.webp", index: 1 },
              { src: "/images/about-story.webp", index: 2 },
            ],
          }}
        />
      </div>

      {/* Werken bij */}
      <div data-nav-theme="light">
        <section className="bg-off-white pt-[11.389vw] pb-[16.389vw] px-[2.431vw] max-md:pt-10 max-md:pb-16 max-md:px-5">
          <CTASection
            label={ctaData?.label ?? "Werken bij"}
            linkText={ctaData?.linkText ?? "Naar het vacature overzicht"}
            linkHref={ctaData?.linkUrl ?? "/werken-bij"}
            labelClassName="pl-[8.333vw] max-md:pl-0"
          >
            {ctaData?.heading ?? "Weverskade is altijd op zoek naar mensen die met aandacht willen werken aan vastgoed en onderdeel willen zijn van een betrokken team."}
          </CTASection>
        </section>
      </div>

      {/* Footer */}
      <div data-nav-theme="dark">
        <FooterReveal>
          <Footer bg="bg-off-black" data={footerProps} />
        </FooterReveal>
      </div>
    </>
  );
}
