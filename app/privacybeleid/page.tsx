import PrivacyPage from "@/components/PrivacyPage";
import Footer from "@/components/Footer";
import FooterReveal from "@/components/FooterReveal";
import { sanityFetch } from "@/sanity/lib/fetch";
import { FOOTER_QUERY } from "@/sanity/lib/queries";

export const metadata = {
  title: "Privacybeleid | Weverskade",
  description:
    "Privacybeleid van Weverskade B.V. — hoe wij omgaan met uw persoonsgegevens conform de AVG.",
};

export default async function Privacybeleid() {
  const footerData = await sanityFetch<any>({
    query: FOOTER_QUERY,
    tags: ["footer"],
  });

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
        <PrivacyPage />
      </div>
      <div data-nav-theme="blue">
        <FooterReveal>
          <Footer bg="bg-blue" data={footerProps} />
        </FooterReveal>
      </div>
    </>
  );
}
