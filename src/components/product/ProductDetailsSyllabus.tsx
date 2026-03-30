import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";

export type ProductDetailsSyllabusItem = {
  id: string;
  title: string;
  /** Shown before the bullet, e.g. "Module 2" or "Course 2". */
  segmentLabel: string;
  duration: string;
  thumb: string;
  href?: string;
};

export type ProductDetailsSyllabusProps = {
  title: string;
  description: string;
  items: ProductDetailsSyllabusItem[];
  onReadMore?: () => void;
  /** Renders beside the course list (e.g. “Offered by”) — tops align with the list on large screens. */
  sidebar?: ReactNode;
};

/** Title line for the syllabus block per product type (Figma 2109:77052). */
export function getSyllabusSectionTitle(productTypeLabel: string, count: number): string {
  const t = productTypeLabel.trim().toLowerCase();
  if (t.includes("professional certificate")) {
    return `Professional Certificate - ${count} course series`;
  }
  return `There are ${count} modules in this course`;
}

export function ProductDetailsSyllabus({ title, description, items, onReadMore, sidebar }: ProductDetailsSyllabusProps) {
  const list = (
    <div className="flex flex-col divide-y divide-[#dae1ed] rounded-2xl border border-solid border-[#dae1ed] p-4">
      {items.map((item) => (
        <div key={item.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
          <div className="relative h-[52px] w-[76px] shrink-0 overflow-hidden rounded-[8px] bg-[#f5f7f8]">
            <img alt="" src={item.thumb} className="size-full object-cover" />
          </div>

          <div className="flex min-h-[52px] min-w-0 flex-1 items-center gap-2">
            <div className="min-w-0 flex-1">
              {item.href ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="font-['Source_Sans_3',sans-serif] text-[16px] font-semibold leading-[20px] tracking-[-0.048px] text-[#0f1114] hover:underline"
                >
                  {item.title}
                </a>
              ) : (
                <p className="font-['Source_Sans_3',sans-serif] text-[16px] font-semibold leading-[20px] tracking-[-0.048px] text-[#0f1114]">
                  {item.title}
                </p>
              )}
              <p className="mt-1 font-['Source_Sans_3',sans-serif] text-[14px] leading-[20px] text-[#636363]">
                <span>{item.segmentLabel}</span>
                <span className="mx-2">•</span>
                <span>{item.duration}</span>
              </p>
            </div>

            <button
              type="button"
              className="flex shrink-0 items-center justify-center rounded-lg px-4 py-3 text-[#0056d2]"
              aria-label={`Expand ${item.title}`}
            >
              <ChevronDown className="size-6" strokeWidth={2} aria-hidden />
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <section className="flex w-full flex-col gap-3" data-name="Syllabus">
      <h2 className="font-['Source_Sans_3',sans-serif] text-[16px] font-semibold leading-[20px] tracking-[-0.048px] text-[#0f1114]">
        {title}
      </h2>

      <div className="flex flex-col font-['Source_Sans_3',sans-serif]">
        <p className="text-[16px] font-normal leading-[24px] text-[#0f1114]">{description}</p>
        <button
          type="button"
          onClick={onReadMore}
          className="mt-0 self-start text-left font-['Source_Sans_3',sans-serif] text-[14px] leading-[20px] text-[#0056d2] hover:underline"
        >
          Read more
        </button>
      </div>

      {sidebar != null ? (
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
          <div className="min-w-0">{list}</div>
          <div className="min-w-0 w-full">{sidebar}</div>
        </div>
      ) : (
        list
      )}
    </section>
  );
}
