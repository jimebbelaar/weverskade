import Image from "next/image";

interface IntroData {
  heading?: string;
  text?: string;
  linkText?: string;
  linkUrl?: string;
  image?: string;
}

export default function Intro({ data }: { data?: IntroData } = {}) {
  return (
    <section className="bg-off-white pt-[3.611vw] px-[2.639vw] pb-[10.625vw] max-md:pt-10 max-md:px-5 max-md:pb-16">
      {/* Plant image — hidden on mobile */}
      <div className="w-[12.847vw] h-[16.389vw] ml-[32.083vw] overflow-hidden max-md:hidden">
        <Image
          src={data?.image ?? "/images/small-plant.jpg"}
          alt="Groene plant"
          width={1373}
          height={800}
          sizes="12.847vw"
          quality={100}
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Large heading */}
      <h2 className="font-body font-medium text-[4.028vw] leading-[4.097vw] text-off-black indent-[32.083vw] mt-[7.153vw] max-md:text-[28px] max-md:leading-[30px] max-md:indent-0 max-md:mt-0">
        {data?.heading ?? "Weverskade is een ontwikkelende belegger in woningen en commercieel vastgoed. Door zelf te ontwikkelen en te beheren, maken we keuzes die verder kijken dan de vraag van nu."}
      </h2>

      {/* About row */}
      <div className="flex items-start mt-[5.556vw] gap-[2.778vw] max-md:flex-col max-md:mt-8 max-md:gap-0">
        <p className="font-heading font-normal not-italic text-[1.389vw] leading-[1.2] text-off-black shrink-0 w-[calc(33.33%_-_1.389vw)] max-md:hidden">
          Over ons
        </p>
        <div className="max-w-[45.486vw] max-md:max-w-none">
          <p className="font-body font-medium text-[1.597vw] leading-[2.153vw] tracking-[-0.032vw] text-off-black max-md:text-[17px] max-md:leading-[22px] max-md:tracking-[-0.34px]">
            {data?.text ?? "Sinds 2010 werken we met een betrokken team aan de groei van onze duurzame vastgoedportefeuille. Door zelf te ontwikkelen én te beheren blijven we dicht bij onze gebouwen en hun omgeving. Zo creëren we met aandacht voor ruimte plekken die vandaag werken en morgen nog steeds kloppen."}
          </p>
          <a
            href={data?.linkUrl ?? "/over-ons"}
            className="link-underline mt-[3.611vw] font-body font-medium text-[1.389vw] leading-[1.2] text-off-black pb-[0.486vw] max-md:text-[17px] max-md:mt-8 max-md:pb-1.5"
          >
            {data?.linkText ?? "Meer over ons"}
          </a>
        </div>
      </div>
    </section>
  );
}
