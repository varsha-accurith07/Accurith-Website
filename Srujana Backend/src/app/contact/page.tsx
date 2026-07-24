import type { Metadata } from "next";
import { Clock, Mail, MapPin } from "lucide-react";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Book a Consultation",
  description:
    "Talk to Accurith about cybersecurity, IS/IT audit, GRC, digital forensics, or audit automation. We respond within one business day.",
};

// V23 — two-column: form left, response promise + contact info right.
export default function ContactPage() {
  return (
    <>
      <section className="bg-hero py-20 text-white md:py-28">
        <Container>
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-label text-accent-light">
            Contact
          </p>
          <h1 className="max-w-3xl text-4xl font-light leading-tight text-white md:text-5xl">
            Book a consultation
          </h1>
          <p className="mt-4 max-w-2xl text-lg font-light leading-relaxed text-white/80">
            Tell us what you&apos;re working toward. No obligation, no hard
            sell — just a scoped, honest read on how we can help.
          </p>
        </Container>
      </section>
      <Section tone="white" hairline={false}>
        <Container>
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <ContactForm />
            </div>

            <aside className="space-y-8">
              <div className="border border-line-light bg-sec1 p-6">
                <Clock
                  aria-hidden="true"
                  size={24}
                  strokeWidth={1.75}
                  className="text-accent-dark"
                />
                <h2 className="mt-3 text-lg font-medium text-ink">
                  We respond within one business day
                </h2>
                <p className="mt-1 text-sm leading-relaxed text-ink-2">
                  A practitioner reads every message — not a sales queue.
                </p>
              </div>

              <div className="space-y-4">
                <p className="flex items-center gap-3 text-ink-2">
                  <Mail
                    aria-hidden="true"
                    size={24}
                    strokeWidth={1.75}
                    className="shrink-0 text-accent-dark"
                  />
                  <a
                    href="mailto:hello@accurith.com"
                    className="inline-flex min-h-11 items-center underline-offset-4 hover:underline"
                  >
                    hello@accurith.com
                  </a>
                </p>
                <p className="flex items-center gap-3 text-ink-2">
                  <MapPin
                    aria-hidden="true"
                    size={24}
                    strokeWidth={1.75}
                    className="shrink-0 text-accent-dark"
                  />
                  Bengaluru, India
                </p>
              </div>

              <p className="text-sm leading-relaxed text-ink-3">
                Form details go to our CRM so we can respond, and nowhere else —
                encrypted in transit. See how we handle data on our{" "}
                <a
                  href="/trust"
                  className="font-medium text-accent-dark underline-offset-4 hover:underline"
                >
                  Trust &amp; Security
                </a>{" "}
                page.
              </p>
            </aside>
          </div>
        </Container>
      </Section>
    </>
  );
}
