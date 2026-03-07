"use client";

import { useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";

export function usePageNavigation() {
  const router = useRouter();
  const pathname = usePathname();

  const navigate = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      // Let external links pass through
      if (href.startsWith("http")) return;

      e.preventDefault();
      if (href === pathname) return;

      // Capture old page DOM
      const container = document.querySelector("[data-page-content]");
      if (container) {
        window.__pageSnapshot = {
          html: container.innerHTML,
          scrollY: window.scrollY,
        };
      }

      // Hide navbar
      window.dispatchEvent(new CustomEvent("nav-hide"));

      // Navigate after a brief delay to let navbar start hiding
      setTimeout(() => {
        router.push(href);
      }, 100);
    },
    [pathname, router]
  );

  return navigate;
}
