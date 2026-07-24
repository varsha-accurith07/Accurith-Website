import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/SectionHeading";
import { frameworks } from "@/components/siteData";

export const metadata: Metadata = {
  title: "Kitchen Sink (dev)",
  robots: { index: false },
};

// V04 — throwaway page showing every primitive, variant, and state.
// Not linked from anywhere; delete before launch.
export default function KitchenSinkPage() {
  return (
    <>
      <section className="bg-hero py-20 text-white md:py-28">
        <Container>
          <SectionHeading
            index="00"
            label="Kitchen Sink"
            title="Every primitive, every state"
            description="Dev-only reference page. The dot-grid behind this section is signature element 1 at its intended, whisper-quiet opacity."
            onNavy
          />
        </Container>
      </section>

      <Section tone="grey">
        <Container className="space-y-10">
          <div>
            <h3 className="mb-4 text-xl">Button — variants × sizes</h3>
            <div className="flex flex-wrap items-center gap-4">
              <Button size="sm">Primary sm</Button>
              <Button>Primary md</Button>
              <Button size="lg">Primary lg</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button disabled>Disabled</Button>
              <Button href="/contact" variant="outline">
                As link
              </Button>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-xl">Badge — framework chips (text only)</h3>
            <div className="flex flex-wrap gap-2">
              {frameworks.map((f) => (
                <Badge key={f} mono>
                  {f}
                </Badge>
              ))}
              <Badge>Default tone</Badge>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-xl">Featured card — corner ticks + precision hover</h3>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <a
                href="#"
                className="corner-ticks group block border border-line-light bg-white p-6 transition-all duration-200 ease-out hover:border-accent/40 hover:shadow-md"
              >
                <ShieldCheck
                  aria-hidden="true"
                  size={24}
                  strokeWidth={1.75}
                  className="text-accent-dark"
                />
                <p className="mt-4 font-heading text-lg font-medium text-ink">
                  Card title
                </p>
                <p className="mt-1 text-sm leading-relaxed text-ink-2">
                  Hover me — border tint + shadow lift, 200ms ease-out. Note the
                  8px corner ticks.
                </p>
              </a>
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="navy" dotGrid>
        <Container>
          <SectionHeading
            index="01"
            label="Navy band"
            title="Section tone: navy"
            description="Reserved for the AI-automation band and the footer. Badges invert."
            onNavy
          />
          <div className="mt-6 flex flex-wrap gap-2">
            <Badge tone="navy" mono>
              ISO 27001
            </Badge>
            <Badge tone="navy" mono>
              SOC 2
            </Badge>
          </div>
          <div className="mt-8">
            <Button href="/services/ai-automation">One teal CTA</Button>
          </div>
        </Container>
      </Section>

      <Section tone="white">
        <Container>
          <SectionHeading
            index="02"
            label="Type scale"
            title="Headings use Sora, body uses Inter"
          />
          <div className="mt-8 space-y-4">
            <p className="text-6xl font-light leading-tight text-ink">6xl display</p>
            <p className="text-5xl font-light leading-tight text-ink">5xl display</p>
            <p className="text-4xl font-light leading-tight text-ink">4xl heading</p>
            <p className="text-2xl font-light text-ink">2xl heading</p>
            <p className="text-xl text-ink">xl heading</p>
            <p className="text-lg leading-relaxed">lg body — leading-relaxed</p>
            <p className="text-base leading-relaxed">base body — minimum grey-700 on white</p>
            <p className="text-sm text-ink-3">sm mono — index labels</p>
          </div>
        </Container>
      </Section>
    </>
  );
}
