import type { Metadata } from "next";
import LegalPageShell from "@/components/LegalPageShell";

export const metadata: Metadata = {
  title: "Data Processing Agreement (Draft)",
  robots: { index: false },
};

export default function DpaPage() {
  return (
    <LegalPageShell
      title="Data Processing Agreement"
      paragraphs={[
        "This agreement will set out how Accurith processes personal data on behalf of clients during engagements — categories of data, security measures, and sub-processor commitments.",
        "It will align with the DPDP Act and GDPR requirements for processors, including breach notification and data-return obligations.",
        "Clients will be able to execute this DPA as part of their engagement paperwork.",
      ]}
    />
  );
}
