import hero1 from "@/assets/hero1.png";
import hero2 from "@/assets/hero2.png";
import googleLogo from "@/assets/google-logo.png";
import spotlight11 from "@/assets/spotlight1-1.png";
import spotlight12 from "@/assets/spotlight1-2.png";
import { useCourseraTypingAutocomplete } from "@/hooks/useCourseraTypingAutocomplete";

/** Figma `_genAI_sparkle_brand_test` (L + S layers; MCP URLs; refresh from Figma if expired). */
const IMG_GEN_AI_SPARKLE_L =
  "https://www.figma.com/api/mcp/asset/98b22db9-d94a-4929-8f13-3a3f4fc86762";
const IMG_GEN_AI_SPARKLE_S =
  "https://www.figma.com/api/mcp/asset/1bb6409e-be5b-4c21-a011-970c56624c09";

export const promptPillHoverClass =
  "transition-colors duration-150 hover:bg-[#f5f8ff] hover:border-[#c5d2ea]";

const learnerFavoriteCardHoverClass =
  "transition-shadow duration-150 hover:shadow-[0_0_24px_rgba(15,17,20,0.12)]";

const autocompleteRowHoverClass =
  "rounded-lg transition-colors duration-150 hover:bg-[#f5f8ff]";

export const LOHP_PROMPT_SUGGESTIONS = [
  "Create a learning plan",
  "Find a new career",
  "Develop in-demand skills",
  "Advance my career",
  "What are the most in-demand skills?",
  "Data Science vs. Data Analytics",
  "Is an online degree right for me?",
  "Learn new coding skills",
  "Leverage Generative AI in my role",
  "Which career’s right for me?",
] as const;

/** Matches Figma `_genAI_sparkle_brand_test` (L + S layers; default 11px). */
export function GenAiSparkleBrandIcon({ sizeClass = "size-[11px]" }: { sizeClass?: string }) {
  return (
    <div className={`relative shrink-0 ${sizeClass}`} data-name="_genAI_sparkle_brand_test" aria-hidden>
      <div className="absolute inset-[8.33%_8.33%_0_0]" data-name="L">
        <img alt="" className="block size-full max-w-none" src={IMG_GEN_AI_SPARKLE_L} />
      </div>
      <div className="absolute inset-[0_0_66.67%_66.67%]" data-name="S">
        <img alt="" className="block size-full max-w-none" src={IMG_GEN_AI_SPARKLE_S} />
      </div>
    </div>
  );
}

function NavigationSearchIcon() {
  return (
    <svg className="size-5 shrink-0" viewBox="0 0 20 20" fill="none" aria-hidden>
      <circle cx="8.5" cy="8.5" r="5" stroke="#0f1114" strokeWidth="1.5" />
      <path d="M12.5 12.5L17 17" stroke="#0f1114" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

const LEARNER_FAVORITE_CARDS = [
  {
    title: "Google AI Essentials",
    partner: "Google",
    meta: "Beginner · Specialization",
    image: hero1,
  },
  {
    title: "Google Data Analytics",
    partner: "Google",
    meta: "Beginner · Professional Certificate",
    image: hero2,
  },
  {
    title: "Lesson | Small Talk & Conversational Vocabulary",
    partner: "Google",
    meta: "Beginner · Course",
    image: spotlight11,
  },
  {
    title: "Learn English: Beginning Grammar",
    partner: "Google",
    meta: "Beginner · Specialization",
    image: spotlight12,
  },
] as const;

/** CDS Avatar org-style (Figma 2320:48885): 24px tile, inset logo, neutral border — matches SERP product card partner row. */
function PartnerLogoAvatar({ src }: { src: string }) {
  return (
    <div
      className="relative flex size-6 shrink-0 flex-col items-center justify-center overflow-hidden rounded-[2px] bg-white p-[2px]"
      data-name="Avatar"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] border-[0.891px] border-solid border-[#dae1ed]"
      />
      <img alt="" className="relative size-[14px] object-contain" src={src} />
    </div>
  );
}

export function IdleAutocompletePanel({ onPick }: { onPick: (q: string) => void }) {
  return (
    <div className="flex w-full min-w-0 flex-col gap-6" data-name="Dropdown">
      <div className="flex w-full min-w-0 flex-col gap-3" data-name="Trending">
        <p className="w-full font-['Source_Sans_3',sans-serif] text-[16px] font-semibold leading-[20px] tracking-[-0.048px] text-[#0f1114]">
          Trending on Coursera
        </p>
        <div className="flex w-full flex-wrap content-start items-start gap-[6px]" data-name="Prompts">
          {LOHP_PROMPT_SUGGESTIONS.map((label) => (
            <button
              key={label}
              type="button"
              className={`content-stretch flex shrink-0 cursor-pointer items-center justify-center gap-[4px] rounded-lg border border-solid border-[#dae1ed] bg-white px-[12px] py-[6px] text-left font-inherit ${promptPillHoverClass}`}
              data-name="Suggestions"
              onClick={() => onPick(label)}
            >
              <GenAiSparkleBrandIcon />
              <span className="font-['Source_Sans_3',sans-serif] text-[14px] font-normal leading-[20px] text-[#0f1114] whitespace-nowrap">
                {label}
              </span>
            </button>
          ))}
        </div>
      </div>
      <div className="flex w-full min-w-0 flex-col gap-3 overflow-visible" data-name="Recs">
        <p className="whitespace-nowrap font-['Source_Sans_3',sans-serif] text-[16px] font-semibold leading-[20px] tracking-[-0.048px] text-[#0f1114]">
          Start with these learner favorites
        </p>
        <div
          className="-m-6 flex w-[min(1056px,calc(100vw-3rem))] min-w-[min(1056px,calc(100vw-3rem))] shrink-0 gap-2 overflow-x-auto overscroll-x-contain p-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          data-name="Cards"
        >
          {LEARNER_FAVORITE_CARDS.map((card) => (
            <button
              key={card.title}
              type="button"
              className={`flex w-[246px] shrink-0 flex-col gap-2 rounded-2xl border border-solid border-[#dae1ed] bg-white p-2 text-left font-inherit ${learnerFavoriteCardHoverClass}`}
              data-name="Card"
              onClick={() => onPick(card.title)}
            >
              <div className="relative h-[131px] w-full overflow-hidden rounded-lg">
                <img alt="" className="size-full object-cover" src={card.image} />
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-1">
                  <PartnerLogoAvatar src={googleLogo} />
                  <span className="font-['Source_Sans_3',sans-serif] text-[14px] font-normal leading-[20px] text-[#5b6780]">
                    {card.partner}
                  </span>
                </div>
                <p className="font-['Source_Sans_3',sans-serif] text-[16px] font-semibold leading-[20px] tracking-[-0.048px] text-[#0f1114]">
                  {card.title}
                </p>
                <p className="font-['Source_Sans_3',sans-serif] text-[12px] font-normal leading-[20px] text-[#5b6780]">{card.meta}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function TypingAutocompletePanel({ query, onPick }: { query: string; onPick: (q: string) => void }) {
  const { data } = useCourseraTypingAutocomplete(query);
  const q = query.trim();
  if (!data || !q) return null;

  const { topCourse, topCourseImage, aiRows, searchRows } = data;

  return (
    <div className="flex w-full flex-col gap-[18px]" data-name="Typing dropdown">
      <button
        type="button"
        className={`flex w-full cursor-pointer items-center gap-[6px] rounded-lg text-left font-inherit ${autocompleteRowHoverClass}`}
        onClick={() => onPick(topCourse.title)}
      >
        <div className="size-[34px] shrink-0 overflow-hidden rounded">
          <img alt="" className="size-full object-cover" src={topCourseImage} />
        </div>
        <div className="flex min-w-0 flex-col leading-[20px]">
          <span className="font-['Source_Sans_3',sans-serif] text-[16px] font-semibold tracking-[-0.048px] text-[#0f1114]">
            {topCourse.title}
          </span>
          <span className="font-['Source_Sans_3',sans-serif] text-[14px] font-normal text-[#5b6780]">
            {topCourse.partner} • {topCourse.productType}
          </span>
        </div>
      </button>
      <div className="h-px w-full bg-[#dae1ed]" aria-hidden />
      <div className="flex flex-col gap-3">
        {aiRows.map((row, i) => (
          <button
            key={`ai-${i}`}
            type="button"
            className={`flex w-full cursor-pointer items-start gap-[7px] px-[3px] py-1 text-left font-inherit ${autocompleteRowHoverClass}`}
            onClick={() => onPick(row.submit)}
          >
            <span className="mt-0.5 shrink-0">
              <GenAiSparkleBrandIcon sizeClass="size-[14px]" />
            </span>
            <span className="font-['Source_Sans_3',sans-serif] text-[16px] font-normal leading-[20px] tracking-[-0.048px] text-[#0f1114]">
              {row.type === "parts" ? (
                <>
                  {row.prefix}
                  <span className="font-semibold">{row.bold}</span>
                  {row.suffix}
                </>
              ) : (
                row.text
              )}
            </span>
          </button>
        ))}
        {searchRows.map((row, i) => (
          <button
            key={`search-${i}`}
            type="button"
            className={`flex min-h-[28px] w-full cursor-pointer items-center gap-1 px-[3px] text-left font-inherit ${autocompleteRowHoverClass}`}
            onClick={() => onPick(row.submit)}
          >
            <NavigationSearchIcon />
            <span className="font-['Source_Sans_3',sans-serif] text-[16px] font-semibold leading-[20px] tracking-[-0.048px] text-[#0f1114]">
              {row.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
