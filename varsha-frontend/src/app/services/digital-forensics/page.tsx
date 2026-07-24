import type { Metadata } from "next";
import ServicePageTemplate from "@/components/ServicePageTemplate";

export const metadata: Metadata = {
  title: "Digital Forensics",
  description:
    "Computer, mobile, and cloud forensics with defensible chain of custody and expert-testimony support.",
};

// V18 — tone: meticulous and serious; this work ends up in front of courts
// and regulators.
export default function DigitalForensicsPage() {
  return (
    <ServicePageTemplate
      serviceName="Digital Forensics"
      heroDescription="When something has gone wrong — fraud, data theft, a disputed termination, a breach — the facts live on devices and in logs. We recover them, preserve them, and present them so they hold up."
      problemStatement="Digital evidence is fragile. A well-meaning IT team that opens files, images a drive incorrectly, or misses a legal-hold obligation can render evidence inadmissible before an investigation properly starts. Forensic work is only as good as its weakest procedural step: acquisition, preservation, analysis, and reporting all have to withstand hostile scrutiny."
      whatWeDoList={[
        {
          title: "Computer forensics",
          description:
            "Forensically sound acquisition and analysis of workstations, servers, and storage media — deleted data, timelines, and user activity reconstruction.",
        },
        {
          title: "Mobile device forensics",
          description:
            "Extraction and analysis of iOS and Android devices, including messaging artefacts, location data, and application usage.",
        },
        {
          title: "Cloud forensics",
          description:
            "Preservation and analysis of evidence held in SaaS platforms, email systems, and cloud infrastructure audit logs.",
        },
        {
          title: "Chain of custody",
          description:
            "Documented, verifiable custody from first acquisition through final disposition — hashes, transfer logs, and secure storage.",
        },
        {
          title: "Expert-testimony support",
          description:
            "Clear, defensible reporting and expert support for legal proceedings, arbitration, and regulatory enquiries.",
        },
      ]}
      methodology={[
        {
          title: "Preserve",
          description:
            "Secure and forensically image the evidence before anything else touches it.",
        },
        {
          title: "Analyse",
          description:
            "Examine artefacts with validated tools and documented, repeatable procedures.",
        },
        {
          title: "Report",
          description:
            "Set out findings, methodology, and limitations in plain, defensible language.",
        },
        {
          title: "Testify",
          description:
            "Stand behind the work in front of counsel, courts, or regulators.",
        },
      ]}
      frameworksAlignedTo={[
        "ISO 27037",
        "NIST SP 800-86",
        "ACPO principles",
        "IT Act (India)",
      ]}
      relevantRoles={[
        "General Counsel",
        "CISO",
        "Fraud & investigations teams",
        "External counsel",
      ]}
      relevantIndustries={[
        "Banking & fintech",
        "Insurance",
        "Corporates & listed companies",
        "Law firms",
      ]}
    />
  );
}
