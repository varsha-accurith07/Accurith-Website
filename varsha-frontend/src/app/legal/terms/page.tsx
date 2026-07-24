import type { Metadata } from "next";
import LegalPageShell from "@/components/LegalPageShell";

export const metadata: Metadata = {
  title: "Terms of Service (Draft)",
  robots: { index: false },
};

export default function TermsPage() {
  return (
    <LegalPageShell
      title="Terms of Service"
      paragraphs={[
        "These terms will govern use of the accurith.com website and set out the basis on which our advisory services are engaged.",
        "They will cover acceptable use of the site, intellectual property in our published material, and limitations of liability.",
        "Engagement-specific terms are always agreed in a signed statement of work, which prevails over this page.",
      ]}
    />
  );
}
