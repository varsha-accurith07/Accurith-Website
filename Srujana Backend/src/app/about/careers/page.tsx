import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/SectionHeading";
import CareersOpenings from "@/components/CareersOpenings";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Open roles at Accurith — a cybersecurity, IS-audit, and GRC advisory firm in Bengaluru. Security testing, IS audit, GRC, and audit automation.",
};

// V25 (P2) + J01 — culture statement, then live openings from
// GET /api/careers/openings with an inline application form per role.
export default function CareersPage() {
  return (
    <>
      <section className="bg-hero py-20 text-white md:py-28">
        <Container className="max-w-3xl">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-label text-accent-light">
            About / Careers
          </p>
          <h1 className="text-4xl font-light leading-tight text-white md:text-5xl">
            We&apos;re growing
          </h1>
        </Container>
      </section>

      <Section tone="white" hairline={false}>
        <Container className="max-w-3xl">
          <div className="space-y-6 text-lg leading-relaxed text-ink-2">
            <p>
              Accurith is a young firm doing careful work: security testing
              that gets verified, audits that hold up, automation with a human
              in the loop. If you like evidence more than theatre, you&apos;ll
              fit in.
            </p>
          </div>
        </Container>
      </Section>

      <Section tone="grey">
        <Container className="max-w-3xl">
          <SectionHeading
            index="01"
            label="Open roles"
            title="Current openings"
          />
          <div className="mt-10">
            <CareersOpenings />
          </div>
          <p className="mt-8 text-sm leading-relaxed text-ink-3">
            We don&apos;t accept file uploads at this stage — applications go
            by link (LinkedIn, portfolio, Drive). It&apos;s a deliberate
            security decision, not an oversight.
          </p>
        </Container>
      </Section>
    </>
  );
}
