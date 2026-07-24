import { cn } from "./ui/cn";

// Direction C section heading — caps letterspaced label above a light-weight
// display title (the A&M kicker move). `index` renders before the label as
// "01 / Services" where pages pass it.
export default function SectionHeading({
  index,
  label,
  title,
  description,
  align = "left",
  onNavy = false,
  className,
}: {
  /** Two-digit index, e.g. "01". */
  index?: string;
  /** Label shown after the index, e.g. "Services". */
  label?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  onNavy?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {(index || label) && (
        <p
          className={cn(
            "mb-4 text-[11px] font-semibold uppercase tracking-label",
            onNavy ? "text-accent-light" : "text-accent-dark",
          )}
        >
          {index}
          {index && label ? " / " : ""}
          {label}
        </p>
      )}
      <h2
        className={cn(
          "text-3xl font-light leading-tight md:text-4xl",
          onNavy ? "text-white" : "text-ink",
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-4 text-lg font-light leading-relaxed",
            onNavy ? "text-white/70" : "text-ink-2",
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
