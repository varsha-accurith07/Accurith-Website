import type { Metadata } from "next";
import { UserRound } from "lucide-react";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import SectionHeading from "@/components/SectionHeading";
import { credentials } from "@/components/siteData";

export const metadata: Metadata = {
  title: "About & Leadership",
  description:
    "Accurith Technologies is a cybersecurity, IS-audit, and GRC advisory firm in Bengaluru, led by practitioners holding CISA, CISSP, CISM, CEH, and CA credentials.",
};

// V22 — leadership cards are PLACEHOLDERS pending real bios/photos/certs from
// the client. Deliberately generic so nothing reads as a real invented person.
// Credential chips sit ABOVE the bio — credential-first identity (signature
// element 3).
const leadershipPlaceholders = [
  {
    title: "Founder & Managing Partner",
    certs: ["CISA", "CA"],
    bio: "Profile pending — audit and assurance background. Final bio, name, and photo to be supplied by the client.",
  },
  {
    title: "Partner — Cyber Security",
    certs: ["CISSP", "CEH"],
    bio: "Profile pending — offensive security and cloud security background. Final bio, name, and photo to be supplied by the client.",
  },
  {
    title: "Partner — Risk & GRC",
    certs: ["CISM", "CISA"],
    bio: "Profile pending — governance and risk background. Final bio, name, and photo to be supplied by the client.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="bg-hero py-20 text-white md:py-28">
        <Container>
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-label text-accent-light">
            About
          </p>
          <h1 className="max-w-3xl text-4xl font-light leading-tight text-white md:text-5xl">
            A new firm, built on old-fashioned rigour
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/80">
            Accurith Technologies Private Limited is a cybersecurity, IS-audit,
            and GRC advisory firm based in Bengaluru, India. We started
            Accurith because assurance work deserves both discipline and
            better tooling — so we deliver the first and build the second.
          </p>
        </Container>
      </section>

      <Section tone="grey">
        <Container className="max-w-3xl">
          <SectionHeading index="01" label="Mission" title="What we're here to do" />
          <p className="mt-6 text-lg leading-relaxed text-ink-2">
            Help organisations prove their controls work — to auditors,
            regulators, customers, and themselves — and automate the parts of
            that proof that never needed a human in the first place. We
            measure ourselves the way our clients are measured: on evidence.
          </p>
        </Container>
      </Section>

      {/* Signature element 3 — credentials where a competitor's logo wall goes */}
      <Section tone="white" className="py-10 md:py-12">
        <Container className="text-center">
          <p className="text-[11px] font-semibold uppercase tracking-label text-ink-3">
            Credentials held across our leadership team
          </p>
          <ul className="mt-4 flex flex-wrap items-center justify-center gap-3">
            {credentials.map((c) => (
              <li key={c}>
                <Badge mono className="px-4 py-1.5 text-sm">
                  {c}
                </Badge>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section tone="grey">
        <Container>
          <SectionHeading
            index="02"
            label="Leadership"
            title="Led by certified practitioners"
            description="Certifications first — because in this profession, they're the credential wall that matters."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {leadershipPlaceholders.map((person) => (
              <div
                key={person.title}
                className="corner-ticks border border-line-light bg-white p-6"
              >
                <div
                  aria-hidden="true"
                  className="flex h-16 w-16 items-center justify-center bg-sec1 text-ink-3"
                >
                  <UserRound size={24} strokeWidth={1.75} />
                </div>
                {/* Credential chips ABOVE the bio, by design */}
                <ul className="mt-4 flex flex-wrap gap-2">
                  {person.certs.map((c) => (
                    <li key={c}>
                      <Badge mono>{c}</Badge>
                    </li>
                  ))}
                </ul>
                <h3 className="mt-3 text-lg font-medium text-ink">
                  {person.title}
                </h3>
                <p className="text-[11px] font-semibold uppercase tracking-label text-ink-3">
                  Placeholder profile
                </p>
                <p className="mt-2 text-sm leading-relaxed text-ink-2">
                  {person.bio}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="white">
        <Container className="max-w-3xl text-center">
          <h2 className="text-2xl font-light leading-tight text-ink md:text-4xl">
            Work with us — or for us
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-ink-2">
            We&apos;re building a firm and a team at the same time.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button href="/contact">Book a Consultation</Button>
            <Button href="/about/careers" variant="outline">
              See careers
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
