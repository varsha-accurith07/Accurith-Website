import type { Metadata } from "next";
import PostShell from "@/components/blog/PostShell";
import { getPost } from "@/components/blog/blogData";

const post = getPost("what-a-first-is-audit-covers")!;

export const metadata: Metadata = {
  title: post.title,
  description: post.excerpt,
};

export default function Page() {
  return (
    <PostShell post={post}>
      <p>
        An information systems audit sounds broader than it is. In practice,
        a first audit walks a defined path: understand the environment,
        identify the systems that matter to the business, and test the
        controls those systems depend on. Here is that path, in the order an
        auditor walks it.
      </p>

      <h2>1. Scoping — which systems actually matter</h2>
      <p>
        The audit starts by mapping business processes to the applications
        and infrastructure behind them. A core banking system, an ERP, a
        billing platform — the systems whose failure or compromise would
        hurt. Everything else is noted but not tested in depth. A good scope
        is short; a scope that lists every server usually means nobody made
        a decision.
      </p>

      <h2>2. IT general controls — the recurring core</h2>
      <p>
        Most of a first audit is spent on ITGC, in three families.{" "}
        <strong>Access:</strong> who can get into each system, how joiners
        and leavers are handled, whether privileged accounts are controlled
        and reviewed. <strong>Change:</strong> how code and configuration
        changes are approved, tested and moved to production, and who can
        push directly. <strong>Operations:</strong> backups and whether
        restores are actually tested, job scheduling and failure handling,
        and incident logging.
      </p>

      <h2>3. Evidence, not assurances</h2>
      <p>
        For each control the auditor asks for proof it operated during the
        period: user access review sign-offs, change tickets with approvals,
        restore-test records. &quot;We always do that&quot; is not evidence;
        a dated record is. This is the step that surprises first-time
        auditees most, and it is where preparation pays off.
      </p>

      <h2>4. Findings and ratings</h2>
      <p>
        Gaps get written up with a severity rating, the risk they create,
        and a recommended fix with an owner and a date. A first audit almost
        always has findings — that is the point of doing it. What matters to
        the board, and to any regulator reading the report, is whether the
        findings close on schedule.
      </p>

      <h2>What to prepare before the auditors arrive</h2>
      <p>
        Four things shorten every first audit: a current inventory of
        systems and their owners, a list of who has admin access to each,
        your change and access-management procedures as actually practised,
        and the last few months of tickets and review records. If any of
        those don&apos;t exist yet, creating them is the real first step —
        the audit just makes it official.
      </p>
    </PostShell>
  );
}
