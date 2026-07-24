import Link from "next/link";
import { Play } from "lucide-react";
import { cn } from "./cn";

// Direction C signature CTA — solid accent square with a play-chevron beside
// letterspaced caps text (the A&M "READ MORE" move). onDark flips the text to
// white for photo/ink grounds.
export default function CtaLink({
  href,
  children,
  onDark = false,
  className,
}: {
  href: string;
  children: React.ReactNode;
  onDark?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn("group inline-flex min-h-12 items-center gap-4", className)}
    >
      <span className="flex h-11 w-11 items-center justify-center bg-accent transition-colors duration-200 group-hover:bg-accent-hover">
        <Play
          aria-hidden="true"
          size={14}
          strokeWidth={0}
          className="fill-white"
        />
      </span>
      <span
        className={cn(
          "text-xs font-semibold uppercase tracking-cta",
          onDark ? "text-white" : "text-accent-dark",
        )}
      >
        {children}
      </span>
    </Link>
  );
}
