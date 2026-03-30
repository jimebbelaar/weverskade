"use client";

import { useEffect, useRef, useState } from "react";

interface StatItem {
  value: string;
  label: string;
}

function StatCard({ item }: { item: StatItem }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref}>
      <span className="block overflow-hidden pt-[1.5vw] -mt-[1.5vw] pb-[0.3vw] -mb-[0.3vw] max-md:pt-[8px] max-md:-mt-[8px] max-md:pb-[2px] max-md:-mb-[2px]">
        <span
          className="block will-change-transform font-heading font-normal text-[3.194vw] leading-[2.153vw] tracking-[-0.064vw] text-off-black mb-[1.389vw] max-md:text-[28px] max-md:leading-normal max-md:tracking-[-0.56px] max-md:mb-2"
          style={{
            transform: visible ? "translateY(0)" : "translateY(110%)",
            transition: visible
              ? "transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.05s"
              : "none",
          }}
        >
          {item.value}
        </span>
      </span>
      <span className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
        <span
          className="block will-change-transform font-body font-medium text-[1.389vw] leading-[1.875vw] tracking-[-0.028vw] text-off-black max-md:text-[15px] max-md:leading-[20px] max-md:tracking-[-0.3px]"
          style={{
            transform: visible ? "translateY(0)" : "translateY(110%)",
            transition: visible
              ? "transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.15s"
              : "none",
          }}
        >
          {item.label}
        </span>
      </span>
    </div>
  );
}

export default function StatsGrid({ items }: { items: StatItem[] }) {
  return (
    <div className="grid grid-cols-[22.708vw_22.708vw] gap-x-[1.389vw] gap-y-[4.583vw] max-md:grid-cols-2 max-md:gap-x-5 max-md:gap-y-8">
      {items.map((item) => (
        <StatCard key={item.value + item.label} item={item} />
      ))}
    </div>
  );
}
