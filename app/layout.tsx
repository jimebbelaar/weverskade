import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import Navbar from "@/components/Navbar";
import PageTransition from "@/components/PageTransition";
import { sanityFetch } from "@/sanity/lib/fetch";
import { SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import "./globals.css";

const arizonaMix = localFont({
  src: "../fonts/ABCArizonaMix-Regular.woff2",
  variable: "--font-heading",
  weight: "400",
  style: "normal",
  display: "swap",
});

const gtStandard = localFont({
  src: [
    {
      path: "../fonts/GT-Standard-L-Standard-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/GT-Standard-L-Standard-Regular-Oblique.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../fonts/GT-Standard-L-Standard-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/GT-Standard-L-Standard-Medium-Oblique.woff2",
      weight: "500",
      style: "italic",
    },
    {
      path: "../fonts/GT-Standard-L-Standard-Semibold.woff2",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-body",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await sanityFetch<{
    metaTitle?: string;
    metaDescription?: string;
  }>({ query: SITE_SETTINGS_QUERY, tags: ["siteSettings"] });

  return {
    title: settings?.metaTitle ?? "Weverskade | Aandacht voor ruimte",
    description:
      settings?.metaDescription ??
      "Weverskade is een ontwikkelende belegger in woningen en commercieel vastgoed.",
    // Next.js will also auto-emit links for app/icon.svg and app/apple-icon
    // thanks to filename conventions — listing them here makes the intent
    // explicit and ensures the SVG is preferred on modern browsers.
    icons: {
      icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
      apple: [{ url: "/apple-icon", sizes: "180x180", type: "image/png" }],
    },
  };
}

// Brand theme color — paints mobile browser chrome (iOS Safari top bar /
// Android address bar / PWA splash) in the same green as the logo tile.
export const viewport: Viewport = {
  themeColor: "#848F71",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl" className={`${arizonaMix.variable} ${gtStandard.variable}`}>
      <body className="antialiased bg-off-white text-off-black font-body font-medium">
        <Navbar />
        <PageTransition>
          {children}
        </PageTransition>
      </body>
    </html>
  );
}
