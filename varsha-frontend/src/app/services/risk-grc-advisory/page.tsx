import type { Metadata } from "next";
import ServicePageTemplate from "@/components/ServicePageTemplate";

export const metadata: Metadata = {
  title: "Risk & GRC Advisory",
  description:
    "Risk assessments, governance frameworks, and compliance programmes that fit how your organisation actually runs.",
};

// V19 — lighter content than the featured services, but complete.
export default function RiskGrcAdvisoryPage() {
  return (
    <ServicePageTemplate
      serviceName="Risk & GRC Advisory"
      heroDescription="Governance, risk, and compliance that fits your organisation — not a binder on a shelf. We build programmes your teams actually run."
      problemStatement="Most GRC programmes fail the same way: a framework is adopted wholesale, documentation balloons, and within a year the register no longer reflects reality. Risk management earns its keep only when it changes decisions — what gets funded, what gets fixed first, what the board hears."
      whatWeDoList={[
        {
          title: "Enterprise & IT risk assessments",
          description:
            "Structured identification and rating of risks, tied to business impact and reported in language the board can act on.",
        },
        {
          title: "Governance framework design",
          description:
            "Policies, committees, and accountabilities right-sized to your organisation — aligned to ISO 31000 and COBIT.",
        },
        {
          title: "Compliance programme build-out",
          description:
            "Map obligations (DPDP, GDPR, RBI/IRDAI/SEBI expectations) to controls and owners, with a living compliance calendar.",
        },
        {
          title: "Third-party risk management",
          description:
            "Vendor tiering, assessment workflows, and contractual control requirements that scale past a spreadsheet.",
        },
      ]}
      methodology={[
        {
          title: "Baseline",
          description:
            "Understand your obligations, current practices, and risk appetite.",
        },
        {
          title: "Design",
          description:
            "Build the framework, registers, and reporting that fit your scale.",
        },
        {
          title: "Embed",
          description:
            "Train owners and wire GRC into existing management routines.",
        },
      ]}
      frameworksAlignedTo={["ISO 31000", "COBIT", "ISO 27001", "DPDP", "GDPR"]}
      relevantRoles={["CRO", "CISO", "Compliance heads", "Company secretaries"]}
      relevantIndustries={["Banking & fintech", "Insurance", "Healthcare"]}
    />
  );
}
