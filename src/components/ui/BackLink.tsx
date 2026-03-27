import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export type BackLinkProps = {
  onClick: () => void;
  className?: string;
  children?: ReactNode;
  "aria-label"?: string;
};

/** Figma Back Link (node 2506:47762) — arrow + label, neutral weak text, no chrome. */
export function BackLink({
  onClick,
  className,
  children = "Back",
  "aria-label": ariaLabel,
}: BackLinkProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={cn(
        "group inline-flex cursor-pointer items-center gap-[5px] rounded-sm p-0 font-['Source_Sans_3',sans-serif] text-[14px] font-normal leading-[20px] text-[#5b6780] transition-colors",
        "hover:text-[#3d4754]",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0056d2]",
        className,
      )}
    >
      <ArrowLeft className="size-[10px] shrink-0" strokeWidth={2} aria-hidden />
      <span className="underline-offset-2 group-hover:underline">{children}</span>
    </button>
  );
}
