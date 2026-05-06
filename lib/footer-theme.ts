import type { Viewport } from "next";

export const FOOTER_BG_HEX: Record<string, string> = {
  "bg-blue": "#717F8B",
  "bg-green": "#848F71",
  "bg-off-white": "#F7F5F0",
  "bg-off-black": "#1D1F1A",
  "bg-brown": "#9A755D",
};

// iOS Safari paints the bottom rubber-band with the meta theme-color set
// at page load and ignores later JS updates. Each page exports a viewport
// matching its footer so the rubber-band lines up.
export function footerViewport(bg: keyof typeof FOOTER_BG_HEX | string): Viewport {
  return { themeColor: FOOTER_BG_HEX[bg] ?? FOOTER_BG_HEX["bg-blue"] };
}
