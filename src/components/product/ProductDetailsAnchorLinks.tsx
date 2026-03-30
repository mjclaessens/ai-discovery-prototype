import { cn } from "@/lib/utils";

/** Figma 2109:76969 — horizontal anchor nav (selected = grey pill + blue text). */
export type ProductDetailsAnchorId =
  | "about"
  | "outcomes"
  | "courses"
  | "testimonials"
  | "recommendations";

export type ProductDetailsAnchorLinksProps = {
  items: readonly { id: ProductDetailsAnchorId; label: string }[];
  activeId: ProductDetailsAnchorId;
  onNavigate: (id: ProductDetailsAnchorId) => void;
  className?: string;
  /** Accessible label for the nav landmark */
  "aria-label"?: string;
};

const linkTypography =
  "font-['Source_Sans_3',sans-serif] text-[16px] font-semibold leading-[24px] tracking-[-0.1px] whitespace-nowrap";

export function ProductDetailsAnchorLinks({
  items,
  activeId,
  onNavigate,
  className,
  "aria-label": ariaLabel = "Product sections",
}: ProductDetailsAnchorLinksProps) {
  return (
    <nav
      className={cn("flex flex-wrap items-start gap-6", className)}
      data-name="Anchor Links"
      data-node-id="2109:76969"
      aria-label={ariaLabel}
    >
      {items.map(({ id, label }) => {
        const selected = activeId === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onNavigate(id)}
            aria-current={selected ? "true" : undefined}
            className={cn(
              "flex shrink-0 flex-col items-start px-3 py-2.5 text-left",
              "rounded-[6px] transition-colors",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0056d2]",
              selected ? "bg-[#f5f7f8]" : "bg-transparent",
            )}
            data-name={selected ? "Anchor Link (Selected)" : "Anchor Link"}
          >
            <span
              className={cn(
                linkTypography,
                selected ? "text-[#0056d2]" : "text-[#1f1f1f]",
              )}
            >
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
