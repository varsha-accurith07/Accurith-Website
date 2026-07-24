import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import Badge from "@/components/ui/Badge";
import SectionHeading from "@/components/SectionHeading";
import { frameworks } from "@/components/siteData";

export const metadata: Metadata = {
  title: "Trust & Security",
  description:
    "How Accurith approaches trust: the frameworks we align to, how this website itself is built, and how to report a vulnerability.",
};

// V21 — the most important page in the strategy. Deliberately ZERO motion:
// no dot-grid, no reveal animation, no hover theatrics. Every claim uses
// honest framing ("align to", "help clients achieve") — never "certified"
// or "we hold" (Accurith holds no company certifications yet).
// These describe the production site's target posture; enforcement of the
// actual headers is Srujana's track (S04).

const siteSecurityPractices = [
  {
    name: "HSTS",
    explanation:
      "Browsers are told to only ever reach this site over an encrypted connection — never plain HTTP.",
  },
  {
    name: "Content-Security-Policy",
    explanation:
      "The browser is given an allowlist of what this site may load, which blunts script-injection attacks.",
  },
  {
    name: "X-Frame-Options: DENY",
    explanation:
      "This site cannot be embedded inside another site's frame, which prevents clickjacking.",
  },
  {
    name: "Privacy-first analytics",
    explanation:
      "We measure traffic without advertising trackers, cross-site cookies, or selling your attention.",
  },
  {
    name: "Minimal third-party code",
    explanation:
      "Every external script is an exposure. This site ships almost none, on purpose.",
  },
  {
    name: "security.txt",
    explanation:
      "A machine-readable file (RFC 9116) telling security researchers exactly how to contact us.",
  },
];

const methodologySteps = [
  {
    title: "Assess",
    description: "Understand the environment and obligations first.",
  },
  {
    title: "Design",
    description: "Define controls proportionate to the actual risk.",
  },
  {
    title: "Implement",
    description: "Execute with evidence captured as we go.",
  },
  {
    title: "Monitor",
    description: "Verify controls keep operating after the engagement ends.",
  },
];

export default function TrustPage() {
  return (
    <>
      <section className="bg-hero py-20 text-white md:py-28">
        <Container>
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-label text-accent-light">
            Trust &amp; Security
          </p>
          <h1 className="max-w-3xl text-4xl font-light leading-tight text-white md:text-5xl">
            Our commitment to trust
          </h1>
          <p className="mt-6 max-w-2xl text-lg font-light leading-relaxed text-white/80">
            We advise organisations on security and audit, so we accept a
            simple standard: everything we claim should be verifiable, and
            anything we ask clients to do, we do ourselves. This page states
            plainly what we align to, what we practise, and how to challenge
            us.
          </p>
        </Container>
      </section>

      <Section tone="grey">
        <Container>
          <SectionHeading
            index="01"
            label="Frameworks"
            title="Frameworks we align to"
          />
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-ink-2">
            We align our delivery to these frameworks and help clients achieve
            certification.{" "}
            <strong className="font-medium text-ink">
              We do not claim certifications we do not hold.
            </strong>
          </p>
          <ul className="mt-8 flex flex-wrap gap-2">
            {frameworks.map((f) => (
              <li key={f}>
                <Badge mono>{f}</Badge>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section tone="white">
        <Container>
          <SectionHeading
            index="02"
            label="Method"
            title="The same method, every engagement"
            description="Trust is mostly consistency. Every service line runs the same evidence-first sequence."
          />
          <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {methodologySteps.map((step, i) => (
              <li key={step.title}>
                <p className="inline-flex border border-accent/40 bg-white px-2 py-1 text-[11px] font-semibold tracking-label text-accent-dark">
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

      <Section tone="grey">
        <Container>
          <SectionHeading
            index="03"
            label="Practice"
            title="This website practices what we preach"
            description="The expanded version of the band you see at the bottom of every page. Each item, in plain English:"
          />
          <dl className="mt-10 grid gap-6 md:grid-cols-2">
            {siteSecurityPractices.map((p) => (
              <div
                key={p.name}
                className="border border-line-light bg-white p-6"
              >
                <dt className="text-sm font-medium text-ink">{p.name}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-ink-2">
                  {p.explanation}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 text-sm text-ink-3">
            You don&apos;t have to take our word for it — scan accurith.com
            with securityheaders.com or Mozilla Observatory at any time.
          </p>
        </Container>
      </Section>

      <Section tone="white">
        <Container className="max-w-3xl">
          <SectionHeading
            index="04"
            label="Disclosure"
            title="Report a vulnerability"
          />
          <p className="mt-6 text-lg leading-relaxed text-ink-2">
            If you believe you&apos;ve found a security issue in this website
            or anything else we operate, we want to hear about it — and
            we&apos;ll treat you as a colleague, not a threat.
          </p>
          <p className="mt-4">
            <Link
              href="/trust/report-vulnerability"
              className="inline-flex min-h-11 items-center font-medium text-accent-dark underline-offset-4 hover:underline"
            >
              How to report a vulnerability →
            </Link>
          </p>
        </Container>
      </Section>

      <Section tone="grey">
        <Container className="max-w-3xl">
          <SectionHeading index="05" label="Data" title="How we handle your data" />
          <p className="mt-6 text-lg leading-relaxed text-ink-2">
            When you submit a form on this site, the details you provide go to
            our CRM so we can respond, and nowhere else. Data is encrypted in
            transit. We don&apos;t sell contact data, and we don&apos;t add
            you to marketing lists you didn&apos;t ask for. The full detail
            lives in our{" "}
            <Link
              href="/legal/privacy"
              className="font-medium text-accent-dark underline-offset-4 hover:underline"
            >
              privacy policy
            </Link>
            .
          </p>
        </Container>
      </Section>
    </>
  );
}
