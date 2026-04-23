"use client";

import { useRef, useState } from "react";

function parseVimeoUrl(url: string): { id: string; hash?: string } | null {
  const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)(?:\/([a-zA-Z0-9]+))?/);
  if (!match) return null;
  return { id: match[1], hash: match[2] };
}

export default function VimeoBackground({
  url,
  poster,
}: {
  url: string;
  poster?: string;
}) {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const parsed = parseVimeoUrl(url);
  if (!parsed) return null;
  const params = new URLSearchParams({
    background: "1",
    autoplay: "1",
    loop: "1",
    muted: "1",
    autopause: "0",
  });
  if (parsed.hash) params.set("h", parsed.hash);
  const src = `https://player.vimeo.com/video/${parsed.id}?${params.toString()}`;

  return (
    <div className="absolute inset-0 pointer-events-none">
      {poster && (
        <img
          src={poster}
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      <iframe
        src={src}
        title="Hero video"
        allow="autoplay; fullscreen; picture-in-picture"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[177.78vh] h-[56.25vw] min-w-full min-h-full"
        frameBorder={0}
        onLoad={() => {
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          timeoutRef.current = setTimeout(() => setVisible(true), 600);
        }}
        style={{
          opacity: visible ? 1 : 0,
          transition: "opacity 0.8s ease-out",
        }}
      />
    </div>
  );
}
