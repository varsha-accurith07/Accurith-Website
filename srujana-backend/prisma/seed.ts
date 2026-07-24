// Seed script — populates a few JobOpenings so Varsha's /careers page has
// something to render. Idempotent: uses `upsert` on the unique slug so
// running it twice does not duplicate.
//
// Run with:  npm run db:seed
// Runs automatically after `prisma migrate reset` too.

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const openings = [
    {
      slug: 'senior-security-consultant',
      title: 'Senior Security Consultant',
      department: 'Cyber Security',
      location: 'Bengaluru (hybrid)',
      employmentType: 'Full-time',
      descriptionMd:
        '## About the role\n\nLead penetration testing and red-team engagements for enterprise clients across BFSI and healthcare.\n\n## What you will do\n\n- Own end-to-end VAPT engagements (scoping, execution, reporting, retest)\n- Coach a small team of junior consultants\n- Present findings to CISO-level stakeholders\n\n## What we expect\n\n- 5+ years hands-on offensive security\n- OSCP, CRTP, or equivalent\n- Comfortable with Burp Suite, Metasploit, and modern EDR-evasion techniques\n- Strong written English — the report is the deliverable',
      isOpen: true,
    },
    {
      slug: 'is-audit-manager',
      title: 'IS Audit Manager',
      department: 'IS / IT Audit',
      location: 'Bengaluru',
      employmentType: 'Full-time',
      descriptionMd:
        '## About the role\n\nLead ITGC, SOC 1 / SOC 2, and IS audit engagements from planning through issuance.\n\n## What we expect\n\n- CA or equivalent + CISA\n- 6+ years in IS audit, ideally at a Big 4 or specialist firm\n- Fluent in ITGC / COBIT / SOC 2 Type II terminology',
      isOpen: true,
    },
    {
      slug: 'grc-analyst',
      title: 'GRC Analyst',
      department: 'Risk & GRC Advisory',
      location: 'Remote (India)',
      employmentType: 'Full-time',
      descriptionMd:
        '## About the role\n\nHelp clients build ISO 27001 / DPDP-aligned control frameworks and prepare for external certification audits.\n\n## What we expect\n\n- 2+ years in a GRC or IS-audit adjacent role\n- Working knowledge of ISO 27001, NIST CSF, and India\'s DPDP Act 2023\n- ISO 27001 Lead Implementer certification is a plus',
      isOpen: true,
    },
  ];

  for (const opening of openings) {
    await prisma.jobOpening.upsert({
      where: { slug: opening.slug },
      update: opening,
      create: opening,
    });
  }

  console.log(`Seeded ${openings.length} job openings.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
