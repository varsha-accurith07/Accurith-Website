import Image from "next/image";
import { cn } from "./ui/cn";

// Permanent brand lockup (2026-07-22 brand sheet, client-confirmed): peak
// monogram above the spaced ACCURITH wordmark. mark-white / mark-ink PNGs are
// the two colorways extracted from the sheet — pass theme="dark" on dark
// surfaces (home hero header), default on light. Ask the client for an SVG
// master; until then the PNGs ship via next/image.

type Theme = "light" | "dark";

export default function Logo({
  theme = "light",
  priority = false,
  className,
}: {
  theme?: Theme;
  priority?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn("inline-flex flex-col items-center gap-1.5", className)}
    >
      <Image
        src={
          theme === "dark"
            ? "/images/brand/mark-white.png"
            : "/images/brand/mark-ink.png"
        }
        alt=""
        width={400}
        height={418}
        priority={priority}
        className="h-8 w-auto md:h-9"
      />
      <span
        className={cn(
          "font-heading text-xs font-semibold uppercase leading-none tracking-brand",
          theme === "dark" ? "text-white" : "text-ink",
        )}
      >
        Accurith
      </span>
    </span>
  );
}
