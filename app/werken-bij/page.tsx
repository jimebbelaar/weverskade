import WerkenBijPage from "@/components/WerkenBijPage";
import Footer from "@/components/Footer";
import FooterReveal from "@/components/FooterReveal";
import { sanityFetch } from "@/sanity/lib/fetch";
import {
  WERKEN_BIJ_PAGE_QUERY,
  ALL_VACATURES_QUERY,
  FOOTER_QUERY,
} from "@/sanity/lib/queries";

export const metadata = {
  title: "Werken bij | Weverskade",
  description:
    "Werken bij Weverskade. Bekijk onze openstaande vacatures en bouw mee aan de toekomst van vastgoedontwikkeling.",
};

export default async function WerkenBij() {
  const [pageData, vacaturesData, footerData] = await Promise.all([
    sanityFetch<any>({ query: WERKEN_BIJ_PAGE_QUERY, tags: ["werkenBijPage"] }),
    sanityFetch<any[]>({ query: ALL_VACATURES_QUERY, tags: ["vacature"] }),
    sanityFetch<any>({ query: FOOTER_QUERY, tags: ["footer"] }),
  ]);

  const werkenData =
    pageData || vacaturesData?.length > 0
      ? {
          heroTitle: pageData?.heroTitle,
          vacatures: vacaturesData?.map((v: any) => ({
            slug: v.slug?.current ?? "",
            title: v.title,
            shortDescription: v.shortDescription ?? "",
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
        <WerkenBijPage data={werkenData} />
      </div>
      <div data-nav-theme="blue">
        <FooterReveal>
          <Footer bg="bg-blue" data={footerProps} />
      </FooterReveal>
      </div>
    </>
  );
}
