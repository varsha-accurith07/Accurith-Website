"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { cn } from "../ui/cn";
import { heroSlides } from "./homeData";

// Direction C hero — abstract Big-4-style ground (bg-hero-scene) with
// full-width light-weight display headline, thin white hairline rule,
// summary, chip CTA. Slide 1 speaks for the company; the rest carry the
// practice lines. Bottom chrome: centered "Scroll Down" with an accent
// progress track, bare chevron arrows bottom-right. Auto-advances every 8s;
// paused on hover, off under prefers-reduced-motion.

const SLIDE_COUNT = heroSlides.length;
// Static classes per slide index — house rule: no style= in shipped React.
const progressWidths = ["w-1/4", "w-2/4", "w-3/4", "w-full"];

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
function subscribeReducedMotion(onChange: () => void) {
  const mq = window.matchMedia(REDUCED_MOTION_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}
const getReducedMotion = () => window.matchMedia(REDUCED_MOTION_QUERY).matches;

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    () => false,
  );

  useEffect(() => {
    if (paused || reducedMotion) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % SLIDE_COUNT), 8000);
    return () => clearInterval(t);
  }, [paused, reducedMotion]);

  const go = (n: number) =>
    setIndex(((n % SLIDE_COUNT) + SLIDE_COUNT) % SLIDE_COUNT);

  const current = heroSlides[index];

  return (
    <section
      aria-roledescription="carousel"
      aria-label="What Accurith does"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="relative min-h-[45rem] overflow-hidden bg-hero text-white lg:h-screen"
    >
      {/* abstract Big-4-style ground — navy gradient, precision grid, light
          beams (no artwork; client dropped the monument photo 2026-07-22) */}
      <div aria-hidden="true" className="absolute inset-0 bg-hero-scene" />

      {/* active slide — keyed so the rise animation restarts */}
      <div className="relative z-20 mx-auto flex h-full min-h-[45rem] max-w-content items-center px-6 pb-32 pt-28 md:px-12 lg:h-screen">
        <div
          key={current.title}
          className="anim-rise grid w-full items-center gap-10 lg:grid-cols-[21rem_1fr] lg:gap-16"
        >
          {/* small inset art card (kept per client, 2026-07-22) */}
          <div className="relative hidden aspect-[10/11] w-full overflow-hidden shadow-2xl shadow-black/50 lg:block">
            <Image
              src={current.image}
              alt=""
              fill
              sizes="21rem"
              className="object-cover"
            />
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-label text-accent-light">
              {current.kicker}
            </p>
            <h1 className="mt-6 max-w-4xl font-heading text-4xl font-light leading-[1.08] text-white sm:text-5xl xl:text-6xl">
              {current.title}
            </h1>
            <div className="mt-8 h-px w-full max-w-xl bg-white/55" />
            <p className="mt-8 max-w-2xl text-lg font-light leading-relaxed text-white/90">
              {current.summary}
            </p>
            <Link
              href={current.href}
              className="group mt-10 inline-flex min-h-12 items-center gap-4"
            >
              <span className="flex h-11 w-11 items-center justify-center bg-accent transition-colors duration-200 group-hover:bg-accent-hover">
                <Play
                  aria-hidden="true"
                  size={14}
                  strokeWidth={0}
                  className="fill-white"
                />
              </span>
              <span className="text-xs font-semibold uppercase tracking-cta text-white">
                {current.cta}
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* bottom chrome: scroll hint + slide progress, centered */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-6 z-20 hidden flex-col items-center gap-2.5 md:flex"
      >
        <span className="text-sm font-light text-white/90">Scroll Down</span>
        <div className="h-0.5 w-full max-w-xl bg-white/30">
          <div
            className={cn(
              "h-full bg-accent transition-all duration-500",
              progressWidths[index] ?? "w-full",
            )}
          />
        </div>
        <ChevronDown
          aria-hidden="true"
          size={18}
          strokeWidth={1.5}
          className="text-white/90"
        />
      </div>

      {/* bare chevron arrows, bottom-right */}
      <div className="absolute bottom-8 right-6 z-20 flex items-center gap-4 md:right-12">
        <button
          type="button"
          aria-label="Previous slide"
          onClick={() => go(index - 1)}
          className="flex h-11 w-11 items-center justify-center text-white transition-colors duration-200 hover:text-accent-light"
        >
          <ChevronLeft aria-hidden="true" size={30} strokeWidth={1.5} />
        </button>
        <button
          type="button"
          aria-label="Next slide"
          onClick={() => go(index + 1)}
          className="flex h-11 w-11 items-center justify-center text-white transition-colors duration-200 hover:text-accent-light"
        >
          <ChevronRight aria-hidden="true" size={30} strokeWidth={1.5} />
        </button>
      </div>
    </section>
  );
}
