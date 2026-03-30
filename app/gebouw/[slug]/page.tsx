import { notFound } from "next/navigation";
import GebouwPage from "@/components/GebouwPage";
import Footer from "@/components/Footer";
import FooterReveal from "@/components/FooterReveal";
import { getGebouwBySlug, getAllGebouwSlugs } from "@/data/gebouwen";
import { sanityFetch } from "@/sanity/lib/fetch";
import {
  PROJECT_BY_SLUG_QUERY,
  ALL_PROJECT_SLUGS_QUERY,
  FOOTER_QUERY,
} from "@/sanity/lib/queries";
import { sanityImageUrl } from "@/sanity/lib/helpers";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const [sanitySlugs] = await Promise.all([
    sanityFetch<string[]>({ query: ALL_PROJECT_SLUGS_QUERY, tags: ["project"] }),
  ]);
  const localSlugs = getAllGebouwSlugs();
  const allSlugs = [...new Set([...(sanitySlugs ?? []), ...localSlugs])];
  return allSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const sanityProject = await sanityFetch<any>({
    query: PROJECT_BY_SLUG_QUERY,
    params: { slug },
    tags: ["project"],
  });
  const localProject = getGebouwBySlug(slug);
  const project = sanityProject ?? localProject;
  if (!project) return {};

  return {
    title: `${project.name} | Weverskade`,
    description: `${project.name} - ${project.tagline ?? ""}. ${project.address ?? ""}`,
  };
}

export default async function GebouwRoute({ params }: PageProps) {
  const { slug } = await params;
  const [sanityProject, footerData] = await Promise.all([
    sanityFetch<any>({
      query: PROJECT_BY_SLUG_QUERY,
      params: { slug },
      tags: ["project"],
    }),
    sanityFetch<any>({ query: FOOTER_QUERY, tags: ["footer"] }),
  ]);

  const localProject = getGebouwBySlug(slug);

  // Build project data: Sanity overrides local
  let project;
  if (sanityProject) {
    project = {
      slug: sanityProject.slug?.current ?? slug,
      name: sanityProject.name,
      tagline: sanityProject.tagline ?? localProject?.tagline ?? "",
      address: sanityProject.address ?? localProject?.address ?? "",
      type: sanityProject.type ?? localProject?.type ?? "",
      status: sanityProject.status ?? localProject?.status ?? "",
      size: sanityProject.size ?? localProject?.size ?? "",
      breeam: sanityProject.breeam ?? localProject?.breeam,
      epc: sanityProject.epc ?? localProject?.epc,
      partners: sanityProject.partners ?? localProject?.partners,
      year: sanityProject.year ?? localProject?.year,
      wonenBeschikbaar: sanityProject.wonenBeschikbaar ?? localProject?.wonenBeschikbaar ?? false,
      heroImage: sanityImageUrl(sanityProject.heroImage, localProject?.heroImage ?? "/images/portfolio-hero.webp"),
      fullWidthImage: sanityImageUrl(sanityProject.fullWidthImage, localProject?.fullWidthImage ?? "/images/portfolio-hero.webp"),
      smallImages: sanityProject.smallImages?.length > 0
        ? sanityProject.smallImages.map((img: any) => sanityImageUrl(img, "/images/portfolio-1.webp"))
        : localProject?.smallImages ?? [],
      descriptionLeft: sanityProject.descriptionLeft ?? localProject?.descriptionLeft ?? "",
      descriptionRight: sanityProject.descriptionRight ?? localProject?.descriptionRight ?? "",
      quote: sanityProject.quote ?? localProject?.quote,
      quoteAuthor: sanityProject.quoteAuthor ?? localProject?.quoteAuthor,
      quoteAuthorImage: sanityProject.quoteAuthorImage
        ? sanityImageUrl(sanityProject.quoteAuthorImage, localProject?.quoteAuthorImage ?? "")
        : localProject?.quoteAuthorImage,
      mapCoordinates: {
        lat: sanityProject.mapLat ?? localProject?.mapCoordinates?.lat ?? 51.92,
        lng: sanityProject.mapLng ?? localProject?.mapCoordinates?.lng ?? 4.25,
      },
    };
  } else if (localProject) {
    project = localProject;
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
        <GebouwPage project={project} />
      </div>
      <div data-nav-theme="green">
        <FooterReveal>
          <Footer bg="bg-green" data={footerProps} />
      </FooterReveal>
      </div>
    </>
  );
}
