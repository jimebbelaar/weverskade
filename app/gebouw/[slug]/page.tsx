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

  // Build project data. When the project exists in Sanity, Sanity is the
  // single source of truth — empty fields stay empty (the UI hides them) so
  // editors can see exactly what they've filled in. Local data is only used
  // for demo slugs that aren't in Sanity at all.
  let project;
  if (sanityProject) {
    project = {
      slug: sanityProject.slug?.current ?? slug,
      name: sanityProject.name,
      tagline: sanityProject.tagline ?? "",
      address: sanityProject.address ?? "",
      type: sanityProject.type ?? "",
      status: sanityProject.status ?? "",
      size: sanityProject.size ?? "",
      breeam: sanityProject.breeam ?? undefined,
      epc: sanityProject.epc ?? undefined,
      partners: sanityProject.partners ?? undefined,
      year: sanityProject.year ?? "",
      wonenBeschikbaar: sanityProject.wonenBeschikbaar ?? false,
      heroImage: sanityImageUrl(sanityProject.heroImage, "/images/portfolio-hero.webp"),
      heroVideoUrl: sanityProject.heroVideoUrl ?? undefined,
      fullWidthImage: sanityImageUrl(sanityProject.fullWidthImage, "/images/portfolio-hero.webp"),
      smallImages: sanityProject.smallImages?.length > 0
        ? sanityProject.smallImages.map((img: any) => sanityImageUrl(img, "/images/portfolio-1.webp"))
        : [],
      descriptionLeft: sanityProject.descriptionLeft ?? "",
      descriptionRight: sanityProject.descriptionRight ?? "",
      quote: sanityProject.quote ?? undefined,
      quoteAuthor: sanityProject.quoteAuthor ?? undefined,
      quoteAuthorImage: sanityProject.quoteAuthorImage
        ? sanityImageUrl(sanityProject.quoteAuthorImage, "")
        : undefined,
      mapCoordinates: {
        lat: sanityProject.mapLat ?? 51.92,
        lng: sanityProject.mapLng ?? 4.25,
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
