import type { Metadata } from "next";
import ServicePageTemplate from "@/components/ServicePageTemplate";

export const metadata: Metadata = {
  title: "AI Automation for Audit & Risk",
  description:
    "Workpaper generation, anomaly detection, and continuous controls monitoring — AI automation applied to audit and risk work, with humans in the loop.",
};

// V18 — tone: forward-thinking, but grounded in audit reality.
export default function AiAutomationPage() {
  return (
    <ServicePageTemplate
      serviceName="AI Automation"
      heroDescription="The repetitive core of audit and risk work — evidence, tie-outs, sampling, drafting — is exactly what software does best. We automate it, with your reviewers firmly in the loop."
      problemStatement="Audit and risk teams spend most of an engagement collecting evidence, reconciling populations, and formatting workpapers — not exercising judgement. Sampling exists because full-population testing was impractical; it isn't anymore. Teams that automate the mechanical layer test everything, continuously, and reserve people for the calls only people can make."
      whatWeDoList={[
        {
          title: "Workpaper generation",
          description:
            "Structured, reviewable workpapers drafted from your evidence and testing results — with every generated statement traceable to its source.",
        },
        {
          title: "Continuous controls monitoring",
          description:
            "Controls checked on a schedule against defined tolerances, with drift flagged when it happens rather than at the annual review.",
        },
        {
          title: "Anomaly detection",
          description:
            "Full-population screening of transactions and access logs to surface outliers for human review — no black-box conclusions.",
        },
        {
          title: "Automation advisory",
          description:
            "Identify which of your audit and risk processes are worth automating, in what order, and with what guardrails.",
        },
      ]}
      methodology={[
        {
          title: "Map",
          description:
            "Break the process into judgement steps and mechanical steps.",
        },
        {
          title: "Automate",
          description:
            "Build the mechanical layer: extraction, matching, monitoring, drafting.",
        },
        {
          title: "Validate",
          description:
            "Run automated output alongside the manual process until it proves itself.",
        },
        {
          title: "Operate",
          description:
            "Hand over a monitored, documented pipeline your team controls.",
        },
      ]}
      frameworksAlignedTo={["COBIT", "ISO 27001", "NIST AI RMF", "SOC 2"]}
      relevantRoles={[
        "Head of Internal Audit",
        "CISO",
        "CRO",
        "Finance transformation leads",
      ]}
      relevantIndustries={[
        "Banking & fintech",
        "Insurance",
        "SaaS & technology",
        "Shared-services centres",
      ]}
    />
  );
}
