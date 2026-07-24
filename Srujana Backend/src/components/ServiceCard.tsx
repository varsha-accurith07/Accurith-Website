import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "./ui/cn";
import type { Service } from "./siteData";

// Direction C service card — sharp hairline card, accent icon, caps
// "Learn more" affordance. Hover: accent border, no lift.
export default function ServiceCard({
  service,
  className,
}: {
  service: Service;
  className?: string;
}) {
  const Icon = service.icon;
  return (
    <Link
      href={`/services/${service.slug}`}
      className={cn(
        "group flex flex-col border border-line-light bg-white p-7 transition-colors duration-200 ease-out hover:border-accent",
        className,
      )}
    >
      <Icon
        aria-hidden="true"
        size={24}
        strokeWidth={1.5}
        className="text-accent-dark"
      />
      <h3 className="mt-5 font-heading text-lg font-normal text-ink">
        {service.name}
      </h3>
      <p className="mt-2 flex-1 text-sm font-light leading-relaxed text-ink-2">
        {service.shortDescription}
      </p>
      <span className="mt-5 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-label text-accent-dark group-hover:text-accent">
        Learn more
        <ArrowRight
          aria-hidden="true"
          size={14}
          strokeWidth={1.75}
          className="transition-transform duration-200 group-hover:translate-x-0.5"
        />
      </span>
    </Link>
  );
}
