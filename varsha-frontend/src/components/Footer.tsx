import Link from "next/link";
import Logo from "./Logo";
import { companyLinks, frameworks, legalPages, services } from "./siteData";

// Direction C footer — dark ink ground, four columns (brand + address,
// Services, Company, framework chips), then a hairline credentials strip
// with the honest-framing statement, responsible-disclosure link, copyright
// and legal links. Framework names stay text chips — never badge images.
export default function Footer() {
  return (
    <footer className="bg-hero text-white/60">
      <div className="mx-auto max-w-content px-6 md:px-12">
        {/* columns */}
        <div className="grid gap-12 py-16 md:grid-cols-2 md:py-20 lg:grid-cols-[1.3fr_1fr_1fr_1.1fr]">
          <div>
            <Link href="/" aria-label="Accurith — home" className="inline-flex">
              <Logo theme="dark" />
            </Link>
            <p className="mt-6 max-w-64 text-sm font-light leading-relaxed">
              Assurance and advisory for organisations answering to
              India&apos;s regulators.
            </p>
            <address className="mt-5 text-sm font-light not-italic leading-relaxed">
              <p>#24, 1st Floor, Beside Sai Castle</p>
              <p>Balaji Layout, Kodigehalli</p>
              <p>Bangalore &ndash; 560092, India</p>
            </address>
          </div>

          <nav aria-label="Footer — services">
            <p className="text-[11px] font-semibold uppercase tracking-label text-white">
              Services
            </p>
            <ul className="mt-5 space-y-3">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/services/${s.slug}`}
                    className="text-sm font-light transition-colors duration-200 hover:text-white"
                  >
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Footer — company">
            <p className="text-[11px] font-semibold uppercase tracking-label text-white">
              Company
            </p>
            <ul className="mt-5 space-y-3">
              {companyLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm font-light transition-colors duration-200 hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/blog"
                  className="text-sm font-light transition-colors duration-200 hover:text-white"
                >
                  Insights
                </Link>
              </li>
            </ul>
          </nav>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-label text-white">
              We Align To
            </p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {frameworks.map((f) => (
                <li
                  key={f}
                  className="border border-line-footer px-3 py-1.5 text-xs tracking-wide text-white/70"
                >
                  {f}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-[13px] font-light leading-relaxed">
              Alignment statements describe our delivery approach and are not
              certification claims.
            </p>
          </div>
        </div>

        {/* credentials + small print */}
        <div className="border-t border-line-footer py-8">
          <p className="text-[13px] font-light leading-relaxed">
            Leadership credentials:{" "}
            <span className="tracking-wide text-white/85">
              DISA · FAFD · ISC2 CC · DPCAC
            </span>
            . To report a security vulnerability in this website, see our{" "}
            <Link
              href="/trust/report-vulnerability"
              className="text-accent-light underline underline-offset-2 transition-colors duration-200 hover:text-white"
            >
              responsible disclosure page
            </Link>
            .
          </p>
          <div className="mt-4 flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
            <p className="text-xs font-light">
              &copy; {new Date().getFullYear()} Accurith Technologies Private
              Limited &middot; Karnataka, India
            </p>
            <div className="flex flex-wrap items-center gap-x-5">
              {legalPages.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="flex min-h-9 items-center text-xs font-light transition-colors duration-200 hover:text-white"
                >
                  {l.label
                    .replace(" Policy", "")
                    .replace(" of Service", "")
                    .replace("Data Processing Agreement", "DPA")}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
