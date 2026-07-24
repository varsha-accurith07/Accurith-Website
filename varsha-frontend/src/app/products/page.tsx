import type { Metadata } from "next";
import { FileSearch, Activity, FileCheck2 } from "lucide-react";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import Badge from "@/components/ui/Badge";
import SectionHeading from "@/components/SectionHeading";
import EarlyAccessForm from "@/components/EarlyAccessForm";
import RevealGroup from "@/components/RevealGroup";

export const metadata: Metadata = {
  title: "Products — Launching Soon",
  description:
    "Accurith's audit-automation platforms — evidence collection, continuous controls monitoring, and audit workpapers — are in testing ahead of launch.",
};

// V24 — no screenshots, no pricing, no fake product imagery. The platforms
// are genuinely in testing; the page says exactly that.
const products = [
  {
    icon: FileSearch,
    name: "Evidence engine",
    description:
      "Scheduled, scripted collection of audit evidence from your systems — versioned, hashed, and mapped to controls.",
  },
  {
    icon: Activity,
    name: "Controls monitor",
    description:
      "Continuous checks of key controls against defined tolerances, with drift alerts and an auditor-readable trail.",
  },
  {
    icon: FileCheck2,
    name: "Workpaper studio",
    description:
      "Structured workpapers drafted from testing output — every statement traceable back to its evidence.",
  },
];

export default function ProductsPage() {
  return (
    <>
      <section className="bg-hero py-20 text-white md:py-28">
        <Container>
          <Badge mono tone="navy" className="mb-4">
            Launching soon
          </Badge>
          <h1 className="max-w-3xl text-4xl font-light leading-tight text-white md:text-5xl">
            The platforms behind our practice
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/80">
            We&apos;re productising the automation we use in our own
            engagements. The platforms below are in testing with early users
            now — no public screenshots or pricing until they&apos;ve earned
            them.
          </p>
        </Container>
      </section>

      <Section tone="grey">
        <Container>
          <SectionHeading index="01" label="Products" title="What's coming" />
          <RevealGroup className="mt-12 grid gap-6 md:grid-cols-3">
            {products.map((p) => (
              <div
                key={p.name}
                className="corner-ticks flex flex-col border border-line-light bg-white p-6 transition-all duration-200 ease-out hover:border-accent/40 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <p.icon
                    aria-hidden="true"
                    size={24}
                    strokeWidth={1.75}
                    className="text-accent-dark"
                  />
                  <Badge mono>Coming soon</Badge>
                </div>
                <h3 className="mt-4 text-lg font-medium text-ink">{p.name}</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-2">
                  {p.description}
                </p>
              </div>
            ))}
          </RevealGroup>
        </Container>
      </Section>

      <Section tone="white">
        <Container className="max-w-2xl">
          <SectionHeading
            index="02"
            label="Early access"
            title="Be first through the door"
            description="Early-access users shape the roadmap and get launch pricing. We'll only contact you about the product you pick."
          />
          <div className="mt-10">
            <EarlyAccessForm products={products.map((p) => p.name)} />
          </div>
        </Container>
      </Section>
    </>
  );
}
