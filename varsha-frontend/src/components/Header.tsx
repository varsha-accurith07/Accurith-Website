"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { cn } from "./ui/cn";
import Logo from "./Logo";
import { primaryNav } from "./siteData";

// Direction B header — click-to-open dropdowns with label + one-line desc
// (Services, Company), solid accent "Request a demo". On the home page the
// header overlays the dark hero (transparent, white links) and stays dark
// after scroll, so no white strip ever covers the hero. Brand is the shared
// Logo lockup (mark above spaced wordmark, per the 2026-07-22 brand sheet).
// A11y: Escape + click-outside close, focus-trapped mobile slide-over.

function Brand({ dark }: { dark: boolean }) {
  return (
    <Link
      href="/"
      aria-label="Accurith — home"
      className="flex rounded-lg py-1"
    >
      <Logo theme={dark ? "dark" : "light"} priority />
    </Link>
  );
}

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const mobilePanelRef = useRef<HTMLDivElement>(null);
  const mobileToggleRef = useRef<HTMLButtonElement>(null);
  const menuIdBase = useId();

  // Close menus whenever the route changes — state adjusted during render
  // (React's recommended pattern) rather than in an effect.
  const [lastPathname, setLastPathname] = useState(pathname);
  if (lastPathname !== pathname) {
    setLastPathname(pathname);
    setMobileOpen(false);
    setOpenMenu(null);
  }

  // Track scroll so the home-page overlay header can go solid past the top.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Desktop dropdowns: close on Escape or click outside the nav.
  useEffect(() => {
    if (!openMenu) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenMenu(null);
    };
    const onClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [openMenu]);

  // Mobile slide-over: lock body scroll, close on Escape, keep Tab inside.
  useEffect(() => {
    if (!mobileOpen) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        mobileToggleRef.current?.focus();
      }
      if (e.key === "Tab" && mobilePanelRef.current) {
        const focusables = mobilePanelRef.current.querySelectorAll<HTMLElement>(
          "a[href], button:not([disabled])",
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [mobileOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  // Home starts with a full-bleed dark hero, so the header floats over it —
  // transparent at the top, dark (never white) once scrolled. Only the white
  // mobile slide-over flips it to the light treatment.
  const isHome = pathname === "/";
  const dark = isHome && !mobileOpen;

  // Direction C nav treatment — caps, letterspaced, thin (the A&M header).
  const navLinkClasses = (active: boolean) =>
    cn(
      "rounded-sm px-3 py-2 text-xs font-medium uppercase tracking-kicker transition-colors duration-200",
      dark
        ? active
          ? "text-white"
          : "text-white/85 hover:bg-white/10 hover:text-white"
        : active
          ? "text-accent"
          : "text-ink-2 hover:bg-sec1 hover:text-ink",
    );

  return (
    <header
      className={cn(
        "top-0 z-40 border-b transition-colors duration-300",
        isHome ? "fixed inset-x-0" : "sticky",
        dark
          ? scrolled
            ? "border-white/10 bg-hero/95 backdrop-blur"
            : "border-transparent bg-transparent"
          : "border-line-light bg-white",
      )}
    >
      <div className="mx-auto flex h-20 max-w-content items-center justify-between px-6 md:h-24 md:px-12">
        <div className="flex items-center gap-8 xl:gap-11">
          <Brand dark={dark} />

          {/* Desktop nav */}
          <nav
            ref={navRef}
            aria-label="Main"
            className="hidden items-center gap-1 lg:flex"
          >
            {primaryNav.map((item) =>
              item.children ? (
                <div key={item.label} className="relative">
                  <button
                    type="button"
                    aria-expanded={openMenu === item.label}
                    aria-controls={`${menuIdBase}-${item.label}`}
                    onClick={() =>
                      setOpenMenu((o) => (o === item.label ? null : item.label))
                    }
                    className={cn(
                      navLinkClasses(isActive(item.href)),
                      "flex items-center gap-1.5",
                    )}
                  >
                    {item.label}
                    <ChevronDown
                      aria-hidden="true"
                      size={14}
                      strokeWidth={1.75}
                      className={cn(
                        "transition-transform duration-200",
                        openMenu === item.label && "rotate-180",
                      )}
                    />
                  </button>

                  {openMenu === item.label && (
                    <div
                      id={`${menuIdBase}-${item.label}`}
                      className="absolute left-0 top-full z-50 mt-2 w-72 rounded-xl border border-line-light bg-white p-2 shadow-xl"
                    >
                      <ul>
                        {item.children.map((c) => (
                          <li key={c.href}>
                            <Link
                              href={c.href}
                              className="group flex flex-col gap-0.5 rounded-lg px-3 py-2.5 transition-colors duration-200 hover:bg-sec1"
                            >
                              <span className="text-sm font-medium text-ink group-hover:text-accent">
                                {c.label}
                              </span>
                              <span className="text-xs text-ink-3">
                                {c.desc}
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  className={navLinkClasses(isActive(item.href))}
                  aria-current={isActive(item.href) ? "page" : undefined}
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>
        </div>

        <div className="hidden lg:block">
          <Link
            href="/contact"
            className="inline-flex min-h-10 items-center bg-accent px-5 text-xs font-semibold uppercase tracking-kicker text-white transition-colors duration-200 hover:bg-accent-hover"
          >
            Request a demo
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          ref={mobileToggleRef}
          type="button"
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileOpen((o) => !o)}
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-lg lg:hidden",
            dark ? "text-white" : "text-ink",
          )}
        >
          {mobileOpen ? (
            <X aria-hidden="true" size={24} strokeWidth={1.75} />
          ) : (
            <Menu aria-hidden="true" size={24} strokeWidth={1.75} />
          )}
        </button>
      </div>

      {/* Mobile slide-over */}
      {mobileOpen && (
        <div
          ref={mobilePanelRef}
          className="fixed inset-x-0 bottom-0 top-20 z-40 overflow-y-auto bg-white md:top-24 lg:hidden"
        >
          <nav aria-label="Mobile" className="px-4 py-6 sm:px-6">
            {primaryNav.map((item) =>
              item.children ? (
                <div key={item.label} className="mb-6">
                  <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-label text-ink-3">
                    {item.label}
                  </p>
                  <ul className="space-y-1">
                    {item.children.map((c) => (
                      <li key={c.href}>
                        <Link
                          href={c.href}
                          className="flex min-h-11 items-center rounded-lg px-3 py-2 text-base text-ink-2 hover:bg-sec1"
                        >
                          {c.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "flex min-h-11 items-center rounded-lg px-3 py-2 text-base",
                    isActive(item.href)
                      ? "font-medium text-accent"
                      : "text-ink-2 hover:bg-sec1",
                  )}
                  aria-current={isActive(item.href) ? "page" : undefined}
                >
                  {item.label}
                </Link>
              ),
            )}
            <div className="mt-6 border-t border-line-light pt-6">
              <Link
                href="/contact"
                className="flex min-h-12 items-center justify-center bg-accent px-5 text-sm font-semibold uppercase tracking-kicker text-white transition-colors duration-200 hover:bg-accent-hover"
              >
                Request a demo
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
