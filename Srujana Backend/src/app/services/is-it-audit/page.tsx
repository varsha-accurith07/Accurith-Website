import type { Metadata } from "next";
import ServicePageTemplate from "@/components/ServicePageTemplate";

export const metadata: Metadata = {
  title: "IS / IT Audit Services",
  description:
    "Information systems audits, ITGC reviews, SOC 2 readiness, and control testing — aligned to COBIT, ISACA standards, SOX/ICFR, and SOC 2 Type I/II.",
};

export default function IsItAuditPage() {
  return (
    <ServicePageTemplate
      serviceName="IS / IT Audit"
      heroDescription="Independent, standards-based assurance over your information systems — planned, tested, and documented the way your auditors and regulators expect."
      problemStatement="IT now underpins every material business process, so IT general controls sit inside every financial and regulatory audit. Yet control testing is still mostly manual: evidence arrives late, samples get contested, and findings surface at year-end when they're most expensive to fix. Audit teams need coverage that scales without headcount."
      whatWeDoList={[
        {
          title: "Information systems audit",
          description:
            "Risk-based IS audits planned and executed to ISACA standards, from scoping through reporting and follow-up.",
        },
        {
          title: "ITGC reviews",
          description:
            "Design and operating-effectiveness testing across access management, change management, and IT operations.",
        },
        {
          title: "SOC 2 readiness",
          description:
            "Gap assessment against the Trusted Services Criteria, remediation support, and preparation for a Type I or Type II examination.",
        },
        {
          title: "Control testing",
          description:
            "Independent testing of automated and manual controls, including ICFR/SOX-style tie-outs, with defensible workpapers.",
        },
        {
          title: "Audit automation",
          description:
            "Scripted, repeatable evidence collection and full-population testing where sampling used to be the only option.",
        },
      ]}
      methodology={[
        {
          title: "Plan",
          description:
            "Risk-assess the environment and agree scope, criteria, and timing.",
        },
        {
          title: "Walk through",
          description:
            "Confirm how each control actually operates with process owners.",
        },
        {
          title: "Test",
          description:
            "Execute design and operating-effectiveness testing with documented evidence.",
        },
        {
          title: "Report",
          description:
            "Rate findings, agree management actions, and present to stakeholders.",
        },
        {
          title: "Follow up",
          description:
            "Track remediation to closure and retest where it matters.",
        },
      ]}
      frameworksAlignedTo={[
        "COBIT",
        "ISACA standards",
        "SOX / ICFR",
        "SOC 2 Type I/II",
      ]}
      relevantRoles={[
        "Head of Internal Audit",
        "Chief Audit Executive",
        "IT Auditors",
        "CFO / Controllers",
      ]}
      relevantIndustries={[
        "Banking & fintech",
        "Insurance",
        "Listed companies",
        "SaaS & technology",
      ]}
    />
  );
}
