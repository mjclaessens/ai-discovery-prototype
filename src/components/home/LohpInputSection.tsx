import svgPaths from "@/components/svg/svg-gmzksqch85";
import actionsAdd from "@/assets/actions-add.svg";
import actionsAudio from "@/assets/actions-audio.svg";
import aiBg from "@/assets/ai-bg.svg";
import hero1 from "@/assets/hero1.png";
import hero2 from "@/assets/hero2.png";
import googleLogo from "@/assets/google-logo.png";
import spotlight11 from "@/assets/spotlight1-1.png";
import spotlight12 from "@/assets/spotlight1-2.png";
import { type FormEvent, forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useCourseraTypingAutocomplete } from "@/hooks/useCourseraTypingAutocomplete";
import { ROUTES } from "@/routes";

/** Figma LOHP hero texture + GenAI sparkle assets (MCP URLs; refresh from Figma if expired) */
const LOHP_INPUT_BG_TEXTURE =
  "https://www.figma.com/api/mcp/asset/a44c30b5-2a4e-4057-9104-7847be1659a9";
const IMG_GEN_AI_SPARKLE_L =
  "https://www.figma.com/api/mcp/asset/98b22db9-d94a-4929-8f13-3a3f4fc86762";
const IMG_GEN_AI_SPARKLE_S =
  "https://www.figma.com/api/mcp/asset/1bb6409e-be5b-4c21-a011-970c56624c09";

const promptPillHoverClass =
  "transition-colors duration-150 hover:bg-[#f5f8ff] hover:border-[#c5d2ea]";

const learnerFavoriteCardHoverClass =
  "transition-shadow duration-150 hover:shadow-[0_0_24px_rgba(15,17,20,0.12)]";

const autocompleteRowHoverClass =
  "rounded-lg transition-colors duration-150 hover:bg-[#f5f8ff]";

const ChatComposerTextField = forwardRef<
  HTMLInputElement,
  { value: string; onChange: (next: string) => void; onFocus?: () => void; ariaExpanded?: boolean }
>(function ChatComposerTextField({ value, onChange, onFocus, ariaExpanded }, ref) {
  return (
    <div className="flex w-full items-center px-1 py-0" data-name="Text Body">
      <input
        ref={ref}
        type="text"
        role="searchbox"
        inputMode="search"
        name="learn-query"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        placeholder="I want to learn..."
        aria-label="I want to learn"
        aria-expanded={ariaExpanded ?? false}
        aria-controls={ariaExpanded ? "lohp-autocomplete-dropdown" : undefined}
        autoComplete="off"
        className="h-[32px] w-full min-w-0 flex-1 align-top border-0 bg-transparent p-0 font-['Source_Sans_3',sans-serif] text-[16px] leading-[24px] text-[#0f1114] outline-none placeholder:text-[#5b6780]"
      />
    </div>
  );
});

function ToolbarAdd() {
  return (
    <button
      type="button"
      aria-label="Add"
      className="flex shrink-0 cursor-pointer items-center justify-center rounded-lg border-0 bg-transparent p-2 transition-colors duration-150 hover:bg-[#f2f5fa]"
      data-name="IconButton"
    >
      <div className="relative flex size-5 items-center justify-center" data-name="actions/Add">
        <img alt="" src={actionsAdd} className="size-[14px] object-contain" aria-hidden />
      </div>
    </button>
  );
}

function SearchButton({ disabled }: { disabled: boolean }) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className={`flex shrink-0 items-center justify-center rounded-lg border-0 p-2 transition-colors duration-150 ${
        disabled ? "cursor-not-allowed bg-[#c1cad9]" : "cursor-pointer bg-[#0056d2] hover:bg-[#0048b0]"
      }`}
      data-name="IconButton"
      aria-label={disabled ? "Search (enter a query)" : "Search"}
    >
      <div className="relative size-5 -rotate-90" data-name="direction/ArrowUp">
        <div className="absolute inset-[21.46%_21.56%_21.51%_20%]">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.6875 11.4067">
            <path d={svgPaths.p205bab00} fill="var(--fill-0, #FFFFFF)" />
          </svg>
        </div>
      </div>
    </button>
  );
}

function ChatSend({ canSubmit }: { canSubmit: boolean }) {
  return (
    <div className="flex shrink-0 items-center gap-1" data-name="Submit">
      <button
        type="button"
        aria-label="Voice input"
        className="flex shrink-0 cursor-pointer items-center justify-center rounded-lg border-0 bg-transparent p-2 transition-colors duration-150 hover:bg-[#f2f5fa]"
        data-name="IconButton"
      >
        <div className="relative size-5 overflow-clip" data-name="media/Microphone">
          <img alt="" src={actionsAudio} className="size-full object-contain" aria-hidden />
        </div>
      </button>
      <SearchButton disabled={!canSubmit} />
    </div>
  );
}

function InputActions({ canSubmit }: { canSubmit: boolean }) {
  return (
    <div className="flex w-full items-end justify-between" data-name="Action container">
      <div className="flex items-center" data-name="Toolbar">
        <ToolbarAdd />
      </div>
      <ChatSend canSubmit={canSubmit} />
    </div>
  );
}

const LOHP_PROMPT_SUGGESTIONS = [
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
function GenAiSparkleBrandIcon({ sizeClass = "size-[11px]" }: { sizeClass?: string }) {
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

function Prompts({ onSelect }: { onSelect: (label: string) => void }) {
  return (
    <div
      className="content-stretch relative flex w-full max-w-full shrink-0 flex-wrap content-center items-center justify-center gap-[6px]"
      data-name="Prompts"
    >
      {LOHP_PROMPT_SUGGESTIONS.map((label) => (
        <PromptSuggestionChip key={label} label={label} onSelect={onSelect} />
      ))}
    </div>
  );
}

function PromptSuggestionChip({ label, onSelect }: { label: string; onSelect: (label: string) => void }) {
  return (
    <button
      type="button"
      className={`content-stretch flex shrink-0 cursor-pointer items-center justify-center gap-[4px] rounded-lg border border-solid border-[#dae1ed] bg-[var(--cds-color-neutral-background-primary,white)] px-[12px] py-[6px] text-left font-inherit ${promptPillHoverClass}`}
      data-name="Suggestions"
      onClick={() => onSelect(label)}
    >
      <GenAiSparkleBrandIcon />
      <span className="font-['Source_Sans_3',sans-serif] text-[14px] font-normal leading-[20px] text-[#0f1114] whitespace-nowrap">
        {label}
      </span>
    </button>
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

function IdleAutocompletePanel({ onPick }: { onPick: (q: string) => void }) {
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

function TypingAutocompletePanel({ query, onPick }: { query: string; onPick: (q: string) => void }) {
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

/** Hero search composer, autocomplete, and prompt chips — top of the logged-out homepage. */
export function LohpInputSection() {
  const [query, setQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const composerContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const goSearch = useCallback(
    (q: string) => {
      const trimmed = q.trim();
      if (!trimmed) return;
      navigate({ pathname: ROUTES.search, search: `?q=${encodeURIComponent(trimmed)}` });
    },
    [navigate],
  );

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    goSearch(query);
  };

  const pickFromDropdown = useCallback(
    (q: string) => {
      setDropdownOpen(false);
      goSearch(q);
    },
    [goSearch],
  );

  useEffect(() => {
    if (!dropdownOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      const root = composerContainerRef.current;
      if (root && !root.contains(e.target as Node)) setDropdownOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown, true);
    return () => document.removeEventListener("pointerdown", onPointerDown, true);
  }, [dropdownOpen]);

  return (
    <div className="content-stretch relative flex w-full shrink-0 flex-col items-center gap-4 pb-2 pt-10" data-name="Input and Prompts">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {/* Blue / purple wash (Figma “Blue Purple Gradient”) */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgb(255, 255, 255) 0%, rgba(53, 135, 252, 0.1) 33.173%, rgba(164, 154, 255, 0.05) 66.827%, rgb(255, 255, 255) 100%)",
          }}
        />
        {/* Soft vertical glow so the center reads lighter / more airy */}
        <div
          className="absolute inset-0 opacity-90"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 85% 70% at 50% -5%, rgba(53, 135, 252, 0.08) 0%, transparent 52%), radial-gradient(ellipse 60% 45% at 50% 100%, rgba(164, 154, 255, 0.06) 0%, transparent 50%)",
          }}
        />
        {/* Texture from Figma frame; local SVG fallback if remote asset fails */}
        <img
          alt=""
          className="absolute inset-0 size-full max-w-none object-cover"
          src={LOHP_INPUT_BG_TEXTURE}
          onError={(e) => {
            const el = e.currentTarget;
            if (!el.dataset.fallbackApplied) {
              el.dataset.fallbackApplied = "true";
              el.src = aiBg;
            }
          }}
        />
      </div>
      <p className="relative min-w-full w-[min-content] shrink-0 whitespace-pre-wrap text-center font-['Source_Sans_3',sans-serif] text-[24px] font-semibold leading-[28px] tracking-[-0.12px] text-[#0f1114]">
        {`Build your path to in-demand `}
        <br aria-hidden="true" />
        skills and careers
      </p>
      <div className="relative flex w-full min-w-0 max-w-[1110px] flex-col items-center gap-6 px-4 sm:px-0">
        <div ref={composerContainerRef} className="relative w-full min-w-0 max-w-[746px]">
          <div
            className="flex flex-col gap-1 rounded-lg border border-transparent p-2"
            style={{
              backgroundImage:
                "linear-gradient(#ffffff, #ffffff), linear-gradient(to bottom right, #3587FC, #5547EA)",
              backgroundOrigin: "border-box",
              backgroundClip: "padding-box, border-box",
            }}
            data-name="ChatMessageComposer"
          >
            <form className="flex w-full flex-col gap-1" onSubmit={onSubmit} data-name="LOHP Chat Input">
              <ChatComposerTextField
                value={query}
                onChange={setQuery}
                onFocus={() => setDropdownOpen(true)}
                ariaExpanded={dropdownOpen}
              />
              <InputActions canSubmit={query.trim().length > 0} />
            </form>
          </div>
          {dropdownOpen ? (
            <div
              id="lohp-autocomplete-dropdown"
              className="absolute left-1/2 top-full z-50 mt-2 w-[min(1056px,calc(100vw-3rem))] min-w-0 -translate-x-1/2 rounded-[24px] border border-[#e8edf4] bg-white p-6 shadow-xl"
              data-name="LOHP Autocomplete"
              aria-label="Search suggestions"
            >
              {query.trim().length > 0 ? (
                <TypingAutocompletePanel query={query} onPick={pickFromDropdown} />
              ) : (
                <IdleAutocompletePanel onPick={pickFromDropdown} />
              )}
            </div>
          ) : null}
        </div>
        <Prompts onSelect={goSearch} />
      </div>
    </div>
  );
}
