import type { MetadataRoute } from "next";

/**
 * PWA manifest — Android adds the icons to the home-screen "web clip" and
 * uses `theme_color` / `background_color` for the splash surface. Points at
 * the same branded favicon sources used everywhere else.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Weverskade",
    short_name: "Weverskade",
    description:
      "Weverskade is een ontwikkelende belegger in woningen en commercieel vastgoed.",
    start_url: "/",
    display: "standalone",
    background_color: "#F7F5F0",
    theme_color: "#848F71",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
