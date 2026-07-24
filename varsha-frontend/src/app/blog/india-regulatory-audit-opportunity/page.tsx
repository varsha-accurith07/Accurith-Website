import type { Metadata } from "next";
import PostShell from "@/components/blog/PostShell";
import { getPost } from "@/components/blog/blogData";

const post = getPost("india-regulatory-audit-opportunity")!;

export const metadata: Metadata = {
  title: post.title,
  description: post.excerpt,
};

export default function Page() {
  return (
    <PostShell post={post}>
      <p>
        India&apos;s audit demand is not discretionary. A large and growing
        share of IS, risk and forensic audit work exists because a regulator
        or a statute says it must — which makes the market unusually
        resilient, and unusually specific about who is allowed to do the
        work. This is our map of where that mandated demand comes from.
      </p>

      <h2>Banking and payments: RBI</h2>
      <p>
        The Reserve Bank of India&apos;s cyber security framework for banks
        expects a board-approved cyber security policy, continuous
        surveillance, and periodic IS audits. Cooperative banks, NBFCs and
        payment system operators carry their own graded versions of these
        expectations, including system audits of payment infrastructure.
        For regulated entities the question is never <strong>whether</strong>{" "}
        to audit — it is how often, at what depth, and by whom.
      </p>

      <h2>Capital markets: SEBI</h2>
      <p>
        SEBI&apos;s Cybersecurity and Cyber Resilience Framework (CSCRF)
        consolidated years of circulars into one graded regime for market
        intermediaries — brokers, depositories, mutual funds, exchanges.
        It ties audit frequency and scope to the entity&apos;s size and
        criticality, and expects audits performed by qualified,
        credentialed auditors.
      </p>

      <h2>Insurance: IRDAI</h2>
      <p>
        IRDAI&apos;s Information and Cyber Security Guidelines require
        insurers and intermediaries to maintain an information and cyber
        security programme with periodic audits and vulnerability
        assessments — another line of recurring, mandated work.
      </p>

      <h2>Everyone with infrastructure: CERT-In</h2>
      <p>
        CERT-In&apos;s directions apply broadly, not just to financial
        entities: incident reporting within six hours of noticing,
        synchronised clocks, and retention of logs. Meeting those
        obligations in practice pushes organisations toward log-management
        reviews, incident-response readiness assessments, and periodic
        security testing.
      </p>

      <h2>Corporate law: the Companies Act and IBC</h2>
      <p>
        The Companies Act, 2013 puts internal financial controls squarely in
        scope for boards and statutory auditors, and auditors increasingly
        lean on IT general controls work to support that opinion. The
        Insolvency and Bankruptcy Code adds a separate stream: forensic
        reviews of stressed and defaulting companies — transaction reviews
        looking for preferential, undervalued or fraudulent transactions —
        commissioned by lenders and resolution professionals.
      </p>

      <h2>Data protection: the DPDP Act</h2>
      <p>
        The Digital Personal Data Protection Act, 2023 introduces obligations
        that will be verified, not merely asserted: Significant Data
        Fiduciaries must appoint an independent data auditor and conduct
        periodic data protection impact assessments. As the rules
        operationalise, this becomes a new recurring audit category in its
        own right.
      </p>

      <h2>What this adds up to</h2>
      <p>
        Overlay these regimes and a pattern emerges: recurring,
        non-discretionary engagements, awarded to firms whose people hold
        recognised credentials, and won or lost on the quality and
        defensibility of the work product. That is why we pair credentialed
        practitioners with tooling that automates the mechanical parts —
        evidence collection, workpaper assembly, control-test documentation
        — so the expert time goes where judgement is actually required.
      </p>
      <p>
        The demand is mandated. The differentiator is doing the work
        rigorously, and proving it.
      </p>
    </PostShell>
  );
}
