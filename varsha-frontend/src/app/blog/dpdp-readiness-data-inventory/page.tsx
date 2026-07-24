import type { Metadata } from "next";
import PostShell from "@/components/blog/PostShell";
import { getPost } from "@/components/blog/blogData";

const post = getPost("dpdp-readiness-data-inventory")!;

export const metadata: Metadata = {
  title: post.title,
  description: post.excerpt,
};

export default function Page() {
  return (
    <PostShell post={post}>
      <p>
        Most DPDP conversations jump straight to consent banners and privacy
        notices. Those are visible, so they feel like progress. But every
        substantive obligation in the Digital Personal Data Protection Act —
        purpose limitation, erasure, breach notification, responding to a
        data principal&apos;s request — assumes you can answer one question
        first: <strong>what personal data do we hold, where, and why?</strong>
      </p>

      <h2>Why the inventory comes first</h2>
      <p>
        You cannot honour an erasure request against data you don&apos;t
        know you have. You cannot notify anyone of a breach in a system you
        never mapped. And you cannot write an honest privacy notice if the
        purposes listed in it were drafted from memory rather than from what
        systems actually collect. The inventory is not paperwork — it is the
        index every other DPDP control looks things up in.
      </p>

      <h2>What a usable inventory records</h2>
      <p>
        For each system that touches personal data: the categories of data
        it holds, the purpose it was collected for, where it is stored and
        backed up, who inside the organisation can access it, which vendors
        or processors receive it, and how long it is kept. One row per
        system-and-purpose is enough. The discipline is in the follow-up
        questions — &quot;why do we still have this?&quot; is asked for the
        first time at almost every organisation we&apos;ve seen do this
        exercise.
      </p>

      <h2>How to build it without boiling the ocean</h2>
      <p>
        Start with the systems closest to customers — CRM, support desk,
        billing, marketing lists — because that is where data-principal
        requests will land first. Interview system owners rather than
        sending a spreadsheet into the void; a 30-minute conversation
        surfaces the shadow exports and shared drives a form never will.
        Then keep the inventory alive by adding one question to your
        change process: does this change collect or move personal data?
      </p>

      <h2>What it sets up next</h2>
      <p>
        With the inventory in place, the rest of the programme has
        somewhere to stand: retention rules become deletion jobs against
        named systems, consent purposes map to real collection points, and
        if the rules classify you as a Significant Data Fiduciary, the
        independent data audit starts from your map instead of a blank
        page. Start with the inventory. Everything else in DPDP is easier
        because of it.
      </p>
    </PostShell>
  );
}
