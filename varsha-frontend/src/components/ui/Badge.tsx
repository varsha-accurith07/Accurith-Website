import { cn } from "./cn";

// Framework names (ISO 27001, SOC 2, COBIT…) always render through this —
// plain text chips, never badge/seal images (hard rule). Direction C: sharp
// hairline chips, quiet text.
export default function Badge({
  children,
  mono = false,
  tone = "teal",
  className,
}: {
  children: React.ReactNode;
  /** Slightly smaller tracking-wide text — framework chips, index labels. */
  mono?: boolean;
  /** `navy` inverts for use on dark bands. (`teal` name kept for call sites.) */
  tone?: "teal" | "navy";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center border px-3 py-1 text-sm",
        tone === "teal" && "border-line-light bg-white text-ink-2",
        tone === "navy" && "border-white/25 bg-white/5 text-white/80",
        mono && "text-xs tracking-wide",
        className,
      )}
    >
      {children}
    </span>
  );
}
