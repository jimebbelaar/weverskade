import ContactPage from "@/components/ContactPage";
import Footer from "@/components/Footer";
import { sanityFetch } from "@/sanity/lib/fetch";
import { CONTACT_PAGE_QUERY, FOOTER_QUERY } from "@/sanity/lib/queries";
import { sanityImageUrl } from "@/sanity/lib/helpers";

export const metadata = {
  title: "Contact | Weverskade",
  description:
    "Neem contact op met Weverskade. We gaan graag in gesprek over projecten, samenwerkingen of andere vragen.",
};

export default async function Contact() {
  const [pageData, footerData] = await Promise.all([
    sanityFetch<any>({ query: CONTACT_PAGE_QUERY, tags: ["contactPage"] }),
    sanityFetch<any>({ query: FOOTER_QUERY, tags: ["footer"] }),
  ]);

  const contactData = pageData
    ? {
        heroTitle: pageData.heroTitle,
        heroImage: sanityImageUrl(pageData.heroImage, "/images/contact-team.webp"),
        contactItems: pageData.contactItems,
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
        <ContactPage data={contactData} />
      </div>
      <div data-nav-theme="blue">
        <Footer bg="bg-blue" data={footerProps} />
      </div>
    </>
  );
}
