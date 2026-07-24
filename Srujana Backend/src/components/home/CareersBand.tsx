import Image from "next/image";
import CtaLink from "../ui/CtaLink";

// Direction C careers band — full-bleed dark photo with a left-heavy shade
// (the A&M careers banner move). Copy is honest-framing: no open-role counts,
// no invented perks. The credential statement lives in the footer strip.
export default function CareersBand() {
  return (
    <section
      aria-labelledby="careers-heading"
      className="relative overflow-hidden bg-hero"
    >
      <div className="absolute inset-0">
        <Image
          src="/images/home/hero-cyber.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-hero/95 via-hero/70 to-hero/40" />
      </div>
      <div className="relative z-10 mx-auto max-w-content px-6 py-28 md:px-12">
        <p className="text-[11px] font-semibold uppercase tracking-label text-accent-light">
          Careers
        </p>
        <h2
          id="careers-heading"
          className="mt-5 max-w-3xl font-heading text-3xl font-light leading-tight text-white md:text-5xl"
        >
          Do Work That Holds Up in Front of a Regulator
        </h2>
        <p className="mt-6 max-w-2xl text-[17px] font-light leading-relaxed text-white/85">
          We hire people who care that the evidence is right — auditors,
          security engineers and forensic examiners building India&apos;s next
          assurance firm. If you like evidence more than theatre, you&apos;ll
          fit in.
        </p>
        <CtaLink href="/about/careers" onDark className="mt-10">
          Explore Careers
        </CtaLink>
      </div>
    </section>
  );
}
