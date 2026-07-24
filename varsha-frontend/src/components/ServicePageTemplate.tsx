import { Check } from "lucide-react";
import Container from "./ui/Container";
import Section from "./ui/Section";
import Button from "./ui/Button";
import Badge from "./ui/Badge";
import SectionHeading from "./SectionHeading";
import RevealGroup from "./RevealGroup";

export type ServicePageProps = {
  serviceName: string;
  heroDescription: string;
  problemStatement: string;
  /** Concrete deliverables — real terminology, not marketing language. */
  whatWeDoList: { title: string; description: string }[];
  /** Handles 3, 4, or 5 steps equally gracefully (flex row on desktop). */
  methodology: { title: string; description: string }[];
  frameworksAlignedTo: string[];
  relevantRoles: string[];
  relevantIndustries: string[];
};

// V15 — every service page renders through this template; section order is
// fixed: Hero → Problem → What Accurith Does → Approach → Frameworks →
// Who It's For → CTA.
export default function ServicePageTemplate({
  serviceName,
  heroDescription,
  problemStatement,
  whatWeDoList,
  methodology,
  frameworksAlignedTo,
  relevantRoles,
  relevantIndustries,
}: ServicePageProps) {
  return (
    <>
      {/* Hero — Direction C full-width dark band */}
      <section className="bg-hero py-20 text-white md:py-28">
        <Container>
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-label text-accent-light">
            Services / {serviceName}
          </p>
          <h1 className="max-w-3xl text-4xl font-light leading-tight text-white md:text-5xl">
            {serviceName}
          </h1>
          <p className="mt-6 max-w-2xl text-lg font-light leading-relaxed text-white/80">
            {heroDescription}
          </p>
          <div className="mt-10">
            <Button href="/contact" size="lg">
              Book a Consultation
            </Button>
          </div>
        </Container>
      </section>

      {/* Problem */}
      <Section tone="grey">
        <Container className="max-w-3xl">
          <SectionHeading index="01" label="The problem" title="Why this matters" />
          <p className="mt-6 text-lg leading-relaxed text-ink-2">
            {problemStatement}
          </p>
        </Container>
      </Section>

      {/* What Accurith does */}
      <Section tone="white">
        <Container>
          <SectionHeading
            index="02"
            label="What we do"
            title={`What Accurith does in ${serviceName.toLowerCase()}`}
          />
          <RevealGroup as="ul" className="mt-12 grid gap-6 sm:grid-cols-2">
            {whatWeDoList.map((item) => (
              <li
                key={item.title}
                className="flex gap-4 border border-line-light bg-white p-6 transition-all duration-200 ease-out hover:border-accent/40 hover:shadow-md"
              >
                <span
                  aria-hidden="true"
                  className="flex h-8 w-8 shrink-0 items-center justify-center bg-sec1 text-accent-dark"
                >
                  <Check size={16} strokeWidth={1.75} />
                </span>
                <span>
                  <h3 className="text-lg font-medium text-ink">{item.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink-2">
                    {item.description}
                  </p>
                </span>
              </li>
            ))}
          </RevealGroup>
        </Container>
      </Section>

      {/* Approach — flex row so 3 or 5 steps lay out equally well */}
      <Section tone="grey">
        <Container>
          <SectionHeading index="03" label="Approach" title="How we deliver it" />
          <ol className="relative mt-12 flex flex-col gap-8 md:flex-row md:gap-6">
            <div
              aria-hidden="true"
              className="absolute left-0 right-0 top-4 hidden h-px bg-line-light md:block"
            />
            {methodology.map((step, i) => (
              <li key={step.title} className="relative md:flex-1">
                <p className="inline-flex border border-accent/40 bg-white px-2 py-1 text-xs text-accent-dark">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-4 text-xl text-ink">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-2">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      {/* Frameworks — text chips only, honest framing */}
      <Section tone="white">
        <Container>
          <SectionHeading
            index="04"
            label="Frameworks"
            title="Frameworks we align this work to"
            description="We align our delivery to these frameworks and help clients achieve certification — we don't claim certifications we don't hold."
          />
          <ul className="mt-8 flex flex-wrap gap-2">
            {frameworksAlignedTo.map((f) => (
              <li key={f}>
                <Badge mono>{f}</Badge>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* Who it's for */}
      <Section tone="grey">
        <Container>
          <SectionHeading index="05" label="Who it's for" title="Built for your seat" />
          <div className="mt-10 grid gap-10 md:grid-cols-2">
            <div>
              <h3 className="text-[11px] font-semibold uppercase tracking-label text-ink-3">
                Roles
              </h3>
              <ul className="mt-4 space-y-3">
                {relevantRoles.map((r) => (
                  <li key={r} className="flex items-center gap-3 text-ink-2">
                    <span
                      aria-hidden="true"
                      className="h-1.5 w-1.5 rounded-full bg-accent"
                    />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-[11px] font-semibold uppercase tracking-label text-ink-3">
                Industries
              </h3>
              <ul className="mt-4 space-y-3">
                {relevantIndustries.map((ind) => (
                  <li key={ind} className="flex items-center gap-3 text-ink-2">
                    <span
                      aria-hidden="true"
                      className="h-1.5 w-1.5 rounded-full bg-accent"
                    />
                    {ind}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </Section>

      {/* CTA */}
      <Section tone="white">
        <Container className="max-w-3xl text-center">
          <h2 className="text-2xl font-light leading-tight text-ink md:text-4xl">
            Talk to us about {serviceName.toLowerCase()}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-ink-2">
            Scoped clearly, delivered by certified practitioners. We respond
            within one business day.
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
