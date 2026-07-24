'use client';

import { useEffect, useState } from 'react';
import { Briefcase, CheckCircle2, CircleAlert, LoaderCircle, MapPin } from 'lucide-react';
import Button from './ui/Button';
import Badge from './ui/Badge';
import { cn } from './ui/cn';

// Careers integration (J01): openings come from GET /api/careers/openings
// (managed by Srujana via Prisma); applications POST to /api/careers/apply.
// No file uploads by design — applicants give links. Contract: CLAUDE.md §7.

type Opening = {
  id: string;
  slug: string;
  title: string;
  department: string;
  location: string;
  employmentType: string;
  descriptionMd: string;
  postedAt: string;
};

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

// Matches ContactForm's field treatment exactly — Direction C inputs are
// sharp-edged hairline boxes, no rounding.
const inputClasses =
  'w-full border border-line-light bg-white px-4 py-3 text-base text-ink placeholder:text-ink-3 transition-colors duration-200 hover:border-ink-3 focus:border-accent focus:outline-none';

const labelClasses =
  'mb-1.5 block text-[11px] font-semibold uppercase tracking-label text-ink-3';

const emptyApplication = {
  name: '',
  email: '',
  phone: '',
  linkedinUrl: '',
  portfolioUrl: '',
  coverNote: '',
  website: '', // honeypot — stays empty for humans
};

const GENERIC_ERROR =
  "That didn't go through — please check the fields (LinkedIn needs a full https:// URL) and try again, or email";
const RATE_LIMIT_ERROR =
  "You've sent several applications in a short window, so we've paused new ones for a few minutes. Please try again shortly, or email";

function ApplyForm({ opening }: { opening: Opening }) {
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorText, setErrorText] = useState(GENERIC_ERROR);
  const [form, setForm] = useState(emptyApplication);

  const update =
    (field: keyof typeof emptyApplication) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/careers/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ openingId: opening.id, ...form }),
      });
      const data: { success?: boolean } = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        setStatus('success');
        return;
      }

      setErrorText(res.status === 429 ? RATE_LIMIT_ERROR : GENERIC_ERROR);
      setStatus('error');
    } catch {
      setErrorText(GENERIC_ERROR);
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div role="status" className="mt-4 border border-accent/40 bg-sec1 p-6">
        <CheckCircle2 aria-hidden="true" size={24} strokeWidth={1.75} className="text-accent-dark" />
        <h4 className="mt-3 text-lg font-light text-ink">Application received.</h4>
        <p className="mt-1 text-sm leading-relaxed text-ink-2">
          Thank you — we read every application and will get back to you either way.
        </p>
      </div>
    );
  }

  const fieldId = (name: string) => `apply-${opening.slug}-${name}`;

  return (
    <form onSubmit={handleSubmit} className="mt-4 border-t border-line-light pt-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={fieldId('name')} className={labelClasses}>
            Name
          </label>
          <input
            id={fieldId('name')}
            type="text"
            required
            autoComplete="name"
            value={form.name}
            onChange={update('name')}
            className={inputClasses}
          />
        </div>
        <div>
          <label htmlFor={fieldId('email')} className={labelClasses}>
            Email
          </label>
          <input
            id={fieldId('email')}
            type="email"
            required
            autoComplete="email"
            value={form.email}
            onChange={update('email')}
            className={inputClasses}
          />
        </div>
        <div>
          <label htmlFor={fieldId('phone')} className={labelClasses}>
            Phone
          </label>
          <input
            id={fieldId('phone')}
            type="tel"
            required
            autoComplete="tel"
            value={form.phone}
            onChange={update('phone')}
            className={inputClasses}
          />
        </div>
        <div>
          <label htmlFor={fieldId('linkedin')} className={labelClasses}>
            LinkedIn URL
          </label>
          <input
            id={fieldId('linkedin')}
            type="url"
            required
            placeholder="https://linkedin.com/in/…"
            value={form.linkedinUrl}
            onChange={update('linkedinUrl')}
            className={inputClasses}
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor={fieldId('portfolio')} className={labelClasses}>
            Portfolio / work sample URL <span className="font-normal normal-case">(optional)</span>
          </label>
          <input
            id={fieldId('portfolio')}
            type="url"
            placeholder="https://…"
            value={form.portfolioUrl}
            onChange={update('portfolioUrl')}
            className={inputClasses}
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor={fieldId('note')} className={labelClasses}>
            Cover note
          </label>
          <textarea
            id={fieldId('note')}
            required
            rows={4}
            value={form.coverNote}
            onChange={update('coverNote')}
            className={inputClasses}
            placeholder="Why this role, and what should we look at first?"
          />
        </div>
        {/* Honeypot. sr-only rather than `hidden` — display:none fields are
            commonly skipped by bots, which defeats the trap. */}
        <div className="sr-only" aria-hidden="true">
          <label htmlFor={fieldId('website')}>Website</label>
          <input
            id={fieldId('website')}
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={form.website}
            onChange={update('website')}
          />
        </div>
      </div>

      {status === 'error' && (
        <div role="alert" className="mt-4 flex items-start gap-3 border border-red-300 bg-red-50 p-4">
          <CircleAlert
            aria-hidden="true"
            size={24}
            strokeWidth={1.75}
            className="shrink-0 text-red-600"
          />
          <p className="text-sm leading-relaxed text-red-800">
            {errorText}{' '}
            <a
              href="mailto:careers@accurith.com"
              className="font-medium underline underline-offset-2"
            >
              careers@accurith.com
            </a>
            .
          </p>
        </div>
      )}

      <div className="mt-5" aria-live="polite">
        <Button type="submit" disabled={status === 'loading'}>
          {status === 'loading' ? (
            <>
              <LoaderCircle
                aria-hidden="true"
                size={16}
                strokeWidth={1.75}
                className="animate-spin"
              />
              Submitting…
            </>
          ) : (
            'Submit application'
          )}
        </Button>
      </div>
    </form>
  );
}

export default function CareersOpenings() {
  const [openings, setOpenings] = useState<Opening[] | null>(null);
  const [applyingTo, setApplyingTo] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/careers/openings')
      .then((res) => res.json())
      .then((data: { openings?: Opening[] }) => {
        if (!cancelled) setOpenings(data.openings ?? []);
      })
      .catch(() => {
        // Network failure looks the same as "nothing listed" on purpose —
        // the mailto fallback below is the useful action either way.
        if (!cancelled) setOpenings([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (openings === null) {
    return (
      <p className="flex items-center gap-2 text-ink-3" role="status">
        <LoaderCircle aria-hidden="true" size={24} strokeWidth={1.75} className="animate-spin" />
        Loading open roles…
      </p>
    );
  }

  if (openings.length === 0) {
    return (
      <div className="border border-line-light bg-sec1 p-6">
        <p className="leading-relaxed text-ink-2">
          No listed openings right now — but we&apos;re a young firm and that changes often. If you
          work in security testing, IS audit, GRC, or audit automation, introduce yourself at{' '}
          <a
            href="mailto:careers@accurith.com"
            className="font-medium text-accent-dark underline-offset-4 hover:underline"
          >
            careers@accurith.com
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-6">
      {openings.map((o) => (
        <li key={o.id} className="corner-ticks border border-line-light bg-white p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h3 className="text-xl font-light text-ink">{o.title}</h3>
              <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-3">
                <span className="flex items-center gap-1.5">
                  <Briefcase
                    aria-hidden="true"
                    size={16}
                    strokeWidth={1.75}
                    className="text-accent-dark"
                  />
                  {o.department} · {o.employmentType}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin
                    aria-hidden="true"
                    size={16}
                    strokeWidth={1.75}
                    className="text-accent-dark"
                  />
                  {o.location}
                </span>
              </p>
            </div>
            <Badge mono>Open</Badge>
          </div>
          <p className="mt-4 text-sm leading-relaxed whitespace-pre-line text-ink-2">
            {o.descriptionMd}
          </p>
          <div className="mt-4">
            <Button
              variant={applyingTo === o.id ? 'outline' : 'primary'}
              size="sm"
              aria-expanded={applyingTo === o.id}
              onClick={() => setApplyingTo((cur) => (cur === o.id ? null : o.id))}
            >
              {applyingTo === o.id ? 'Close application form' : 'Apply for this role'}
            </Button>
          </div>
          <div className={cn(applyingTo !== o.id && 'hidden')}>
            <ApplyForm opening={o} />
          </div>
        </li>
      ))}
    </ul>
  );
}
