"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";

const menuItems = [
  { label: "Over ons", href: "/over-ons" },
  { label: "Portefeuille", href: "/portefeuille" },
  { label: "Wonen bij", href: "/wonen-bij" },
  { label: "Nieuws", href: "/nieuws" },
  { label: "Maatschappelijk", href: "/maatschappelijk" },
  { label: "Werken bij", href: "/werken-bij" },
  { label: "Contact", href: "/contact" },
];

interface MenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Menu({ isOpen, onClose }: MenuProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pendingHref = useRef<string | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isNavHovered, setIsNavHovered] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      let cancelled = false;
      requestAnimationFrame(() => {
        if (cancelled) return;
        requestAnimationFrame(() => {
          if (cancelled) return;
          setVisible(true);
        });
      });
      return () => { cancelled = true; };
    } else {
      setVisible(false);
      const t = setTimeout(() => setMounted(false), 900);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  // Navigate early — page transition runs behind the closing menu
  useEffect(() => {
    if (!isOpen && pendingHref.current) {
      const href = pendingHref.current;
      pendingHref.current = null;
      const t = setTimeout(() => {
        router.push(href);
      }, 250);
      return () => clearTimeout(t);
    }
  }, [isOpen, router]);

  // Escape key
  const handleEsc = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!isOpen) return;
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, handleEsc]);

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleNavigation = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      if (href === pathname) {
        onClose();
        return;
      }

      // Capture old page DOM BEFORE any navigation happens
      const container = document.querySelector("[data-page-content]");
      if (container) {
        window.__pageSnapshot = {
          html: container.innerHTML,
          scrollY: window.scrollY,
        };
      }

      // Tell navbar to slide up immediately (synced with menu close)
      window.dispatchEvent(new CustomEvent("nav-hide"));

      pendingHref.current = href;
      onClose();
    },
    [pathname, onClose]
  );

  if (!mounted) return null;

  const n = menuItems.length;

  return (
    <div className="fixed inset-0 z-30">
      {/* Dark blur overlay */}
      <div
        className="absolute inset-0 bg-off-black/70 backdrop-blur-[2px]"
        style={{
          opacity: visible ? 1 : 0,
          transition: visible
            ? "opacity 0.5s cubic-bezier(0.4, 0, 0, 1)"
            : "opacity 0.35s cubic-bezier(0.4, 0, 0, 1) 0.12s",
        }}
      />

      {/* Blue panel — slides from right */}
      <div
        className="absolute top-[1.181vw] right-[1.042vw] bottom-[1.181vw] w-[39.444vw] bg-blue rounded-[0.556vw] overflow-hidden flex flex-col max-md:inset-0 max-md:w-auto max-md:rounded-none"
        style={{
          transform: visible
            ? "translateX(0)"
            : "translateX(calc(100% + 1.042vw))",
          transition: visible
            ? "transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.05s"
            : "transform 0.6s cubic-bezier(0.4, 0, 0, 1) 0.15s",
        }}
      >
        {/* Nav links with staggered dividers */}
        <nav
          className="px-[2.222vw] pt-[9.722vw] max-md:px-5 max-md:pt-20"
          onMouseEnter={() => setIsNavHovered(true)}
          onMouseLeave={() => { setIsNavHovered(false); setHoveredIndex(null); }}
        >
          {menuItems.map((item, i) => {
            const isActive = item.href === pathname;
            const isHovered = hoveredIndex === i;
            const isDimmed = isNavHovered && hoveredIndex !== null && !isHovered && !isActive;
            // The line BELOW this item = divider of next item (i+1), or the final divider
            const lineBelow = hoveredIndex !== null && hoveredIndex === i - 1;
            return (
            <div
              key={item.label}
              onMouseEnter={() => !isActive && setHoveredIndex(i)}
            >
              {/* Divider line — expands from left */}
              <div
                className="h-px"
                style={{
                  transformOrigin: "left",
                  transform: visible ? "scaleX(1)" : "scaleX(0)",
                  background: lineBelow
                    ? "rgba(255,255,255,0.8)"
                    : "rgba(255,255,255,0.3)",
                  transition: visible
                    ? `transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${0.4 + i * 0.06}s, background 0.5s ease`
                    : `transform 0.3s cubic-bezier(0.4, 0, 0, 1) ${(n - i) * 0.02}s, background 0.5s ease`,
                }}
              />
              {/* Link */}
              <a
                href={item.href}
                onClick={(e) => handleNavigation(e, item.href)}
                className={`block font-body font-medium text-[2.917vw] leading-[4.306vw] tracking-[-0.04em] text-off-white no-underline max-md:text-[32px] max-md:leading-[48px] ${isActive ? "pointer-events-none" : ""}`}
                style={{
                  opacity: visible
                    ? isActive
                      ? 0.4
                      : isDimmed
                        ? 0.4
                        : 1
                    : 0,
                  transform: visible
                    ? "translateY(0)"
                    : "translateY(0.694vw)",
                  transition: visible
                    ? "opacity 0.4s ease, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)"
                    : `opacity 0.25s ease ${(n - 1 - i) * 0.02}s, transform 0.25s ease ${(n - 1 - i) * 0.02}s`,
                }}
              >
                {item.label}
              </a>
            </div>
            );
          })}
          {/* Final divider */}
          <div
            className="h-px"
            style={{
              transformOrigin: "left",
              transform: visible ? "scaleX(1)" : "scaleX(0)",
              background: hoveredIndex === n - 1
                ? "rgba(255,255,255,0.8)"
                : "rgba(255,255,255,0.3)",
              transition: visible
                ? `transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${0.4 + n * 0.06}s, background 0.5s ease`
                : "transform 0.3s cubic-bezier(0.4, 0, 0, 1) 0s, background 0.5s ease",
            }}
          />
        </nav>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Bottom: Home + Privacy Policy */}
        <div className="relative px-[2.222vw] pb-[1.944vw] max-md:px-5 max-md:pb-8">
          <a
            href="/"
            onClick={(e) => handleNavigation(e, "/")}
            className="block font-body font-medium text-[2.917vw] leading-[4.306vw] tracking-[-0.04em] text-off-white no-underline hover:opacity-70 transition-opacity duration-200 max-md:text-[32px] max-md:leading-[48px]"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible
                ? "translateY(0)"
                : "translateY(0.694vw)",
              transition: visible
                ? `opacity 0.5s ease ${0.45 + n * 0.06}s, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${0.45 + n * 0.06}s`
                : "opacity 0.2s ease 0s, transform 0.2s ease 0s",
            }}
          >
            Home
          </a>
          <span
            className="absolute right-[1.458vw] bottom-[1.944vw] font-body font-medium text-[0.694vw] leading-normal tracking-[-0.04em] text-off-white max-md:right-5 max-md:bottom-8 max-md:text-[11px]"
            style={{
              opacity: visible ? 1 : 0,
              transition: visible
                ? `opacity 0.5s ease ${0.5 + n * 0.06}s`
                : "opacity 0.2s ease 0s",
            }}
          >
            Privacy Policy
          </span>
        </div>
      </div>
    </div>
  );
}
