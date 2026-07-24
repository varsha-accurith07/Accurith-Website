"use client";

import { createElement, useEffect, useRef } from "react";

// V28 — scroll-reveal with sibling stagger (60–80ms), no framer-motion.
// Children below the viewport get [data-reveal] (hidden via globals.css) and
// .is-revealed on intersection; children already visible on load are left
// untouched, so there is no flash. Entirely inert under
// prefers-reduced-motion, and never used on the Trust page.
export default function RevealGroup({
  children,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "ul" | "ol";
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const items = Array.from(el.children).filter(
      (child): child is HTMLElement =>
        child instanceof HTMLElement &&
        child.getAttribute("aria-hidden") !== "true",
    );

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const target = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            if (target.hasAttribute("data-reveal")) {
              target.classList.add("is-revealed");
            }
            observer.unobserve(target);
          } else if (!target.hasAttribute("data-reveal")) {
            // Below the fold on first check — arm it for reveal.
            target.setAttribute("data-reveal", "");
          }
        }
      },
      { threshold: 0.15 },
    );

    items.forEach((item, i) => {
      item.style.setProperty("--reveal-delay", `${i * 70}ms`);
      observer.observe(item);
    });

    return () => observer.disconnect();
  }, []);

  return createElement(
    as,
    { ref, className },
    children,
  );
}
