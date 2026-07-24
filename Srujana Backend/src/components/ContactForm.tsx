"use client";

import { useState } from "react";
import { CheckCircle2, CircleAlert, LoaderCircle } from "lucide-react";
import Button from "./ui/Button";
import { cn } from "./ui/cn";
import { services } from "./siteData";

type FormStatus = "idle" | "loading" | "success" | "error";

const inputClasses =
  "w-full border border-line-light bg-white px-4 py-3 text-base text-ink placeholder:text-ink-3 transition-colors duration-200 hover:border-ink-3 focus:border-accent focus:outline-none";

const emptyForm = {
  name: "",
  email: "",
  company: "",
  role: "",
  service: "",
  message: "",
  // Honeypot — see the hidden field near the bottom of the form. Real users
  // never fill this; the API silently drops any submission that has it set.
  website: "",
};

const GENERIC_ERROR =
  "Something went wrong sending your message. Your details are still in the form — please try again, or email us directly at";
const RATE_LIMIT_ERROR =
  "You've sent several messages in a short window, so we've paused new ones for a few minutes. Please try again shortly, or email us directly at";

// V23 / J01 — all four states (idle / loading / success / error) against the
// real POST /api/consultation. Contract is documented in
// Srujana Backend/CLAUDE.md §7.
export default function ContactForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorText, setErrorText] = useState(GENERIC_ERROR);
  const [form, setForm] = useState(emptyForm);

  const update =
    (field: keyof typeof emptyForm) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >,
    ) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      // The API answers 200 {success:true} on the happy path AND when the
      // honeypot fires, so a bot cannot tell it was caught.
      const data: { success?: boolean } = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        setStatus("success");
        return;
      }

      setErrorText(res.status === 429 ? RATE_LIMIT_ERROR : GENERIC_ERROR);
      setStatus("error");
    } catch {
      // Network failure / offline — never surface the underlying error text.
      setErrorText(GENERIC_ERROR);
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        className="border border-accent/40 bg-sec1 p-8"
      >
        <CheckCircle2
          aria-hidden="true"
          size={24}
          strokeWidth={1.75}
          className="text-accent-dark"
        />
        <h2 className="mt-4 text-2xl font-light text-ink">Thank you — we&apos;ve got it.</h2>
        <p className="mt-2 leading-relaxed text-ink-2">
          Your message is on its way to our team. We respond within one
          business day.
        </p>
        <div className="mt-6">
          <Button
            variant="outline"
            onClick={() => {
              setForm(emptyForm);
              setStatus("idle");
            }}
          >
            Send another message
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate={false}>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="mb-1.5 block text-[11px] font-semibold uppercase tracking-label text-ink-3">
            Name
          </label>
          <input
            id="contact-name"
            type="text"
            required
            autoComplete="name"
            value={form.name}
            onChange={update("name")}
            className={inputClasses}
          />
        </div>
        <div>
          <label htmlFor="contact-email" className="mb-1.5 block text-[11px] font-semibold uppercase tracking-label text-ink-3">
            Work email
          </label>
          <input
            id="contact-email"
            type="email"
            required
            autoComplete="email"
            value={form.email}
            onChange={update("email")}
            className={inputClasses}
          />
        </div>
        <div>
          <label htmlFor="contact-company" className="mb-1.5 block text-[11px] font-semibold uppercase tracking-label text-ink-3">
            Company
          </label>
          <input
            id="contact-company"
            type="text"
            required
            autoComplete="organization"
            value={form.company}
            onChange={update("company")}
            className={inputClasses}
          />
        </div>
        <div>
          <label htmlFor="contact-role" className="mb-1.5 block text-[11px] font-semibold uppercase tracking-label text-ink-3">
            Role
          </label>
          {/* required: the API's consultationSchema demands role.min(1), so a
              blank value would 400. Contract, not preference. */}
          <input
            id="contact-role"
            type="text"
            required
            autoComplete="organization-title"
            value={form.role}
            onChange={update("role")}
            className={inputClasses}
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="contact-service" className="mb-1.5 block text-[11px] font-semibold uppercase tracking-label text-ink-3">
            Service of interest
          </label>
          <select
            id="contact-service"
            required
            value={form.service}
            onChange={update("service")}
            className={cn(inputClasses, form.service === "" && "text-ink-3")}
          >
            <option value="" disabled>
              Select a service…
            </option>
            {services.map((s) => (
              <option key={s.slug} value={s.name}>
                {s.name}
              </option>
            ))}
            <option value="Other">Other / not sure yet</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="contact-message" className="mb-1.5 block text-[11px] font-semibold uppercase tracking-label text-ink-3">
            Message
          </label>
          <textarea
            id="contact-message"
            required
            rows={5}
            value={form.message}
            onChange={update("message")}
            className={inputClasses}
            placeholder="What do you need to prove, protect, or automate?"
          />
        </div>
        {/* Honeypot. Hidden from people (and from screen readers via
            aria-hidden + tabIndex -1), but present in the DOM for bots that
            fill every field. Not `type="hidden"` — bots skip those. */}
        <div className="sr-only" aria-hidden="true">
          <label htmlFor="contact-website">Website</label>
          <input
            id="contact-website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={form.website}
            onChange={update("website")}
          />
        </div>
      </div>

      {status === "error" && (
        <div
          role="alert"
          className="mt-5 flex items-start gap-3 border border-red-300 bg-red-50 p-4"
        >
          <CircleAlert
            aria-hidden="true"
            size={24}
            strokeWidth={1.75}
            className="shrink-0 text-red-600"
          />
          <p className="text-sm leading-relaxed text-red-800">
            {errorText}{" "}
            <a
              href="mailto:hello@accurith.com"
              className="font-medium underline underline-offset-2"
            >
              hello@accurith.com
            </a>
            .
          </p>
        </div>
      )}

      <div className="mt-6" aria-live="polite">
        <Button type="submit" size="lg" disabled={status === "loading"}>
          {status === "loading" ? (
            <>
              <LoaderCircle
                aria-hidden="true"
                size={16}
                strokeWidth={1.75}
                className="animate-spin"
              />
              Sending…
            </>
          ) : (
            "Send message"
          )}
        </Button>
      </div>
    </form>
  );
}
