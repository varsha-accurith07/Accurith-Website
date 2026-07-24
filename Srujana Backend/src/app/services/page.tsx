import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";
import SectionHeading from "@/components/SectionHeading";
import ServiceCard from "@/components/ServiceCard";
import RevealGroup from "@/components/RevealGroup";
import {
  additionalServices,
  featuredServices,
} from "@/components/siteData";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Cybersecurity, IS/IT audit, AI automation, digital forensics, risk & GRC advisory, and managed services — delivered by certified practitioners.",
};

// V20 — Services overview: featured group first, exact order preserved.
export default function ServicesPage() {
  return (
    <>
      <section className="bg-hero py-20 text-white md:py-28">
        <Container>
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-label text-accent-light">
            Services
          </p>
          <h1 className="max-w-3xl text-4xl font-light leading-tight text-white md:text-5xl">
            One firm across audit, security, and automation
          </h1>
          <p className="mt-6 max-w-2xl text-lg font-light leading-relaxed text-white/80">
            Six service lines, one method: scope precisely, test properly, and
            leave you with evidence — not just opinions.
          </p>
        </Container>
      </section>

      <Section tone="grey">
        <Container>
          <SectionHeading index="01" label="Featured" title="Featured services" />
          <RevealGroup className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredServices.map((s) => (
              <ServiceCard key={s.slug} service={s} />
            ))}
          </RevealGroup>
        </Container>
      </Section>

      <Section tone="white">
        <Container>
          <SectionHeading
            index="02"
            label="Additional"
            title="Additional services"
          />
          <RevealGroup className="mt-12 grid gap-6 sm:grid-cols-2 lg:max-w-2xl">
            {additionalServices.map((s) => (
              <ServiceCard key={s.slug} service={s} />
            ))}
          </RevealGroup>
        </Container>
      </Section>

      <Section tone="grey">
        <Container className="max-w-3xl text-center">
          <h2 className="text-2xl font-light leading-tight text-ink md:text-4xl">
            Not sure where to start?
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-ink-2">
            Describe the problem — an upcoming audit, a security concern, a
            board question — and we&apos;ll scope the right entry point.
          </p>
          <div className="mt-8">
            <Button href="/contact" size="lg">
              Book a Consultation
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
