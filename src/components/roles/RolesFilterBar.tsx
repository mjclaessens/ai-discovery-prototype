import { ChevronDown } from "lucide-react";
import type { FilterItem } from "@/data/rolesPageContent";

export function RolesFilterBar({ items }: { items: FilterItem[] }) {
  return (
    <div
      className="flex min-h-8 w-full flex-wrap items-center gap-x-2 gap-y-2 font-['Source_Sans_3',sans-serif]"
      data-name="Roles filters"
    >
      {items.map((item, i) => {
        if (item.type === "divider") {
          return (
            <div
              key={`d-${i}`}
              className="hidden h-9 w-px shrink-0 bg-[#dae1ed] sm:block"
              aria-hidden
            />
          );
        }
        if (item.type === "dropdown") {
          return (
            <button
              key={`dd-${item.label}-${i}`}
              type="button"
              className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg border border-solid border-[#dae1ed] bg-white px-3 text-left text-[14px] font-normal leading-5 text-[#0f1114] transition-colors hover:bg-[#f8fafc]"
            >
              {item.label}
              <ChevronDown className="size-4 shrink-0 text-[#5b6780]" aria-hidden />
            </button>
          );
        }
        const count = item.count != null ? ` (${item.count})` : "";
        return (
          <button
            key={`pill-${item.label}-${i}`}
            type="button"
            className="inline-flex h-8 shrink-0 items-center rounded-lg border border-solid border-[#dae1ed] bg-white px-3 text-[14px] font-normal leading-5 text-[#0f1114] transition-colors hover:bg-[#f8fafc]"
          >
            {item.label}
            {count}
          </button>
        );
      })}
    </div>
  );
}
