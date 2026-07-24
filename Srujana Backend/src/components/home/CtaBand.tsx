import CtaLink from "../ui/CtaLink";

// Direction C closing CTA — quiet, centered, white. One action: the
// consultation form on /contact. Response promise per the build plan.
export default function CtaBand() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-content px-6 py-24 text-center md:px-12 md:py-28">
        <p className="text-[11px] font-semibold uppercase tracking-label text-accent-dark">
          Contact
        </p>
        <h2 className="mx-auto mt-4 max-w-2xl font-heading text-3xl font-light text-ink md:text-5xl">
          Book a Consultation
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-[17px] leading-relaxed text-ink-2">
          Tell us what you&apos;re answering to — a regulator, a board, or a
          breach. We respond within one business day.
        </p>
        <div className="mt-10 flex justify-center">
          <CtaLink href="/contact">Get in Touch</CtaLink>
        </div>
      </div>
    </section>
  );
}
