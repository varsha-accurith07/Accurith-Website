import type { Metadata } from "next";
import ServicePageTemplate from "@/components/ServicePageTemplate";

export const metadata: Metadata = {
  title: "Managed Services",
  description:
    "Ongoing security and compliance operations delivered as a service — continuous monitoring, periodic testing, and audit-ready evidence.",
};

// V19 — lighter content than the featured services, but complete.
export default function ManagedServicesPage() {
  return (
    <ServicePageTemplate
      serviceName="Managed Services"
      heroDescription="Security and compliance don't stop between engagements. We run the recurring work — monitoring, testing, evidence — so audit-readiness is a state, not a scramble."
      problemStatement="Point-in-time engagements leave gaps: controls drift between reviews, evidence goes stale, and every audit season starts with a rebuild. Mid-sized organisations rarely justify a full in-house team for work that is periodic by nature — but the work still has to happen, reliably."
      whatWeDoList={[
        {
          title: "Continuous compliance operations",
          description:
            "Scheduled control checks, evidence refresh, and register upkeep so you stay audit-ready year-round.",
        },
        {
          title: "Recurring security testing",
          description:
            "Quarterly vulnerability assessments and annual penetration tests, with tracked remediation between cycles.",
        },
        {
          title: "Virtual CISO support",
          description:
            "Named senior practitioners who own your security calendar, vendor reviews, and board reporting cadence.",
        },
      ]}
      methodology={[
        {
          title: "Onboard",
          description:
            "Baseline your environment and agree the service calendar and SLAs.",
        },
        {
          title: "Operate",
          description:
            "Run the recurring monitoring, testing, and evidence cycles.",
        },
        {
          title: "Report",
          description:
            "Monthly posture reporting with clear actions and owners.",
        },
      ]}
      frameworksAlignedTo={["ISO 27001", "SOC 2", "NIST CSF", "PCI-DSS"]}
      relevantRoles={["CISO", "CTO", "Compliance heads", "Founders / COOs"]}
      relevantIndustries={["SaaS & technology", "Banking & fintech", "Healthcare"]}
    />
  );
}
