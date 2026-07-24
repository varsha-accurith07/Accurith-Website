import Link from "next/link";
import { cn } from "./cn";

type ButtonVariant = "primary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

// Direction C buttons — sharp corners, caps letterspaced text, one accent
// (primary) action per section; secondary actions use outline/ghost.
const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-accent text-white hover:bg-accent-hover disabled:hover:bg-accent",
  outline:
    "border border-ink/30 text-ink hover:border-ink bg-transparent",
  ghost: "text-ink hover:bg-sec1",
};

// md/lg meet the 44px touch-target minimum; sm is for dense desktop-only spots.
const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-[11px] min-h-10",
  md: "px-6 py-3 text-xs min-h-11",
  lg: "px-8 py-3.5 text-[13px] min-h-12",
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 font-semibold uppercase tracking-kicker " +
  "transition-colors duration-200 ease-out " +
  "disabled:opacity-50 disabled:pointer-events-none";

type CommonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: React.ReactNode;
};

type ButtonAsButton = CommonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps> & {
    href?: undefined;
  };

type ButtonAsLink = CommonProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof CommonProps> & {
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export default function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: ButtonProps) {
  const classes = cn(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className,
  );

  if (rest.href !== undefined) {
    const { href, ...anchorProps } = rest as ButtonAsLink;
    // Plain anchor for external/mailto targets; Next Link for internal routes.
    if (/^(https?:|mailto:|tel:)/.test(href)) {
      return (
        <a href={href} className={classes} {...anchorProps}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} {...anchorProps}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...(rest as ButtonAsButton)}>
      {children}
    </button>
  );
}
