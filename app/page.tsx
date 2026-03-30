import Hero from "@/components/Hero";
import Intro from "@/components/Intro";
import Portfolio from "@/components/Portfolio";
import Impact from "@/components/Impact";
import News from "@/components/News";
import Footer from "@/components/Footer";
import FooterReveal from "@/components/FooterReveal";
import { sanityFetch } from "@/sanity/lib/fetch";
import {
  HOME_PAGE_QUERY,
  FOOTER_QUERY,
  ALL_NIEUWS_QUERY,
} from "@/sanity/lib/queries";
import { sanityImageUrl } from "@/sanity/lib/helpers";

export default async function Home() {
  const [homeData, footerData, newsData] = await Promise.all([
    sanityFetch<any>({ query: HOME_PAGE_QUERY, tags: ["homePage"] }),
    sanityFetch<any>({ query: FOOTER_QUERY, tags: ["footer"] }),
    sanityFetch<any>({ query: ALL_NIEUWS_QUERY, tags: ["nieuwsArtikel"] }),
  ]);

  const heroProps = homeData
    ? {
        title: homeData.heroTitle,
        subtitle: homeData.heroSubtitle,
        backgroundImage: sanityImageUrl(homeData.heroImage, "/images/hero-bg.webp"),
      }
    : undefined;

  const introProps = homeData
    ? {
        heading: homeData.introHeading,
        text: homeData.introText,
        linkText: homeData.introLinkText,
        linkUrl: homeData.introLinkUrl,
        image: sanityImageUrl(homeData.introImage, "/images/small-plant.webp"),
      }
    : undefined;

  const portfolioProps =
    homeData?.featuredProjects?.length > 0
      ? {
          label: homeData.portfolioLabel,
          heading: homeData.portfolioHeading,
          linkText: homeData.portfolioLinkText,
          linkUrl: homeData.portfolioLinkUrl,
          projects: homeData.featuredProjects.map((p: any) => ({
            image: sanityImageUrl(p.portfolioImage, "/images/portfolio-1.webp"),
            title: p.name,
            subtitle: p.tagline,
            slug: p.slug?.current ?? p.slug ?? "",
          })),
        }
      : undefined;

  const impactProps = homeData
    ? {
        label: homeData.impactLabel,
        heading: homeData.impactHeading,
        words: homeData.impactWords,
        description: homeData.impactDescription,
        linkText: homeData.impactLinkText,
        linkUrl: homeData.impactLinkUrl,
        images: homeData.impactImages?.map((img: any, i: number) => ({
          src: sanityImageUrl(img, ["/images/portfolio-3.webp", "/images/portfolio-2.webp", "/images/nature.webp"][i] || "/images/portfolio-1.webp"),
          index: i,
        })),
      }
    : undefined;

  const newsProps =
    newsData?.length > 0
      ? {
          label: homeData?.newsLabel,
          heading: homeData?.newsHeading,
          articles: newsData.slice(0, 3).map((a: any) => ({
            date: a.date,
            title: a.title,
            image: sanityImageUrl(a.heroImage, "/images/news-placeholder.webp"),
            slug: a.slug?.current,
          })),
        }
      : undefined;

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
      <div data-nav-theme="dark">
        <Hero data={heroProps} />
      </div>
      <div data-nav-theme="light">
        <Intro data={introProps} />
      </div>
      <div data-nav-theme="light">
        <Portfolio data={portfolioProps} />
      </div>
      <div data-nav-theme="green">
        <Impact data={impactProps} />
      </div>
      <div data-nav-theme="light">
        <News data={newsProps} />
      </div>
      <div data-nav-theme="blue">
        <FooterReveal>
          <Footer data={footerProps} />
        </FooterReveal>
      </div>
    </>
  );
}
