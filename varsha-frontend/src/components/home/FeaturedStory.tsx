import Image from "next/image";
import Link from "next/link";
import { featuredPost, regularPosts } from "@/components/blog/blogData";

// Direction C insights — featured post large left (image, caps category,
// light headline), remaining posts as a hairline-divided list right. All
// content from blogData (single source of truth).
export default function FeaturedStory() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-content px-6 py-24 md:px-12 md:py-28">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-label text-accent-dark">
              Insights
            </p>
            <h2 className="mt-3 font-heading text-3xl font-light text-ink md:text-4xl">
              Latest Thinking
            </h2>
          </div>
          <Link
            href="/blog"
            className="inline-flex min-h-11 items-center text-xs font-semibold uppercase tracking-label text-accent-dark transition-colors duration-200 hover:text-accent"
          >
            All Insights&ensp;›
          </Link>
        </div>

        <div className="grid items-start gap-14 lg:grid-cols-[1.15fr_0.85fr]">
          {/* featured */}
          <Link href={`/blog/${featuredPost.slug}`} className="group block">
            {featuredPost.image && (
              <span className="relative block aspect-[16/9.5] overflow-hidden bg-navy">
                <Image
                  src={featuredPost.image}
                  alt={featuredPost.imageAlt ?? ""}
                  fill
                  sizes="(min-width: 1024px) 55vw, 100vw"
                  className={
                    featuredPost.imagePos === "left"
                      ? "object-cover object-left transition-transform duration-500 motion-safe:group-hover:scale-[1.04]"
                      : featuredPost.imagePos === "right"
                        ? "object-cover object-right transition-transform duration-500 motion-safe:group-hover:scale-[1.04]"
                        : "object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.04]"
                  }
                />
              </span>
            )}
            <span className="mt-6 block text-[11px] font-bold uppercase tracking-label text-accent-dark">
              {featuredPost.category}
            </span>
            <span className="mt-3 block font-heading text-2xl font-light leading-snug text-ink transition-colors duration-200 group-hover:text-accent-dark md:text-3xl">
              {featuredPost.title}
            </span>
            <span className="mt-4 block max-w-2xl text-[15px] leading-relaxed text-ink-2">
              {featuredPost.excerpt}
            </span>
            <span className="mt-4 block text-[13px] tracking-wide text-ink-3">
              {featuredPost.date} · {featuredPost.readTime}
            </span>
          </Link>

          {/* list */}
          <div>
            {regularPosts.map((p, i) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className={
                  i === 0
                    ? "group block pb-8"
                    : "group block border-t border-line-light py-8"
                }
              >
                <span className="block text-[11px] font-bold uppercase tracking-label text-accent-dark">
                  {p.category}
                </span>
                <span className="mt-2.5 block font-heading text-xl font-normal leading-snug text-ink transition-colors duration-200 group-hover:text-accent-dark">
                  {p.title}
                </span>
                <span className="mt-3 block text-sm font-light leading-relaxed text-ink-2">
                  {p.excerpt}
                </span>
                <span className="mt-3 block text-[13px] tracking-wide text-ink-3">
                  {p.date} · {p.readTime}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
