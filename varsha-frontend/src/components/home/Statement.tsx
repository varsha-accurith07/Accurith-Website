import Link from "next/link";

// Direction C statement band — the A&M "Leadership. Action. Results." move:
// oversized light headline left, positioning copy right.
export default function Statement() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-content px-6 py-24 md:px-12 md:py-28">
        <p className="text-[11px] font-semibold uppercase tracking-label text-accent-dark">
          Accurith Technologies
        </p>
        <div className="mt-6 grid items-start gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          <h2 className="font-heading text-4xl font-light tracking-wide text-ink md:text-5xl xl:text-6xl">
            Precision. Evidence.{" "}
            <span className="font-normal text-accent-dark">Trust.</span>
          </h2>
          <div>
            <p className="text-[17px] leading-relaxed text-ink-2">
              Accurith is a Bengaluru-based assurance and advisory firm for
              organisations answering to India&apos;s regulators — RBI, SEBI,
              IRDAI, CERT-In and the DPDP Act.
            </p>
            <p className="mt-5 text-[17px] leading-relaxed text-ink-2">
              Six connected practices, one defensible evidence trail: every
              finding is documented to the standard a regulator, board or court
              will accept.
            </p>
            <Link
              href="/about"
              className="mt-8 inline-flex min-h-11 items-center text-xs font-semibold uppercase tracking-label text-accent-dark transition-colors duration-200 hover:text-accent"
            >
              About Accurith&ensp;›
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
