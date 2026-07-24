import { cn } from "./cn";

type SectionTone = "white" | "grey" | "navy";

const toneClasses: Record<SectionTone, string> = {
  white: "bg-white",
  grey: "bg-sec1",
  navy: "bg-navy text-white/80",
};

// Direction C sections — hairline top borders between light sections; navy
// reserved for emphasis bands. dotGrid is a legacy no-op kept for call sites.
export default function Section({
  children,
  tone = "white",
  hairline = true,
  dotGrid = false,
  className,
  ...rest
}: {
  children: React.ReactNode;
  tone?: SectionTone;
  /** Hairline top border between sections. */
  hairline?: boolean;
  /** Legacy Direction A dot-grid — ignored under Direction C. */
  dotGrid?: boolean;
  className?: string;
} & React.HTMLAttributes<HTMLElement>) {
  void dotGrid;
  return (
    <section
      className={cn(
        "py-16 md:py-24",
        toneClasses[tone],
        hairline && tone !== "navy" && "border-t border-line-light",
        className,
      )}
      {...rest}
    >
      {children}
    </section>
  );
}
