import { industries } from "./homeData";

// Direction C industries strip — cool-grey band, hairline six-up grid.
// Regulator tag in caps accent, industry name below. Plain cells, not links
// (no industry pages exist yet; no invented routes).
export default function IndustriesGrid() {
  return (
    <section className="bg-sec1">
      <div className="mx-auto max-w-content px-6 py-24 md:px-12">
        <p className="text-[11px] font-semibold uppercase tracking-label text-accent-dark">
          Industries
        </p>
        <h2 className="mt-3 font-heading text-3xl font-light text-ink md:text-4xl">
          Who We Serve
        </h2>
        <ul className="mt-12 grid gap-px border border-line-light bg-line-light sm:grid-cols-3 xl:grid-cols-6">
          {industries.map((n) => (
            <li key={n.reg} className="bg-sec1 p-7">
              <span className="block text-[11px] font-bold uppercase tracking-label text-accent-dark">
                {n.reg}
              </span>
              <span className="mt-2 block text-[15px] leading-snug text-ink">
                {n.name}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
