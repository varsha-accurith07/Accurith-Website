import Image from "next/image";
import Link from "next/link";
import { cn } from "../ui/cn";
import { expertise } from "./homeData";

// "What we do" — Direction C photo-tile grid. Six tiles on a hairline grid,
// each carrying service artwork under a bottom-heavy shade. Caps title,
// accent bar, desc. imagePos picks the crop for tiles sharing the wide
// skyline artwork (static class map — no style=, CSP posture).
const posClasses = { left: "object-left", right: "object-right" } as const;
export default function ExpertiseList() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-content px-6 pb-24 md:px-12 md:pb-28">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-label text-accent-dark">
              Expertise
            </p>
            <h2 className="mt-3 font-heading text-3xl font-light text-ink md:text-4xl">
              What We Do
            </h2>
          </div>
          <Link
            href="/services"
            className="inline-flex min-h-11 items-center text-xs font-semibold uppercase tracking-label text-accent-dark transition-colors duration-200 hover:text-accent"
          >
            All Services&ensp;›
          </Link>
        </div>

        <ul className="grid gap-0.5 bg-line-light sm:grid-cols-2 lg:grid-cols-3">
          {expertise.map((e) => (
            <li key={e.no} className="group relative">
              <Link
                href={e.href}
                className="relative block aspect-[4/3.4] overflow-hidden bg-navy"
              >
                {e.image && (
                  <Image
                    src={e.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className={cn(
                      "object-cover transition-transform duration-500 motion-safe:group-hover:scale-105",
                      e.imagePos && posClasses[e.imagePos],
                    )}
                  />
                )}
                <span className="absolute inset-0 bg-gradient-to-b from-hero/10 via-hero/30 to-hero/90" />
                <span className="absolute inset-x-0 bottom-0 z-10 p-7">
                  <span className="block text-[11px] font-semibold uppercase tracking-label text-white/60">
                    {e.no}
                  </span>
                  <span className="mt-2 block font-heading text-xl font-normal uppercase tracking-kicker text-white">
                    {e.title}
                  </span>
                  <span className="mt-3 block h-0.5 w-9 bg-accent" />
                  <span className="mt-3 block max-w-xs text-sm font-light leading-relaxed text-white/85">
                    {e.desc}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
