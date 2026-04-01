import actionsClose from "@/assets/actions-close.svg";
import type { ResolvedSerpCourse } from "@/data/serpCourses";

/**
 * Figma 2807:45991 — attachment thumbnails (40×40, course image + overlay dismiss only).
 * Shown when the user has confirmed their role and results are in a state where course selection applies:
 * default SERP grid, or personalized results after PM refresh (pm_results).
 */
export function ComposerSelectedCoursesAttachment({
  courses,
  onRemove,
}: {
  courses: ResolvedSerpCourse[];
  onRemove: (id: string) => void;
}) {
  if (courses.length === 0) return null;
  return (
    <div className="flex w-full min-w-0 flex-wrap gap-1" data-name="Composer selected courses">
      {courses.map((c) => (
        <div
          key={c.id}
          className="relative shrink-0 size-10 overflow-hidden rounded-lg"
          data-name="Selected course chip"
        >
          <img alt="" className="size-full rounded-lg object-cover" src={c.thumb} />
          <button
            type="button"
            className="absolute right-1 top-1 flex size-4 cursor-pointer items-center justify-center rounded-full bg-[rgba(45,52,64,0.8)] p-0.5 transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0056d2]"
            aria-label={`Remove ${c.title}`}
            onClick={() => onRemove(c.id)}
          >
            <img
              alt=""
              className="size-[10px] object-contain brightness-0 invert"
              src={actionsClose}
              aria-hidden
            />
          </button>
        </div>
      ))}
    </div>
  );
}

const SINGLE_COURSE_FOLLOW_UP_PILLS = [
  "What skills will I gain?",
  "What tools will I use?",
  "Compare to similar courses",
] as const;

/** PDP composer — 2×2 grid (Figma: arrival state on product page). */
const PDP_COURSE_FOLLOW_UP_SUGGESTIONS = [
  "What skills will I gain?",
  "How can I use this at work?",
  "What tools will I use?",
  "Compare to similar courses",
] as const;

export function PdpCourseFollowUpPills({ onSelect }: { onSelect: (label: string) => void }) {
  return (
    <div className="content-stretch flex w-full min-w-0 flex-col items-start" data-name="PDP follow up prompts">
      <div className="grid w-full grid-cols-2 gap-2" data-name="prompts">
        {PDP_COURSE_FOLLOW_UP_SUGGESTIONS.map((label) => (
          <button
            key={label}
            type="button"
            className="flex min-h-[40px] cursor-pointer items-center justify-center rounded-lg border border-solid border-[#dae1ed] bg-white px-3 py-2 text-left font-inherit transition-colors duration-150 hover:bg-[#f8fafc]"
            data-name="Prompt - PDP"
            onClick={() => onSelect(label)}
          >
            <span className="w-full font-['Source_Sans_3',sans-serif] text-[14px] font-normal leading-[18px] text-[#0f1114]">
              {label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

/** Single scoped course chip for PDP composer (thumb + truncated title + dismiss). */
export function PdpComposerCoursePill({
  title,
  thumb,
  onRemove,
}: {
  title: string;
  thumb: string;
  onRemove: () => void;
}) {
  return (
    <div className="flex w-full min-w-0 shrink-0" data-name="PDP composer course">
      <div className="flex h-[30px] max-h-[30px] min-h-[30px] w-fit max-w-full min-w-0 items-center gap-1 rounded-lg border border-[#dae1ed] bg-white py-0.5 pl-0.5 pr-1">
        <img alt="" className="size-[22px] shrink-0 rounded-md object-cover" src={thumb} />
        <p className="min-w-0 max-w-[200px] truncate font-['Source_Sans_3',sans-serif] text-[12px] leading-[22px] text-[#0f1114]">
          {title}
        </p>
        <button
          type="button"
          className="flex size-[22px] shrink-0 cursor-pointer items-center justify-center rounded text-[#5b6780] transition-colors hover:bg-[#f2f5fa] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0056d2]"
          aria-label={`Remove ${title} from assistant context`}
          onClick={onRemove}
        >
          <img alt="" className="size-3 object-contain opacity-70" src={actionsClose} aria-hidden />
        </button>
      </div>
    </div>
  );
}

export function SingleCourseFollowUpPills({ onSelect }: { onSelect: (label: string) => void }) {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Follow up prompts (single course)">
      <div className="flex flex-wrap gap-[8px] items-center relative shrink-0 w-full" data-name="prompts">
        {SINGLE_COURSE_FOLLOW_UP_PILLS.map((label) => (
          <button
            key={label}
            type="button"
            className="bg-white border border-[#dae1ed] border-solid flex gap-[4px] items-center justify-center px-[12px] py-[6px] relative rounded-[8px] shrink-0 font-inherit cursor-pointer text-left transition-colors duration-150 hover:bg-[#f8fafc]"
            data-name="Prompt - Single Select"
            onClick={() => onSelect(label)}
          >
            <span className="font-['Source_Sans_3',sans-serif] font-normal leading-[20px] text-[14px] text-[#5b6780] whitespace-nowrap">
              {label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
