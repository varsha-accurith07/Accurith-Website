// Mail sender — nodemailer over SMTP.
//
// Provider-agnostic on purpose: SMTP_HOST/USER/PASS come from env, no
// specific host is hardcoded. Swap providers (Gmail Workspace / SES /
// Postmark / Zoho) by editing env vars, not code.
//
// The whole app shares ONE transporter — nodemailer pools SMTP connections
// per transporter and creating a new one per request would open a fresh
// socket every ~2 seconds. Attached to globalThis for the same dev
// hot-reload reason as the Prisma client.

import nodemailer, { type Transporter } from 'nodemailer';

interface MailEnv {
  SMTP_HOST: string;
  SMTP_PORT: string;
  SMTP_USER: string;
  SMTP_PASS: string;
  MAIL_TO: string;
}

function readEnv(): MailEnv {
  const env = process.env as Partial<Record<keyof MailEnv, string>>;
  const missing = (['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'MAIL_TO'] as const).filter(
    (k) => !env[k],
  );
  if (missing.length) {
    throw new Error(`mail: missing env vars ${missing.join(', ')}`);
  }
  return env as MailEnv;
}

const globalForMail = globalThis as unknown as { mailer?: Transporter };

function getTransporter(): Transporter {
  if (globalForMail.mailer) return globalForMail.mailer;
  const env = readEnv();
  const port = Number(env.SMTP_PORT);
  const t = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port,
    // 465 = implicit TLS. 587 = STARTTLS (secure:false + upgrade). Never 25.
    secure: port === 465,
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
    // Fail fast — a 30s hang on a broken SMTP config would tie up the API
    // route and eat the rate-limit budget.
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
  });
  if (process.env.NODE_ENV !== 'production') globalForMail.mailer = t;
  return t;
}

// Public API used by both route handlers.
export interface Notification {
  subject: string;
  text: string;
  html: string;
  // reply-to = the enquirer's email, so hitting Reply in the inbox goes to
  // the human, not the SMTP mailbox.
  replyTo?: string;
  replyToName?: string;
}

export async function sendNotification(n: Notification): Promise<void> {
  const env = readEnv();
  const transporter = getTransporter();
  await transporter.sendMail({
    from: { name: 'Accurith Website', address: env.SMTP_USER },
    to: env.MAIL_TO,
    replyTo: n.replyTo ? { name: n.replyToName ?? '', address: n.replyTo } : undefined,
    subject: n.subject,
    text: n.text,
    html: n.html,
  });
}

// HTML-escape untrusted content before pasting into an HTML email body.
export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
