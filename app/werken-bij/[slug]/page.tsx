import { notFound } from "next/navigation";
import VacatureDetailPage from "@/components/VacatureDetailPage";
import Footer from "@/components/Footer";
import FooterReveal from "@/components/FooterReveal";
import { getVacatureBySlug, getAllVacatureSlugs } from "@/data/vacatures";
import { sanityFetch } from "@/sanity/lib/fetch";
import {
  VACATURE_BY_SLUG_QUERY,
  ALL_VACATURE_SLUGS_QUERY,
  FOOTER_QUERY,
} from "@/sanity/lib/queries";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const sanitySlugs = await sanityFetch<string[]>({
    query: ALL_VACATURE_SLUGS_QUERY,
    tags: ["vacature"],
  });
  const localSlugs = getAllVacatureSlugs();
  const allSlugs = [...new Set([...(sanitySlugs ?? []), ...localSlugs])];
  return allSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const sanityVacature = await sanityFetch<any>({
    query: VACATURE_BY_SLUG_QUERY,
    params: { slug },
    tags: ["vacature"],
  });
  const localVacature = getVacatureBySlug(slug);
  const vacature = sanityVacature ?? localVacature;
  if (!vacature) return {};

  return {
    title: `${vacature.title} | Werken bij | Weverskade`,
    description: vacature.shortDescription ?? "",
  };
}

export default async function VacatureRoute({ params }: PageProps) {
  const { slug } = await params;
  const [sanityVacature, footerData] = await Promise.all([
    sanityFetch<any>({
      query: VACATURE_BY_SLUG_QUERY,
      params: { slug },
      tags: ["vacature"],
    }),
    sanityFetch<any>({ query: FOOTER_QUERY, tags: ["footer"] }),
  ]);

  const localVacature = getVacatureBySlug(slug);

  // Build vacature data: Sanity body is portable text, local is structured blocks
  let vacature;
  if (sanityVacature) {
    vacature = {
      slug: sanityVacature.slug?.current ?? slug,
      title: sanityVacature.title,
      shortDescription: sanityVacature.shortDescription ?? localVacature?.shortDescription ?? "",
      body: sanityVacature.body
        ? sanityVacature.body.map((block: any) => ({
            type: block.style === 'h2' || block.style === 'h3' ? 'heading' : 'paragraph',
            text: block.children?.map((c: any) => c.text).join('') ?? '',
          }))
        : localVacature?.body ?? [],
    };
  } else if (localVacature) {
    vacature = localVacature;
  } else {
    notFound();
  }

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
        <VacatureDetailPage vacature={vacature} />
      </div>
      <div data-nav-theme="green">
        <FooterReveal>
          <Footer bg="bg-green" data={footerProps} />
      </FooterReveal>
      </div>
    </>
  );
}
