import svgPaths from "@/components/svg/svg-gmzksqch85";
import actionsAdd from "@/assets/actions-add.svg";
import actionsAudio from "@/assets/actions-audio.svg";
import aiBg from "@/assets/ai-bg.svg";
import { type FormEvent, forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import {
  GenAiSparkleBrandIcon,
  IdleAutocompletePanel,
  LOHP_PROMPT_SUGGESTIONS,
  promptPillHoverClass,
  TypingAutocompletePanel,
} from "@/components/search/SearchAutocompletePanels";
import { ROUTES } from "@/routes";

/** Figma LOHP hero texture + GenAI sparkle assets (MCP URLs; refresh from Figma if expired) */
const LOHP_INPUT_BG_TEXTURE =
  "https://www.figma.com/api/mcp/asset/a44c30b5-2a4e-4057-9104-7847be1659a9";

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
