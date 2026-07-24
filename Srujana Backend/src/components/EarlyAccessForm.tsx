"use client";

import { useState } from "react";
import { CheckCircle2, CircleAlert, LoaderCircle } from "lucide-react";
import Button from "./ui/Button";
import { cn } from "./ui/cn";

type FormStatus = "idle" | "loading" | "success" | "error";

const inputClasses =
  "w-full border border-line-light bg-white px-4 py-3 text-base text-ink placeholder:text-ink-3 transition-colors duration-200 hover:border-ink-3 focus:border-accent focus:outline-none";

const GENERIC_ERROR = "That didn't go through. Please try again, or email";
const RATE_LIMIT_ERROR =
  "You've submitted this a few times in a short window, so we've paused new ones for a few minutes. Please try again shortly, or email";

// V24 / J01 — early-access waitlist against POST /api/early-access. Signing up
// twice for the same product is a no-op server-side, so it still reports
// success.
export default function EarlyAccessForm({ products }: { products: string[] }) {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorText, setErrorText] = useState(GENERIC_ERROR);
  const [form, setForm] = useState({
    name: "",
    email: "",
    product: "",
    // Honeypot — see the hidden field below.
    website: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/early-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data: { success?: boolean } = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        setStatus("success");
        return;
      }

      setErrorText(res.status === 429 ? RATE_LIMIT_ERROR : GENERIC_ERROR);
      setStatus("error");
    } catch {
      setErrorText(GENERIC_ERROR);
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        className="border border-accent/40 bg-sec1 p-6 text-left"
      >
        <CheckCircle2
          aria-hidden="true"
          size={24}
          strokeWidth={1.75}
          className="text-accent-dark"
        />
        <h3 className="mt-3 text-xl font-light text-ink">You&apos;re on the list.</h3>
        <p className="mt-1 text-sm leading-relaxed text-ink-2">
          We&apos;ll write to you when early access opens — and not before,
          and not about anything else.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="text-left">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="ea-name" className="mb-1.5 block text-[11px] font-semibold uppercase tracking-label text-ink-3">
            Name
          </label>
          <input
            id="ea-name"
            type="text"
            required
            autoComplete="name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className={inputClasses}
          />
        </div>
        <div>
          <label htmlFor="ea-email" className="mb-1.5 block text-[11px] font-semibold uppercase tracking-label text-ink-3">
            Work email
          </label>
          <input
            id="ea-email"
            type="email"
            required
            autoComplete="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className={inputClasses}
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="ea-product" className="mb-1.5 block text-[11px] font-semibold uppercase tracking-label text-ink-3">
            Product of interest
          </label>
          <select
            id="ea-product"
            required
            value={form.product}
            onChange={(e) =>
              setForm((f) => ({ ...f, product: e.target.value }))
            }
            className={cn(inputClasses, form.product === "" && "text-ink-3")}
          >
            <option value="" disabled>
              Select a product…
            </option>
            {products.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
        {/* Honeypot. sr-only rather than `hidden` — display:none fields are
            commonly skipped by bots, which defeats the trap. */}
        <div className="sr-only" aria-hidden="true">
          <label htmlFor="ea-website">Website</label>
          <input
            id="ea-website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={form.website}
            onChange={(e) =>
              setForm((f) => ({ ...f, website: e.target.value }))
            }
          />
        </div>
      </div>

      {status === "error" && (
        <div
          role="alert"
          className="mt-4 flex items-start gap-3 border border-red-300 bg-red-50 p-4"
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

      <div className="mt-5" aria-live="polite">
        <Button type="submit" disabled={status === "loading"}>
          {status === "loading" ? (
            <>
              <LoaderCircle
                aria-hidden="true"
                size={16}
                strokeWidth={1.75}
                className="animate-spin"
              />
              Requesting…
            </>
          ) : (
            "Request Early Access"
          )}
        </Button>
      </div>
    </form>
  );
}
