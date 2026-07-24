import type { Metadata } from "next";
import LegalPageShell from "@/components/LegalPageShell";

export const metadata: Metadata = {
  title: "Privacy Policy (Draft)",
  robots: { index: false },
};

export default function PrivacyPage() {
  return (
    <LegalPageShell
      title="Privacy Policy"
      paragraphs={[
        "This policy will describe what personal data Accurith collects through this website, why it is collected, and how long it is retained.",
        "It will cover the contact and early-access forms, our privacy-first analytics, and your rights under India's DPDP Act and, where applicable, the GDPR.",
        "It will also explain how to contact us with a privacy question or request.",
      ]}
    />
  );
}
