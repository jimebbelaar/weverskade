export interface GebouwProject {
  slug: string;
  name: string;
  tagline: string;
  address: string;
  type: string;
  status: string;
  size: string;
  breeam?: string;
  epc?: string;
  partners?: string;
  year: string;
  wonenBeschikbaar: boolean;
  wonenSize?: string;
  heroImage: string;
  fullWidthImage: string;
  smallImages: [string, string];
  descriptionLeft: string;
  descriptionRight: string;
  quote?: string;
  quoteAuthor?: string;
  quoteAuthorImage?: string;
  mapCoordinates: { lat: number; lng: number };
}

export const gebouwen: GebouwProject[] = [
  {
    slug: "the-new-citizen",
    name: "The New Citizen",
    tagline: "Dichtbij alles",
    address: "Straat naam 123, Nieuwegein",
    type: "Kantoor",
    status: "Opgeleverd",
    size: "10.000 m2",
    breeam: "BREEAM Very Good",
    epc: "EPC A++++",
    partners: "Naam partners",
    year: "2025",
    wonenBeschikbaar: false,
    heroImage: "/images/portfolio-card-1.jpg",
    fullWidthImage: "/images/portfolio-card-2.jpg",
    smallImages: ["/images/portfolio-card-3.jpg", "/images/portfolio-1.png"],
    descriptionLeft:
      "Thuiskomen krijgt een heel nieuwe dimensie in The New Citizen: Een appartementengebouw met huurwoningen in de vrije sector, dat letterlijk boven anderen uitstijgt. De 128 comfortabele appartementen onderscheiden zich door de eigentijdse interieurontwerpen. Het slim bedachte, down to earth design, herken je ook in de openbare ruimtes. Zo begint thuiskomen al bij de entree.",
    descriptionRight:
      "The New Citizen is onderdeel van City Nieuwegein. Hier ontwikkelt gemeente Nieuwegein samen met partners in co-creatie een toekomstbestendige, duurzame, groene en gezonde binnenstad. The New Citizen is hier ook een belangrijk onderdeel van. Het complex voldoet aan alle moderne eisen op het gebied van comfort en duurzaamheid. Zo worden de energiezuinige woningen standaard gasloos opgeleverd, door gebruik te maken van een bodemwarmtepomp.",
    quote:
      "\u201CBij The New Citizen ging het ons niet alleen om het gebouw, maar om de plek in de stad. Hoe het aansluit op de omgeving en hoe bewoners het dagelijks gebruiken. Dat is waar we het voor doen.\u201D",
    quoteAuthor: "Vivianne Quak",
    quoteAuthorImage: "/images/about-team-1.jpg",
    mapCoordinates: { lat: 52.0286, lng: 5.0868 },
  },
  {
    slug: "weverstede",
    name: "Weverstede",
    tagline: "Wonen aan het water",
    address: "Weverstede 10, Nieuwegein",
    type: "Woning",
    status: "Woningen beschikbaar",
    size: "60 - 80 m2",
    epc: "EPC A++++",
    year: "2025",
    wonenBeschikbaar: true,
    wonenSize: "60 - 80 m2",
    heroImage: "/images/portfolio-card-2.jpg",
    fullWidthImage: "/images/portfolio-card-3.jpg",
    smallImages: ["/images/portfolio-card-1.jpg", "/images/portfolio-1.png"],
    descriptionLeft:
      "Thuiskomen krijgt een heel nieuwe dimensie in The New Citizen: Een appartementengebouw met huurwoningen in de vrije sector, dat letterlijk boven anderen uitstijgt. De 128 comfortabele appartementen onderscheiden zich door de eigentijdse interieurontwerpen. Het slim bedachte, down to earth design, herken je ook in de openbare ruimtes. Zo begint thuiskomen al bij de entree.",
    descriptionRight:
      "The New Citizen is onderdeel van City Nieuwegein. Hier ontwikkelt gemeente Nieuwegein samen met partners in co-creatie een toekomstbestendige, duurzame, groene en gezonde binnenstad. The New Citizen is hier ook een belangrijk onderdeel van. Het complex voldoet aan alle moderne eisen op het gebied van comfort en duurzaamheid. Zo worden de energiezuinige woningen standaard gasloos opgeleverd, door gebruik te maken van een bodemwarmtepomp.",
    mapCoordinates: { lat: 52.0316, lng: 5.0948 },
  },
  {
    slug: "de-drie-lelies",
    name: "De Drie Lelies",
    tagline: "Historie in het Maaslands erfgoed",
    address: "Hoogstraat 45, Maassluis",
    type: "Kantoor",
    status: "In ontwikkeling",
    size: "8.500 m2",
    breeam: "BREEAM Good",
    epc: "EPC A+++",
    partners: "Van der Linden & Co",
    year: "2026",
    wonenBeschikbaar: false,
    heroImage: "/images/portfolio-card-3.jpg",
    fullWidthImage: "/images/portfolio-card-1.jpg",
    smallImages: ["/images/portfolio-card-2.jpg", "/images/portfolio-2.png"],
    descriptionLeft:
      "Thuiskomen krijgt een heel nieuwe dimensie in The New Citizen: Een appartementengebouw met huurwoningen in de vrije sector, dat letterlijk boven anderen uitstijgt. De 128 comfortabele appartementen onderscheiden zich door de eigentijdse interieurontwerpen. Het slim bedachte, down to earth design, herken je ook in de openbare ruimtes. Zo begint thuiskomen al bij de entree.",
    descriptionRight:
      "The New Citizen is onderdeel van City Nieuwegein. Hier ontwikkelt gemeente Nieuwegein samen met partners in co-creatie een toekomstbestendige, duurzame, groene en gezonde binnenstad. The New Citizen is hier ook een belangrijk onderdeel van. Het complex voldoet aan alle moderne eisen op het gebied van comfort en duurzaamheid. Zo worden de energiezuinige woningen standaard gasloos opgeleverd, door gebruik te maken van een bodemwarmtepomp.",
    quote:
      "\u201CDe Drie Lelies is een ode aan het rijke erfgoed van Maassluis. Elk detail in het ontwerp vertelt een verhaal.\u201D",
    quoteAuthor: "Jan de Vries",
    quoteAuthorImage: "/images/about-team-2.jpg",
    mapCoordinates: { lat: 51.9225, lng: 4.2506 },
  },
];

export function getGebouwBySlug(slug: string): GebouwProject | undefined {
  return gebouwen.find((g) => g.slug === slug);
}

export function getAllGebouwSlugs(): string[] {
  return gebouwen.map((g) => g.slug);
}
