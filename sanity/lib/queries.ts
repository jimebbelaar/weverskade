// ============================================
// SINGLETON QUERIES
// ============================================

export const SITE_SETTINGS_QUERY = `*[_type == "siteSettings"][0]`

export const FOOTER_QUERY = `*[_type == "footer"][0]`

export const HOME_PAGE_QUERY = `*[_type == "homePage"][0]{
  ...,
  featuredProjects[]->{
    _id,
    name,
    slug,
    tagline,
    type,
    location,
    portfolioImage
  }
}`

export const OVER_ONS_PAGE_QUERY = `*[_type == "overOnsPage"][0]`

export const MAATSCHAPPELIJK_PAGE_QUERY = `*[_type == "maatschappelijkPage"][0]`

export const CONTACT_PAGE_QUERY = `*[_type == "contactPage"][0]`

export const PORTEFEUILLE_PAGE_QUERY = `*[_type == "portefeuillePage"][0]`

export const WONEN_BIJ_PAGE_QUERY = `*[_type == "wonenBijPage"][0]`

export const NIEUWS_PAGE_SETTINGS_QUERY = `*[_type == "nieuwsPageSettings"][0]`

export const WERKEN_BIJ_PAGE_QUERY = `*[_type == "werkenBijPage"][0]`

// ============================================
// DOCUMENT QUERIES
// ============================================

export const ALL_PROJECTS_QUERY = `*[_type == "project" && showInPortfolio == true] | order(orderRank asc) {
  _id,
  name,
  slug,
  tagline,
  type,
  status,
  category,
  location,
  hasDetailPage,
  portfolioImage
}`

export const WONEN_PROJECTS_QUERY = `*[_type == "project" && showInWonen == true] | order(orderRank asc) {
  _id,
  name,
  slug,
  tagline,
  type,
  status,
  location,
  wonenBeschikbaar,
  hasDetailPage,
  portfolioImage
}`

export const PROJECT_BY_SLUG_QUERY = `*[_type == "project" && slug.current == $slug][0]`

export const ALL_PROJECT_SLUGS_QUERY = `*[_type == "project" && hasDetailPage == true].slug.current`

export const ALL_NIEUWS_QUERY = `*[_type == "nieuwsArtikel"] | order(date desc) {
  _id,
  title,
  slug,
  date,
  category,
  excerpt,
  heroImage
}`

export const NIEUWS_BY_SLUG_QUERY = `*[_type == "nieuwsArtikel" && slug.current == $slug][0]`

export const ALL_NIEUWS_SLUGS_QUERY = `*[_type == "nieuwsArtikel"].slug.current`

export const ALL_VACATURES_QUERY = `*[_type == "vacature" && isActive == true] | order(_createdAt desc) {
  _id,
  title,
  slug,
  shortDescription
}`

export const VACATURE_BY_SLUG_QUERY = `*[_type == "vacature" && slug.current == $slug][0]`

export const ALL_VACATURE_SLUGS_QUERY = `*[_type == "vacature"].slug.current`

export const ALL_TEAM_QUERY = `*[_type == "teamLid"] | order(orderRank asc) {
  _id,
  name,
  "function": function,
  image
}`
