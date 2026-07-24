import type { Metadata } from "next";
import ServicePageTemplate from "@/components/ServicePageTemplate";

export const metadata: Metadata = {
  title: "Cyber Security Services",
  description:
    "VAPT across web, API, cloud, and internal network; security audits; cloud security architecture review; and incident response — aligned to ISO 27001, NIST CSF, PCI-DSS, and CIS.",
};

export default function CyberSecurityPage() {
  return (
    <ServicePageTemplate
      serviceName="Cyber Security"
      heroDescription="Find the weaknesses before someone else does. We test, audit, and harden your environment — and stand beside you when something goes wrong."
      problemStatement="Most organisations discover their real attack surface during an incident. Point-in-time scans miss chained weaknesses, cloud estates drift out of their intended configuration, and incident plans go untested until they're needed. Security work only counts when it's verified — exploited in a controlled test, traced to a root cause, and fixed with evidence."
      whatWeDoList={[
        {
          title: "VAPT across web, API, cloud, and internal network",
          description:
            "Manual-led vulnerability assessment and penetration testing with proof-of-concept exploitation, risk-rated findings, and retest verification.",
        },
        {
          title: "Security audits",
          description:
            "Control-by-control review of your security programme against your chosen baseline, with a prioritised remediation roadmap.",
        },
        {
          title: "Cloud security architecture review",
          description:
            "Configuration and design review across AWS, Azure, and GCP — identity, network segmentation, encryption, logging, and workload posture.",
        },
        {
          title: "Incident response",
          description:
            "Readiness assessments, playbook development, tabletop exercises, and hands-on response support when an incident is live.",
        },
      ]}
      methodology={[
        {
          title: "Scope",
          description:
            "Define targets, rules of engagement, and success criteria with your team.",
        },
        {
          title: "Test",
          description:
            "Execute manual-led testing with controlled exploitation and full evidence capture.",
        },
        {
          title: "Report",
          description:
            "Deliver risk-rated findings with reproduction steps and concrete fixes.",
        },
        {
          title: "Verify",
          description:
            "Retest remediated findings and confirm closure with evidence.",
        },
      ]}
      frameworksAlignedTo={["ISO 27001", "NIST CSF", "PCI-DSS", "CIS Controls"]}
      relevantRoles={["CISO", "Security leads", "Heads of Engineering", "CTO"]}
      relevantIndustries={[
        "Banking & fintech",
        "Insurance",
        "Healthcare",
        "SaaS & technology",
      ]}
    />
  );
}
