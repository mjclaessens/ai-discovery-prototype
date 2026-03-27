import { type FormEvent, type ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { Search } from "lucide-react";
import actionsClose from "../../assets/actions-close.svg";
import sparkleSvg from "../../assets/sparkle.svg";
import svgPaths from "../svg/svg-gmzksqch85";
import { IdleAutocompletePanel, TypingAutocompletePanel } from "@/components/search/SearchAutocompletePanels";
import { ROUTES } from "@/routes";

const SERP_HEADER_AUTOCOMPLETE_LISTBOX_ID = "serp-header-autocomplete-dropdown";

/** Figma AI-native header — `_genAI_sparkle_brand_test` single asset when AI panel is open (node 2104:63356). MCP URL; refresh from Figma if expired. */
const IMG_HEADER_GEN_AI_SPARKLE_OPEN =
  "https://www.figma.com/api/mcp/asset/88cf2fb1-1898-498b-8c92-f8bdb87a4ae0";

/** AI-native Discovery Vision — Header (Figma node 1815:53299 / 1625:33523): logo + Explore + Degrees | Log In + Join for free */
function LogoAppSwitcher() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Logo + App Switcher">
      <Link
        to={ROUTES.home}
        className="relative block h-[20px] w-[141.474px] shrink-0 rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0056d2]"
        data-name="Coursera logo"
        aria-label="Coursera home"
      >
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 141.474 20">
          <path
            d={svgPaths.p3a3cdf00}
            fill="var(--cds-color-interactive-primary, #0056d2)"
            id="Coursera logo"
          />
        </svg>
      </Link>
    </div>
  );
}

function ExploreButton() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Explore Button">
      <div className="flex flex-col font-['Source_Sans_3',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-[color:var(--cds-color-neutral-primary-weak,#5b6780)] text-center whitespace-nowrap">
        <p className="leading-[20px]">Explore</p>
      </div>
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="direction/ChevronDown">
        <div className="absolute inset-[36.46%_26.46%_36.25%_26.51%]" data-name="Vector">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7.52535 4.36667">
            <path d={svgPaths.p309a7b80} fill="var(--fill-0, #5B6780)" id="Vector" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function DegreesButton() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0" data-name="Degrees Button">
      <div className="flex flex-col font-['Source_Sans_3',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-[color:var(--cds-color-neutral-primary-weak,#5b6780)] text-center whitespace-nowrap">
        <p className="leading-[20px]">Degrees</p>
      </div>
    </div>
  );
}

function Nav() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-name="Nav">
      <ExploreButton />
      <DegreesButton />
    </div>
  );
}

function Left({ children, className = "" }: { children?: ReactNode; className?: string }) {
  return (
    <div
      className={`content-stretch flex flex-wrap gap-x-[24px] gap-y-3 items-center relative min-w-0 max-w-full ${className}`.trim()}
      data-name="Left"
    >
      <LogoAppSwitcher />
      <Nav />
      {children}
    </div>
  );
}

/** AI panel closed: 24px sparkle asset (`src/assets/sparkle.svg`). */
function HeaderGenAiSparkleClosed() {
  return (
    <div className="relative shrink-0 size-6" data-name="_genAI_sparkle_brand_test" aria-hidden>
      <img alt="" className="absolute inset-0 size-full max-w-none object-contain" src={sparkleSvg} />
    </div>
  );
}

function HeaderGenAiSparkleOpen() {
  return (
    <div className="relative shrink-0 size-6 overflow-hidden" data-name="_genAI_sparkle_brand_test" aria-hidden>
      <img alt="" className="absolute inset-[-0.67%_0_0_0] size-full max-w-none object-contain" src={IMG_HEADER_GEN_AI_SPARKLE_OPEN} />
    </div>
  );
}

function SerpHeaderSearch({
  query,
  onQueryChange,
  onSubmit,
  onAutocompletePick,
}: {
  query: string;
  onQueryChange: (q: string) => void;
  onSubmit: () => void;
  onAutocompletePick: (q: string) => void;
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit();
  };

  const pickFromDropdown = useCallback(
    (q: string) => {
      setDropdownOpen(false);
      onAutocompletePick(q);
    },
    [onAutocompletePick],
  );

  useEffect(() => {
    if (!dropdownOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      const root = containerRef.current;
      if (root && !root.contains(e.target as Node)) setDropdownOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown, true);
    return () => document.removeEventListener("pointerdown", onPointerDown, true);
  }, [dropdownOpen]);

  return (
    <div ref={containerRef} className="relative w-full min-w-0 flex-1" data-name="Search Input container">
      <form
        onSubmit={handleSubmit}
        className="flex w-full min-w-0 items-center justify-between gap-2 overflow-hidden rounded-[24px] border border-solid border-[#dae1ed] bg-white py-1 pl-4 pr-1"
        data-name="Search Input"
        role="search"
      >
        <input
          type="text"
          inputMode="search"
          role="searchbox"
          name="learn-query"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onFocus={() => setDropdownOpen(true)}
          placeholder="I want to learn..."
          aria-label="I want to learn"
          aria-expanded={dropdownOpen}
          aria-controls={dropdownOpen ? SERP_HEADER_AUTOCOMPLETE_LISTBOX_ID : undefined}
          autoComplete="off"
          className="min-w-0 flex-1 border-0 bg-transparent font-['Source_Sans_3',sans-serif] text-[14px] leading-[24px] text-[#0f1114] outline-none placeholder:text-[#5b6780]"
        />
        {query.length > 0 ? (
          <button
            type="button"
            onClick={() => onQueryChange("")}
            className="flex shrink-0 cursor-pointer items-center justify-center rounded-lg border-0 bg-transparent p-1 text-[#5b6780] transition-colors hover:bg-[#f2f5fa] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0056d2]"
            aria-label="Clear search"
            data-name="Search clear"
          >
            <img alt="" className="size-5 shrink-0 object-contain" src={actionsClose} aria-hidden />
          </button>
        ) : null}
        <button
          type="submit"
          className="flex shrink-0 items-center justify-center rounded-[999px] bg-[#0056d2] p-2 text-white transition-colors hover:bg-[#0048b0] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0056d2]"
          aria-label="Search"
          data-name="IconButton"
        >
          <Search className="size-5 shrink-0" strokeWidth={2} aria-hidden />
        </button>
      </form>
      {dropdownOpen ? (
        <div
          id={SERP_HEADER_AUTOCOMPLETE_LISTBOX_ID}
          className="absolute left-0 top-full z-50 mt-2 w-full min-w-0 max-w-[min(1056px,100vw-2rem)] rounded-[24px] border border-[#e8edf4] bg-white p-6 shadow-xl"
          data-name="SERP header autocomplete"
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
  );
}

function Right({ children }: { children?: ReactNode }) {
  return (
    <div className="content-stretch flex gap-[20px] items-center justify-end relative shrink-0" data-name="Right">
      {children}
      <div className="flex flex-col font-['Source_Sans_3',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-[color:var(--cds-color-interactive-primary,#0056d2)] text-center whitespace-nowrap">
        <p className="leading-[20px]">Log In</p>
      </div>
      <div
        className="bg-[var(--cds-color-neutral-primary-invert,white)] border border-[var(--cds-color-interactive-primary,#0056d2)] border-solid content-stretch flex items-center justify-center px-[24px] py-[12px] relative rounded-[4px] shrink-0"
        data-name="Button"
      >
        <div className="flex flex-col font-['Source_Sans_3',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-[color:var(--cds-color-interactive-primary,#0056d2)] text-center tracking-[-0.1px] whitespace-nowrap">
          <p className="leading-[24px]">Join for free</p>
        </div>
      </div>
    </div>
  );
}

/** Search + sparkle chrome for SERP (Figma 2104:63294 closed / 2104:63356 open). Omit on logged-out home. */
export type AppSerpHeaderChrome = {
  query: string;
  onQueryChange: (q: string) => void;
  onSearchSubmit: () => void;
  /** Apply chosen suggestion and update URL in one step (avoids stale draft when submitting). */
  onAutocompletePick: (q: string) => void;
  aiPanelOpen: boolean;
  onAiSparkleClick: () => void;
};

export type AppPageHeaderProps = {
  /** Bottom border on the bar (Figma default). Set false to remove (e.g. embedded chrome). */
  borderBottom?: boolean;
  className?: string;
  serp?: AppSerpHeaderChrome;
};

export default function AppPageHeader({ borderBottom = true, className = "", serp }: AppPageHeaderProps) {
  const barBorder = borderBottom ? "border-b border-[var(--cds-color-neutral-stroke-primary-weak,#dae1ed)] border-solid" : "";
  return (
    <div
      className={`relative shrink-0 w-full bg-[var(--cds-color-neutral-background-primary,white)] ${className}`.trim()}
      data-name="Header"
    >
      <div className="flex flex-row items-center size-full">
        <div
          className={`content-stretch flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-4 py-2.5 sm:px-[46px] sm:py-[10px] relative w-full bg-[var(--cds-color-neutral-background-primary,white)] ${serp ? "sm:gap-8" : ""} ${barBorder}`.trim()}
        >
          <Left className={serp ? "min-w-0 flex-1" : "shrink-0"}>
            {serp ? (
              <SerpHeaderSearch
                query={serp.query}
                onQueryChange={serp.onQueryChange}
                onSubmit={serp.onSearchSubmit}
                onAutocompletePick={serp.onAutocompletePick}
              />
            ) : null}
          </Left>
          <Right>
            {serp ? (
              <button
                type="button"
                onClick={serp.onAiSparkleClick}
                aria-pressed={serp.aiPanelOpen}
                aria-label="AI assistant"
                className="flex cursor-pointer items-center justify-center rounded-lg border-0 bg-transparent p-0.5 text-[inherit] transition-colors hover:bg-[#f2f5fa] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0056d2]"
                data-name="Header AI sparkle"
              >
                {serp.aiPanelOpen ? <HeaderGenAiSparkleOpen /> : <HeaderGenAiSparkleClosed />}
              </button>
            ) : null}
          </Right>
        </div>
      </div>
    </div>
  );
}
