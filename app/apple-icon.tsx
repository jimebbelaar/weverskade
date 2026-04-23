import { ImageResponse } from "next/og";

// Apple touch icon — iOS adds rounded corners automatically, so we render a
// full-bleed green square with the Weverskade "W" centered.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

const GREEN = "#848F71";
const OFF_WHITE = "#F7F5F0";

// "W" path lifted verbatim from the Navbar SVG logo (viewBox 0–61 × 0–43).
const W_PATH =
  "M53.8613 0L46.56 25.6671L44.3119 33.7945L41.8162 25.6671L34.0763 0H27.0244L19.2844 25.6671L16.7888 33.7945L14.5425 25.6671L7.23939 0H0L13.2319 43.0839H20.2219L27.8362 18.1493L30.5813 9.22704L33.2662 18.2117L40.8806 43.0839H47.8706L61.1025 0H53.8613Z";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: GREEN,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="99"
          height="70"
          viewBox="0 0 61.1 43.1"
        >
          <path fill={OFF_WHITE} d={W_PATH} />
        </svg>
      </div>
    ),
    { ...size }
  );
}
