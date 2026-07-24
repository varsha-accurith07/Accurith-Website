import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { BlogPost } from "./blogData";

// Direction C article layout — dark page-header band (kicker + light-weight
// display title) over a measured prose column on white. Wraps every post page;
// when the MDX pipeline (S-track) lands, its rendered output drops into
// `children` unchanged.
export default function PostShell({
  post,
  children,
}: {
  post: BlogPost;
  children: React.ReactNode;
}) {
  return (
    <article className="bg-white">
      {/* Post header — full-width dark band */}
      <header className="bg-hero text-white">
        <div className="mx-auto max-w-content px-6 py-20 md:px-12 md:py-28">
          <div className="mx-auto max-w-3xl">
            <p className="mb-10">
              <Link
                href="/blog"
                className="inline-flex min-h-11 items-center gap-2 text-[11px] font-semibold uppercase tracking-label text-white/70 transition-colors duration-200 hover:text-accent-light"
              >
                <ArrowLeft aria-hidden="true" size={14} strokeWidth={2} />
                All posts
              </Link>
            </p>

            <p className="text-[11px] font-semibold uppercase tracking-label text-accent-light">
              {post.category}
            </p>
            <h1 className="mt-5 font-heading text-3xl font-light leading-[1.1] text-white md:text-5xl">
              {post.title}
            </h1>
            <p className="mt-6 text-[11px] uppercase tracking-label text-white/70">
              {post.date} · {post.readTime}
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-content px-6 py-16 md:px-12 md:py-24">
        <div className="mx-auto max-w-3xl">
          <div className="space-y-6 text-[17px] leading-relaxed text-ink-2 [&_h2]:pt-6 [&_h2]:font-heading [&_h2]:text-2xl [&_h2]:font-light [&_h2]:text-ink [&_strong]:font-semibold [&_strong]:text-ink">
            {children}
          </div>

          {/* Post-level CTA — same conversion path as everywhere else. */}
          <div className="mt-16 border-t border-line-light pt-10">
            <p className="text-[15px] text-ink-3">
              Working through this in your own organisation?
            </p>
            <Link
              href="/contact"
              className="mt-4 inline-flex min-h-11 items-center gap-3.5"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-sm bg-accent text-white">
                <ArrowRight aria-hidden="true" size={16} strokeWidth={2} />
              </span>
              <span className="text-[12px] font-semibold uppercase tracking-cta text-ink">
                Book a consultation
              </span>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
