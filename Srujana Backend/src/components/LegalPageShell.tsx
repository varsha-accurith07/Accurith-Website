import { FileWarning } from "lucide-react";
import Container from "./ui/Container";
import Section from "./ui/Section";

// Legal pages are shells only — drafting real policy language is counsel's
// job (hard rule 8). The draft banner must stay until legal sign-off.
export default function LegalPageShell({
  title,
  paragraphs,
}: {
  title: string;
  paragraphs: string[];
}) {
  return (
    <>
      {/* Page header — full-width dark band */}
      <section className="bg-hero text-white">
        <Container className="max-w-2xl py-20 md:py-28">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-label text-accent-light">
            Legal
          </p>
          <h1 className="font-heading text-4xl font-light leading-[1.1] text-white md:text-5xl">
            {title}
          </h1>
        </Container>
      </section>

      <Section tone="white" hairline={false} className="md:py-24">
        <Container className="max-w-2xl">
          <div
            role="note"
            className="flex items-start gap-3 border border-amber-300 bg-amber-50 p-4"
          >
            <FileWarning
              aria-hidden="true"
              size={24}
              strokeWidth={1.75}
              className="shrink-0 text-amber-600"
            />
            <p className="text-sm leading-relaxed text-amber-900">
              <strong className="font-medium">Draft — pending legal review.</strong>{" "}
              This page is a structural placeholder. Final wording will be
              prepared and approved by counsel before launch.
            </p>
          </div>

          <div className="mt-8 space-y-6 text-lg leading-relaxed text-ink-2">
            {paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
