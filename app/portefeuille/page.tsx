import PortfolioPage from "@/components/PortfolioPage";
import Footer from "@/components/Footer";
import FooterReveal from "@/components/FooterReveal";
import { sanityFetch } from "@/sanity/lib/fetch";
import {
  PORTEFEUILLE_PAGE_QUERY,
  ALL_PROJECTS_QUERY,
  FOOTER_QUERY,
} from "@/sanity/lib/queries";
import { sanityImageUrl } from "@/sanity/lib/helpers";

export const metadata = {
  title: "Portefeuille | Weverskade",
  description:
    "Een selectie van woningen en commercieel vastgoed binnen de portefeuille van Weverskade.",
};

export default async function Portefeuille() {
  const [pageData, projectsData, footerData] = await Promise.all([
    sanityFetch<any>({ query: PORTEFEUILLE_PAGE_QUERY, tags: ["portefeuillePage"] }),
    sanityFetch<any[]>({ query: ALL_PROJECTS_QUERY, tags: ["project"] }),
    sanityFetch<any>({ query: FOOTER_QUERY, tags: ["footer"] }),
  ]);

  const portfolioPageData =
    pageData || projectsData?.length > 0
      ? {
          heroLabel: pageData?.heroLabel,
          heroTitle: pageData?.heroTitle,
          heroImages: pageData?.heroImages?.map((img: any) =>
            sanityImageUrl(img, "/images/portfolio-hero.webp")
          ),
          ctaLabel: pageData?.ctaLabel,
          ctaHeading: pageData?.ctaHeading,
          ctaLinkText: pageData?.ctaLinkText,
          ctaLinkUrl: pageData?.ctaLinkUrl,
          projects: projectsData?.map((p: any, i: number) => ({
            id: i + 1,
            slug: p.slug?.current ?? p.slug ?? "",
            name: p.name,
            tagline: p.tagline ?? "",
            type: p.category ?? p.type ?? "",
            location: p.location ?? "",
            image: sanityImageUrl(p.portfolioImage, "/images/portfolio-card-1.webp"),
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
      <div data-nav-theme="light">
        <PortfolioPage data={portfolioPageData} />
      </div>
      <div data-nav-theme="green">
        <FooterReveal>
          <Footer bg="bg-green" data={footerProps} />
      </FooterReveal>
      </div>
    </>
  );
}
