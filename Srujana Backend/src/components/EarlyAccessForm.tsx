"use client";

import { useState } from "react";
import { CheckCircle2, CircleAlert, LoaderCircle } from "lucide-react";
import Button from "./ui/Button";
import { cn } from "./ui/cn";
import { submitEarlyAccess } from "@/mocks/earlyAccess";

type FormStatus = "idle" | "loading" | "success" | "error";

const inputClasses =
  "w-full border border-line-light bg-white px-4 py-3 text-base text-ink placeholder:text-ink-3 transition-colors duration-200 hover:border-ink-3 focus:border-accent focus:outline-none";

// V24 — simple early-access form against the mocked endpoint. Append ?fail
// to the URL to demo the error state.
export default function EarlyAccessForm({ products }: { products: string[] }) {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [form, setForm] = useState({ name: "", email: "", product: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    const result = await submitEarlyAccess(form);
    setStatus(result.success ? "success" : "error");
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
            That didn&apos;t go through. Please try again, or email{" "}
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
