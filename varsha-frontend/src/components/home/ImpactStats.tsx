import { impact } from "./homeData";

// Direction C stats — deep-navy band, huge thin numerals, accent bar under
// each. Counts are real (regulators / credentials / practices) — house rule:
// no invented metrics.
export default function ImpactStats() {
  return (
    <section className="bg-navy text-white">
      <div className="mx-auto max-w-content px-6 py-24 md:px-12 md:py-28">
        <p className="text-[11px] font-semibold uppercase tracking-label text-accent-light">
          At a Glance
        </p>
        <dl className="mt-12 grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
          {impact.map((s) => (
            <div key={s.label}>
              <dt className="sr-only">{s.label}</dt>
              <dd className="font-heading text-7xl font-extralight leading-none text-white tabular-nums md:text-8xl">
                {s.num}
              </dd>
              <dd className="mt-5">
                <span className="block h-0.5 w-10 bg-accent" />
                <span className="mt-3.5 block max-w-56 text-sm font-light leading-relaxed text-white/70">
                  {s.label}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
