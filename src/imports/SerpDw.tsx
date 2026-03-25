import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import { useNavigate, useSearchParams } from "react-router";
import adobeLogo from "../assets/adobe.png";
import courseraLogo from "../assets/coursera.png";
import deeplearningLogo from "../assets/deeplearning.png";
import googleLogo from "../assets/google.png";
import ibmLogo from "../assets/ibm.png";
import simplilearnLogo from "../assets/simplilearn.png";
import skillupLogo from "../assets/skillup.png";
import starweaverLogo from "../assets/starweaver.png";
import loadingIcon from "../assets/loading.svg";
import serp1 from "../assets/serp1.png";
import serp2 from "../assets/serp2.png";
import serp2_1 from "../assets/serp2-1.png";
import serp2_2 from "../assets/serp2-2.png";
import serp2_3 from "../assets/serp2-3.png";
import serp2_4 from "../assets/serp2-4.png";
import serp2_5 from "../assets/serp2-5.png";
import serp2_6 from "../assets/serp2-6.png";
import serp3 from "../assets/serp3.png";
import serp4 from "../assets/serp4.png";
import serp5 from "../assets/serp5.png";
import serp6 from "../assets/serp6.png";
import serp7 from "../assets/serp7.png";
import serp8 from "../assets/serp8.png";
import serp9 from "../assets/serp9.png";
import actionsAdd from "../assets/actions-add.svg";
import actionsAudio from "../assets/actions-audio.svg";
import actionsClose from "../assets/actions-close.svg";
import actionsCopy from "../assets/actions-copy.svg";
import actionsMore from "../assets/actions-more.svg";
import actionsReload from "../assets/actions-reload.svg";
import actionsSettings from "../assets/actions-settings.svg";
import actionsThumbsDown from "../assets/actions-thumbsdown.svg";
import actionsThumbsUp from "../assets/actions-thumbsup.svg";
import reloadIcon from "../assets/reload.svg";
import sparkleIcon from "../assets/sparkle.svg";
import { RoleIcon } from "../roleIcons";
import svgPaths from "./svg-blndo5mrzw";
import AppPageHeader from "./AppPageHeader";
import MetaNav from "./MetaNav";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../app/components/ui/dropdown-menu";
import { MoreVertical, Trash2 } from "lucide-react";

/** Figma ProductCard -2 (node 2104:20461): padded shell with clip + 14.25px radius. */
function SerpProductCardShell({ children }: { children: ReactNode }) {
  return (
    <div
      className="bg-white flex h-full min-h-0 flex-col items-start overflow-clip p-[7.125px] relative rounded-[14.25px] w-full"
      data-name="ProductCard -2"
    >
      {children}
    </div>
  );
}

/** Hover + selected ring; checkbox on image — shared by default SERP grid and PM cards. */
type SerpCardSelection = {
  selected: boolean;
  onToggle: () => void;
  title: string;
  /** When true, the card cannot be newly selected (e.g. max selections reached). */
  disabled?: boolean;
};

const MAX_SELECTED_COURSES = 3;

/** Figma 2109:70580 / 2109:73028 — circular control, top-right; visible on card hover, when selected, or focus. */
function SerpCardSelectCheckbox({
  selected,
  onToggle,
  title,
  disabled = false,
}: {
  selected: boolean;
  onToggle: () => void;
  title: string;
  disabled?: boolean;
}) {
  const inactive = Boolean(disabled && !selected);
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={selected}
      aria-disabled={inactive}
      aria-label={inactive ? `Cannot select ${title} — maximum of ${MAX_SELECTED_COURSES} courses` : `Select ${title}`}
      data-selected={selected ? "true" : "false"}
      data-disabled={inactive ? "true" : "false"}
      onClick={(e) => {
        e.stopPropagation();
        if (inactive) return;
        onToggle();
      }}
      className={`absolute right-3 top-3 z-[4] box-border flex size-6 items-center justify-center rounded-full border-[1.5px] border-solid transition-[opacity,background-color,box-shadow] duration-200 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0056d2] ${
        inactive
          ? "border-[#dae1ed] bg-[#f2f5fa] opacity-0 shadow-none pointer-events-none group-hover:opacity-100"
          : `cursor-pointer border-white opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto data-[selected=true]:opacity-100 data-[selected=true]:pointer-events-auto focus-visible:opacity-100 focus-visible:pointer-events-auto ${
              selected
                ? "bg-[#0056d2] text-white shadow-[0_1px_4px_rgba(0,86,210,0.45)]"
                : "bg-white/50 shadow-[0_1px_4px_rgba(15,17,20,0.15)]"
            }`
      }`}
      data-name="Card select"
    >
      {selected ? (
        <svg className="size-[11px] shrink-0" viewBox="0 0 12 12" fill="none" aria-hidden>
          <path
            d="M2 6l3 3 5-6"
            stroke="currentColor"
            strokeWidth="1.85"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : null}
    </button>
  );
}

function SerpCardInteractiveWrap({
  children,
  selected,
  interactive,
  outerRadiusClass,
  selectionDisabled = false,
}: {
  children: ReactNode;
  selected: boolean;
  interactive: boolean;
  outerRadiusClass: string;
  selectionDisabled?: boolean;
}) {
  if (!interactive) return <>{children}</>;
  const limitBlockUnselected = Boolean(selectionDisabled && !selected);
  return (
    <div
      className={`group relative flex h-full min-h-0 w-full min-w-0 flex-col ${outerRadiusClass} ${
        selected
          ? "shadow-[0_6px_24px_rgba(0,86,210,0.16)] ring-2 ring-[#0056d2] ring-offset-0 transition-[box-shadow,ring] duration-200 ease-out"
          : "ring-1 ring-transparent shadow-none transition-[box-shadow,ring] duration-200 ease-out hover:shadow-[0_10px_32px_rgba(54,64,81,0.12)] hover:ring-[#dae1ed]"
      } ${limitBlockUnselected ? "hover:cursor-not-allowed" : ""}`}
      data-selected={selected}
    >
      {children}
    </div>
  );
}

function SerpCardImageSlot({
  children,
  selection,
}: {
  children: ReactNode;
  selection?: SerpCardSelection | null;
}) {
  return (
    <div className="aspect-[304/171] content-stretch flex shrink-0 flex-col isolate items-start overflow-clip relative rounded-[14px] w-full" data-name="image">
      {selection ? (
        <div
          className="pointer-events-none absolute inset-0 z-[2] rounded-[14px] bg-black opacity-0 transition-opacity duration-200 ease-out group-hover:opacity-20"
          aria-hidden
          data-name="Image hover overlay"
        />
      ) : null}
      {selection ? (
        <SerpCardSelectCheckbox
          selected={selection.selected}
          onToggle={selection.onToggle}
          title={selection.title}
          disabled={selection.disabled}
        />
      ) : null}
      {children}
    </div>
  );
}

// Card thumbnails: serp1–9 match the SERP grid left-to-right, top-to-bottom (see ProductCard → Image*).
const imgScreenshot20260128At105736Am3 = serp1;
const imgImageWrapper = ibmLogo;
const imgScreenshot20260128At105736Am4 = serp2;
const imgImageWrapper1 = deeplearningLogo;
const imgScreenshot20260128At105736Am5 = serp3;
const imgImageWrapper2 = googleLogo;
const imgScreenshot20260128At105736Am6 = serp4;
const imgScreenshot20260128At105736Am7 = serp5;
const imgScreenshot20260128At105736Am8 = serp6;
const imgScreenshot20260128At105736Am9 = serp7;
const imgScreenshot20260128At105736Am10 = serp8;
const imgScreenshot20260128At105736Am11 = serp9;
const imgImageWrapper3 = adobeLogo;

function Frame() {
  return (
    <div className="h-[32px] relative shrink-0 w-[16px]" aria-hidden="true">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 32">
        <g id="Frame 1618873463">
          <line
            id="Line 5"
            stroke="var(--cds-color-neutral-stroke-primary-weak, #dae1ed)"
            x1="8.5"
            x2="8.5"
            y2="32"
          />
        </g>
      </svg>
    </div>
  );
}

/** Matches Figma Filter&Sort (node 1809:39236): pill controls + divider. */
function SerpFilterChevron({ className }: { className?: string }) {
  return (
    <div
      className={`overflow-clip relative shrink-0 size-[20px] transition-transform duration-150 ${className ?? ""}`}
      data-name="direction/ChevronDown"
      aria-hidden
    >
      <div className="absolute inset-[36.46%_26.46%_36.25%_26.51%]" data-name="Vector">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.40669 5.45833">
          <path d={svgPaths.p24623340} fill="var(--fill-0, #0F1114)" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

type SerpFilterOption = { id: string; label: string; count?: number };
type SerpFilterDef = { id: string; label: string; options: SerpFilterOption[] };

/** Realistic SERP filter options (Figma 1813:39611 Tools dropdown pattern). */
const SERP_FILTER_DEFS: SerpFilterDef[] = [
  {
    id: "topic",
    label: "Topic",
    options: [
      { id: "data-science", label: "Data Science", count: 1240 },
      { id: "business", label: "Business", count: 892 },
      { id: "computer-science", label: "Computer Science", count: 2104 },
      { id: "health", label: "Health", count: 415 },
      { id: "arts", label: "Arts & Humanities", count: 678 },
      { id: "personal-dev", label: "Personal Development", count: 533 },
    ],
  },
  {
    id: "duration",
    label: "Duration",
    options: [
      { id: "lt2", label: "Under 2 hours", count: 412 },
      { id: "2-10", label: "2–10 hours", count: 1566 },
      { id: "10-20", label: "10–20 hours", count: 890 },
      { id: "20p", label: "20+ hours", count: 723 },
    ],
  },
  {
    id: "learning-product",
    label: "Learning Product",
    options: [
      { id: "courses", label: "Courses", count: 4200 },
      { id: "guided", label: "Guided Projects", count: 380 },
      { id: "professional", label: "Professional Certificates", count: 290 },
      { id: "specs", label: "Specializations", count: 610 },
    ],
  },
  {
    id: "level",
    label: "Level",
    options: [
      { id: "beginner", label: "Beginner", count: 3102 },
      { id: "intermediate", label: "Intermediate", count: 1840 },
      { id: "advanced", label: "Advanced", count: 920 },
    ],
  },
  {
    id: "tools",
    label: "Tools",
    options: [
      { id: "chatgpt", label: "ChatGPT", count: 219 },
      { id: "claude", label: "Claude", count: 2183 },
      { id: "gemini", label: "Gemini", count: 548 },
      { id: "perplexity", label: "Perplexity AI", count: 212 },
      { id: "copilot", label: "Microsoft Copilot", count: 176 },
      { id: "midjourney", label: "Midjourney", count: 94 },
    ],
  },
];

function getFilterPillLabel(def: SerpFilterDef, selectedIds: string[]): string {
  if (selectedIds.length === 0) return def.label;
  if (selectedIds.length > 3) {
    return `${def.label.toLowerCase()} (${selectedIds.length})`;
  }
  const labels = selectedIds
    .map((id) => def.options.find((o) => o.id === id)?.label)
    .filter(Boolean) as string[];
  return labels.join(", ");
}

function serpSelectionSame(committed: string[], pending: Set<string>): boolean {
  if (committed.length !== pending.size) return false;
  return committed.every((id) => pending.has(id));
}

function SerpFilterCheckboxRow({
  option,
  checked,
  onToggle,
}: {
  option: SerpFilterOption;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      className="flex w-full cursor-pointer items-start gap-[6px] rounded-[4px] py-[3px] text-left outline-none focus-visible:ring-2 focus-visible:ring-[#0056d2] focus-visible:ring-offset-1"
      onClick={onToggle}
    >
      <span className="mt-[3px] flex h-[15px] w-[15px] shrink-0 items-center justify-center">
        <span
          className={`box-border flex h-[13.5px] w-[13.5px] shrink-0 items-center justify-center rounded-[3px] border-[1.5px] border-solid ${
            checked
              ? "border-[#0056d2] bg-[#0056d2] text-white"
              : "border-[#8495b0] bg-white"
          }`}
        >
          {checked ? (
            <svg className="size-[9px]" viewBox="0 0 12 12" fill="none" aria-hidden>
              <path
                d="M2 6l3 3 5-6"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : null}
        </span>
      </span>
      <span className="flex min-w-0 flex-1 flex-wrap items-baseline gap-[3px] font-['Source_Sans_3',sans-serif]">
        <span className="text-[12px] leading-[18px] text-[#0f1114]">{option.label}</span>
        {option.count != null ? (
          <span className="text-[10.5px] leading-[15px] text-[#5b6780]">({option.count})</span>
        ) : null}
      </span>
    </button>
  );
}

function SerpFilterDropdownPanel({
  def,
  committedIds,
  pendingIds,
  onToggle,
  onView,
  onClearAll,
  dropdownRef,
}: {
  def: SerpFilterDef;
  committedIds: string[];
  pendingIds: Set<string>;
  onToggle: (id: string) => void;
  onView: () => void;
  onClearAll: () => void;
  dropdownRef: RefObject<HTMLDivElement | null>;
}) {
  const hasPending = pendingIds.size > 0;
  const canApply = !serpSelectionSame(committedIds, pendingIds);
  return (
    <div
      ref={dropdownRef}
      className="w-[270px] overflow-hidden rounded-[12px] border border-[#e8edf4] bg-white shadow-[0px_0px_3px_0px_#e8eef7,0px_3px_9px_3px_rgba(54,64,81,0.08)]"
      data-name="🏗 Popover"
      role="dialog"
      aria-label={`${def.label} filter`}
    >
      <div className="max-h-[min(280px,45vh)] overflow-y-auto p-3">
        <div className="flex flex-col gap-[3px]" data-name="CheckboxGroup">
          {def.options.map((opt) => (
            <SerpFilterCheckboxRow
              key={opt.id}
              option={opt}
              checked={pendingIds.has(opt.id)}
              onToggle={() => onToggle(opt.id)}
            />
          ))}
        </div>
      </div>
      <div
        className="border-t border-[#dae1ed] p-3"
        data-name="Footer"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            disabled={!canApply}
            onClick={onView}
            className={`rounded-[6px] px-3 py-[6px] font-['Source_Sans_3',sans-serif] text-[10.5px] font-semibold leading-[15px] tracking-[0.105px] text-white transition-colors ${
              canApply ? "cursor-pointer bg-[#0056d2] hover:bg-[#004cbd]" : "cursor-not-allowed bg-[#c1cad9]"
            }`}
          >
            View
          </button>
          <button
            type="button"
            disabled={!hasPending}
            onClick={onClearAll}
            className={`rounded-[4px] p-[6px] font-['Source_Sans_3',sans-serif] text-[10.5px] font-semibold leading-[15px] tracking-[0.105px] transition-colors ${
              hasPending
                ? "cursor-pointer text-[#0f1114] hover:bg-[#f2f5fa]"
                : "cursor-not-allowed text-[#c1cad9]"
            }`}
          >
            Clear all
          </button>
        </div>
      </div>
    </div>
  );
}

function SerpDropdownFilter({
  def,
  selectedIds,
  open,
  onOpen,
  onDismiss,
  onCommit,
  pendingIds,
  onPendingToggle,
  onPendingClearAll,
}: {
  def: SerpFilterDef;
  selectedIds: string[];
  open: boolean;
  onOpen: () => void;
  onDismiss: () => void;
  onCommit: (ids: string[]) => void;
  pendingIds: Set<string>;
  onPendingToggle: (id: string) => void;
  onPendingClearAll: () => void;
}) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });

  const pillText = useMemo(() => getFilterPillLabel(def, selectedIds), [def, selectedIds]);
  const isActive = open || selectedIds.length > 0;

  useLayoutEffect(() => {
    if (!open || !triggerRef.current) return;
    const update = () => {
      const r = triggerRef.current!.getBoundingClientRect();
      const menuWidth = 270;
      const left = Math.min(Math.max(8, r.left), window.innerWidth - menuWidth - 8);
      setMenuPos({ top: r.bottom + 8, left });
    };
    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      const t = e.target as Node;
      if (triggerRef.current?.contains(t)) return;
      if (dropdownRef.current?.contains(t)) return;
      onDismiss();
    };
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") onDismiss();
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onDismiss]);

  const handleView = useCallback(() => {
    onCommit([...pendingIds]);
  }, [onCommit, pendingIds]);

  return (
    <div className="relative shrink-0" data-name="Individual filter wrap">
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-haspopup="dialog"
        data-name="Individual filter"
        className={`content-stretch flex h-[32px] max-w-[min(100vw-2rem,320px)] shrink-0 cursor-pointer items-center justify-center gap-[4px] rounded-[20px] border border-solid px-[16px] py-[8px] transition-colors ${
          isActive
            ? "border-[#dae1ed] bg-[#f2f5fa]"
            : "border-[#dae1ed] bg-[var(--cds-color-neutral-background-primary,white)]"
        }`}
        onClick={() => (open ? onDismiss() : onOpen())}
      >
        <div
          className={`min-w-0 font-['Source_Sans_3',sans-serif] font-semibold leading-[0] text-[color:var(--cds-color-interactive-secondary,#0f1114)] ${
            isActive ? "text-[14px] tracking-[0.14px]" : "text-[13px] tracking-[0.13px]"
          }`}
        >
          <p className={`truncate text-left ${isActive ? "leading-[20px]" : "leading-[18px]"}`}>{pillText}</p>
        </div>
        <SerpFilterChevron className={open ? "rotate-180" : ""} />
      </button>
      {open
        ? createPortal(
            <div
              className="fixed z-[100]"
              style={{ top: menuPos.top, left: menuPos.left }}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <SerpFilterDropdownPanel
                def={def}
                committedIds={selectedIds}
                pendingIds={pendingIds}
                onToggle={onPendingToggle}
                onView={handleView}
                onClearAll={onPendingClearAll}
                dropdownRef={dropdownRef}
              />
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}

function SerpFilterBar() {
  const [openFilterId, setOpenFilterId] = useState<string | null>(null);
  const [committed, setCommitted] = useState<Record<string, string[]>>(() =>
    Object.fromEntries(SERP_FILTER_DEFS.map((f) => [f.id, [] as string[]])),
  );
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());

  useLayoutEffect(() => {
    if (!openFilterId) {
      setPendingIds(new Set());
      return;
    }
    setPendingIds(new Set(committed[openFilterId] ?? []));
  }, [openFilterId, committed]);

  const dismiss = useCallback(() => {
    setOpenFilterId(null);
  }, []);

  const handleOpen = useCallback((id: string) => {
    setOpenFilterId((prev) => (prev === id ? null : id));
  }, []);

  return (
    <div
      className="content-stretch flex gap-[8px] items-start relative shrink-0 overflow-x-auto pb-1 w-full min-w-0"
      data-name="Filter&Sort"
    >
      <SerpFilterSortButton />
      <Frame />
      {SERP_FILTER_DEFS.map((def) => (
        <SerpDropdownFilter
          key={def.id}
          def={def}
          selectedIds={committed[def.id] ?? []}
          open={openFilterId === def.id}
          onOpen={() => handleOpen(def.id)}
          onDismiss={dismiss}
          onCommit={(ids) => {
            setCommitted((c) => ({ ...c, [def.id]: ids }));
            setOpenFilterId(null);
          }}
          pendingIds={openFilterId === def.id ? pendingIds : new Set()}
          onPendingToggle={(optId) => {
            setPendingIds((prev) => {
              const next = new Set(prev);
              if (next.has(optId)) next.delete(optId);
              else next.add(optId);
              return next;
            });
          }}
          onPendingClearAll={() => setPendingIds(new Set())}
        />
      ))}
    </div>
  );
}

function SerpFilterSortButton() {
  return (
    <div
      className="bg-[var(--cds-color-neutral-background-primary,white)] border-[0.889px] border-[var(--cds-color-neutral-stroke-primary-weak,#dae1ed)] border-solid content-stretch flex gap-[3px] h-[32px] items-center justify-center px-[14px] py-[7px] relative rounded-[18px] shrink-0"
      data-name="Filter&Sort button"
    >
      <div className="overflow-clip relative shrink-0 size-[17.778px]" data-name="navigation/Filter">
        <div className="absolute inset-[15%_12.5%]" data-name="Vector">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.3333 12.4444">
            <path d={svgPaths.p1e6f6500} fill="var(--fill-0, #0F1114)" id="Vector" />
          </svg>
        </div>
      </div>
      <div className="flex flex-col font-['Source_Sans_3',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[13px] text-[color:var(--cds-color-interactive-secondary,#0f1114)] text-center tracking-[0.13px] whitespace-nowrap">
        <p className="leading-[18px]">{`Filter & Sort`}</p>
      </div>
    </div>
  );
}

/** Figma SERP - DW - Loading (2107:64063): filter pill placeholders. */
function SerpFilterSkeletonBar({ className }: { className: string }) {
  return (
    <div
      className={`h-[15px] shrink-0 rounded-[4px] bg-[#e8eef7] animate-pulse ${className}`}
      aria-hidden
    />
  );
}

function SerpFilterBarSkeleton() {
  const chevronPills: { barClass: string; pillClass?: string }[] = [
    { barClass: "w-[47px]" },
    { barClass: "w-[56px]" },
    { barClass: "w-[75px]", pillClass: "w-[136px]" },
    { barClass: "w-[71px]" },
    { barClass: "w-[39px]", pillClass: "w-[93px]" },
  ];
  return (
    <div
      className="content-stretch flex min-h-[36px] min-w-0 w-full items-start gap-[8px] overflow-x-auto pb-1 relative shrink-0"
      data-name="Filter&Sort"
      aria-hidden
    >
      <div className="content-stretch flex shrink-0 items-center justify-center gap-[4px] rounded-[20px] bg-[#f2f5fa] px-[16px] py-[8px] relative">
        <div className="relative shrink-0 overflow-clip size-[20px]" data-name="navigation/Filter">
          <div className="absolute inset-[15%_12.5%]" data-name="Vector">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.3333 12.4444">
              <path d={svgPaths.p1e6f6500} fill="#5b6780" id="Vector" />
            </svg>
          </div>
        </div>
        <SerpFilterSkeletonBar className="w-[66px]" />
      </div>
      <Frame />
      {chevronPills.map((p, i) => (
        <div
          key={i}
          className={`content-stretch flex shrink-0 items-center justify-center gap-[4px] rounded-[20px] bg-[#f2f5fa] px-[16px] py-[8px] relative ${p.pillClass ?? ""}`}
        >
          <SerpFilterSkeletonBar className={p.barClass} />
          <div className="opacity-50">
            <SerpFilterChevron />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Figma 2107:64063: product card placeholder in results grid. */
function SerpProductCardSkeleton({ slowPulse = false }: { slowPulse?: boolean }) {
  const pulse = slowPulse ? "animate-[pulse_2.5s_ease-in-out_infinite]" : "animate-pulse";
  return (
    <div
      className="content-stretch flex h-full min-h-0 min-w-0 w-full flex-col items-start gap-[8px] self-stretch rounded-[16px] border border-solid border-[#dae1ed] p-[8px] relative"
      data-name="ProductCard"
    >
      <div
        className={`h-[124px] w-full shrink-0 rounded-[16px] bg-gradient-to-r from-[#f2f5fa] via-[#e8f1ff] via-[64.177%] to-[#f2f5fa] ${pulse}`}
        data-name="Thumbnail"
      />
      <div className="content-stretch flex w-full flex-col items-start gap-[36px] p-[8px] relative shrink-0" data-name="Body">
        <div className="content-stretch flex w-full flex-col items-start relative shrink-0">
          <div className={`h-[31px] w-full shrink-0 rounded-[4px] bg-[#e8ecf4] ${pulse}`} />
        </div>
        <div className="content-stretch flex w-full flex-col items-start gap-[8px] relative shrink-0">
          <div className={`h-[13px] w-full shrink-0 rounded-[4px] bg-[#e8ecf4] ${pulse}`} />
          <div className={`h-[13px] w-[148px] max-w-full shrink-0 rounded-[4px] bg-[#e8ecf4] ${pulse}`} />
          <div className={`h-[13px] w-[148px] max-w-full shrink-0 rounded-[4px] bg-[#e8ecf4] ${pulse}`} />
          <div className={`h-[13px] w-[168px] max-w-full shrink-0 rounded-[4px] bg-[#e8ecf4] ${pulse}`} />
        </div>
      </div>
    </div>
  );
}

/** Figma 2109:67074 — 3×3 card skeleton while recommendations refresh. */
function SerpResultsSkeleton({
  "aria-label": ariaLabel,
  slowPulse = false,
}: {
  "aria-label"?: string;
  /** Softer, slower pulse while PM-filtered results are refreshing (not initial SERP load). */
  slowPulse?: boolean;
}) {
  return (
    <div
      className="content-stretch flex w-full flex-col items-start gap-[16px] relative shrink-0"
      data-name="Results"
      aria-busy="true"
      aria-label={ariaLabel ?? "Loading search results"}
    >
      {[0, 1, 2].map((row) => (
        <div
          key={row}
          className="content-stretch flex w-full min-w-0 flex-col items-start relative shrink-0"
          data-name="Compact Collections"
        >
          <div
            className="grid w-full min-w-0 grid-cols-3 gap-[12px] items-stretch min-h-[307px] relative shrink-0"
            data-name="Collections"
          >
            {[0, 1, 2].map((c) => (
              <SerpProductCardSkeleton key={c} slowPulse={slowPulse} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function Image({ selection }: { selection?: SerpCardSelection | null }) {
  return (
    <SerpCardImageSlot selection={selection}>
      <div className="relative shrink-0 w-full aspect-[304/171] z-[1]" data-name="Screenshot 2026-01-28 at 10.57.36 AM 3">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgScreenshot20260128At105736Am3} />
      </div>
    </SerpCardImageSlot>
  );
}

function ImageWrapper() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-full" data-name="Image wrapper">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImageWrapper} />
      <div className="flex flex-row items-center justify-center overflow-clip size-full">
        <div className="content-stretch flex items-center justify-center p-[1.586px] size-full" />
      </div>
    </div>
  );
}

function Title() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="_💠 Title">
      <p className="flex-[1_0_0] font-['Source_Sans_3',sans-serif] font-semibold leading-[22px] min-h-px min-w-px relative text-[#0f1114] text-[15px] tracking-[-0.03px]">Generative AI: Introduction and Applications</p>
    </div>
  );
}

function Header() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="_💠 Header">
      <div className="content-stretch flex gap-[4px] h-[24px] items-center relative shrink-0 w-full min-w-0" data-name="_💠 Partner label">
        <div className="content-stretch flex flex-col items-center justify-center overflow-hidden p-[2px] relative rounded-[2px] shrink-0 size-[24px]" data-name="Avatar">
          <div aria-hidden="true" className="absolute border-[#dae1ed] border-[0.891px] border-solid inset-0 pointer-events-none rounded-[2px]" />
          <ImageWrapper />
        </div>
        <p className="flex-[1_0_0] font-['Source_Sans_3',sans-serif] font-normal leading-[16px] min-h-px min-w-px relative text-[#5b6780] text-[11px]">IBM</p>
      </div>
      <Title />
    </div>
  );
}

function RatingStatContainer() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Rating stat container">
      <div className="overflow-clip relative shrink-0 size-[14.25px]" data-name="toggles/StarFilled">
        <div className="absolute inset-[15.73%_15.56%_18.94%_15.54%]" data-name="Vector">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.8182 9.30915">
            <path d={svgPaths.p63e9900} fill="var(--fill-0, #0F1114)" id="Vector" />
          </svg>
        </div>
      </div>
      <p className="font-['Source_Sans_3',sans-serif] font-normal leading-[0] relative shrink-0 text-[12px] text-[#0f1114] whitespace-nowrap">
        <span className="leading-[18px]">4.9</span>
        <span className="leading-[18px]">{` · `}</span>
        <span className="leading-[18px]">3.4k reviews</span>
      </p>
    </div>
  );
}

function DataType2Group() {
  return (
    <div className="content-stretch flex gap-[3.563px] items-start relative shrink-0" data-name="Data type 2 group">
      <p className="relative shrink-0">·</p>
      <p className="relative shrink-0">Course</p>
    </div>
  );
}

function DataType3Group() {
  return (
    <div className="content-stretch flex gap-[3.563px] items-start relative shrink-0" data-name="Data type 3 group">
      <p className="relative shrink-0">·</p>
      <p className="relative shrink-0">1-4 weeks</p>
    </div>
  );
}

function Row() {
  return (
    <div className="content-center flex flex-wrap font-['Source_Sans_3',sans-serif] font-normal gap-[4px] items-center leading-[18px] relative shrink-0 text-[#5b6780] text-[12px] w-full min-w-0 whitespace-nowrap" data-name="Row 1">
      <p className="relative shrink-0">Beginner</p>
      <DataType2Group />
      <DataType3Group />
    </div>
  );
}

function Metadata() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center relative shrink-0 w-full" data-name="_💠 Metadata">
      <Row />
    </div>
  );
}

function Footer() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start justify-end relative shrink-0 w-full" data-name="_💠 Footer">
      <div className="content-stretch flex gap-[2px] items-center min-w-0 relative shrink-0 w-full" data-name="RatingStat">
        <RatingStatContainer />
      </div>
      <Metadata />
    </div>
  );
}

function Content() {
  return (
    <div className="relative flex min-h-0 w-full flex-1 flex-col" data-name="Content">
      <div className="flex min-h-0 w-full flex-1 flex-col justify-between gap-[8px] p-[8px]">
        <Header />
        <Footer />
      </div>
    </div>
  );
}

function Card({ selection }: { selection?: SerpCardSelection | null }) {
  return (
    <div className="content-stretch flex h-full min-h-0 w-full flex-col items-start relative rounded-[14.25px]" data-name="Card">
      <Image selection={selection} />
      <Content />
    </div>
  );
}

function ProductCard({
  selected,
  onToggleSelect,
  title,
  selectionDisabled = false,
}: {
  selected: boolean;
  onToggleSelect: () => void;
  title: string;
  selectionDisabled?: boolean;
}) {
  const selection: SerpCardSelection = {
    selected,
    onToggle: onToggleSelect,
    title,
    ...(selectionDisabled ? { disabled: true } : {}),
  };
  return (
    <SerpCardInteractiveWrap selected={selected} interactive outerRadiusClass="rounded-[14.25px]" selectionDisabled={selectionDisabled}>
      <SerpProductCardShell>
        <Card selection={selection} />
      </SerpProductCardShell>
    </SerpCardInteractiveWrap>
  );
}

function Image1({ selection }: { selection?: SerpCardSelection | null }) {
  return (
    <SerpCardImageSlot selection={selection}>
      <div className="relative shrink-0 w-full aspect-[304/171] z-[1]" data-name="Screenshot 2026-01-28 at 10.57.36 AM 3">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgScreenshot20260128At105736Am4} />
      </div>
    </SerpCardImageSlot>
  );
}

function ImageWrapper1() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-full" data-name="Image wrapper">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImageWrapper1} />
      <div className="flex flex-row items-center justify-center overflow-clip size-full">
        <div className="content-stretch flex items-center justify-center p-[1.586px] size-full" />
      </div>
    </div>
  );
}

function Title1() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="_💠 Title">
      <p className="flex-[1_0_0] font-['Source_Sans_3',sans-serif] font-semibold leading-[22px] min-h-px min-w-px relative text-[#0f1114] text-[15px] tracking-[-0.03px]">Generative AI for Everyone</p>
    </div>
  );
}

function Header1() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="_💠 Header">
      <div className="content-stretch flex gap-[4px] h-[24px] items-center relative shrink-0 w-full min-w-0" data-name="_💠 Partner label">
        <div className="content-stretch flex flex-col items-center justify-center overflow-hidden p-[2px] relative rounded-[2px] shrink-0 size-[24px]" data-name="Avatar">
          <div aria-hidden="true" className="absolute border-[#dae1ed] border-[0.891px] border-solid inset-0 pointer-events-none rounded-[2px]" />
          <ImageWrapper1 />
        </div>
        <p className="flex-[1_0_0] font-['Source_Sans_3',sans-serif] font-normal leading-[16px] min-h-px min-w-px relative text-[#5b6780] text-[11px]">DeepLearning.AI</p>
      </div>
      <Title1 />
    </div>
  );
}

function RatingStatContainer1() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Rating stat container">
      <div className="overflow-clip relative shrink-0 size-[14.25px]" data-name="toggles/StarFilled">
        <div className="absolute inset-[15.73%_15.56%_18.94%_15.54%]" data-name="Vector">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.8182 9.30915">
            <path d={svgPaths.p63e9900} fill="var(--fill-0, #0F1114)" id="Vector" />
          </svg>
        </div>
      </div>
      <p className="font-['Source_Sans_3',sans-serif] font-normal leading-[0] relative shrink-0 text-[12px] text-[#0f1114] whitespace-nowrap">
        <span className="leading-[18px]">4.9</span>
        <span className="leading-[18px]">{` · `}</span>
        <span className="leading-[18px]">3.4k reviews</span>
      </p>
    </div>
  );
}

function DataType2Group1() {
  return (
    <div className="content-stretch flex gap-[3.563px] items-start relative shrink-0" data-name="Data type 2 group">
      <p className="relative shrink-0">·</p>
      <p className="relative shrink-0">Course</p>
    </div>
  );
}

function DataType3Group1() {
  return (
    <div className="content-stretch flex gap-[3.563px] items-start relative shrink-0" data-name="Data type 3 group">
      <p className="relative shrink-0">·</p>
      <p className="relative shrink-0">1-4 weeks</p>
    </div>
  );
}

function Row1() {
  return (
    <div className="content-center flex flex-wrap font-['Source_Sans_3',sans-serif] font-normal gap-[4px] items-center leading-[18px] relative shrink-0 text-[#5b6780] text-[12px] w-full min-w-0 whitespace-nowrap" data-name="Row 1">
      <p className="relative shrink-0">Beginner</p>
      <DataType2Group1 />
      <DataType3Group1 />
    </div>
  );
}

function Metadata1() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center relative shrink-0 w-full" data-name="_💠 Metadata">
      <Row1 />
    </div>
  );
}

function Footer1() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start justify-end relative shrink-0 w-full" data-name="_💠 Footer">
      <div className="content-stretch flex gap-[2px] items-center min-w-0 relative shrink-0 w-full" data-name="RatingStat">
        <RatingStatContainer1 />
      </div>
      <Metadata1 />
    </div>
  );
}

function Content1() {
  return (
    <div className="relative flex min-h-0 w-full flex-1 flex-col" data-name="Content">
      <div className="flex min-h-0 w-full flex-1 flex-col justify-between gap-[8px] p-[8px]">
        <Header1 />
        <Footer1 />
      </div>
    </div>
  );
}

function Card1({ selection }: { selection?: SerpCardSelection | null }) {
  return (
    <div className="content-stretch flex h-full min-h-0 w-full flex-col items-start relative rounded-[14.25px]" data-name="Card">
      <Image1 selection={selection} />
      <Content1 />
    </div>
  );
}

function ProductCard1({
  selected,
  onToggleSelect,
  title,
  selectionDisabled = false,
}: {
  selected: boolean;
  onToggleSelect: () => void;
  title: string;
  selectionDisabled?: boolean;
}) {
  const selection: SerpCardSelection = {
    selected,
    onToggle: onToggleSelect,
    title,
    ...(selectionDisabled ? { disabled: true } : {}),
  };
  return (
    <SerpCardInteractiveWrap selected={selected} interactive outerRadiusClass="rounded-[14.25px]" selectionDisabled={selectionDisabled}>
      <SerpProductCardShell>
        <Card1 selection={selection} />
      </SerpProductCardShell>
    </SerpCardInteractiveWrap>
  );
}

function Image2({ selection }: { selection?: SerpCardSelection | null }) {
  return (
    <SerpCardImageSlot selection={selection}>
      <div className="relative shrink-0 w-full aspect-[304/171] z-[1]" data-name="Screenshot 2026-01-28 at 10.57.36 AM 3">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgScreenshot20260128At105736Am5} />
      </div>
    </SerpCardImageSlot>
  );
}

function ImageWrapper2() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-full" data-name="Image wrapper">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImageWrapper2} />
      <div className="flex flex-row items-center justify-center overflow-clip size-full">
        <div className="content-stretch flex items-center justify-center p-[1.586px] size-full" />
      </div>
    </div>
  );
}

function Title2() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="_💠 Title">
      <p className="flex-[1_0_0] font-['Source_Sans_3',sans-serif] font-semibold leading-[22px] min-h-px min-w-px relative text-[#0f1114] text-[15px] tracking-[-0.03px]">Generative AI Leader</p>
    </div>
  );
}

function Header2() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="_💠 Header">
      <div className="content-stretch flex gap-[4px] h-[24px] items-center relative shrink-0 w-full min-w-0" data-name="_💠 Partner label">
        <div className="content-stretch flex flex-col items-center justify-center overflow-hidden p-[2px] relative rounded-[2px] shrink-0 size-[24px]" data-name="Avatar">
          <div aria-hidden="true" className="absolute border-[#dae1ed] border-[0.891px] border-solid inset-0 pointer-events-none rounded-[2px]" />
          <ImageWrapper2 />
        </div>
        <p className="flex-[1_0_0] font-['Source_Sans_3',sans-serif] font-normal leading-[16px] min-h-px min-w-px relative text-[#5b6780] text-[11px]">Google Cloud</p>
      </div>
      <Title2 />
    </div>
  );
}

function RatingStatContainer2() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Rating stat container">
      <div className="overflow-clip relative shrink-0 size-[14.25px]" data-name="toggles/StarFilled">
        <div className="absolute inset-[15.73%_15.56%_18.94%_15.54%]" data-name="Vector">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.8182 9.30915">
            <path d={svgPaths.p63e9900} fill="var(--fill-0, #0F1114)" id="Vector" />
          </svg>
        </div>
      </div>
      <p className="font-['Source_Sans_3',sans-serif] font-normal leading-[0] relative shrink-0 text-[12px] text-[#0f1114] whitespace-nowrap">
        <span className="leading-[18px]">4.9</span>
        <span className="leading-[18px]">{` · `}</span>
        <span className="leading-[18px]">3.4k reviews</span>
      </p>
    </div>
  );
}

function DataType2Group2() {
  return (
    <div className="content-stretch flex gap-[3.563px] items-start relative shrink-0" data-name="Data type 2 group">
      <p className="relative shrink-0">·</p>
      <p className="relative shrink-0">Professional Certificate</p>
    </div>
  );
}

function DataType3Group2() {
  return (
    <div className="content-stretch flex gap-[3.563px] items-start relative shrink-0" data-name="Data type 3 group">
      <p className="relative shrink-0">·</p>
      <p className="relative shrink-0">3-6 months</p>
    </div>
  );
}

function Row2() {
  return (
    <div className="content-center flex flex-wrap font-['Source_Sans_3',sans-serif] font-normal gap-[4px] items-center leading-[18px] relative shrink-0 text-[#5b6780] text-[12px] w-full min-w-0 whitespace-nowrap" data-name="Row 1">
      <p className="relative shrink-0">Beginner</p>
      <DataType2Group2 />
      <DataType3Group2 />
    </div>
  );
}

function Metadata2() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center relative shrink-0 w-full" data-name="_💠 Metadata">
      <Row2 />
    </div>
  );
}

function Footer2() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start justify-end relative shrink-0 w-full" data-name="_💠 Footer">
      <div className="content-stretch flex gap-[2px] items-center min-w-0 relative shrink-0 w-full" data-name="RatingStat">
        <RatingStatContainer2 />
      </div>
      <Metadata2 />
    </div>
  );
}

function Content2() {
  return (
    <div className="relative flex min-h-0 w-full flex-1 flex-col" data-name="Content">
      <div className="flex min-h-0 w-full flex-1 flex-col justify-between gap-[8px] p-[8px]">
        <Header2 />
        <Footer2 />
      </div>
    </div>
  );
}

function Card2({ selection }: { selection?: SerpCardSelection | null }) {
  return (
    <div className="content-stretch flex h-full min-h-0 w-full flex-col items-start relative rounded-[14.25px]" data-name="Card">
      <Image2 selection={selection} />
      <Content2 />
    </div>
  );
}

function ProductCard2({
  selected,
  onToggleSelect,
  title,
  selectionDisabled = false,
}: {
  selected: boolean;
  onToggleSelect: () => void;
  title: string;
  selectionDisabled?: boolean;
}) {
  const selection: SerpCardSelection = {
    selected,
    onToggle: onToggleSelect,
    title,
    ...(selectionDisabled ? { disabled: true } : {}),
  };
  return (
    <SerpCardInteractiveWrap selected={selected} interactive outerRadiusClass="rounded-[14.25px]" selectionDisabled={selectionDisabled}>
      <SerpProductCardShell>
        <Card2 selection={selection} />
      </SerpProductCardShell>
    </SerpCardInteractiveWrap>
  );
}

function Image3({ selection }: { selection?: SerpCardSelection | null }) {
  return (
    <SerpCardImageSlot selection={selection}>
      <div className="relative shrink-0 w-full aspect-[304/171] z-[1]" data-name="Screenshot 2026-01-28 at 10.57.36 AM 3">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgScreenshot20260128At105736Am6} />
      </div>
    </SerpCardImageSlot>
  );
}

function ImageWrapper3() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-full" data-name="Image wrapper">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImageWrapper} />
      <div className="flex flex-row items-center justify-center overflow-clip size-full">
        <div className="content-stretch flex items-center justify-center p-[1.586px] size-full" />
      </div>
    </div>
  );
}

function Title3() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="_💠 Title">
      <p className="flex-[1_0_0] font-['Source_Sans_3',sans-serif] font-semibold leading-[22px] min-h-px min-w-px relative text-[#0f1114] text-[15px] tracking-[-0.03px]">IBM Generative AI Engineering</p>
    </div>
  );
}

function Header3() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="_💠 Header">
      <div className="content-stretch flex gap-[4px] h-[24px] items-center relative shrink-0 w-full min-w-0" data-name="_💠 Partner label">
        <div className="content-stretch flex flex-col items-center justify-center overflow-hidden p-[2px] relative rounded-[2px] shrink-0 size-[24px]" data-name="Avatar">
          <div aria-hidden="true" className="absolute border-[#dae1ed] border-[0.891px] border-solid inset-0 pointer-events-none rounded-[2px]" />
          <ImageWrapper3 />
        </div>
        <p className="flex-[1_0_0] font-['Source_Sans_3',sans-serif] font-normal leading-[16px] min-h-px min-w-px relative text-[#5b6780] text-[11px]">IBM</p>
      </div>
      <Title3 />
    </div>
  );
}

function RatingStatContainer3() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Rating stat container">
      <div className="overflow-clip relative shrink-0 size-[14.25px]" data-name="toggles/StarFilled">
        <div className="absolute inset-[15.73%_15.56%_18.94%_15.54%]" data-name="Vector">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.8182 9.30915">
            <path d={svgPaths.p63e9900} fill="var(--fill-0, #0F1114)" id="Vector" />
          </svg>
        </div>
      </div>
      <p className="font-['Source_Sans_3',sans-serif] font-normal leading-[0] relative shrink-0 text-[12px] text-[#0f1114] whitespace-nowrap">
        <span className="leading-[18px]">4.9</span>
        <span className="leading-[18px]">{` · `}</span>
        <span className="leading-[18px]">3.4k reviews</span>
      </p>
    </div>
  );
}

function DataType2Group3() {
  return (
    <div className="content-stretch flex gap-[3.563px] items-start relative shrink-0" data-name="Data type 2 group">
      <p className="relative shrink-0">·</p>
      <p className="relative shrink-0">Professional Certificate</p>
    </div>
  );
}

function DataType3Group3() {
  return (
    <div className="content-stretch flex gap-[3.563px] items-start relative shrink-0" data-name="Data type 3 group">
      <p className="relative shrink-0">·</p>
      <p className="relative shrink-0">3-6 months</p>
    </div>
  );
}

function Row3() {
  return (
    <div className="content-center flex flex-wrap font-['Source_Sans_3',sans-serif] font-normal gap-[4px] items-center leading-[18px] relative shrink-0 text-[#5b6780] text-[12px] w-full min-w-0 whitespace-nowrap" data-name="Row 1">
      <p className="relative shrink-0">Beginner</p>
      <DataType2Group3 />
      <DataType3Group3 />
    </div>
  );
}

function Metadata3() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center relative shrink-0 w-full" data-name="_💠 Metadata">
      <Row3 />
    </div>
  );
}

function Footer3() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start justify-end relative shrink-0 w-full" data-name="_💠 Footer">
      <div className="content-stretch flex gap-[2px] items-center min-w-0 relative shrink-0 w-full" data-name="RatingStat">
        <RatingStatContainer3 />
      </div>
      <Metadata3 />
    </div>
  );
}

function Content3() {
  return (
    <div className="relative flex min-h-0 w-full flex-1 flex-col" data-name="Content">
      <div className="flex min-h-0 w-full flex-1 flex-col justify-between gap-[8px] p-[8px]">
        <Header3 />
        <Footer3 />
      </div>
    </div>
  );
}

function Card3({ selection }: { selection?: SerpCardSelection | null }) {
  return (
    <div className="content-stretch flex h-full min-h-0 w-full flex-col items-start relative rounded-[14.25px]" data-name="Card">
      <Image3 selection={selection} />
      <Content3 />
    </div>
  );
}

function ProductCard3({
  selected,
  onToggleSelect,
  title,
  selectionDisabled = false,
}: {
  selected: boolean;
  onToggleSelect: () => void;
  title: string;
  selectionDisabled?: boolean;
}) {
  const selection: SerpCardSelection = {
    selected,
    onToggle: onToggleSelect,
    title,
    ...(selectionDisabled ? { disabled: true } : {}),
  };
  return (
    <SerpCardInteractiveWrap selected={selected} interactive outerRadiusClass="rounded-[14.25px]" selectionDisabled={selectionDisabled}>
      <SerpProductCardShell>
        <Card3 selection={selection} />
      </SerpProductCardShell>
    </SerpCardInteractiveWrap>
  );
}

function Image4({ selection }: { selection?: SerpCardSelection | null }) {
  return (
    <SerpCardImageSlot selection={selection}>
      <div className="relative shrink-0 w-full aspect-[304/171] z-[1]" data-name="Screenshot 2026-01-28 at 10.57.36 AM 3">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgScreenshot20260128At105736Am7} />
      </div>
    </SerpCardImageSlot>
  );
}

function ImageWrapper4() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-full" data-name="Image wrapper">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImageWrapper2} />
      <div className="flex flex-row items-center justify-center overflow-clip size-full">
        <div className="content-stretch flex items-center justify-center p-[1.586px] size-full" />
      </div>
    </div>
  );
}

function Title4() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="_💠 Title">
      <p className="flex-[1_0_0] font-['Source_Sans_3',sans-serif] font-semibold leading-[22px] min-h-px min-w-px relative text-[#0f1114] text-[15px] tracking-[-0.03px]">Introduction to Generative AI</p>
    </div>
  );
}

function Header4() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="_💠 Header">
      <div className="content-stretch flex gap-[4px] h-[24px] items-center relative shrink-0 w-full min-w-0" data-name="_💠 Partner label">
        <div className="content-stretch flex flex-col items-center justify-center overflow-hidden p-[2px] relative rounded-[2px] shrink-0 size-[24px]" data-name="Avatar">
          <div aria-hidden="true" className="absolute border-[#dae1ed] border-[0.891px] border-solid inset-0 pointer-events-none rounded-[2px]" />
          <ImageWrapper4 />
        </div>
        <p className="flex-[1_0_0] font-['Source_Sans_3',sans-serif] font-normal leading-[16px] min-h-px min-w-px relative text-[#5b6780] text-[11px]">Google CLoud</p>
      </div>
      <Title4 />
    </div>
  );
}

function RatingStatContainer4() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Rating stat container">
      <div className="overflow-clip relative shrink-0 size-[14.25px]" data-name="toggles/StarFilled">
        <div className="absolute inset-[15.73%_15.56%_18.94%_15.54%]" data-name="Vector">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.8182 9.30915">
            <path d={svgPaths.p63e9900} fill="var(--fill-0, #0F1114)" id="Vector" />
          </svg>
        </div>
      </div>
      <p className="font-['Source_Sans_3',sans-serif] font-normal leading-[0] relative shrink-0 text-[12px] text-[#0f1114] whitespace-nowrap">
        <span className="leading-[18px]">4.9</span>
        <span className="leading-[18px]">{` · `}</span>
        <span className="leading-[18px]">3.4k reviews</span>
      </p>
    </div>
  );
}

function DataType2Group4() {
  return (
    <div className="content-stretch flex gap-[3.563px] items-start relative shrink-0" data-name="Data type 2 group">
      <p className="relative shrink-0">·</p>
      <p className="relative shrink-0">Course</p>
    </div>
  );
}

function DataType3Group4() {
  return (
    <div className="content-stretch flex gap-[3.563px] items-start relative shrink-0" data-name="Data type 3 group">
      <p className="relative shrink-0">·</p>
      <p className="relative shrink-0">1-4 weeks</p>
    </div>
  );
}

function Row4() {
  return (
    <div className="content-center flex flex-wrap font-['Source_Sans_3',sans-serif] font-normal gap-[4px] items-center leading-[18px] relative shrink-0 text-[#5b6780] text-[12px] w-full min-w-0 whitespace-nowrap" data-name="Row 1">
      <p className="relative shrink-0">Beginner</p>
      <DataType2Group4 />
      <DataType3Group4 />
    </div>
  );
}

function Metadata4() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center relative shrink-0 w-full" data-name="_💠 Metadata">
      <Row4 />
    </div>
  );
}

function Footer4() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start justify-end relative shrink-0 w-full" data-name="_💠 Footer">
      <div className="content-stretch flex gap-[2px] items-center min-w-0 relative shrink-0 w-full" data-name="RatingStat">
        <RatingStatContainer4 />
      </div>
      <Metadata4 />
    </div>
  );
}

function Content4() {
  return (
    <div className="relative flex min-h-0 w-full flex-1 flex-col" data-name="Content">
      <div className="flex min-h-0 w-full flex-1 flex-col justify-between gap-[8px] p-[8px]">
        <Header4 />
        <Footer4 />
      </div>
    </div>
  );
}

function Card4({ selection }: { selection?: SerpCardSelection | null }) {
  return (
    <div className="content-stretch flex h-full min-h-0 w-full flex-col items-start relative rounded-[14.25px]" data-name="Card">
      <Image4 selection={selection} />
      <Content4 />
    </div>
  );
}

function ProductCard4({
  selected,
  onToggleSelect,
  title,
  selectionDisabled = false,
}: {
  selected: boolean;
  onToggleSelect: () => void;
  title: string;
  selectionDisabled?: boolean;
}) {
  const selection: SerpCardSelection = {
    selected,
    onToggle: onToggleSelect,
    title,
    ...(selectionDisabled ? { disabled: true } : {}),
  };
  return (
    <SerpCardInteractiveWrap selected={selected} interactive outerRadiusClass="rounded-[14.25px]" selectionDisabled={selectionDisabled}>
      <SerpProductCardShell>
        <Card4 selection={selection} />
      </SerpProductCardShell>
    </SerpCardInteractiveWrap>
  );
}

function Image5({ selection }: { selection?: SerpCardSelection | null }) {
  return (
    <SerpCardImageSlot selection={selection}>
      <div className="relative shrink-0 w-full aspect-[304/171] z-[1]" data-name="Screenshot 2026-01-28 at 10.57.36 AM 3">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-full left-[-0.7%] max-w-none top-0 w-[100.7%]" src={imgScreenshot20260128At105736Am8} />
        </div>
      </div>
    </SerpCardImageSlot>
  );
}

function ImageWrapper5() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-full" data-name="Image wrapper">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImageWrapper} />
      <div className="flex flex-row items-center justify-center overflow-clip size-full">
        <div className="content-stretch flex items-center justify-center p-[1.586px] size-full" />
      </div>
    </div>
  );
}

function Title5() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="_💠 Title">
      <p className="flex-[1_0_0] font-['Source_Sans_3',sans-serif] font-semibold leading-[22px] min-h-px min-w-px relative text-[#0f1114] text-[15px] tracking-[-0.03px]">Generative AI Engineering with LLMs</p>
    </div>
  );
}

function Header5() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="_💠 Header">
      <div className="content-stretch flex gap-[4px] h-[24px] items-center relative shrink-0 w-full min-w-0" data-name="_💠 Partner label">
        <div className="content-stretch flex flex-col items-center justify-center overflow-hidden p-[2px] relative rounded-[2px] shrink-0 size-[24px]" data-name="Avatar">
          <div aria-hidden="true" className="absolute border-[#dae1ed] border-[0.891px] border-solid inset-0 pointer-events-none rounded-[2px]" />
          <ImageWrapper5 />
        </div>
        <p className="flex-[1_0_0] font-['Source_Sans_3',sans-serif] font-normal leading-[16px] min-h-px min-w-px relative text-[#5b6780] text-[11px]">IBM</p>
      </div>
      <Title5 />
    </div>
  );
}

function RatingStatContainer5() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Rating stat container">
      <div className="overflow-clip relative shrink-0 size-[14.25px]" data-name="toggles/StarFilled">
        <div className="absolute inset-[15.73%_15.56%_18.94%_15.54%]" data-name="Vector">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.8182 9.30915">
            <path d={svgPaths.p63e9900} fill="var(--fill-0, #0F1114)" id="Vector" />
          </svg>
        </div>
      </div>
      <p className="font-['Source_Sans_3',sans-serif] font-normal leading-[0] relative shrink-0 text-[12px] text-[#0f1114] whitespace-nowrap">
        <span className="leading-[18px]">4.9</span>
        <span className="leading-[18px]">{` · `}</span>
        <span className="leading-[18px]">3.4k reviews</span>
      </p>
    </div>
  );
}

function DataType2Group5() {
  return (
    <div className="content-stretch flex gap-[3.563px] items-start relative shrink-0" data-name="Data type 2 group">
      <p className="relative shrink-0">·</p>
      <p className="relative shrink-0">Specialization</p>
    </div>
  );
}

function DataType3Group5() {
  return (
    <div className="content-stretch flex gap-[3.563px] items-start relative shrink-0" data-name="Data type 3 group">
      <p className="relative shrink-0">·</p>
      <p className="relative shrink-0">3-6 months</p>
    </div>
  );
}

function Row5() {
  return (
    <div className="content-center flex flex-wrap font-['Source_Sans_3',sans-serif] font-normal gap-[4px] items-center leading-[18px] relative shrink-0 text-[#5b6780] text-[12px] w-full min-w-0 whitespace-nowrap" data-name="Row 1">
      <p className="relative shrink-0">Beginner</p>
      <DataType2Group5 />
      <DataType3Group5 />
    </div>
  );
}

function Metadata5() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center relative shrink-0 w-full" data-name="_💠 Metadata">
      <Row5 />
    </div>
  );
}

function Footer5() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start justify-end relative shrink-0 w-full" data-name="_💠 Footer">
      <div className="content-stretch flex gap-[2px] items-center min-w-0 relative shrink-0 w-full" data-name="RatingStat">
        <RatingStatContainer5 />
      </div>
      <Metadata5 />
    </div>
  );
}

function Content5() {
  return (
    <div className="relative flex min-h-0 w-full flex-1 flex-col" data-name="Content">
      <div className="flex min-h-0 w-full flex-1 flex-col justify-between gap-[8px] p-[8px]">
        <Header5 />
        <Footer5 />
      </div>
    </div>
  );
}

function Card5({ selection }: { selection?: SerpCardSelection | null }) {
  return (
    <div className="content-stretch flex h-full min-h-0 w-full flex-col items-start relative rounded-[14.25px]" data-name="Card">
      <Image5 selection={selection} />
      <Content5 />
    </div>
  );
}

function ProductCard5({
  selected,
  onToggleSelect,
  title,
  selectionDisabled = false,
}: {
  selected: boolean;
  onToggleSelect: () => void;
  title: string;
  selectionDisabled?: boolean;
}) {
  const selection: SerpCardSelection = {
    selected,
    onToggle: onToggleSelect,
    title,
    ...(selectionDisabled ? { disabled: true } : {}),
  };
  return (
    <SerpCardInteractiveWrap selected={selected} interactive outerRadiusClass="rounded-[14.25px]" selectionDisabled={selectionDisabled}>
      <SerpProductCardShell>
        <Card5 selection={selection} />
      </SerpProductCardShell>
    </SerpCardInteractiveWrap>
  );
}

const RELATED_SEARCH_QUERIES = [
  "gen ai with llm",
  "gen ai for sustainability",
  "gen ai google",
  "gen ai foundational models for nlp & language understanding",
  "gen ai in cybersecurity",
  "gen ai leader",
  "gen ai ibm",
  "gen ai: beyond the chatbot",
] as const;

function RelatedSearches() {
  return (
    <div className="content-start flex flex-wrap gap-[8px] items-start relative shrink-0 w-full" data-name="Related Searches">
      {RELATED_SEARCH_QUERIES.map((label) => (
        <div
          key={label}
          className="bg-white border border-[#dae1ed] border-solid content-stretch flex gap-[4px] items-center justify-center px-[12px] py-[6px] relative rounded-[8px] shrink-0"
          data-name="Prompt"
        >
          <div className="flex flex-col font-['Source_Sans_3',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[13px] text-[#5b6780] whitespace-nowrap">
            <p className="leading-[19.5px]">{label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function Frame7() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[12px] items-start px-[8px] py-[24px] relative shrink-0 w-full min-w-0 max-w-full">
      <div className="flex flex-col font-['Source_Sans_3',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[18px] text-[#0f1114] tracking-[-0.054px] w-full">
        <p className="leading-[24px]">Searches related to Generative AI</p>
      </div>
      <RelatedSearches />
    </div>
  );
}

function Image6({ selection }: { selection?: SerpCardSelection | null }) {
  return (
    <SerpCardImageSlot selection={selection}>
      <div className="relative shrink-0 w-full aspect-[304/171] z-[1]" data-name="Screenshot 2026-01-28 at 10.57.36 AM 3">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgScreenshot20260128At105736Am9} />
      </div>
    </SerpCardImageSlot>
  );
}

function ImageWrapper6() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-full" data-name="Image wrapper">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImageWrapper} />
      <div className="flex flex-row items-center justify-center overflow-clip size-full">
        <div className="content-stretch flex items-center justify-center p-[1.586px] size-full" />
      </div>
    </div>
  );
}

function Title6() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="_💠 Title">
      <p className="flex-[1_0_0] font-['Source_Sans_3',sans-serif] font-semibold leading-[22px] min-h-px min-w-px relative text-[#0f1114] text-[15px] tracking-[-0.03px]">Generative AI for Executives</p>
    </div>
  );
}

function Header6() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="_💠 Header">
      <div className="content-stretch flex gap-[4px] h-[24px] items-center relative shrink-0 w-full min-w-0" data-name="_💠 Partner label">
        <div className="content-stretch flex flex-col items-center justify-center overflow-hidden p-[2px] relative rounded-[2px] shrink-0 size-[24px]" data-name="Avatar">
          <div aria-hidden="true" className="absolute border-[#dae1ed] border-[0.891px] border-solid inset-0 pointer-events-none rounded-[2px]" />
          <ImageWrapper6 />
        </div>
        <p className="flex-[1_0_0] font-['Source_Sans_3',sans-serif] font-normal leading-[16px] min-h-px min-w-px relative text-[#5b6780] text-[11px]">IBM</p>
      </div>
      <Title6 />
    </div>
  );
}

function RatingStatContainer6() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Rating stat container">
      <div className="overflow-clip relative shrink-0 size-[14.25px]" data-name="toggles/StarFilled">
        <div className="absolute inset-[15.73%_15.56%_18.94%_15.54%]" data-name="Vector">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.8182 9.30915">
            <path d={svgPaths.p63e9900} fill="var(--fill-0, #0F1114)" id="Vector" />
          </svg>
        </div>
      </div>
      <p className="font-['Source_Sans_3',sans-serif] font-normal leading-[0] relative shrink-0 text-[12px] text-[#0f1114] whitespace-nowrap">
        <span className="leading-[18px]">4.9</span>
        <span className="leading-[18px]">{` · `}</span>
        <span className="leading-[18px]">3.4k reviews</span>
      </p>
    </div>
  );
}

function DataType2Group6() {
  return (
    <div className="content-stretch flex gap-[3.563px] items-start relative shrink-0" data-name="Data type 2 group">
      <p className="relative shrink-0">·</p>
      <p className="relative shrink-0">Specialization</p>
    </div>
  );
}

function DataType3Group6() {
  return (
    <div className="content-stretch flex gap-[3.563px] items-start relative shrink-0" data-name="Data type 3 group">
      <p className="relative shrink-0">·</p>
      <p className="relative shrink-0">1-3 months</p>
    </div>
  );
}

function Row6() {
  return (
    <div className="content-center flex flex-wrap font-['Source_Sans_3',sans-serif] font-normal gap-[4px] items-center leading-[18px] relative shrink-0 text-[#5b6780] text-[12px] w-full min-w-0 whitespace-nowrap" data-name="Row 1">
      <p className="relative shrink-0">Beginner</p>
      <DataType2Group6 />
      <DataType3Group6 />
    </div>
  );
}

function Metadata6() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center relative shrink-0 w-full" data-name="_💠 Metadata">
      <Row6 />
    </div>
  );
}

function Footer6() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start justify-end relative shrink-0 w-full" data-name="_💠 Footer">
      <div className="content-stretch flex gap-[2px] items-center min-w-0 relative shrink-0 w-full" data-name="RatingStat">
        <RatingStatContainer6 />
      </div>
      <Metadata6 />
    </div>
  );
}

function Content6() {
  return (
    <div className="relative flex min-h-0 w-full flex-1 flex-col" data-name="Content">
      <div className="flex min-h-0 w-full flex-1 flex-col justify-between gap-[8px] p-[8px]">
        <Header6 />
        <Footer6 />
      </div>
    </div>
  );
}

function Card6({ selection }: { selection?: SerpCardSelection | null }) {
  return (
    <div className="content-stretch flex h-full min-h-0 w-full flex-col items-start relative rounded-[14.25px]" data-name="Card">
      <Image6 selection={selection} />
      <Content6 />
    </div>
  );
}

function ProductCard6({
  selected,
  onToggleSelect,
  title,
  selectionDisabled = false,
}: {
  selected: boolean;
  onToggleSelect: () => void;
  title: string;
  selectionDisabled?: boolean;
}) {
  const selection: SerpCardSelection = {
    selected,
    onToggle: onToggleSelect,
    title,
    ...(selectionDisabled ? { disabled: true } : {}),
  };
  return (
    <SerpCardInteractiveWrap selected={selected} interactive outerRadiusClass="rounded-[14.25px]" selectionDisabled={selectionDisabled}>
      <SerpProductCardShell>
        <Card6 selection={selection} />
      </SerpProductCardShell>
    </SerpCardInteractiveWrap>
  );
}

function Image7({ selection }: { selection?: SerpCardSelection | null }) {
  return (
    <SerpCardImageSlot selection={selection}>
      <div className="relative shrink-0 w-full aspect-[304/171] z-[1]" data-name="Screenshot 2026-01-28 at 10.57.36 AM 3">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgScreenshot20260128At105736Am10} />
      </div>
    </SerpCardImageSlot>
  );
}

function ImageWrapper7() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-full" data-name="Image wrapper">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImageWrapper} />
      <div className="flex flex-row items-center justify-center overflow-clip size-full">
        <div className="content-stretch flex items-center justify-center p-[1.586px] size-full" />
      </div>
    </div>
  );
}

function Title7() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="_💠 Title">
      <p className="flex-[1_0_0] font-['Source_Sans_3',sans-serif] font-semibold leading-[22px] min-h-px min-w-px relative text-[#0f1114] text-[15px] tracking-[-0.03px]">Generative AI for Software Developers</p>
    </div>
  );
}

function Header7() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="_💠 Header">
      <div className="content-stretch flex gap-[4px] h-[24px] items-center relative shrink-0 w-full min-w-0" data-name="_💠 Partner label">
        <div className="content-stretch flex flex-col items-center justify-center overflow-hidden p-[2px] relative rounded-[2px] shrink-0 size-[24px]" data-name="Avatar">
          <div aria-hidden="true" className="absolute border-[#dae1ed] border-[0.891px] border-solid inset-0 pointer-events-none rounded-[2px]" />
          <ImageWrapper7 />
        </div>
        <p className="flex-[1_0_0] font-['Source_Sans_3',sans-serif] font-normal leading-[16px] min-h-px min-w-px relative text-[#5b6780] text-[11px]">IBM</p>
      </div>
      <Title7 />
    </div>
  );
}

function RatingStatContainer7() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Rating stat container">
      <div className="overflow-clip relative shrink-0 size-[14.25px]" data-name="toggles/StarFilled">
        <div className="absolute inset-[15.73%_15.56%_18.94%_15.54%]" data-name="Vector">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.8182 9.30915">
            <path d={svgPaths.p63e9900} fill="var(--fill-0, #0F1114)" id="Vector" />
          </svg>
        </div>
      </div>
      <p className="font-['Source_Sans_3',sans-serif] font-normal leading-[0] relative shrink-0 text-[12px] text-[#0f1114] whitespace-nowrap">
        <span className="leading-[18px]">4.9</span>
        <span className="leading-[18px]">{` · `}</span>
        <span className="leading-[18px]">3.4k reviews</span>
      </p>
    </div>
  );
}

function DataType2Group7() {
  return (
    <div className="content-stretch flex gap-[3.563px] items-start relative shrink-0" data-name="Data type 2 group">
      <p className="relative shrink-0">·</p>
      <p className="relative shrink-0">Specialization</p>
    </div>
  );
}

function DataType3Group7() {
  return (
    <div className="content-stretch flex gap-[3.563px] items-start relative shrink-0" data-name="Data type 3 group">
      <p className="relative shrink-0">·</p>
      <p className="relative shrink-0">1-3 months</p>
    </div>
  );
}

function Row7() {
  return (
    <div className="content-center flex flex-wrap font-['Source_Sans_3',sans-serif] font-normal gap-[4px] items-center leading-[18px] relative shrink-0 text-[#5b6780] text-[12px] w-full min-w-0 whitespace-nowrap" data-name="Row 1">
      <p className="relative shrink-0">Beginner</p>
      <DataType2Group7 />
      <DataType3Group7 />
    </div>
  );
}

function Metadata7() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center relative shrink-0 w-full" data-name="_💠 Metadata">
      <Row7 />
    </div>
  );
}

function Footer7() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start justify-end relative shrink-0 w-full" data-name="_💠 Footer">
      <div className="content-stretch flex gap-[2px] items-center min-w-0 relative shrink-0 w-full" data-name="RatingStat">
        <RatingStatContainer7 />
      </div>
      <Metadata7 />
    </div>
  );
}

function Content7() {
  return (
    <div className="relative flex min-h-0 w-full flex-1 flex-col" data-name="Content">
      <div className="flex min-h-0 w-full flex-1 flex-col justify-between gap-[8px] p-[8px]">
        <Header7 />
        <Footer7 />
      </div>
    </div>
  );
}

function Card7({ selection }: { selection?: SerpCardSelection | null }) {
  return (
    <div className="content-stretch flex h-full min-h-0 w-full flex-col items-start relative rounded-[14.25px]" data-name="Card">
      <Image7 selection={selection} />
      <Content7 />
    </div>
  );
}

function ProductCard7({
  selected,
  onToggleSelect,
  title,
  selectionDisabled = false,
}: {
  selected: boolean;
  onToggleSelect: () => void;
  title: string;
  selectionDisabled?: boolean;
}) {
  const selection: SerpCardSelection = {
    selected,
    onToggle: onToggleSelect,
    title,
    ...(selectionDisabled ? { disabled: true } : {}),
  };
  return (
    <SerpCardInteractiveWrap selected={selected} interactive outerRadiusClass="rounded-[14.25px]" selectionDisabled={selectionDisabled}>
      <SerpProductCardShell>
        <Card7 selection={selection} />
      </SerpProductCardShell>
    </SerpCardInteractiveWrap>
  );
}

function Image8({ selection }: { selection?: SerpCardSelection | null }) {
  return (
    <SerpCardImageSlot selection={selection}>
      <div className="relative shrink-0 w-full aspect-[304/171] z-[1]" data-name="Screenshot 2026-01-28 at 10.57.36 AM 3">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgScreenshot20260128At105736Am11} />
      </div>
    </SerpCardImageSlot>
  );
}

function ImageWrapper8() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-full" data-name="Image wrapper">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImageWrapper3} />
      <div className="flex flex-row items-center justify-center overflow-clip size-full">
        <div className="content-stretch flex items-center justify-center p-[1.586px] size-full" />
      </div>
    </div>
  );
}

function Title8() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="_💠 Title">
      <p className="flex-[1_0_0] font-['Source_Sans_3',sans-serif] font-semibold leading-[22px] min-h-px min-w-px relative text-[#0f1114] text-[15px] tracking-[-0.03px]">Generative AI for Content Creation</p>
    </div>
  );
}

function Header8() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="_💠 Header">
      <div className="content-stretch flex gap-[4px] h-[24px] items-center relative shrink-0 w-full min-w-0" data-name="_💠 Partner label">
        <div className="content-stretch flex flex-col items-center justify-center overflow-hidden p-[2px] relative rounded-[2px] shrink-0 size-[24px]" data-name="Avatar">
          <div aria-hidden="true" className="absolute border-[#dae1ed] border-[0.891px] border-solid inset-0 pointer-events-none rounded-[2px]" />
          <ImageWrapper8 />
        </div>
        <p className="flex-[1_0_0] font-['Source_Sans_3',sans-serif] font-normal leading-[16px] min-h-px min-w-px relative text-[#5b6780] text-[11px]">Adobe</p>
      </div>
      <Title8 />
    </div>
  );
}

function RatingStatContainer8() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Rating stat container">
      <div className="overflow-clip relative shrink-0 size-[14.25px]" data-name="toggles/StarFilled">
        <div className="absolute inset-[15.73%_15.56%_18.94%_15.54%]" data-name="Vector">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.8182 9.30915">
            <path d={svgPaths.p63e9900} fill="var(--fill-0, #0F1114)" id="Vector" />
          </svg>
        </div>
      </div>
      <p className="font-['Source_Sans_3',sans-serif] font-normal leading-[0] relative shrink-0 text-[12px] text-[#0f1114] whitespace-nowrap">
        <span className="leading-[18px]">4.9</span>
        <span className="leading-[18px]">{` · `}</span>
        <span className="leading-[18px]">3.4k reviews</span>
      </p>
    </div>
  );
}

function DataType2Group8() {
  return (
    <div className="content-stretch flex gap-[3.563px] items-start relative shrink-0" data-name="Data type 2 group">
      <p className="relative shrink-0">·</p>
      <p className="relative shrink-0">Course</p>
    </div>
  );
}

function DataType3Group8() {
  return (
    <div className="content-stretch flex gap-[3.563px] items-start relative shrink-0" data-name="Data type 3 group">
      <p className="relative shrink-0">·</p>
      <p className="relative shrink-0">1-4 weeks</p>
    </div>
  );
}

function Row8() {
  return (
    <div className="content-center flex flex-wrap font-['Source_Sans_3',sans-serif] font-normal gap-[4px] items-center leading-[18px] relative shrink-0 text-[#5b6780] text-[12px] w-full min-w-0 whitespace-nowrap" data-name="Row 1">
      <p className="relative shrink-0">Beginner</p>
      <DataType2Group8 />
      <DataType3Group8 />
    </div>
  );
}

function Metadata8() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center relative shrink-0 w-full" data-name="_💠 Metadata">
      <Row8 />
    </div>
  );
}

function Footer8() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start justify-end relative shrink-0 w-full" data-name="_💠 Footer">
      <div className="content-stretch flex gap-[2px] items-center min-w-0 relative shrink-0 w-full" data-name="RatingStat">
        <RatingStatContainer8 />
      </div>
      <Metadata8 />
    </div>
  );
}

function Content8() {
  return (
    <div className="relative flex min-h-0 w-full flex-1 flex-col" data-name="Content">
      <div className="flex min-h-0 w-full flex-1 flex-col justify-between gap-[8px] p-[8px]">
        <Header8 />
        <Footer8 />
      </div>
    </div>
  );
}

function Card8({ selection }: { selection?: SerpCardSelection | null }) {
  return (
    <div className="content-stretch flex h-full min-h-0 w-full flex-col items-start relative rounded-[14.25px]" data-name="Card">
      <Image8 selection={selection} />
      <Content8 />
    </div>
  );
}

function ProductCard8({
  selected,
  onToggleSelect,
  title,
  selectionDisabled = false,
}: {
  selected: boolean;
  onToggleSelect: () => void;
  title: string;
  selectionDisabled?: boolean;
}) {
  const selection: SerpCardSelection = {
    selected,
    onToggle: onToggleSelect,
    title,
    ...(selectionDisabled ? { disabled: true } : {}),
  };
  return (
    <SerpCardInteractiveWrap selected={selected} interactive outerRadiusClass="rounded-[14.25px]" selectionDisabled={selectionDisabled}>
      <SerpProductCardShell>
        <Card8 selection={selection} />
      </SerpProductCardShell>
    </SerpCardInteractiveWrap>
  );
}

const PM_RELATED_SEARCH_QUERIES = [
  "gen ai with llm",
  "gen ai for sustainability",
  "gen ai google",
  "gen ai foundational models for nlp & language understanding",
  "gen ai in cybersecurity",
] as const;

function PmRelatedSearches() {
  return (
    <div className="content-start flex flex-wrap gap-[8px] items-start relative shrink-0 w-full" data-name="Related Searches">
      {PM_RELATED_SEARCH_QUERIES.map((label) => (
        <div
          key={label}
          className="bg-white border border-[#dae1ed] border-solid content-stretch flex gap-[4px] items-center justify-center px-[12px] py-[6px] relative rounded-[8px] shrink-0"
          data-name="Prompt"
        >
          <div className="flex flex-col font-['Source_Sans_3',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[13px] text-[#5b6780] whitespace-nowrap">
            <p className="leading-[19.5px]">{label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function Frame7Pm() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[12px] items-start px-[8px] py-[24px] relative shrink-0 w-full min-w-0 max-w-full">
      <div className="flex flex-col font-['Source_Sans_3',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[18px] text-[#0f1114] tracking-[-0.054px] w-full">
        <p className="leading-[24px]">Searches related to Generative AI</p>
      </div>
      <PmRelatedSearches />
    </div>
  );
}

type PmResultCardConfig = {
  thumb: string;
  logo?: string;
  partnerInitial?: string;
  partner: string;
  title: string;
  description?: string;
  matchPercent?: number;
  showAiSkillsTag?: boolean;
  meta: string;
  /** Figma 2109:67364: top row uses 8px pad + 14px radius; bottom row matches default SERP shell. */
  shell: "featured" | "standard";
};

const PM_RESULT_CARDS: PmResultCardConfig[] = [
  {
    thumb: serp2_1,
    logo: ibmLogo,
    partner: "IBM",
    title: "Generative AI for Product Managers",
    matchPercent: 90,
    showAiSkillsTag: true,
    shell: "featured",
    description:
      "This is a strong fit for you as a product manager because it bridges technical understanding and practical application—exactly the gap PMs need to close right now.",
    meta: "Beginner · Specialization · 1-3 months",
  },
  {
    thumb: serp2_2,
    logo: skillupLogo,
    partner: "SkillUp",
    title: "Product Management: Building AI-Powered Products",
    matchPercent: 84,
    showAiSkillsTag: true,
    shell: "featured",
    description:
      "This is a good fit for you as a product manager because it focuses on practical understanding, not technical depth—exactly what PMs need in an AI-driven environment.",
    meta: "Beginner · Course · 1-4 weeks",
  },
  {
    thumb: serp2_3,
    logo: skillupLogo,
    partner: "SkillUp",
    title: "Generative AI: Supercharge Your Product Management Career",
    matchPercent: 82,
    showAiSkillsTag: true,
    shell: "featured",
    description:
      "This is a good fit for you as a product manager because it focuses on strategic leadership—which is where PMs create the most impact.",
    meta: "Beginner · Course · 1-4 weeks",
  },
  {
    thumb: serp2_4,
    logo: starweaverLogo,
    partner: "Starweaver",
    title: "ChatGPT (and other AI) for Product Management & Innovation",
    meta: "Beginner · Course · 1-4 weeks",
    shell: "standard",
    description:
      "This is a good fit for you as a product manager because it focuses on practical ChatGPT and AI workflows for innovation—useful for shaping roadmap bets without deep ML expertise.",
  },
  {
    thumb: serp2_5,
    logo: simplilearnLogo,
    partner: "Simplilearn",
    title: "Generative AI in Product Development Training",
    meta: "Beginner · Course · 1-4 weeks",
    shell: "standard",
    description:
      "This is a good fit for you as a product manager because it ties generative AI to product development cycles—helpful if you own delivery tradeoffs and stakeholder alignment.",
  },
  {
    thumb: serp2_6,
    logo: courseraLogo,
    partner: "Coursera",
    title: "GenAI for Product Managers",
    meta: "Beginner · Course · 1-4 weeks",
    shell: "standard",
    description:
      "This is a good fit for you as a product manager because it offers a concise GenAI foundation you can pair with your domain context—ideal for time-boxed upskilling.",
  },
];

function PmPartnerMark({ logo, partnerInitial, partner }: Pick<PmResultCardConfig, "logo" | "partnerInitial" | "partner">) {
  if (logo) {
    return (
      <div className="relative h-full w-full min-h-0 min-w-0" data-name="Image wrapper">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={logo} />
      </div>
    );
  }
  return (
    <div className="flex h-full w-full flex-col items-center justify-center rounded-[2px] bg-[#f2f5fa] font-['Source_Sans_3',sans-serif] font-semibold text-[11px] text-[#5b6780]">
      {partnerInitial ?? partner.slice(0, 1)}
    </div>
  );
}

/** Figma 2109:67364 — Tags row: gradient % match, outlined AI Skills, then description in same flex-wrap block. */
function PmTagsSection({
  matchPercent,
  showAiSkillsTag,
  description,
}: {
  matchPercent?: number;
  showAiSkillsTag?: boolean;
  description?: string;
}) {
  if (matchPercent == null && !showAiSkillsTag && !description) return null;
  return (
    <div
      className="content-start flex flex-wrap gap-[4px] items-start relative shrink-0 w-full min-w-0"
      data-name="Tags"
    >
      {matchPercent != null ? (
        <div
          className="content-stretch flex h-[18px] shrink-0 items-center justify-center gap-[2px] rounded-[80px] bg-gradient-to-r from-[#d65d00] to-[#9c1a84] px-[4px] pt-[2px] pb-0"
          data-name="Tag"
        >
          <p className="font-['Source_Sans_3'] font-semibold leading-[14.278px] text-[9.519px] text-white whitespace-nowrap">
            {matchPercent}% match
          </p>
        </div>
      ) : null}
      {showAiSkillsTag ? (
        <div
          className="content-stretch flex h-[18px] shrink-0 items-center justify-center rounded-[800px] border-[0.793px] border-solid border-[#dae1ed] bg-white px-[4px]"
          data-name="Tag"
        >
          <p className="font-['Source_Sans_3',sans-serif] font-normal leading-[14.278px] text-[9.519px] text-[#5b6780] whitespace-nowrap">
            AI Skills
          </p>
        </div>
      ) : null}
      {description ? (
        <p className="w-full min-w-0 basis-full font-['Source_Sans_3',sans-serif] font-normal leading-[18px] text-[12px] text-[#5b6780]">
          {description}
        </p>
      ) : null}
    </div>
  );
}

function PmCardShell({ shell, children }: { shell: PmResultCardConfig["shell"]; children: ReactNode }) {
  if (shell === "featured") {
    return (
      <div
        className="bg-white flex h-full min-h-0 flex-col items-start overflow-clip p-[8px] relative rounded-[14px] w-full"
        data-name="ProductCard -2"
      >
        {children}
      </div>
    );
  }
  return (
    <div
      className="bg-white flex h-full min-h-0 flex-col items-start overflow-clip p-[7.125px] relative rounded-[14.25px] w-full"
      data-name="ProductCard -2"
    >
      {children}
    </div>
  );
}

function PmRatingRow() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Rating stat container">
      <div className="overflow-clip relative shrink-0 size-[14.25px]" data-name="toggles/StarFilled">
        <div className="absolute inset-[15.73%_15.56%_18.94%_15.54%]" data-name="Vector">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.8182 9.30915">
            <path d={svgPaths.p63e9900} fill="var(--fill-0, #0F1114)" id="Vector" />
          </svg>
        </div>
      </div>
      <p className="font-['Source_Sans_3',sans-serif] font-normal leading-[0] relative shrink-0 text-[12px] text-[#0f1114] whitespace-nowrap">
        <span className="leading-[18px]">4.9</span>
        <span className="leading-[18px]">{` · `}</span>
        <span className="leading-[18px]">3.4k reviews</span>
      </p>
    </div>
  );
}

function PmProductCard({
  config,
  selected = false,
  onToggleSelect,
  selectionDisabled = false,
}: {
  config: PmResultCardConfig;
  selected?: boolean;
  onToggleSelect?: () => void;
  selectionDisabled?: boolean;
}) {
  const { thumb, shell, logo, partnerInitial, partner, title, description, matchPercent, showAiSkillsTag, meta } =
    config;
  const selectable = Boolean(onToggleSelect);
  const outerRadius = shell === "featured" ? "rounded-[14px]" : "rounded-[14.25px]";
  const selection: SerpCardSelection | null =
    selectable && onToggleSelect
      ? { selected, onToggle: onToggleSelect, title, ...(selectionDisabled ? { disabled: true } : {}) }
      : null;

  return (
    <SerpCardInteractiveWrap selected={selected} interactive={selectable} outerRadiusClass={outerRadius} selectionDisabled={selectionDisabled}>
      <PmCardShell shell={shell}>
        <div className="content-stretch flex h-full min-h-0 w-full flex-col items-start relative rounded-[14.25px]" data-name="Card">
          <SerpCardImageSlot selection={selection}>
            <div className="relative z-[1] w-full shrink-0 aspect-[304/171]">
              <img
                alt=""
                className="pointer-events-none absolute inset-0 size-full max-w-none rounded-[8px] object-cover"
                src={thumb}
              />
            </div>
          </SerpCardImageSlot>
        <div className="relative flex min-h-0 w-full flex-1 flex-col" data-name="Content">
          <div className="flex min-h-0 w-full flex-1 flex-col justify-between gap-[8px] p-[8px]">
            <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="_💠 Header">
              <div className="content-stretch flex gap-[4px] h-[21px] items-center relative shrink-0 w-full min-w-0" data-name="_💠 Partner label">
                <div className="content-stretch flex flex-col items-center justify-center overflow-hidden p-[2px] relative rounded-[2px] shrink-0 size-[24px]" data-name="Avatar">
                  <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[2px] border-[#dae1ed] border-[0.891px] border-solid" />
                  <PmPartnerMark logo={logo} partnerInitial={partnerInitial} partner={partner} />
                </div>
                <p className="min-h-px min-w-px flex-[1_0_0] font-['Source_Sans_3',sans-serif] font-normal leading-[17.813px] text-[12.47px] text-[#5b6780]">
                  {partner}
                </p>
              </div>
              <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="_💠 Title">
                <p className="min-h-px min-w-px flex-[1_0_0] font-['Source_Sans_3'] font-semibold leading-[17.813px] text-[14.25px] tracking-[-0.0428px] text-[#0f1114]">
                  {title}
                </p>
              </div>
            </div>
            <div className="content-stretch flex flex-col gap-[8px] items-start justify-end relative shrink-0 w-full" data-name="_💠 Footer">
              <PmTagsSection
                matchPercent={matchPercent}
                showAiSkillsTag={showAiSkillsTag}
                description={description}
              />
              <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
                <div className="content-stretch flex min-w-0 w-full shrink-0 items-center gap-[2px]" data-name="RatingStat">
                  <PmRatingRow />
                </div>
                <div className="content-stretch flex flex-col items-start justify-center relative shrink-0 w-full" data-name="_💠 Metadata">
                  <p className="content-center flex min-w-0 w-full flex-wrap items-center gap-[4px] font-['Source_Sans_3',sans-serif] font-normal text-[10.688px] leading-[16.031px] text-[#5b6780] whitespace-pre-wrap">
                    {meta}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PmCardShell>
    </SerpCardInteractiveWrap>
  );
}

/** Titles for default SERP ProductCard grid (ProductCard → ProductCard8), for selection aria-labels. */
const SERP_DEFAULT_RESULT_TITLES = [
  "Generative AI: Introduction and Applications",
  "Generative AI for Everyone",
  "Generative AI Leader",
  "IBM Generative AI Engineering",
  "Introduction to Generative AI",
  "Generative AI Engineering with LLMs",
  "Generative AI for Executives",
  "Generative AI for Software Developers",
  "Generative AI for Content Creation",
] as const;

/** Thumbnails aligned with `SERP_DEFAULT_RESULT_TITLES` / ProductCard0–8 (`serp1`–`serp9`). */
const SERP_DEFAULT_THUMBS = [serp1, serp2, serp3, serp4, serp5, serp6, serp7, serp8, serp9] as const;

/** Partner labels from default grid headers (ProductCard0–8). */
const SERP_DEFAULT_PARTNERS = [
  "IBM",
  "DeepLearning.AI",
  "Google Cloud",
  "IBM",
  "Google CLoud",
  "IBM",
  "IBM",
  "IBM",
  "Adobe",
] as const;

const SERP_DEFAULT_META = "Beginner · Course · 1-4 weeks";
const SERP_DEFAULT_RATING = "4.9 · 3.4k reviews";

/** Figma 2219:125198 — compare stripe rows (prototype copy shared across columns). */
const COMPARISON_SKILLS_LINE =
  "Business communication, Human Resources, Interviewing Skills, Verbal Communication";
const COMPARISON_TOOLS_LINE = "ChatGPT, Claude, Gemini, Perplexity AI";
const COMPARISON_HANDS_ON_LINE = "3 coding assignments, 1 role play";
const COMPARISON_SUMMARY_LINE =
  "Learners say the course makes it easy to build practical generative AI skills through hands-on exercises. They find they can quickly apply what they learn to real-world tasks.";

type SerpResultsMode = "default" | "pm_updating" | "pm_results";

type ComparisonMenuAction = "more" | "explore" | "remove";

function getSerpResultIds(mode: SerpResultsMode): string[] {
  if (mode === "default") {
    return Array.from({ length: SERP_DEFAULT_RESULT_TITLES.length }, (_, i) => `default:${i}`);
  }
  if (mode === "pm_results") {
    return Array.from({ length: PM_RESULT_CARDS.length }, (_, i) => `pm:${i}`);
  }
  return [];
}

function pickNextFromPool(current: string[], mode: SerpResultsMode): string | undefined {
  return getSerpResultIds(mode).find((id) => !current.includes(id));
}

function pickReplacementForSlot(
  current: string[],
  slotIndex: number,
  mode: SerpResultsMode,
): string | undefined {
  const others = current.filter((_, i) => i !== slotIndex);
  return getSerpResultIds(mode).find((id) => !others.includes(id) && id !== current[slotIndex]);
}

type ResolvedSerpCourse = {
  id: string;
  title: string;
  partner: string;
  thumb: string;
  meta: string;
  rating: string;
};

type CompareCourseDetail = ResolvedSerpCourse & {
  logo?: string;
  partnerInitial?: string;
  description?: string;
  matchPercent?: number;
  showAiSkillsTag?: boolean;
  recentlyUpdated?: boolean;
  skillsLine: string;
  toolsLine: string;
  handsOnLine: string;
  summaryLine: string;
};

/** Stable IDs: `default:0`…`default:8`, `pm:0`…`pm:5`. */
function resolveSerpCourseId(id: string): ResolvedSerpCourse | null {
  if (id.startsWith("default:")) {
    const idx = Number(id.slice("default:".length));
    if (!Number.isInteger(idx) || idx < 0 || idx >= SERP_DEFAULT_RESULT_TITLES.length) return null;
    return {
      id,
      title: SERP_DEFAULT_RESULT_TITLES[idx],
      partner: SERP_DEFAULT_PARTNERS[idx],
      thumb: SERP_DEFAULT_THUMBS[idx],
      meta: SERP_DEFAULT_META,
      rating: SERP_DEFAULT_RATING,
    };
  }
  if (id.startsWith("pm:")) {
    const idx = Number(id.slice("pm:".length));
    if (!Number.isInteger(idx) || idx < 0 || idx >= PM_RESULT_CARDS.length) return null;
    const c = PM_RESULT_CARDS[idx];
    return {
      id,
      title: c.title,
      partner: c.partner,
      thumb: c.thumb,
      meta: c.meta,
      rating: SERP_DEFAULT_RATING,
    };
  }
  return null;
}

function resolveSelectedCourses(ids: Set<string>): ResolvedSerpCourse[] {
  return Array.from(ids)
    .map((courseId) => resolveSerpCourseId(courseId))
    .filter((c): c is ResolvedSerpCourse => c != null);
}

function partnerLogoForDefaultSerp(partner: string): string | undefined {
  const p = partner.toLowerCase();
  if (p.includes("ibm")) return ibmLogo;
  if (p.includes("google")) return googleLogo;
  if (p.includes("deeplearning")) return deeplearningLogo;
  if (p.includes("adobe")) return adobeLogo;
  if (p.includes("coursera")) return courseraLogo;
  if (p.includes("simplilearn")) return simplilearnLogo;
  if (p.includes("starweaver")) return starweaverLogo;
  if (p.includes("skillup")) return skillupLogo;
  return undefined;
}

function resolveCompareCourseDetail(id: string): CompareCourseDetail | null {
  const base = resolveSerpCourseId(id);
  if (!base) return null;
  const staticRows = {
    skillsLine: COMPARISON_SKILLS_LINE,
    toolsLine: COMPARISON_TOOLS_LINE,
    handsOnLine: COMPARISON_HANDS_ON_LINE,
    summaryLine: COMPARISON_SUMMARY_LINE,
  };
  if (id.startsWith("pm:")) {
    const idx = Number(id.slice("pm:".length));
    if (!Number.isInteger(idx) || idx < 0 || idx >= PM_RESULT_CARDS.length) return null;
    const c = PM_RESULT_CARDS[idx];
    /** SERP cards without a % match still get a lower comparison % so columns align. */
    const comparisonMatchFallback =
      c.matchPercent ??
      (idx >= 3 && idx <= 5 ? ([68, 65, 62] as const)[idx - 3] : 58);
    return {
      ...base,
      logo: c.logo,
      partnerInitial: c.partnerInitial,
      description: c.description,
      matchPercent: comparisonMatchFallback,
      showAiSkillsTag: c.showAiSkillsTag,
      recentlyUpdated: idx === 0,
      ...staticRows,
    };
  }
  if (id.startsWith("default:")) {
    const idx = Number(id.slice("default:".length));
    return {
      ...base,
      logo: partnerLogoForDefaultSerp(base.partner),
      description:
        "This course aligns with your learning priorities. Review the skills and format below to decide if it fits your next step.",
      matchPercent: 72 + (idx % 18),
      showAiSkillsTag: true,
      recentlyUpdated: false,
      ...staticRows,
    };
  }
  return null;
}

/**
 * Figma 2163:34106 — selected course chips above the composer.
 * Shown when the user has confirmed their role and results are in a state where course selection applies:
 * default SERP grid, or personalized results after PM refresh (pm_results).
 */
function ComposerSelectedCoursesAttachment({
  courses,
  onRemove,
}: {
  courses: ResolvedSerpCourse[];
  onRemove: (id: string) => void;
}) {
  if (courses.length === 0) return null;
  return (
    <div className="flex w-full min-w-0 flex-col gap-2" data-name="Composer selected courses">
      <div className="grid w-full min-w-0 grid-cols-2 gap-2">
        {courses.map((c) => (
          <div
            key={c.id}
            className="flex h-[26px] min-h-[26px] max-h-[26px] min-w-0 w-full items-center gap-1 rounded-md border border-[#dae1ed] bg-white px-0.5 py-[3px]"
            data-name="Selected course chip"
          >
            <img alt="" className="size-[22px] shrink-0 rounded-[6px] object-cover" src={c.thumb} />
            <p className="min-w-0 flex-1 truncate font-['Source_Sans_3',sans-serif] text-[11px] leading-[22px] text-[#0f1114]">
              {c.title}
            </p>
            <button
              type="button"
              className="flex size-[22px] shrink-0 cursor-pointer items-center justify-center rounded text-[#5b6780] transition-colors hover:bg-[#f2f5fa] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0056d2]"
              aria-label={`Remove ${c.title}`}
              onClick={() => onRemove(c.id)}
            >
              <img alt="" className="size-3 object-contain opacity-70" src={actionsClose} aria-hidden />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const SINGLE_COURSE_FOLLOW_UP_PILLS = [
  "What skills will I gain?",
  "What tools will I use?",
  "Compare to similar courses",
] as const;

function SingleCourseFollowUpPills({ onSelect }: { onSelect: (label: string) => void }) {
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

function CompareSelectedCoursesPill({
  onClick,
  comparisonActive,
}: {
  onClick: () => void;
  /** True while the multi-column comparison grid is shown. */
  comparisonActive: boolean;
}) {
  const label = comparisonActive ? "Which one is right for me?" : "Compare selected courses";
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Compare selected courses pill">
      <button
        type="button"
        className="bg-white border border-[#dae1ed] border-solid flex gap-[4px] items-center justify-center px-[12px] py-[6px] relative rounded-[8px] shrink-0 max-w-full min-w-0 font-inherit cursor-pointer text-left transition-colors duration-150 hover:bg-[#f8fafc]"
        data-name="Prompt - Compare"
        onClick={onClick}
      >
        <span className="font-['Source_Sans_3',sans-serif] font-normal leading-[20px] text-[14px] text-[#5b6780] min-w-0">
          {label}
        </span>
      </button>
    </div>
  );
}

/** Figma 2261:100753 — comparison card skeleton (match gradient + striped rows). */
function CompareCourseColumnSkeleton() {
  const pulse = "animate-pulse";
  return (
    <div
      className="flex min-h-0 min-w-0 w-full flex-col gap-3"
      data-name="Product cards - compare skeleton"
      aria-hidden
    >
      <div className="flex w-full min-w-0 flex-col items-start overflow-clip rounded-[14.25px] bg-[#f0f6ff] p-1.5">
        <div className="flex w-full min-w-0 flex-col items-start overflow-clip rounded-[8px]">
          <div className="relative isolate aspect-[304/171] w-full shrink-0 overflow-clip rounded-[8px]">
            <div
              className={`absolute inset-0 rounded-[8px] bg-gradient-to-r from-[#f2f5fa] via-[#e8f1ff] via-[64.177%] to-[#f2f5fa] ${pulse}`}
              data-name="Thumbnail skeleton"
            />
          </div>
          <div className="relative flex w-full min-w-0 flex-col rounded-[8px]" data-name="Content">
            <div className="flex w-full min-w-0 flex-col gap-0 bg-[#f0f6ff] px-2 py-1.5" data-name="Header">
              <div className="flex max-w-[239px] flex-col gap-0">
                <div className={`h-3 w-full shrink-0 rounded bg-[#e8eef7] ${pulse}`} />
                <div className={`h-3 w-full shrink-0 rounded bg-[#e8eef7] ${pulse}`} />
                <div className={`h-3 w-[153px] max-w-full shrink-0 rounded bg-[#e8eef7] ${pulse}`} />
              </div>
            </div>

            <div className="flex w-full min-w-0 flex-col gap-0 bg-[#e3eeff] px-2 py-2">
              <div className="flex min-w-0 flex-wrap content-start items-start gap-0.5">
                <div
                  className="h-[22px] w-[78px] shrink-0 rounded-full bg-gradient-to-r from-[#d65d00] to-[#9c1a84]"
                  aria-hidden
                />
                <div className="flex h-[22px] shrink-0 items-center justify-center rounded-full border border-[#dae1ed] bg-white px-2 py-1">
                  <div className={`h-2 w-[52px] rounded bg-[#e8eef7] ${pulse}`} />
                </div>
                <div className="flex h-[22px] w-[107px] shrink-0 items-center justify-center rounded-full border border-[#dae1ed] bg-white px-2 py-1">
                  <div className={`h-2 w-[91px] rounded bg-[#e8eef7] ${pulse}`} />
                </div>
              </div>
              <div className="flex flex-col gap-0">
                <div className={`h-3 w-full rounded bg-[#c1cad9]/30 ${pulse}`} />
                <div className={`h-3 w-full rounded bg-[#c1cad9]/30 ${pulse}`} />
                <div className={`h-3 w-full rounded bg-[#c1cad9]/30 ${pulse}`} />
                <div className={`h-3 w-[150px] max-w-full rounded bg-[#c1cad9]/30 ${pulse}`} />
              </div>
            </div>

            <div className="bg-[#f0f6ff] px-2 py-2">
              <div className="flex flex-col gap-0">
                <div className={`h-3 w-[209px] max-w-full rounded bg-[#e8eef7] ${pulse}`} />
                <div className={`h-3 w-[209px] max-w-full rounded bg-[#e8eef7] ${pulse}`} />
              </div>
            </div>
            <div className="bg-[#e3eeff] px-2 py-1">
              <div className={`h-3 w-[150px] max-w-full rounded bg-[#c1cad9]/30 ${pulse}`} />
            </div>
            <div className="bg-[#f0f6ff] px-2 py-1">
              <div className={`h-3 w-[150px] max-w-full rounded bg-[#e8eef7] ${pulse}`} />
            </div>
            <div className="flex w-full min-w-0 flex-col gap-0 bg-[#e3eeff] px-2 py-1">
              <div className={`h-3 w-[150px] max-w-full rounded bg-[#c1cad9]/30 ${pulse}`} />
              <div className="flex flex-col gap-0 pt-0">
                <div className={`h-3 w-full rounded bg-[#c1cad9]/30 ${pulse}`} />
                <div className={`h-3 w-full rounded bg-[#c1cad9]/30 ${pulse}`} />
                <div className={`h-3 w-full rounded bg-[#c1cad9]/30 ${pulse}`} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex w-full min-w-0 flex-col gap-3">
        <div className={`h-9 w-full shrink-0 rounded bg-[#e8eef7] ${pulse}`} data-name="Button skeleton" />
        <div className={`h-9 w-full shrink-0 rounded bg-[#e8eef7] ${pulse}`} data-name="Button skeleton" />
      </div>
    </div>
  );
}

/** Row keys for cross-column height sync (sm+); each row uses max height across cards. */
const COMPARE_SYNC_ROW_KEYS = [
  "partner",
  "title",
  "meta",
  "pills",
  "description",
  "skills",
  "tools",
  "handsOn",
  "ratingSummary",
] as const;
type CompareSyncRowKey = (typeof COMPARE_SYNC_ROW_KEYS)[number];

/** Figma 2219:125198 — side-by-side comparison cards (tinted stripes, match tags, CTAs). */
function CompareCourseColumn({
  course,
  registerRowRef,
  rowMinHeights,
  columnCount,
  canExploreAlternatives,
  onMenuAction,
}: {
  course: CompareCourseDetail;
  registerRowRef: (key: CompareSyncRowKey) => (el: HTMLElement | null) => void;
  rowMinHeights?: Partial<Record<CompareSyncRowKey, number>>;
  columnCount: number;
  canExploreAlternatives: boolean;
  onMenuAction: (action: ComparisonMenuAction) => void;
}) {
  const {
    thumb,
    logo,
    partnerInitial,
    partner,
    title,
    meta,
    rating,
    description,
    matchPercent,
    showAiSkillsTag,
    recentlyUpdated,
    skillsLine,
    toolsLine,
    handsOnLine,
    summaryLine,
  } = course;
  const matchPct = matchPercent ?? 58;
  const rh = rowMinHeights;
  const reg = registerRowRef;

  return (
    <div className="flex min-h-0 min-w-0 w-full flex-col gap-3" data-name="Product cards - compare">
      <div
        className="flex w-full min-w-0 flex-col items-start overflow-clip rounded-[14.25px] bg-[#f0f6ff] p-1.5"
        data-name="ProductCard - compare"
      >
        <div className="flex w-full min-w-0 flex-col items-start overflow-clip rounded-[8px]" data-name="Card">
          <div className="group/card relative isolate w-full shrink-0 overflow-clip rounded-[8px] aspect-[304/171]">
            <img
              alt=""
              className="pointer-events-none absolute inset-0 size-full max-w-none rounded-[8px] object-cover"
              src={thumb}
            />
            <div
              className="pointer-events-none absolute inset-0 rounded-[8px] bg-black/0 transition-colors group-hover/card:bg-black/20 group-focus-within/card:bg-black/20"
              aria-hidden
            />
            <div className="absolute top-1 right-1 z-[2] opacity-0 transition-opacity group-hover/card:opacity-100 group-focus-within/card:opacity-100 has-[button[data-state=open]]:opacity-100">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="pointer-events-auto flex size-8 items-center justify-center rounded-md text-white outline-none transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white/80"
                    aria-label="Course menu"
                  >
                    <MoreVertical className="size-5" strokeWidth={2} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="bottom"
                  align="end"
                  sideOffset={8}
                  className="min-w-[240px] rounded-2xl border border-[#e8eef7] bg-white p-2 shadow-lg"
                >
                  {columnCount < MAX_SELECTED_COURSES ? (
                    <DropdownMenuItem
                      className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2.5 font-['Source_Sans_3',sans-serif] text-[14px] text-[#0f1114] focus:bg-[#f2f5fa]"
                      onSelect={() => onMenuAction("more")}
                    >
                      <span>More like this</span>
                      <img alt="" className="size-5 shrink-0 object-contain" src={sparkleIcon} aria-hidden />
                    </DropdownMenuItem>
                  ) : null}
                  <DropdownMenuItem
                    className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2.5 font-['Source_Sans_3',sans-serif] text-[14px] text-[#0f1114] focus:bg-[#f2f5fa] data-[disabled]:pointer-events-none data-[disabled]:opacity-40"
                    disabled={!canExploreAlternatives}
                    onSelect={() => onMenuAction("explore")}
                  >
                    <span>Explore alternatives</span>
                    <img alt="" className="size-5 shrink-0 object-contain" src={reloadIcon} aria-hidden />
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2.5 font-['Source_Sans_3',sans-serif] text-[14px] text-[#0f1114] focus:bg-[#f2f5fa] data-[highlighted]:text-[#0f1114]"
                    onSelect={() => onMenuAction("remove")}
                  >
                    <span>Remove</span>
                    <Trash2 className="size-5 shrink-0 text-[#5b6780]" aria-hidden />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="relative flex w-full min-w-0 flex-col rounded-[8px]" data-name="Content">
            <div
              className="flex w-full min-w-0 flex-col gap-0 bg-[#f0f6ff] px-2 py-1.5"
              data-name="Header"
            >
              <div
                ref={reg("partner")}
                style={rh?.partner != null ? { minHeight: rh.partner } : undefined}
                className="flex min-h-6 w-full min-w-0 items-center gap-0.5"
                data-name="Partner label"
              >
                <div className="relative flex size-6 shrink-0 flex-col items-center justify-center overflow-hidden rounded-[2px] p-[2px]">
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 rounded-[2px] border-[0.891px] border-solid border-[#dae1ed]"
                  />
                  <PmPartnerMark logo={logo} partnerInitial={partnerInitial} partner={partner} />
                </div>
                <p className="line-clamp-1 min-h-px min-w-0 flex-[1_0_0] font-['Source_Sans_3',sans-serif] font-normal leading-[17.813px] text-[12.47px] text-[#5b6780]">
                  {partner}
                </p>
              </div>
              <div
                className="flex w-full min-w-0 flex-col gap-0 px-0 pt-0 text-[#0f1114]"
                data-name="Title"
              >
                <p
                  ref={reg("title")}
                  style={rh?.title != null ? { minHeight: rh.title } : undefined}
                  className="line-clamp-3 w-full font-['Source_Sans_3',sans-serif] font-semibold text-[16px] leading-[20px] tracking-[-0.048px]"
                >
                  {title}
                </p>
                <p
                  ref={reg("meta")}
                  style={rh?.meta != null ? { minHeight: rh.meta } : undefined}
                  className="line-clamp-2 min-w-0 w-full font-['Source_Sans_3',sans-serif] font-normal text-[12px] leading-[18px] text-[#0f1114]"
                >
                  {meta}
                </p>
              </div>
            </div>

            <div className="flex w-full min-w-0 flex-col gap-0 bg-[#e3eeff] px-2 py-2">
              <div
                ref={reg("pills")}
                style={rh?.pills != null ? { minHeight: rh.pills } : undefined}
                className="flex min-w-0 flex-wrap content-start items-start gap-0.5 pb-1"
                data-name="Compare tags row"
              >
                <div className="flex h-[22px] shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-[#d65d00] to-[#9c1a84] px-[7px]">
                  <span className="font-['Source_Sans_3',sans-serif] font-semibold text-[13px] leading-[22px] text-white whitespace-nowrap">
                    {matchPct}% match
                  </span>
                </div>
                {showAiSkillsTag ? (
                  <div className="flex h-[22px] shrink-0 items-center justify-center rounded-full border border-[#dae1ed] bg-white px-[7px]">
                    <span className="font-['Source_Sans_3',sans-serif] font-normal text-[13px] leading-[22px] text-[#5b6780] whitespace-nowrap">
                      AI Skills
                    </span>
                  </div>
                ) : null}
                {recentlyUpdated ? (
                  <div className="flex h-[22px] shrink-0 items-center justify-center rounded-full border border-[#dae1ed] bg-white px-[7px]">
                    <span className="font-['Source_Sans_3',sans-serif] font-normal text-[13px] leading-[22px] text-[#5b6780] whitespace-nowrap">
                      Recently updated
                    </span>
                  </div>
                ) : null}
              </div>
              <div
                ref={reg("description")}
                style={rh?.description != null ? { minHeight: rh.description } : undefined}
                className="w-full min-w-0 flex-1"
              >
                {description ? (
                  <p className="line-clamp-5 font-['Source_Sans_3',sans-serif] font-normal text-[12px] leading-[18px] text-[#0f1114]">
                    {description}
                  </p>
                ) : null}
              </div>
            </div>

            <div
              ref={reg("skills")}
              style={rh?.skills != null ? { minHeight: rh.skills } : undefined}
              className="bg-[#f0f6ff] px-2 py-2"
            >
              <p className="font-['Source_Sans_3',sans-serif] text-[12px] leading-[18px] text-[#0f1114]">
                <span className="font-bold">Skills: </span>
                <span className="font-normal">{skillsLine}</span>
              </p>
            </div>
            <div
              ref={reg("tools")}
              style={rh?.tools != null ? { minHeight: rh.tools } : undefined}
              className="bg-[#e3eeff] px-2 py-1"
            >
              <p className="font-['Source_Sans_3',sans-serif] text-[12px] leading-[18px] text-[#0f1114]">
                <span className="font-bold">Tools: </span>
                <span className="font-normal">{toolsLine}</span>
              </p>
            </div>
            <div
              ref={reg("handsOn")}
              style={rh?.handsOn != null ? { minHeight: rh.handsOn } : undefined}
              className="bg-[#f0f6ff] px-2 py-1"
            >
              <p className="font-['Source_Sans_3',sans-serif] text-[12px] leading-[18px] text-[#0f1114]">
                <span className="font-bold">Hands-on learning: </span>
                <span className="font-normal">{handsOnLine}</span>
              </p>
            </div>
            <div
              ref={reg("ratingSummary")}
              style={rh?.ratingSummary != null ? { minHeight: rh.ratingSummary } : undefined}
              className="flex w-full min-w-0 flex-col gap-0 bg-[#e3eeff] px-2 py-1"
            >
              <div className="flex items-center gap-0.5" data-name="RatingStat">
                <div className="relative shrink-0 overflow-clip size-[14.25px]" data-name="toggles/StarFilled">
                  <div className="absolute inset-[15.73%_15.56%_18.94%_15.54%]" data-name="Vector">
                    <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.8182 9.30915">
                      <path d={svgPaths.p63e9900} fill="var(--fill-0, #0F1114)" id="Vector" />
                    </svg>
                  </div>
                </div>
                <p className="font-['Source_Sans_3',sans-serif] font-normal text-[12px] leading-[18px] text-[#0f1114]">
                  {rating}
                </p>
              </div>
              <p className="font-['Source_Sans_3',sans-serif] text-[12px] leading-[18px] text-[#0f1114]">
                <span className="font-bold">Summary: </span>
                <span className="font-normal">{summaryLine}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex w-full min-w-0 flex-col gap-3">
        <button
          type="button"
          className="w-full rounded-lg bg-[#0056d2] px-4 py-2.5 font-['Source_Sans_3',sans-serif] text-[14px] font-semibold leading-[20px] text-white transition-colors hover:bg-[#004cbd] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0056d2]"
        >
          Enroll
        </button>
        <button
          type="button"
          className="w-full rounded-lg border border-[#0056d2] bg-white px-4 py-2.5 font-['Source_Sans_3',sans-serif] text-[14px] font-semibold leading-[20px] text-[#0056d2] transition-colors hover:bg-[#f8fafc] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0056d2]"
        >
          Create a learning plan
        </button>
      </div>
    </div>
  );
}

function CourseComparisonView({
  courses,
  onBack,
  serpResultsMode,
  loadingColumnIndexes,
  onComparisonMenuAction,
}: {
  courses: ResolvedSerpCourse[];
  onBack: () => void;
  serpResultsMode: SerpResultsMode;
  loadingColumnIndexes: ReadonlySet<number>;
  onComparisonMenuAction: (action: ComparisonMenuAction, columnIndex: number) => void;
}) {
  const courseKey = useMemo(() => courses.map((c) => c.id).join("|"), [courses]);
  const rows = useMemo(
    () =>
      courses
        .map((c) => resolveCompareCourseDetail(c.id))
        .filter((d): d is CompareCourseDetail => d != null),
    [courseKey]
  );
  const poolMode: SerpResultsMode = serpResultsMode === "pm_results" ? "pm_results" : "default";
  const courseIds = useMemo(() => rows.map((r) => r.id), [rows]);
  const canExploreAtIndex = useMemo(
    () => courseIds.map((_, i) => pickReplacementForSlot(courseIds, i, poolMode) != null),
    [courseIds, poolMode],
  );

  const [compareColumnsReady, setCompareColumnsReady] = useState(false);
  const compareRowRefs = useRef<Partial<Record<CompareSyncRowKey, (HTMLElement | null)[]>>>({});
  const [compareRowMinHeights, setCompareRowMinHeights] = useState<
    Partial<Record<CompareSyncRowKey, number>>
  >({});
  const [compareSyncRows, setCompareSyncRows] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(min-width: 640px)").matches
  );

  /** Initial full-grid load only; column swaps use `loadingColumnIndexes` without blanking the grid. */
  useEffect(() => {
    setCompareColumnsReady(false);
    const id = window.setTimeout(() => setCompareColumnsReady(true), 650);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");
    const onChange = () => setCompareSyncRows(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useLayoutEffect(() => {
    setCompareRowMinHeights({});
    compareRowRefs.current = {};
  }, [courseKey]);

  useLayoutEffect(() => {
    if (!compareColumnsReady || !compareSyncRows || rows.length < 2) {
      setCompareRowMinHeights({});
      return;
    }
    const measure = () => {
      const next: Partial<Record<CompareSyncRowKey, number>> = {};
      for (const key of COMPARE_SYNC_ROW_KEYS) {
        const cells = compareRowRefs.current[key];
        if (!cells) continue;
        const heights = rows.map((_, i) =>
          loadingColumnIndexes.has(i) ? 0 : cells[i]?.getBoundingClientRect().height ?? 0,
        );
        const max = Math.max(...heights, 0);
        if (max > 0) next[key] = max;
      }
      setCompareRowMinHeights(next);
    };
    measure();
    const ro =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => {
            requestAnimationFrame(measure);
          })
        : null;
    for (const key of COMPARE_SYNC_ROW_KEYS) {
      const cells = compareRowRefs.current[key];
      if (!cells) continue;
      for (const el of cells) {
        if (el && ro) ro.observe(el);
      }
    }
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("resize", measure);
      ro?.disconnect();
    };
  }, [compareColumnsReady, compareSyncRows, courseKey, rows, loadingColumnIndexes]);

  if (courses.length < 2) return null;
  if (rows.length < 2) return null;
  const n = rows.length;
  return (
    <div className="w-full min-w-0" data-name="Course comparison">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <p className="font-['Source_Sans_3',sans-serif] font-semibold text-[20px] leading-[24px] text-[#0f1114] tracking-[-0.06px]">
          Comparing {n} courses
        </p>
        <button
          type="button"
          className="shrink-0 rounded-lg bg-white px-3 py-1.5 font-['Source_Sans_3',sans-serif] text-[14px] leading-[20px] text-[#0056d2] transition-colors hover:bg-[#f8fafc] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0056d2]"
          onClick={onBack}
        >
          Back to results
        </button>
      </div>
      <div
        className={`grid w-full min-w-0 items-stretch gap-4 ${
          n === 2 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-3"
        }`}
        aria-busy={!compareColumnsReady || loadingColumnIndexes.size > 0}
        aria-label={compareColumnsReady ? undefined : "Loading comparison details"}
      >
        {compareColumnsReady
          ? rows.map((c, i) =>
              loadingColumnIndexes.has(i) ? (
                <CompareCourseColumnSkeleton key={`sk-col-${i}-${c.id}`} />
              ) : (
                <CompareCourseColumn
                  key={c.id}
                  course={c}
                  columnCount={rows.length}
                  canExploreAlternatives={canExploreAtIndex[i] ?? false}
                  onMenuAction={(action) => onComparisonMenuAction(action, i)}
                  registerRowRef={(key) => (el) => {
                    const slot = compareRowRefs.current[key] ?? (compareRowRefs.current[key] = []);
                    slot[i] = el;
                  }}
                  rowMinHeights={compareSyncRows ? compareRowMinHeights : undefined}
                />
              ),
            )
          : Array.from({ length: n }, (_, i) => <CompareCourseColumnSkeleton key={`sk-${i}`} />)}
      </div>
    </div>
  );
}

/** Figma 2109:67364 — product-management + GenAI personalized results. */
function ListPmFiltered({
  selectedIds,
  onToggle,
}: {
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
}) {
  const limitReached = selectedIds.size >= MAX_SELECTED_COURSES;
  return (
    <div className="grid w-full min-w-0 grid-cols-3 gap-4 items-stretch" data-name="List">
      {PM_RESULT_CARDS.map((config, i) => (
        <div key={`${config.title}-${i}`} className="flex h-full min-h-0 flex-col items-stretch relative min-w-0 w-full" data-name="Product cards">
          <PmProductCard
            config={config}
            selected={selectedIds.has(`pm:${i}`)}
            onToggleSelect={() => onToggle(`pm:${i}`)}
            selectionDisabled={limitReached && !selectedIds.has(`pm:${i}`)}
          />
        </div>
      ))}
      <div className="col-span-full w-full min-w-0">
        <Frame7Pm />
      </div>
    </div>
  );
}

function List({
  selectedIds,
  onToggle,
}: {
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
}) {
  const limitReached = selectedIds.size >= MAX_SELECTED_COURSES;
  return (
    <div
      className="grid w-full min-w-0 grid-cols-3 gap-3 items-stretch"
      data-name="List"
    >
      <div className="flex h-full min-h-0 flex-col items-stretch relative min-w-0 w-full" data-name="Product cards">
        <ProductCard
          selected={selectedIds.has("default:0")}
          onToggleSelect={() => onToggle("default:0")}
          title={SERP_DEFAULT_RESULT_TITLES[0]}
          selectionDisabled={limitReached && !selectedIds.has("default:0")}
        />
      </div>
      <div className="flex h-full min-h-0 flex-col items-stretch relative min-w-0 w-full" data-name="Product cards">
        <ProductCard1
          selected={selectedIds.has("default:1")}
          onToggleSelect={() => onToggle("default:1")}
          title={SERP_DEFAULT_RESULT_TITLES[1]}
          selectionDisabled={limitReached && !selectedIds.has("default:1")}
        />
      </div>
      <div className="flex h-full min-h-0 flex-col items-stretch relative min-w-0 w-full" data-name="Product cards">
        <ProductCard2
          selected={selectedIds.has("default:2")}
          onToggleSelect={() => onToggle("default:2")}
          title={SERP_DEFAULT_RESULT_TITLES[2]}
          selectionDisabled={limitReached && !selectedIds.has("default:2")}
        />
      </div>
      <div className="flex h-full min-h-0 flex-col items-stretch relative min-w-0 w-full" data-name="Product cards">
        <ProductCard3
          selected={selectedIds.has("default:3")}
          onToggleSelect={() => onToggle("default:3")}
          title={SERP_DEFAULT_RESULT_TITLES[3]}
          selectionDisabled={limitReached && !selectedIds.has("default:3")}
        />
      </div>
      <div className="flex h-full min-h-0 flex-col items-stretch relative min-w-0 w-full" data-name="Product cards">
        <ProductCard4
          selected={selectedIds.has("default:4")}
          onToggleSelect={() => onToggle("default:4")}
          title={SERP_DEFAULT_RESULT_TITLES[4]}
          selectionDisabled={limitReached && !selectedIds.has("default:4")}
        />
      </div>
      <div className="flex h-full min-h-0 flex-col items-stretch relative min-w-0 w-full" data-name="Product cards">
        <ProductCard5
          selected={selectedIds.has("default:5")}
          onToggleSelect={() => onToggle("default:5")}
          title={SERP_DEFAULT_RESULT_TITLES[5]}
          selectionDisabled={limitReached && !selectedIds.has("default:5")}
        />
      </div>
      <div className="col-span-full w-full min-w-0">
        <Frame7 />
      </div>
      <div className="flex h-full min-h-0 flex-col items-stretch relative min-w-0 w-full" data-name="Product cards">
        <ProductCard6
          selected={selectedIds.has("default:6")}
          onToggleSelect={() => onToggle("default:6")}
          title={SERP_DEFAULT_RESULT_TITLES[6]}
          selectionDisabled={limitReached && !selectedIds.has("default:6")}
        />
      </div>
      <div className="flex h-full min-h-0 flex-col items-stretch relative min-w-0 w-full" data-name="Product cards">
        <ProductCard7
          selected={selectedIds.has("default:7")}
          onToggleSelect={() => onToggle("default:7")}
          title={SERP_DEFAULT_RESULT_TITLES[7]}
          selectionDisabled={limitReached && !selectedIds.has("default:7")}
        />
      </div>
      <div className="flex h-full min-h-0 flex-col items-stretch relative min-w-0 w-full" data-name="Product cards">
        <ProductCard8
          selected={selectedIds.has("default:8")}
          onToggleSelect={() => onToggle("default:8")}
          title={SERP_DEFAULT_RESULT_TITLES[8]}
          selectionDisabled={limitReached && !selectedIds.has("default:8")}
        />
      </div>
    </div>
  );
}

/** Figma Status (2109:67361): "Updating recs" vs "Recs updated" (content/Check + green copy). */
function RecommendationStatus({ recommendationsReady }: { recommendationsReady: boolean }) {
  if (recommendationsReady) {
    return (
      <div className="content-stretch flex gap-[6px] items-center py-[8px] relative shrink-0" data-name="Status">
        <div className="overflow-clip relative shrink-0 size-[16px]" aria-hidden="true" data-name="content/Check">
          <div className="absolute inset-[29.27%_21.88%]" data-name="Vector">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9 7">
              <path
                d="M1 3.5L3.5 6L8 1"
                stroke="#087051"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
        <p className="font-['Source_Sans_3',sans-serif] font-normal leading-[18px] relative shrink-0 text-[12px] text-[#087051] whitespace-nowrap">
          Recommendations updated
        </p>
      </div>
    );
  }
  return (
    <div className="content-stretch flex gap-[6px] items-center py-[8px] relative shrink-0" data-name="Status">
      <div className="relative shrink-0 size-[16px]" aria-hidden="true" data-name="actions/Reload">
        <img
          src={loadingIcon}
          alt=""
          className="block size-full object-contain animate-[spin_2.5s_linear_infinite]"
          style={{ transformOrigin: "50% 50%" }}
        />
      </div>
      <p className="font-['Source_Sans_3',sans-serif] font-normal leading-[18px] relative shrink-0 text-[12px] text-[#5b6780] whitespace-nowrap">
        Updating your recommendations…
      </p>
    </div>
  );
}

const aiMessageActionBtnClass =
  "flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg border-0 bg-transparent p-0 text-[#6d7c99] transition-colors hover:bg-[#f2f5fa] hover:text-[#0f1114] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0056d2]";

/** AI assistant reply toolbar: thumbs, copy, regenerate, more (Figma Actions / message feedback row). */
function Actions() {
  return (
    <div
      className="content-stretch flex flex-wrap gap-0 items-center min-h-[32px] pt-2 relative shrink-0"
      data-name="Actions"
    >
      <button type="button" className={aiMessageActionBtnClass} aria-label="Helpful response" data-name="toggles/ThumbsUp">
        <img alt="" src={actionsThumbsUp} className="size-4 shrink-0 object-contain" aria-hidden />
      </button>
      <button type="button" className={aiMessageActionBtnClass} aria-label="Not helpful" data-name="toggles/ThumbsDown">
        <img alt="" src={actionsThumbsDown} className="size-4 shrink-0 object-contain" aria-hidden />
      </button>
      <button type="button" className={aiMessageActionBtnClass} aria-label="Copy response" data-name="actions/Copy">
        <img alt="" src={actionsCopy} className="size-4 shrink-0 object-contain" aria-hidden />
      </button>
      <button type="button" className={aiMessageActionBtnClass} aria-label="Regenerate response" data-name="actions/Reload">
        <img alt="" src={actionsReload} className="size-4 shrink-0 object-contain" aria-hidden />
      </button>
      <button type="button" className={aiMessageActionBtnClass} aria-label="More actions" data-name="actions/More">
        <img alt="" src={actionsMore} className="size-4 shrink-0 object-contain" aria-hidden />
      </button>
    </div>
  );
}

const PRODUCT_MANAGER_TITLE = "Product Manager";

/** Segments for opening assistant typewriter — `bold` applies as those characters stream in. */
const FIRST_AI_SEGMENTS = [
  {
    text: `You can leverage generative AI\u00a0to boost productivity by automating routine tasks, such as summarizing meetings, drafting emails, and organizing data, allowing you to focus on high-value creative and strategic work. Actively adopt tools like ChatGPT or Gemini to brainstorm ideas, analyze large documents, create content, and generate code, treating them as collaborative partners rather than just automated tools.

To recommend the best fit, `,
  },
  { text: `what\u2019s your current role?`, bold: true },
] as const;

const FIRST_AI_RESPONSE_PLAINTEXT = FIRST_AI_SEGMENTS.map((s) => s.text).join("");

/** Segments for PM follow-up typewriter — bold phrases match the final list styling. */
const PM_AI_SEGMENTS = [
  { text: "As a Product Manager, Generative AI can immediately help you with:\n\n" },
  { text: "• Writing clearer " },
  { text: "PRDs and specs", bold: true },
  { text: "\n• Synthesizing " },
  { text: "user research and feedback", bold: true },
  { text: "\n• Generating " },
  { text: "roadmap options", bold: true },
  { text: "\n• Drafting " },
  { text: "stakeholder updates", bold: true },
  { text: "\n\nI'll focus on short, practical lessons with reusable prompt frameworks you can apply right away." },
] as const;

const PRODUCT_MANAGER_AI_PLAINTEXT = PM_AI_SEGMENTS.map((s) => s.text).join("");

const REFINE_RECOMMENDATIONS_QUESTION =
  "Would you like me to refine these recommendations further?";

const AI_TYPEWRITER_INITIAL_DELAY_MS = 200;
const AI_TYPE_MS_PER_STEP = 12;
const AI_CHARS_PER_STEP = 3;

/** Main SERP skeleton + chat “Updating recommendations…” duration after PM assistant completes. */
const PM_RECOMMENDATIONS_REFRESH_MS = 2600;

const AI_TYPING_BOLD_CLASS = "font-['Source_Sans_3',sans-serif] font-bold leading-[21px]";

function AiResponseTypingBlock({
  segments,
  typedLen,
}: {
  segments: readonly { text: string; bold?: boolean }[];
  typedLen: number;
}) {
  let remaining = typedLen;
  const parts: ReactNode[] = [];
  let partKey = 0;
  for (const seg of segments) {
    if (remaining <= 0) break;
    const take = Math.min(seg.text.length, remaining);
    if (take > 0) {
      const chunk = seg.text.slice(0, take);
      parts.push(
        seg.bold ? (
          <span key={partKey} className={AI_TYPING_BOLD_CLASS}>
            {chunk}
          </span>
        ) : (
          <span key={partKey}>{chunk}</span>
        ),
      );
      partKey += 1;
      remaining -= take;
    }
  }

  return (
    <div className="relative shrink-0 w-full" data-name="Individual chat inputs">
      <div className="content-stretch flex flex-col gap-[8px] items-start px-[16px] relative w-full">
        <p className="font-['Source_Sans_3',sans-serif] font-normal leading-[21px] min-w-0 w-full max-w-full text-[14px] text-[#0f1114] whitespace-pre-wrap">
          {parts}
          <span
            className="inline-block w-px h-[14px] ml-0.5 bg-[#0f1114] animate-pulse"
            style={{ verticalAlign: "-0.15em" }}
            aria-hidden="true"
          />
        </p>
      </div>
    </div>
  );
}

function FirstAiResponseSequence() {
  const [phase, setPhase] = useState<"delay" | "typing" | "done">("delay");
  const [typedLen, setTypedLen] = useState(0);

  useEffect(() => {
    if (phase !== "delay") return;
    const id = window.setTimeout(() => setPhase("typing"), AI_TYPEWRITER_INITIAL_DELAY_MS);
    return () => window.clearTimeout(id);
  }, [phase]);

  useEffect(() => {
    if (phase !== "typing") return;
    if (typedLen >= FIRST_AI_RESPONSE_PLAINTEXT.length) {
      setPhase("done");
      return;
    }
    const id = window.setTimeout(() => {
      setTypedLen((n) => Math.min(n + AI_CHARS_PER_STEP, FIRST_AI_RESPONSE_PLAINTEXT.length));
    }, AI_TYPE_MS_PER_STEP);
    return () => window.clearTimeout(id);
  }, [phase, typedLen]);

  return (
    <>
      {phase === "typing" ? (
        <AiResponseTypingBlock segments={FIRST_AI_SEGMENTS} typedLen={typedLen} />
      ) : null}
      {phase === "done" ? (
        <div className="relative shrink-0 w-full" data-name="Individual chat inputs">
          <div className="content-stretch flex flex-col gap-[8px] items-start px-[16px] relative w-full">
            <div className="flex flex-col font-['Source_Sans_3',sans-serif] font-normal justify-center leading-[0] min-w-0 w-full max-w-full relative shrink-0 text-[0px] text-[14px] text-[#0f1114] whitespace-pre-wrap">
              <p className="leading-[21px] mb-0">
                You can leverage generative AI to boost productivity by automating routine tasks, such as summarizing meetings, drafting emails, and organizing data, allowing you to focus on high-value creative and strategic work. Actively adopt tools like ChatGPT or Gemini to brainstorm ideas, analyze large documents, create content, and generate code, treating them as collaborative partners rather than just automated tools.
              </p>
              <p>
                <span className="leading-[21px]">
                  <br aria-hidden="true" />
                  {`To recommend the best fit, `}
                </span>
                <span className="font-['Source_Sans_3',sans-serif] font-bold leading-[21px]">what’s your current role?</span>
              </p>
            </div>
            <Actions />
          </div>
        </div>
      ) : null}
    </>
  );
}

function ProductManagerFollowUpSequence({
  onFlowComplete,
  recommendationsReady,
  onUserMessageMounted,
}: {
  onFlowComplete?: () => void;
  recommendationsReady: boolean;
  onUserMessageMounted?: (el: HTMLElement) => void;
}) {
  const [phase, setPhase] = useState<"chip" | "typing" | "done">("chip");
  const [typedLen, setTypedLen] = useState(0);
  const [refineTypedLen, setRefineTypedLen] = useState(0);
  const completionFiredRef = useRef(false);

  useEffect(() => {
    if (phase !== "done" || completionFiredRef.current) return;
    completionFiredRef.current = true;
    onFlowComplete?.();
  }, [phase, onFlowComplete]);

  useEffect(() => {
    if (phase !== "chip") return;
    const id = window.setTimeout(() => setPhase("typing"), AI_TYPEWRITER_INITIAL_DELAY_MS);
    return () => window.clearTimeout(id);
  }, [phase]);

  useEffect(() => {
    if (phase !== "typing") return;
    if (typedLen >= PRODUCT_MANAGER_AI_PLAINTEXT.length) {
      setPhase("done");
      return;
    }
    const id = window.setTimeout(() => {
      setTypedLen((n) => Math.min(n + AI_CHARS_PER_STEP, PRODUCT_MANAGER_AI_PLAINTEXT.length));
    }, AI_TYPE_MS_PER_STEP);
    return () => window.clearTimeout(id);
  }, [phase, typedLen]);

  useEffect(() => {
    if (!recommendationsReady) {
      setRefineTypedLen(0);
    }
  }, [recommendationsReady]);

  useEffect(() => {
    if (!recommendationsReady || refineTypedLen >= REFINE_RECOMMENDATIONS_QUESTION.length) return;
    const id = window.setTimeout(() => {
      setRefineTypedLen((n) => Math.min(n + AI_CHARS_PER_STEP, REFINE_RECOMMENDATIONS_QUESTION.length));
    }, AI_TYPE_MS_PER_STEP);
    return () => window.clearTimeout(id);
  }, [recommendationsReady, refineTypedLen]);

  return (
    <>
      <UserMessageChip key="user-turn-product-manager" onUserMessageMounted={onUserMessageMounted}>
        {PRODUCT_MANAGER_TITLE}
      </UserMessageChip>
      {phase === "typing" ? (
        <AiResponseTypingBlock segments={PM_AI_SEGMENTS} typedLen={typedLen} />
      ) : null}
      {phase === "done" ? (
        <div className="relative shrink-0 w-full" data-name="Individual chat inputs">
          <div className="content-stretch flex flex-col gap-[8px] items-start px-[16px] relative w-full">
            <div className="flex flex-col font-['Source_Sans_3',sans-serif] font-normal justify-center leading-[0] min-w-0 w-full max-w-full relative shrink-0 text-[0px] text-[14px] text-[#0f1114] whitespace-pre-wrap">
              <p className="leading-[21px] mb-0 whitespace-pre-wrap">
                As a Product Manager, Generative AI can immediately help you with:
              </p>
              <ul className="list-disc mb-0">
                <li className="mb-0 ms-[24px]">
                  <span className="leading-[21px]">{`Writing clearer `}</span>
                  <span className="font-['Source_Sans_3',sans-serif] font-bold leading-[21px]">PRDs and specs</span>
                </li>
                <li className="mb-0 ms-[24px]">
                  <span className="leading-[21px]">{`Synthesizing `}</span>
                  <span className="font-['Source_Sans_3',sans-serif] font-bold leading-[21px]">user research and feedback</span>
                </li>
                <li className="mb-0 ms-[24px]">
                  <span className="leading-[21px]">{`Generating `}</span>
                  <span className="font-['Source_Sans_3',sans-serif] font-bold leading-[21px]">roadmap options</span>
                </li>
                <li className="ms-[24px]">
                  <span className="leading-[21px]">{`Drafting `}</span>
                  <span className="font-['Source_Sans_3',sans-serif] font-bold leading-[21px]">stakeholder updates</span>
                </li>
              </ul>
              <p className="leading-[21px] mb-0 whitespace-pre-wrap">&nbsp;</p>
              <p className="leading-[21px] whitespace-pre-wrap">
                I’ll focus on short, practical lessons with reusable prompt frameworks you can apply right away.
              </p>
            </div>
            <RecommendationStatus recommendationsReady={recommendationsReady} />
            {recommendationsReady ? (
              <p className="font-['Source_Sans_3',sans-serif] font-bold leading-[21px] min-w-0 w-full max-w-full text-[14px] text-[#0f1114]">
                {REFINE_RECOMMENDATIONS_QUESTION.slice(0, refineTypedLen)}
                {refineTypedLen < REFINE_RECOMMENDATIONS_QUESTION.length ? (
                  <span
                    className="inline-block w-px h-[14px] ml-0.5 bg-[#0f1114] animate-pulse"
                    style={{ verticalAlign: "-0.15em" }}
                    aria-hidden
                  />
                ) : null}
              </p>
            ) : null}
            <Actions />
          </div>
        </div>
      ) : null}
    </>
  );
}

function UserMessageChip({
  children,
  onUserMessageMounted,
}: {
  children: ReactNode;
  /** Called when this user bubble mounts so the panel can pin it to the top (new turn). */
  onUserMessageMounted?: (el: HTMLElement) => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);

  const setRootRef = useCallback((node: HTMLDivElement | null) => {
    rootRef.current = node;
  }, []);

  useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el || !onUserMessageMounted) return;
    onUserMessageMounted(el);
    /** `children` ensures a new chip instance still pins after layout; callback is stable via ref at call site. */
  }, [onUserMessageMounted, children]);

  return (
    <div
      ref={setRootRef}
      className="relative shrink-0 w-full scroll-mt-2"
      data-name="Individual chat inputs"
      data-chat-user-turn
    >
      <div className="flex flex-col items-end justify-center size-full">
        <div className="content-stretch flex flex-col items-end justify-center px-[16px] relative w-full">
          <div
            className="bg-[#f2f5fa] content-stretch flex gap-[4px] items-start justify-end max-w-[min(452px,100%)] px-[12px] py-[8px] relative rounded-[8px] shrink-0 w-fit min-w-0 ml-auto"
            data-name="Chip"
          >
            <div className="flex flex-[1_0_0] flex-col font-['Source_Sans_3',sans-serif] font-normal justify-center leading-[0] min-h-px min-w-px relative text-[#0f1114] text-[14px]">
              <p className="leading-[21px]">{children}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const COMPARE_SELECTED_USER_MESSAGE = "Compare selected courses";
const MORE_LIKE_THIS_USER_MESSAGE = "More like this";
const EXPLORE_ALTERNATIVES_USER_MESSAGE = "Explore alternatives";
const REMOVE_COURSE_USER_MESSAGE = "Remove";
const REMOVE_COURSE_AI_MESSAGE = "Course removed";
const REMOVE_COURSE_AI_SEGMENTS = [{ text: REMOVE_COURSE_AI_MESSAGE }] as const;

/** Stable unique keys so React never reuses a chat exchange row when actions repeat in the same tick. */
function uniqueChatExchangeKey(prefix: string): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

/** Summary for a course swapped in via “Explore alternatives” (prototype copy). */
function exploreAlternativesSummaryBlurb(
  newD: CompareCourseDetail,
  replaced: CompareCourseDetail | null,
): string {
  const firstDesc =
    newD.description.split(/(?<=[.!?])\s/)[0]?.trim() ?? newD.summaryLine.slice(0, 200);
  let text = `${firstDesc} (${newD.meta}).`;
  if (replaced) {
    text += ` It replaces ${replaced.title} in this column—same slot, refreshed pick you can compare with your other courses.`;
  }
  return text;
}

function buildExploreAlternativesTypingSegments(
  newDetail: CompareCourseDetail,
  replaced: CompareCourseDetail | null,
): readonly { text: string; bold?: boolean }[] {
  const blurb = exploreAlternativesSummaryBlurb(newDetail, replaced);
  return [
    { text: "Here's your alternative:\n\n", bold: true },
    { text: "• " },
    { text: newDetail.title, bold: true },
    { text: ` ${blurb}` },
  ];
}

/** Summary line when a “more like this” course is added next to an existing comparison (prototype copy). */
function moreLikeThisBlurb(newD: CompareCourseDetail, previous: CompareCourseDetail[]): string {
  const t = newD.title.toLowerCase();
  const vsOthers =
    previous.length > 0
      ? " Compared with the courses already in your comparison, it offers a similar goal with a different mix of depth, pace, and hands-on practice."
      : "";
  if (t.includes("product management: building ai-powered products")) {
    return "...might be a good fit for you. It's comprehensive — taking 3-6 months — but focuses more on practical understanding than technical depth." + vsOthers;
  }
  const meta = newD.meta;
  const m = meta.match(/(\d+)[-–](\d+)\s*(month|week)s?/i);
  const duration = m ? `${m[1]}–${m[2]} ${m[3]}s` : "3–6 months";
  return `...might be a good fit for you. It's comprehensive — taking ${duration} — but focuses more on practical understanding than technical depth.${vsOthers}`;
}

function buildMoreLikeTypingSegments(
  newDetail: CompareCourseDetail,
  previous: CompareCourseDetail[],
): readonly { text: string; bold?: boolean }[] {
  const blurb = moreLikeThisBlurb(newDetail, previous);
  return [
    { text: "Added another comparable option:\n\n", bold: true },
    { text: "• " },
    { text: newDetail.title, bold: true },
    { text: ` ${blurb}` },
  ];
}

/** One or two sentences contrasting a course with the rest of the selection (prototype copy). */
function compareDifferenceLine(d: CompareCourseDetail, index: number): string {
  const tm = d.title.toLowerCase();
  if (tm.includes("generative ai for product managers") && !tm.includes("supercharge")) {
    return "is more foundational and strategic — it will take 3-6 months and will build both a solid technical understanding and practical application.";
  }
  if (tm.includes("supercharge your product management career")) {
    return "is more tactical and specific, emphasizing practical ways PMs can use generative AI to boost strategic leadership.";
  }
  const firstDesc = d.description.split(/(?<=[.!?])\s/)[0]?.trim() ?? d.summaryLine.slice(0, 140);
  const angles = [
    `is weighted toward foundational breadth (${d.meta}) — ${firstDesc}`,
    `stresses applied workflows you can reuse quickly (${d.meta}) — ${firstDesc}`,
    `sits between the others on depth versus time investment (${d.meta}) — ${firstDesc}`,
  ];
  return angles[index % angles.length];
}

function buildCompareTypingSegments(details: CompareCourseDetail[]): readonly { text: string; bold?: boolean }[] {
  if (details.length === 0) return [{ text: "" }];
  const out: { text: string; bold?: boolean }[] = [{ text: "Key differences:\n\n", bold: true }];
  details.forEach((d, i) => {
    out.push({ text: "• " });
    out.push({ text: d.title, bold: true });
    out.push({ text: ` ${compareDifferenceLine(d, i)}` });
    out.push({ text: i < details.length - 1 ? "\n" : "\n\n" });
  });
  out.push({ text: "Do you have any questions?", bold: true });
  return out;
}

/** Matches ChatPanelSkeleton user row — pulse bar before the real user chip appears. */
function UserMessageLoadingSkeleton() {
  return (
    <div
      className="relative shrink-0 w-full"
      data-name="User message loading"
      aria-busy="true"
    >
      <div className="flex flex-col items-end justify-center size-full">
        <div className="content-stretch flex flex-col items-end justify-center px-[16px] relative w-full">
          <div className="ml-auto h-[28px] w-[min(214px,90%)] max-w-[min(452px,100%)] shrink-0 rounded-[5px] bg-[#e8ecf4] animate-pulse" />
        </div>
      </div>
    </div>
  );
}

function CompareCoursesSummaryAiBlock({ courses }: { courses: ResolvedSerpCourse[] }) {
  const details = courses
    .map((c) => resolveCompareCourseDetail(c.id))
    .filter((row): row is CompareCourseDetail => row != null);
  if (details.length === 0) return null;
  return (
    <div className="relative shrink-0 w-full" data-name="Compare summary AI">
      <div className="content-stretch flex flex-col gap-[8px] items-start px-[16px] relative w-full">
        <div className="flex flex-col font-['Source_Sans_3',sans-serif] font-normal justify-center leading-[0] min-w-0 w-full max-w-full relative shrink-0 text-[0px] text-[14px] text-[#0f1114] whitespace-pre-wrap">
          <p className="leading-[21px] mb-0 whitespace-pre-wrap">
            <span className="font-['Source_Sans_3',sans-serif] font-bold leading-[21px]">Key differences:</span>
          </p>
          <ul className="list-disc mb-0">
            {details.map((d, i) => (
              <li key={d.id} className={i < details.length - 1 ? "mb-0 ms-[24px]" : "ms-[24px]"}>
                <span className="leading-[21px]">
                  <span className="font-['Source_Sans_3',sans-serif] font-bold leading-[21px]">{d.title}</span>
                  {` ${compareDifferenceLine(d, i)}`}
                </span>
              </li>
            ))}
          </ul>
          <p className="leading-[21px] mb-0 whitespace-pre-wrap">&nbsp;</p>
          <p className="leading-[21px] whitespace-pre-wrap">
            <span className="font-['Source_Sans_3',sans-serif] font-bold leading-[21px]">Do you have any questions?</span>
          </p>
        </div>
        <Actions />
      </div>
    </div>
  );
}

function CompareCoursesChatExchange({
  courses,
  onUserMessageMounted,
}: {
  courses: ResolvedSerpCourse[];
  onUserMessageMounted?: (el: HTMLElement) => void;
}) {
  const details = useMemo(
    () =>
      courses
        .map((c) => resolveCompareCourseDetail(c.id))
        .filter((row): row is CompareCourseDetail => row != null),
    [courses],
  );
  const typingSegments = useMemo(() => buildCompareTypingSegments(details), [details]);
  const compareTypingPlaintext = useMemo(() => typingSegments.map((s) => s.text).join(""), [typingSegments]);

  const [phase, setPhase] = useState<"user_loading" | "user_chip" | "typing" | "done">("user_loading");
  const [typedLen, setTypedLen] = useState(0);

  useEffect(() => {
    if (phase !== "user_loading") return;
    const id = window.setTimeout(() => setPhase("user_chip"), AI_TYPEWRITER_INITIAL_DELAY_MS);
    return () => window.clearTimeout(id);
  }, [phase]);

  useEffect(() => {
    if (phase !== "user_chip") return;
    const id = window.setTimeout(() => {
      setTypedLen(0);
      setPhase("typing");
    }, AI_TYPEWRITER_INITIAL_DELAY_MS);
    return () => window.clearTimeout(id);
  }, [phase]);

  useEffect(() => {
    if (phase !== "typing") return;
    if (typedLen >= compareTypingPlaintext.length) {
      setPhase("done");
      return;
    }
    const id = window.setTimeout(() => {
      setTypedLen((n) => Math.min(n + AI_CHARS_PER_STEP, compareTypingPlaintext.length));
    }, AI_TYPE_MS_PER_STEP);
    return () => window.clearTimeout(id);
  }, [phase, typedLen, compareTypingPlaintext.length]);

  if (details.length === 0) return null;

  return (
    <div className="contents">
      {phase === "user_loading" ? <UserMessageLoadingSkeleton /> : null}
      {phase === "user_chip" || phase === "typing" || phase === "done" ? (
        <UserMessageChip onUserMessageMounted={onUserMessageMounted}>{COMPARE_SELECTED_USER_MESSAGE}</UserMessageChip>
      ) : null}
      {phase === "typing" ? (
        <AiResponseTypingBlock segments={typingSegments} typedLen={typedLen} />
      ) : null}
      {phase === "done" ? <CompareCoursesSummaryAiBlock courses={courses} /> : null}
    </div>
  );
}

function MoreLikeThisSummaryAiBlock({
  newCourse,
  previousCourses,
}: {
  newCourse: ResolvedSerpCourse;
  previousCourses: ResolvedSerpCourse[];
}) {
  const newD = resolveCompareCourseDetail(newCourse.id);
  const prevDetails = previousCourses
    .map((c) => resolveCompareCourseDetail(c.id))
    .filter((row): row is CompareCourseDetail => row != null);
  if (!newD) return null;
  const blurb = moreLikeThisBlurb(newD, prevDetails);
  return (
    <div className="relative shrink-0 w-full" data-name="More like this summary AI">
      <div className="content-stretch flex flex-col gap-[8px] items-start px-[16px] relative w-full">
        <RecommendationStatus recommendationsReady={true} />
        <div className="flex flex-col font-['Source_Sans_3',sans-serif] font-normal justify-center leading-[0] min-w-0 w-full max-w-full relative shrink-0 text-[0px] text-[14px] text-[#0f1114] whitespace-pre-wrap">
          <p className="leading-[21px] mb-0 whitespace-pre-wrap">
            <span className="font-['Source_Sans_3',sans-serif] font-bold leading-[21px]">Added another comparable option:</span>
          </p>
          <ul className="list-disc mb-0">
            <li className="ms-[24px]">
              <span className="leading-[21px]">
                <span className="font-['Source_Sans_3',sans-serif] font-bold leading-[21px]">{newD.title}</span>
                {` ${blurb}`}
              </span>
            </li>
          </ul>
        </div>
        <Actions />
      </div>
    </div>
  );
}

function MoreLikeThisChatExchange({
  newCourse,
  previousCourses,
  onUserMessageMounted,
}: {
  newCourse: ResolvedSerpCourse;
  previousCourses: ResolvedSerpCourse[];
  onUserMessageMounted?: (el: HTMLElement) => void;
}) {
  const newDetail = useMemo(() => resolveCompareCourseDetail(newCourse.id), [newCourse.id]);
  const prevDetails = useMemo(
    () =>
      previousCourses
        .map((c) => resolveCompareCourseDetail(c.id))
        .filter((row): row is CompareCourseDetail => row != null),
    [previousCourses],
  );
  const typingSegments = useMemo(() => {
    if (!newDetail) return [{ text: "" }];
    return buildMoreLikeTypingSegments(newDetail, prevDetails);
  }, [newDetail, prevDetails]);
  const typingPlaintext = useMemo(() => typingSegments.map((s) => s.text).join(""), [typingSegments]);

  const [phase, setPhase] = useState<"user_loading" | "user_chip" | "typing" | "done">("user_loading");
  const [typedLen, setTypedLen] = useState(0);

  useEffect(() => {
    if (phase !== "user_loading") return;
    const id = window.setTimeout(() => setPhase("user_chip"), AI_TYPEWRITER_INITIAL_DELAY_MS);
    return () => window.clearTimeout(id);
  }, [phase]);

  useEffect(() => {
    if (phase !== "user_chip") return;
    const id = window.setTimeout(() => {
      setTypedLen(0);
      setPhase("typing");
    }, AI_TYPEWRITER_INITIAL_DELAY_MS);
    return () => window.clearTimeout(id);
  }, [phase]);

  useEffect(() => {
    if (phase !== "typing") return;
    if (typedLen >= typingPlaintext.length) {
      setPhase("done");
      return;
    }
    const id = window.setTimeout(() => {
      setTypedLen((n) => Math.min(n + AI_CHARS_PER_STEP, typingPlaintext.length));
    }, AI_TYPE_MS_PER_STEP);
    return () => window.clearTimeout(id);
  }, [phase, typedLen, typingPlaintext.length]);

  if (!newDetail) return null;

  return (
    <div className="contents">
      {phase === "user_loading" ? <UserMessageLoadingSkeleton /> : null}
      {phase === "user_chip" || phase === "typing" || phase === "done" ? (
        <UserMessageChip onUserMessageMounted={onUserMessageMounted}>{MORE_LIKE_THIS_USER_MESSAGE}</UserMessageChip>
      ) : null}
      {phase === "typing" ? <AiResponseTypingBlock segments={typingSegments} typedLen={typedLen} /> : null}
      {phase === "done" ? (
        <MoreLikeThisSummaryAiBlock newCourse={newCourse} previousCourses={previousCourses} />
      ) : null}
    </div>
  );
}

function ExploreAlternativesSummaryAiBlock({
  newCourse,
  replacedCourse,
}: {
  newCourse: ResolvedSerpCourse;
  replacedCourse: ResolvedSerpCourse | null;
}) {
  const newD = resolveCompareCourseDetail(newCourse.id);
  const replacedD = replacedCourse ? resolveCompareCourseDetail(replacedCourse.id) : null;
  if (!newD) return null;
  const blurb = exploreAlternativesSummaryBlurb(newD, replacedD);
  return (
    <div className="relative shrink-0 w-full" data-name="Explore alternatives summary AI">
      <div className="content-stretch flex flex-col gap-[8px] items-start px-[16px] relative w-full">
        <RecommendationStatus recommendationsReady={true} />
        <div className="flex flex-col font-['Source_Sans_3',sans-serif] font-normal justify-center leading-[0] min-w-0 w-full max-w-full relative shrink-0 text-[0px] text-[14px] text-[#0f1114] whitespace-pre-wrap">
          <p className="leading-[21px] mb-0 whitespace-pre-wrap">
            <span className="font-['Source_Sans_3',sans-serif] font-bold leading-[21px]">Here’s your alternative:</span>
          </p>
          <ul className="list-disc mb-0">
            <li className="ms-[24px]">
              <span className="leading-[21px]">
                <span className="font-['Source_Sans_3',sans-serif] font-bold leading-[21px]">{newD.title}</span>
                {` ${blurb}`}
              </span>
            </li>
          </ul>
        </div>
        <Actions />
      </div>
    </div>
  );
}

function ExploreAlternativesChatExchange({
  newCourse,
  replacedCourse,
  onUserMessageMounted,
}: {
  newCourse: ResolvedSerpCourse;
  replacedCourse: ResolvedSerpCourse | null;
  onUserMessageMounted?: (el: HTMLElement) => void;
}) {
  const newDetail = useMemo(() => resolveCompareCourseDetail(newCourse.id), [newCourse.id]);
  const replacedDetail = useMemo(
    () => (replacedCourse ? resolveCompareCourseDetail(replacedCourse.id) : null),
    [replacedCourse?.id],
  );
  const typingSegments = useMemo(() => {
    if (!newDetail) return [{ text: "" }];
    return buildExploreAlternativesTypingSegments(newDetail, replacedDetail);
  }, [newDetail, replacedDetail]);
  const typingPlaintext = useMemo(() => typingSegments.map((s) => s.text).join(""), [typingSegments]);

  const [phase, setPhase] = useState<"user_loading" | "user_chip" | "typing" | "done">("user_loading");
  const [typedLen, setTypedLen] = useState(0);

  useEffect(() => {
    if (phase !== "user_loading") return;
    const id = window.setTimeout(() => setPhase("user_chip"), AI_TYPEWRITER_INITIAL_DELAY_MS);
    return () => window.clearTimeout(id);
  }, [phase]);

  useEffect(() => {
    if (phase !== "user_chip") return;
    const id = window.setTimeout(() => {
      setTypedLen(0);
      setPhase("typing");
    }, AI_TYPEWRITER_INITIAL_DELAY_MS);
    return () => window.clearTimeout(id);
  }, [phase]);

  useEffect(() => {
    if (phase !== "typing") return;
    if (typedLen >= typingPlaintext.length) {
      setPhase("done");
      return;
    }
    const id = window.setTimeout(() => {
      setTypedLen((n) => Math.min(n + AI_CHARS_PER_STEP, typingPlaintext.length));
    }, AI_TYPE_MS_PER_STEP);
    return () => window.clearTimeout(id);
  }, [phase, typedLen, typingPlaintext.length]);

  if (!newDetail) return null;

  return (
    <div className="contents">
      {phase === "user_loading" ? <UserMessageLoadingSkeleton /> : null}
      {phase === "user_chip" || phase === "typing" || phase === "done" ? (
        <UserMessageChip onUserMessageMounted={onUserMessageMounted}>{EXPLORE_ALTERNATIVES_USER_MESSAGE}</UserMessageChip>
      ) : null}
      {phase === "typing" ? <AiResponseTypingBlock segments={typingSegments} typedLen={typedLen} /> : null}
      {phase === "done" ? (
        <ExploreAlternativesSummaryAiBlock newCourse={newCourse} replacedCourse={replacedCourse} />
      ) : null}
    </div>
  );
}

function RemoveCourseSummaryAiBlock() {
  return (
    <div className="relative shrink-0 w-full" data-name="Remove course AI">
      <div className="content-stretch flex flex-col gap-[8px] items-start px-[16px] relative w-full">
        <p className="font-['Source_Sans_3',sans-serif] font-normal leading-[21px] min-w-0 w-full max-w-full text-[14px] text-[#0f1114] whitespace-pre-wrap">
          {REMOVE_COURSE_AI_MESSAGE}
        </p>
        <Actions />
      </div>
    </div>
  );
}

function RemoveCourseChatExchange({ onUserMessageMounted }: { onUserMessageMounted?: (el: HTMLElement) => void }) {
  const typingPlaintext = REMOVE_COURSE_AI_MESSAGE;

  const [phase, setPhase] = useState<"user_loading" | "user_chip" | "typing" | "done">("user_loading");
  const [typedLen, setTypedLen] = useState(0);

  useEffect(() => {
    if (phase !== "user_loading") return;
    const id = window.setTimeout(() => setPhase("user_chip"), AI_TYPEWRITER_INITIAL_DELAY_MS);
    return () => window.clearTimeout(id);
  }, [phase]);

  useEffect(() => {
    if (phase !== "user_chip") return;
    const id = window.setTimeout(() => {
      setTypedLen(0);
      setPhase("typing");
    }, AI_TYPEWRITER_INITIAL_DELAY_MS);
    return () => window.clearTimeout(id);
  }, [phase]);

  useEffect(() => {
    if (phase !== "typing") return;
    if (typedLen >= typingPlaintext.length) {
      setPhase("done");
      return;
    }
    const id = window.setTimeout(() => {
      setTypedLen((n) => Math.min(n + AI_CHARS_PER_STEP, typingPlaintext.length));
    }, AI_TYPE_MS_PER_STEP);
    return () => window.clearTimeout(id);
  }, [phase, typedLen, typingPlaintext.length]);

  return (
    <div className="contents">
      {phase === "user_loading" ? <UserMessageLoadingSkeleton /> : null}
      {phase === "user_chip" || phase === "typing" || phase === "done" ? (
        <UserMessageChip onUserMessageMounted={onUserMessageMounted}>{REMOVE_COURSE_USER_MESSAGE}</UserMessageChip>
      ) : null}
      {phase === "typing" ? (
        <AiResponseTypingBlock segments={REMOVE_COURSE_AI_SEGMENTS} typedLen={typedLen} />
      ) : null}
      {phase === "done" ? <RemoveCourseSummaryAiBlock /> : null}
    </div>
  );
}

/** Single ordering for compare / more / explore / remove bubbles (older = lower seq, rendered above). */
type ComparisonChatTimelineEntry =
  | { kind: "compare"; seq: number; key: string; courses: ResolvedSerpCourse[] }
  | {
      kind: "more";
      seq: number;
      key: string;
      newCourse: ResolvedSerpCourse;
      previousCourses: ResolvedSerpCourse[];
    }
  | {
      kind: "explore";
      seq: number;
      key: string;
      newCourse: ResolvedSerpCourse;
      replacedCourse: ResolvedSerpCourse | null;
    }
  | { kind: "remove"; seq: number; key: string };

function buildComparisonChatTimeline(
  compareChatExchanges: readonly { key: string; seq: number; courses: ResolvedSerpCourse[] }[],
  moreLikeThisChatExchanges: readonly {
    key: string;
    seq: number;
    newCourse: ResolvedSerpCourse;
    previousCourses: ResolvedSerpCourse[];
  }[],
  exploreAlternativesChatExchanges: readonly {
    key: string;
    seq: number;
    newCourse: ResolvedSerpCourse;
    replacedCourse: ResolvedSerpCourse | null;
  }[],
  removeCourseChatExchanges: readonly { key: string; seq: number }[],
): ComparisonChatTimelineEntry[] {
  const out: ComparisonChatTimelineEntry[] = [];
  for (const x of compareChatExchanges) {
    out.push({ kind: "compare", seq: x.seq, key: x.key, courses: x.courses });
  }
  for (const x of moreLikeThisChatExchanges) {
    out.push({
      kind: "more",
      seq: x.seq,
      key: x.key,
      newCourse: x.newCourse,
      previousCourses: x.previousCourses,
    });
  }
  for (const x of exploreAlternativesChatExchanges) {
    out.push({
      kind: "explore",
      seq: x.seq,
      key: x.key,
      newCourse: x.newCourse,
      replacedCourse: x.replacedCourse,
    });
  }
  for (const x of removeCourseChatExchanges) {
    out.push({ kind: "remove", seq: x.seq, key: x.key });
  }
  out.sort((a, b) => (a.seq !== b.seq ? a.seq - b.seq : a.key.localeCompare(b.key)));
  return out;
}

function Conversation({
  showProductManagerFollowUp,
  onPmAssistantComplete,
  recommendationsReady,
  onUserMessageMounted,
  compareChatExchanges,
  moreLikeThisChatExchanges,
  exploreAlternativesChatExchanges,
  removeCourseChatExchanges,
}: {
  showProductManagerFollowUp: boolean;
  onPmAssistantComplete?: () => void;
  recommendationsReady: boolean;
  onUserMessageMounted?: (el: HTMLElement) => void;
  compareChatExchanges: readonly { key: string; seq: number; courses: ResolvedSerpCourse[] }[];
  moreLikeThisChatExchanges: readonly {
    key: string;
    seq: number;
    newCourse: ResolvedSerpCourse;
    previousCourses: ResolvedSerpCourse[];
  }[];
  exploreAlternativesChatExchanges: readonly {
    key: string;
    seq: number;
    newCourse: ResolvedSerpCourse;
    replacedCourse: ResolvedSerpCourse | null;
  }[];
  removeCourseChatExchanges: readonly { key: string; seq: number }[];
}) {
  const comparisonTimeline = useMemo(
    () =>
      buildComparisonChatTimeline(
        compareChatExchanges,
        moreLikeThisChatExchanges,
        exploreAlternativesChatExchanges,
        removeCourseChatExchanges,
      ),
    [
      compareChatExchanges,
      moreLikeThisChatExchanges,
      exploreAlternativesChatExchanges,
      removeCourseChatExchanges,
    ],
  );

  return (
    <div
      className="content-stretch flex flex-col gap-[24px] items-start pt-[24px] relative w-full min-w-0"
      data-name="Conversation"
    >
      <UserMessageChip key="user-turn-initial-role" onUserMessageMounted={onUserMessageMounted}>
        Leverage Generative AI in my role
      </UserMessageChip>
      <FirstAiResponseSequence />
      {showProductManagerFollowUp ? (
        <ProductManagerFollowUpSequence
          onFlowComplete={onPmAssistantComplete}
          recommendationsReady={recommendationsReady}
          onUserMessageMounted={onUserMessageMounted}
        />
      ) : null}
      {comparisonTimeline.map((entry) => {
        if (entry.kind === "compare") {
          return (
            <CompareCoursesChatExchange
              key={entry.key}
              courses={entry.courses}
              onUserMessageMounted={onUserMessageMounted}
            />
          );
        }
        if (entry.kind === "more") {
          return (
            <MoreLikeThisChatExchange
              key={entry.key}
              newCourse={entry.newCourse}
              previousCourses={entry.previousCourses}
              onUserMessageMounted={onUserMessageMounted}
            />
          );
        }
        if (entry.kind === "explore") {
          return (
            <ExploreAlternativesChatExchange
              key={entry.key}
              newCourse={entry.newCourse}
              replacedCourse={entry.replacedCourse}
              onUserMessageMounted={onUserMessageMounted}
            />
          );
        }
        return <RemoveCourseChatExchange key={entry.key} onUserMessageMounted={onUserMessageMounted} />;
      })}
    </div>
  );
}

const ROLE_TITLES = [
  "Accountant",
  "Android Developer",
  "Attorney",
  "Backend Developer",
  "Business Analyst",
  "Chef",
  "Cloud Architect",
  "Content Strategist",
  "Copywriter",
  "Customer Success Manager",
  "Cyber Security Analyst",
  "Data Analyst",
  "Data Scientist",
  "Database Administrator",
  "Designer",
  "DevOps Engineer",
  "Financial Analyst",
  "Frontend Developer",
  "Full Stack Developer",
  "Graphic Designer",
  "HR Manager",
  "IT Support Specialist",
  "iOS Developer",
  "Machine Learning Engineer",
  "Marketing Manager",
  "Nurse Practitioner",
  "Operations Manager",
  "Pharmacist",
  "Physician Assistant",
  "Product Analyst",
  "Product Designer",
  "Product Manager",
  "Project Manager",
  "Python Developer",
  "QA Engineer",
  "Sales Representative",
  "Scientist",
  "Scrum Master",
  "Social Media Manager",
  "Software Engineer",
  "Teacher",
  "Technical Writer",
  "UX Designer",
  "UX Researcher",
  "Video Editor",
  "Web Developer",
  "Blockchain Developer",
  "Data Engineer",
  "Engineering Manager",
  "Kotlin Developer",
  "Node.js Developer",
  "React Developer",
  "Rust Developer",
  "Security Engineer",
  "Site Reliability Engineer",
  "Solutions Architect",
  "Swift Developer",
  "Tech Lead",
] as const;

const ROLE_OPTIONS = ROLE_TITLES.map((title) => ({ title }));

/** Figma SuggestedReplies / Role Cards (2156:31405 → 2338:55152): 32px pill, 16px icon, 14/20 label. */
function RoleCardItem({
  title,
  onSelect,
}: (typeof ROLE_OPTIONS)[number] & { onSelect?: (title: string) => void }) {
  return (
    <button
      type="button"
      onClick={() => onSelect?.(title)}
      className="relative flex h-8 max-w-full shrink-0 cursor-pointer items-center gap-2 overflow-hidden rounded-lg border border-solid border-[#dae1ed] bg-white pl-[10px] pr-3 text-left transition-colors duration-150 hover:bg-[#f8fafc]"
      data-name="Suggestions"
    >
      <div className="relative flex size-4 shrink-0 items-center justify-center overflow-hidden rounded-[2px] text-[#0f1114]" aria-hidden data-name="icon">
        <RoleIcon title={title} className="shrink-0" />
      </div>
      <span className="min-w-0 truncate font-['Source_Sans_3',sans-serif] text-[14px] font-normal leading-[20px] text-[#0f1114]">
        {title}
      </span>
    </button>
  );
}

/**
 * Figma SuggestedReplies 2141:36178 + Next 2338:58385:
 * — Role Cards: exactly 2 rows (`grid-flow-col` + `grid-template-rows: repeat(2,auto)`), columns extend right → horizontal scroll
 * — Next: absolute right-0 top-0 72×72, 50px gradient + 24px chevron; Previous when scrollLeft > 0
 */
function SuggestedRoleReplies({
  roles,
  onSelectRole,
}: {
  roles: (typeof ROLE_OPTIONS)[number][];
  onSelectRole?: (title: string) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const updateScrollArrows = useCallback(() => {
    const el = scrollRef.current;
    if (!el) {
      setCanScrollPrev(false);
      setCanScrollNext(false);
      return;
    }
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollPrev(scrollLeft > 2);
    setCanScrollNext(scrollLeft + clientWidth < scrollWidth - 2);
  }, []);

  useLayoutEffect(() => {
    updateScrollArrows();
    const id = requestAnimationFrame(() => updateScrollArrows());
    return () => cancelAnimationFrame(id);
  }, [roles, updateScrollArrows]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollArrows();
    el.addEventListener("scroll", updateScrollArrows, { passive: true });
    const ro = new ResizeObserver(() => updateScrollArrows());
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateScrollArrows);
      ro.disconnect();
    };
  }, [updateScrollArrows]);

  const roleListKey = roles.map((r) => r.title).join("\0");
  useEffect(() => {
    scrollRef.current?.scrollTo({ left: 0, behavior: "auto" });
  }, [roleListKey]);

  const scrollByDir = useCallback((dir: -1 | 1) => {
    const el = scrollRef.current;
    if (!el) return;
    const step = Math.max(200, Math.round(el.clientWidth * 0.65));
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  }, []);

  return (
    <div
      className="relative w-full min-w-0 overflow-hidden"
      data-name="Suggested replies"
    >
      {/* min-w-0 + w-full: scrollport must shrink below intrinsic chip grid width or scrollWidth === clientWidth */}
      <div
        ref={scrollRef}
        className="relative z-0 min-h-0 min-w-0 w-full max-w-full touch-pan-x overflow-x-auto overflow-y-visible overscroll-x-contain scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        <div
          className="grid w-max shrink-0 grid-flow-col gap-2 [grid-auto-columns:max-content] [grid-template-rows:repeat(2,auto)]"
          data-name="Role Cards"
        >
          {roles.map((role) => (
            <RoleCardItem key={role.title} {...role} onSelect={onSelectRole} />
          ))}
        </div>
      </div>
      {canScrollPrev ? (
        <div
          className="pointer-events-none absolute left-0 top-0 z-10 h-[72px] w-[72px]"
          data-name="Previous"
        >
          <div className="absolute left-0 top-1/2 flex h-[72px] w-[50px] -translate-y-1/2 items-center justify-center">
            <div
              className="h-[72px] w-[50px] bg-[linear-gradient(to_right,rgb(255,255,255)_0%,rgba(255,255,255,0)_96.078%)]"
              aria-hidden
            />
          </div>
          <div className="absolute left-[calc(50%-24px)] top-1/2 size-6 -translate-x-1/2 -translate-y-1/2">
            <button
              type="button"
              aria-label="Previous roles"
              onClick={() => scrollByDir(-1)}
              className="pointer-events-auto flex size-6 cursor-pointer items-center justify-center overflow-clip border-0 bg-transparent p-0"
            >
              <div className="relative size-6 overflow-clip" data-name="direction/ChevronPrevious">
                <div className="absolute inset-[26.46%_36.15%_26.46%_36.56%]" data-name="Vector">
                  <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4.36667 7.53333">
                    <path d={svgPaths.p24c18970} fill="#0F1114" />
                  </svg>
                </div>
              </div>
            </button>
          </div>
        </div>
      ) : null}
      {canScrollNext ? (
        <div className="pointer-events-none absolute right-0 top-0 z-10 size-[72px]" data-name="Next">
          <div className="absolute right-0 top-1/2 flex h-[72px] w-[50px] -translate-y-1/2 items-center justify-center">
            <div className="rotate-180">
              <div
                className="h-[72px] w-[50px] bg-[linear-gradient(to_right,rgb(255,255,255)_0%,rgba(255,255,255,0)_96.078%)]"
                aria-hidden
              />
            </div>
          </div>
          <div className="absolute left-[calc(50%+24px)] top-1/2 size-6 -translate-x-1/2 -translate-y-1/2 overflow-clip">
            <button
              type="button"
              aria-label="Next roles"
              onClick={() => scrollByDir(1)}
              className="pointer-events-auto flex size-6 cursor-pointer items-center justify-center border-0 bg-transparent p-0"
            >
              <div className="relative size-6 overflow-clip" data-name="direction/ChevronNext">
                <div className="absolute inset-[26.46%_36.56%_26.51%_36.15%]" data-name="Vector">
                  <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4.36667 7.52535">
                    <path d={svgPaths.p3881aa00} fill="#0F1114" />
                  </svg>
                </div>
              </div>
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

/** Figma ChatMessageComposer Toolbar (2156:31405): single ghost IconButton — add / attachment. */
function ChatComposerAddButton() {
  return (
    <button
      type="button"
      aria-label="Add attachment"
      className="flex shrink-0 items-center justify-center rounded-lg border-0 bg-transparent p-1 text-[#0f1114] transition-colors hover:bg-white/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0056d2]"
      data-name="IconButton"
    >
      <img alt="" src={actionsAdd} className="size-5 shrink-0 object-contain" data-name="actions/Add" aria-hidden />
    </button>
  );
}

/** Figma ChatMessageComposer primary send (2156:70477): 32×32, rounded-lg, blue fill, white arrow. */
function ChatSendCircleButton({ disabled }: { disabled: boolean }) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className={`flex size-8 shrink-0 items-center justify-center rounded-lg border-0 p-0 transition-colors duration-150 ${
        disabled ? "cursor-not-allowed bg-[#c1cad9]" : "cursor-pointer bg-[#0056d2] hover:bg-[#0048b0]"
      }`}
      data-name="IconButton"
      aria-label={disabled ? "Send message (enter text first)" : "Send"}
    >
      <div className="relative size-5 shrink-0 -rotate-90 overflow-clip" data-name="direction/ArrowUp">
        <div className="absolute inset-[21.46%_21.56%_21.51%_20%]" data-name="Vector">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.6875 11.4067">
            <path d={svgPaths.p205bab00} fill="#FFFFFF" id="Vector" />
          </svg>
        </div>
      </div>
    </button>
  );
}

function ChatComposerActionRow({ canSubmit }: { canSubmit: boolean }) {
  return (
    <div
      className="content-stretch flex min-w-0 w-full shrink-0 items-end justify-between"
      data-name="Action container"
    >
      <div className="content-stretch flex shrink-0 items-center" data-name="Toolbar">
        <ChatComposerAddButton />
      </div>
      <div className="content-stretch flex shrink-0 items-center justify-end gap-1" data-name="Submit">
        <button
          type="button"
          aria-label="Voice input"
          className="relative flex size-8 shrink-0 cursor-pointer items-center justify-center overflow-clip rounded-lg border-0 bg-transparent p-1 text-[#0f1114] transition-colors hover:bg-white/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0056d2]"
          data-name="media/Microphone"
        >
          <img alt="" src={actionsAudio} className="size-5 shrink-0 object-contain" aria-hidden />
        </button>
        <ChatSendCircleButton disabled={!canSubmit} />
      </div>
    </div>
  );
}

/** Figma ChatMessageComposer (2156:31405): compact shell; text body + gap-4px + action row. */
function ChatInputSkeleton() {
  return (
    <div
      className="bg-[#f2f5fa] flex flex-col gap-1 overflow-clip rounded-lg p-2 relative shrink-0 w-full min-w-0"
      data-name="ChatMessageComposer"
    >
      <div className="flex w-full min-w-0 items-center p-1 relative shrink-0" data-name="Text Body">
        <p className="min-h-[32px] flex-1 font-['Source_Sans_3',sans-serif] font-normal leading-[24px] text-[16px] text-[#5b6780]">
          Ask anything...
        </p>
      </div>
      <ChatComposerActionRow canSubmit={false} />
    </div>
  );
}

/** Figma Chat input 2109:67362 — follow-up refinement chips above composer after load. */
const PM_FOLLOW_UP_SUGGESTIONS = [
  "Beginner-friendly",
  "Fastest practical win",
  "ChatGPT-specific workflows",
  "Advanced prompting",
] as const;

function FollowUpPromptPills({ onSelect }: { onSelect: (label: string) => void }) {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Follow up prompts">
      <div className="flex flex-wrap gap-[8px] items-center relative shrink-0 w-full" data-name="prompts">
        {PM_FOLLOW_UP_SUGGESTIONS.map((label) => (
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

/** Chat header sparkle — `src/assets/sparkle.svg`, 20px (Figma 2156:31405). */
function ChatPanelSparkleIcon() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Variant B Icon" aria-hidden>
      <img alt="" className="block size-full object-contain" src={sparkleIcon} />
    </div>
  );
}

/** Figma Chat header (2156:31405): sparkle + settings + close. */
function ChatPanelHeader({ onClose }: { onClose?: () => void }) {
  return (
    <header
      className="bg-white content-stretch flex h-[49px] shrink-0 w-full items-center justify-between overflow-clip px-[16px]"
      data-name="Chat header"
    >
      <ChatPanelSparkleIcon />
      <div
        className="content-stretch flex shrink-0 items-center gap-[4px]"
        data-name="Text input/AI Chat Top Buttons"
      >
        <button
          type="button"
          className="flex cursor-pointer items-center justify-center rounded-lg border-0 bg-transparent p-1 text-[#5b6780] transition-colors hover:bg-[#f2f5fa] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0056d2]"
          aria-label="Assistant settings"
        >
          <img alt="" className="size-5 shrink-0 object-contain" src={actionsSettings} aria-hidden />
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex cursor-pointer items-center justify-center rounded-lg border-0 bg-transparent p-1 text-[#5b6780] transition-colors hover:bg-[#f2f5fa] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0056d2]"
          aria-label="Close assistant panel"
        >
          <img alt="" className="size-5 shrink-0 object-contain" src={actionsClose} aria-hidden />
        </button>
      </div>
    </header>
  );
}

function ChatPanelSkeleton({ onClose }: { onClose?: () => void }) {
  return (
    <aside
      className="relative flex flex-col bg-white z-[15] border-[#dae1ed] min-h-0 justify-between
        max-sm:relative max-sm:mt-6 max-sm:w-full max-sm:border max-sm:rounded-lg max-sm:max-h-[min(560px,72dvh)] max-sm:overflow-hidden
        sm:fixed sm:top-[108px] sm:h-[calc(100dvh-108px)] sm:w-[384px] sm:shrink-0 sm:border-l sm:border-t-0 sm:border-r-0 sm:border-b-0 sm:[right:max(0px,calc((100vw-1440px)/2))]"
      data-name="Chat Panel"
      aria-busy="true"
      aria-label="Loading assistant"
    >
      <ChatPanelHeader onClose={onClose} />
      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
        <div
          className="content-stretch flex flex-col gap-[32px] items-start px-[16px] py-[28px] relative w-full min-w-0"
          data-name="Conversation"
        >
          <div
            className="content-stretch flex flex-col items-end justify-center relative shrink-0 w-full"
            data-name="User response"
          >
            <div className="h-[28px] max-w-[90%] w-[214px] shrink-0 rounded-[5px] bg-[#e8ecf4] animate-pulse" />
          </div>
          <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full min-w-0">
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div
                key={i}
                className="h-[13px] w-full shrink-0 rounded-[4px] bg-[#e8ecf4] animate-pulse"
              />
            ))}
            <div className="h-[13px] w-full max-w-[202px] shrink-0 rounded-[4px] bg-[#e8ecf4] animate-pulse" />
          </div>
        </div>
      </div>
      <div className="shrink-0 flex flex-col gap-[10px] items-start px-4 pt-4 pb-4 w-full min-w-0 bg-white overflow-x-clip">
        <ChatInputSkeleton />
      </div>
    </aside>
  );
}

function ChatInput({
  value,
  onChange,
  placeholder,
  awaitingRoleAnswer,
  onConfirmProductManager,
  composerTop,
  inputAriaLabel,
}: {
  value: string;
  onChange: (next: string) => void;
  placeholder: string;
  awaitingRoleAnswer: boolean;
  onConfirmProductManager: () => void;
  /** Optional slot inside the #f2f5fa composer shell (e.g. selected course chips — Figma 2163:34106). */
  composerTop?: ReactNode;
  /** Overrides default role vs chat aria-label (e.g. when courses are selected before role pick). */
  inputAriaLabel?: string;
}) {
  const navigate = useNavigate();
  const canSubmit = value.trim().length > 0;

  const formRef = useRef<HTMLFormElement>(null);

  const onSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const trimmed = value.trim();
      if (!trimmed) return;
      if (awaitingRoleAnswer && trimmed.toLowerCase() === PRODUCT_MANAGER_TITLE.toLowerCase()) {
        onConfirmProductManager();
        onChange("");
        return;
      }
      navigate({ pathname: "/search", search: `?q=${encodeURIComponent(trimmed)}` });
      onChange("");
    },
    [awaitingRoleAnswer, navigate, onChange, onConfirmProductManager, value],
  );

  const onTextareaKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key !== "Enter" || e.shiftKey) return;
      e.preventDefault();
      formRef.current?.requestSubmit();
    },
    [],
  );

  return (
    <form
      ref={formRef}
      className="bg-[#f2f5fa] flex flex-col gap-1 overflow-clip rounded-lg p-2 relative shrink-0 w-full min-w-0"
      data-name="ChatMessageComposer"
      onSubmit={onSubmit}
    >
      {composerTop}
      <div className="flex w-full min-w-0 items-center p-1 relative shrink-0" data-name="Text Body">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onTextareaKeyDown}
          placeholder={placeholder}
          rows={1}
          aria-label={
            inputAriaLabel ?? (awaitingRoleAnswer ? "My current role" : "Chat message")
          }
          className="max-h-[200px] min-h-[32px] w-full max-w-full flex-1 resize-none overflow-y-auto bg-transparent border-0 p-0 font-['Source_Sans_3',sans-serif] font-normal leading-[20px] text-[14px] text-[#0f1114] outline-none placeholder:text-[#5b6780]"
        />
      </div>
      <ChatComposerActionRow canSubmit={canSubmit} />
    </form>
  );
}

/** Gap between the scroll viewport top and the pinned user bubble (below header). */
const CHAT_PIN_GAP_BELOW_VIEWPORT_TOP_PX = 8;

function ChatPanel({
  onPmAssistantComplete,
  recommendationsReady,
  courseSelectionFeaturesReady,
  onClose,
  selectedCourses,
  onRemoveSelectedCourse,
  onCompareSelected,
  compareChatExchanges,
  moreLikeThisChatExchanges,
  exploreAlternativesChatExchanges,
  removeCourseChatExchanges,
  comparisonActive,
}: {
  onPmAssistantComplete?: () => void;
  recommendationsReady: boolean;
  /** True on default SERP or after PM refresh → pm_results; enables course attachments, compare pills, and placeholders. */
  courseSelectionFeaturesReady: boolean;
  onClose?: () => void;
  /** Resolved selection from the active SERP grid (SerpDw). */
  selectedCourses: ResolvedSerpCourse[];
  onRemoveSelectedCourse: (id: string) => void;
  onCompareSelected: () => void;
  compareChatExchanges: readonly { key: string; seq: number; courses: ResolvedSerpCourse[] }[];
  moreLikeThisChatExchanges: readonly {
    key: string;
    seq: number;
    newCourse: ResolvedSerpCourse;
    previousCourses: ResolvedSerpCourse[];
  }[];
  exploreAlternativesChatExchanges: readonly {
    key: string;
    seq: number;
    newCourse: ResolvedSerpCourse;
    replacedCourse: ResolvedSerpCourse | null;
  }[];
  removeCourseChatExchanges: readonly { key: string; seq: number }[];
  /** True while the course comparison grid is open (not the SERP card grid). */
  comparisonActive: boolean;
}) {
  const [composerText, setComposerText] = useState("");
  const [productManagerConfirmed, setProductManagerConfirmed] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const pinSeqRef = useRef<{
    rafId: number | null;
    t160: number | null;
    t420: number | null;
  }>({ rafId: null, t160: null, t420: null });

  /**
   * Pin a user bubble just below the scroll viewport top. If content is shorter than the viewport
   * (maxScroll too small), extend the conversation with padding-bottom so scrolling is possible.
   * Retries only adjust scroll / grow padding if needed — they do not clear padding (avoids jumpy reflow).
   */
  const pinUserMessageToTop = useCallback((target: HTMLElement) => {
    // Coalesce overlapping pin requests (chips mount while the AI typewriter is still changing height).
    // This prevents multiple concurrent scrollTop updates that can look like flicker/jump.
    const prev = pinSeqRef.current;
    if (prev.rafId != null) cancelAnimationFrame(prev.rafId);
    if (prev.t160 != null) clearTimeout(prev.t160);
    if (prev.t420 != null) clearTimeout(prev.t420);
    prev.rafId = null;
    prev.t160 = null;
    prev.t420 = null;

    let resetPaddingForThisPin = true;
    const apply = () => {
      const c = chatScrollRef.current;
      if (!c || !c.contains(target)) return;
      const contentEl = c.firstElementChild as HTMLElement | null;
      if (!contentEl || contentEl.getAttribute("data-name") !== "Conversation") return;

      if (resetPaddingForThisPin) {
        // Only force a reset when padding was previously applied (avoids needless reflow).
        if (parseFloat(contentEl.style.paddingBottom) > 0.5) {
          contentEl.style.paddingBottom = "";
          void c.offsetHeight;
        }
        resetPaddingForThisPin = false;
      }

      const cRect = c.getBoundingClientRect();
      const tRect = target.getBoundingClientRect();
      const y = tRect.top - cRect.top + c.scrollTop;
      const neededScrollTop = y - CHAT_PIN_GAP_BELOW_VIEWPORT_TOP_PX;
      let maxScroll = Math.max(0, c.scrollHeight - c.clientHeight);
      const shortage = neededScrollTop - maxScroll;
      if (shortage > 1) {
        const nextPad = shortage + 8;
        const currentPad = parseFloat(contentEl.style.paddingBottom) || 0;
        if (nextPad > currentPad + 0.5) {
          contentEl.style.paddingBottom = `${nextPad}px`;
          void c.offsetHeight;
          maxScroll = Math.max(0, c.scrollHeight - c.clientHeight);
        }
      }
      const desiredScrollTop = Math.round(Math.min(Math.max(0, neededScrollTop), maxScroll));
      const currentScrollTop = c.scrollTop;

      // Prevent "bounce": during typing the desired value can fluctuate slightly.
      // We only move forward (or stay) to keep the animation feeling continuous.
      if (desiredScrollTop <= currentScrollTop + 1) return;
      c.scrollTop = desiredScrollTop;
    };

    apply();
    prev.rafId = requestAnimationFrame(apply);
    prev.t160 = window.setTimeout(apply, 160);
    prev.t420 = window.setTimeout(apply, 420);
  }, []);

  const pinUserMessageToTopRef = useRef(pinUserMessageToTop);
  pinUserMessageToTopRef.current = pinUserMessageToTop;
  const stablePinUserMessageToTop = useCallback((el: HTMLElement) => {
    pinUserMessageToTopRef.current(el);
  }, []);

  const confirmProductManager = useCallback(() => {
    setProductManagerConfirmed(true);
  }, []);

  const handleSelectRole = useCallback(
    (title: string) => {
      if (productManagerConfirmed) return;
      if (title === PRODUCT_MANAGER_TITLE) {
        setComposerText("");
        confirmProductManager();
      }
    },
    [confirmProductManager, productManagerConfirmed],
  );

  const filteredRoles = useMemo(() => {
    const prefix = composerText.trim().toLowerCase();
    return prefix.length === 0
      ? ROLE_OPTIONS
      : ROLE_OPTIONS.filter((r) => r.title.toLowerCase().startsWith(prefix));
  }, [composerText]);

  const navigate = useNavigate();
  const onFollowUpSuggestion = useCallback(
    (label: string) => {
      navigate({ pathname: "/search", search: `?q=${encodeURIComponent(label)}` });
      setComposerText("");
    },
    [navigate],
  );

  return (
    <aside
      className="relative flex flex-col bg-white z-[15] border-[#dae1ed] min-h-0 justify-between
        max-sm:relative max-sm:mt-6 max-sm:w-full max-sm:border max-sm:rounded-lg max-sm:max-h-[min(560px,72dvh)] max-sm:overflow-hidden
        sm:fixed sm:top-[108px] sm:h-[calc(100dvh-108px)] sm:w-[384px] sm:shrink-0 sm:border-l sm:border-t-0 sm:border-r-0 sm:border-b-0 sm:[right:max(0px,calc((100vw-1440px)/2))]"
      data-name="Chat Panel"
    >
      <ChatPanelHeader onClose={onClose} />
      <div
        ref={chatScrollRef}
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain [overflow-anchor:none] pt-2"
      >
        <Conversation
          showProductManagerFollowUp={productManagerConfirmed}
          onPmAssistantComplete={onPmAssistantComplete}
          recommendationsReady={recommendationsReady}
          onUserMessageMounted={stablePinUserMessageToTop}
          compareChatExchanges={compareChatExchanges}
          moreLikeThisChatExchanges={moreLikeThisChatExchanges}
          exploreAlternativesChatExchanges={exploreAlternativesChatExchanges}
          removeCourseChatExchanges={removeCourseChatExchanges}
        />
      </div>
      <div
        className="shrink-0 flex flex-col gap-[10px] items-start px-4 pt-4 pb-4 w-full min-w-0 bg-white overflow-x-clip"
        data-name="Chat input"
      >
        {!productManagerConfirmed && selectedCourses.length === 0 ? (
          filteredRoles.length === 0 ? (
            <p className="font-['Source_Sans_3',sans-serif] font-normal leading-[20px] text-[13px] text-[#5b6780]">
              No roles match &ldquo;{composerText.trim()}&rdquo;
            </p>
          ) : (
            <SuggestedRoleReplies roles={filteredRoles} onSelectRole={handleSelectRole} />
          )
        ) : null}
        {productManagerConfirmed && courseSelectionFeaturesReady && selectedCourses.length === 0 ? (
          <FollowUpPromptPills onSelect={onFollowUpSuggestion} />
        ) : null}
        {courseSelectionFeaturesReady && selectedCourses.length === 1 ? (
          <SingleCourseFollowUpPills onSelect={onFollowUpSuggestion} />
        ) : null}
        {courseSelectionFeaturesReady && selectedCourses.length >= 2 ? (
          <CompareSelectedCoursesPill comparisonActive={comparisonActive} onClick={onCompareSelected} />
        ) : null}
        <ChatInput
          value={composerText}
          onChange={setComposerText}
          placeholder={
            courseSelectionFeaturesReady && selectedCourses.length >= 2
              ? "Ask about selected courses..."
              : courseSelectionFeaturesReady && selectedCourses.length === 1
                ? "Ask about selected course..."
                : productManagerConfirmed
                  ? "Ask anything..."
                  : "My current role is..."
          }
          awaitingRoleAnswer={!productManagerConfirmed}
          onConfirmProductManager={confirmProductManager}
          inputAriaLabel={
            !productManagerConfirmed && selectedCourses.length === 0 ? undefined : "Chat message"
          }
          composerTop={
            courseSelectionFeaturesReady && selectedCourses.length > 0 ? (
              <ComposerSelectedCoursesAttachment courses={selectedCourses} onRemove={onRemoveSelectedCourse} />
            ) : undefined
          }
        />
      </div>
    </aside>
  );
}

export default function SerpDw() {
  const [searchParams, setSearchParams] = useSearchParams();
  const qFromUrl = searchParams.get("q") ?? "";
  const [headerSearchDraft, setHeaderSearchDraft] = useState(qFromUrl);
  const [aiPanelOpen, setAiPanelOpen] = useState(true);

  const [resultsReady, setResultsReady] = useState(false);
  const [serpResultsMode, setSerpResultsMode] = useState<SerpResultsMode>("default");
  const [followUpPillsReady, setFollowUpPillsReady] = useState(false);
  const prevSerpResultsMode = useRef<SerpResultsMode>(serpResultsMode);

  const [selectedCourseIds, setSelectedCourseIds] = useState<Set<string>>(() => new Set());
  const [comparisonActive, setComparisonActive] = useState(false);
  const [comparisonColumnOrder, setComparisonColumnOrder] = useState<string[] | null>(null);
  const [comparisonColumnLoading, setComparisonColumnLoading] = useState<Set<number>>(() => new Set());
  const comparisonChatSeqRef = useRef(0);
  const nextComparisonChatSeq = useCallback(() => {
    comparisonChatSeqRef.current += 1;
    return comparisonChatSeqRef.current;
  }, []);

  const [compareChatExchanges, setCompareChatExchanges] = useState<
    { key: string; seq: number; courses: ResolvedSerpCourse[] }[]
  >(() => []);
  const [moreLikeThisChatExchanges, setMoreLikeThisChatExchanges] = useState<
    { key: string; seq: number; newCourse: ResolvedSerpCourse; previousCourses: ResolvedSerpCourse[] }[]
  >(() => []);
  const [exploreAlternativesChatExchanges, setExploreAlternativesChatExchanges] = useState<
    { key: string; seq: number; newCourse: ResolvedSerpCourse; replacedCourse: ResolvedSerpCourse | null }[]
  >(() => []);
  const [removeCourseChatExchanges, setRemoveCourseChatExchanges] = useState<{ key: string; seq: number }[]>(
    () => [],
  );

  const comparisonPoolMode: SerpResultsMode =
    serpResultsMode === "pm_results" ? "pm_results" : "default";

  const toggleCourseSelection = useCallback((id: string) => {
    setSelectedCourseIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else if (next.size >= MAX_SELECTED_COURSES) return prev;
      else next.add(id);
      return next;
    });
  }, []);

  const removeCourseSelection = useCallback((id: string) => {
    if (comparisonActive && comparisonColumnOrder) {
      const next = comparisonColumnOrder.filter((x) => x !== id);
      if (next.length < 2) {
        setComparisonColumnOrder(null);
        setSelectedCourseIds(new Set(next));
        setComparisonActive(false);
      } else {
        setComparisonColumnOrder(next);
        setSelectedCourseIds(new Set(next));
      }
      return;
    }
    setSelectedCourseIds((prev) => {
      const n = new Set(prev);
      n.delete(id);
      return n;
    });
  }, [comparisonActive, comparisonColumnOrder]);

  const selectedCourses = useMemo(() => {
    const ids =
      comparisonActive && comparisonColumnOrder && comparisonColumnOrder.length >= 2
        ? comparisonColumnOrder
        : Array.from(selectedCourseIds);
    return ids
      .map((id) => resolveSerpCourseId(id))
      .filter((c): c is ResolvedSerpCourse => c != null);
  }, [comparisonActive, comparisonColumnOrder, selectedCourseIds]);

  const handleComparisonMenuAction = useCallback(
    (action: ComparisonMenuAction, columnIndex: number) => {
      if (!comparisonColumnOrder) return;
      if (action === "remove") {
        setRemoveCourseChatExchanges((prev) => [
          ...prev,
          { key: uniqueChatExchangeKey("remove"), seq: nextComparisonChatSeq() },
        ]);
        const next = comparisonColumnOrder.filter((_, i) => i !== columnIndex);
        if (next.length < 2) {
          setComparisonColumnOrder(null);
          setSelectedCourseIds(new Set(next));
          setComparisonActive(false);
        } else {
          setComparisonColumnOrder(next);
          setSelectedCourseIds(new Set(next));
        }
        return;
      }
      if (action === "more") {
        if (comparisonColumnOrder.length >= MAX_SELECTED_COURSES) return;
        const nextId = pickNextFromPool(comparisonColumnOrder, comparisonPoolMode);
        if (!nextId) return;
        const previousCourses = comparisonColumnOrder
          .map((id) => resolveSerpCourseId(id))
          .filter((c): c is ResolvedSerpCourse => c != null);
        const newCourse = resolveSerpCourseId(nextId);
        if (newCourse) {
          setMoreLikeThisChatExchanges((prev) => [
            ...prev,
            {
              key: uniqueChatExchangeKey("more-like"),
              seq: nextComparisonChatSeq(),
              newCourse,
              previousCourses: [...previousCourses],
            },
          ]);
        }
        const newIndex = comparisonColumnOrder.length;
        setComparisonColumnLoading((prev) => new Set(prev).add(newIndex));
        const nextOrder = [...comparisonColumnOrder, nextId];
        setComparisonColumnOrder(nextOrder);
        setSelectedCourseIds(new Set(nextOrder));
        window.setTimeout(() => {
          setComparisonColumnLoading((prev) => {
            const n = new Set(prev);
            n.delete(newIndex);
            return n;
          });
        }, 650);
        return;
      }
      if (action === "explore") {
        const replacement = pickReplacementForSlot(comparisonColumnOrder, columnIndex, comparisonPoolMode);
        if (!replacement) return;
        const replacedId = comparisonColumnOrder[columnIndex];
        const replacedResolved = resolveSerpCourseId(replacedId);
        const newResolved = resolveSerpCourseId(replacement);
        if (newResolved) {
          setExploreAlternativesChatExchanges((prev) => [
            ...prev,
            {
              key: uniqueChatExchangeKey("explore"),
              seq: nextComparisonChatSeq(),
              newCourse: newResolved,
              replacedCourse: replacedResolved ?? null,
            },
          ]);
        }
        setComparisonColumnLoading((prev) => new Set(prev).add(columnIndex));
        const nextOrder = comparisonColumnOrder.map((id, i) => (i === columnIndex ? replacement : id));
        setComparisonColumnOrder(nextOrder);
        setSelectedCourseIds(new Set(nextOrder));
        window.setTimeout(() => {
          setComparisonColumnLoading((prev) => {
            const n = new Set(prev);
            n.delete(columnIndex);
            return n;
          });
        }, 650);
      }
    },
    [comparisonColumnOrder, comparisonPoolMode, nextComparisonChatSeq],
  );

  const exitComparison = useCallback(() => {
    setComparisonActive(false);
    setComparisonColumnOrder(null);
    setComparisonColumnLoading(new Set());
  }, []);

  const enterComparison = useCallback(() => {
    if (selectedCourseIds.size < 2) return;
    const order = Array.from(selectedCourseIds).slice(0, MAX_SELECTED_COURSES);
    setComparisonColumnOrder(order);
    setComparisonActive(true);
  }, [selectedCourseIds]);

  const handleCompareSelectedFromChat = useCallback(() => {
    if (selectedCourseIds.size < 2) return;
    const order = Array.from(selectedCourseIds).slice(0, MAX_SELECTED_COURSES);
    const courses = order
      .map((id) => resolveSerpCourseId(id))
      .filter((c): c is ResolvedSerpCourse => c != null);
    setCompareChatExchanges((prev) => [
      ...prev,
      { key: uniqueChatExchangeKey("compare"), seq: nextComparisonChatSeq(), courses: [...courses] },
    ]);
    enterComparison();
  }, [selectedCourseIds, enterComparison, nextComparisonChatSeq]);

  /** Course compare UI applies on the default grid and on personalized results, not during the refresh skeleton. */
  const courseSelectionFeaturesReady = followUpPillsReady || serpResultsMode === "default";

  useEffect(() => {
    setSelectedCourseIds(new Set());
    setComparisonActive(false);
    setComparisonColumnOrder(null);
    setComparisonColumnLoading(new Set());
    comparisonChatSeqRef.current = 0;
    setCompareChatExchanges([]);
    setMoreLikeThisChatExchanges([]);
    setExploreAlternativesChatExchanges([]);
    setRemoveCourseChatExchanges([]);
  }, [serpResultsMode]);

  useEffect(() => {
    if (selectedCourseIds.size < 2) {
      setComparisonActive(false);
      setComparisonColumnOrder(null);
    }
  }, [selectedCourseIds.size]);

  useEffect(() => {
    setHeaderSearchDraft(qFromUrl);
  }, [qFromUrl]);

  useEffect(() => {
    const id = window.setTimeout(() => setResultsReady(true), 850);
    return () => window.clearTimeout(id);
  }, []);

  const submitHeaderSearch = useCallback(() => {
    const t = headerSearchDraft.trim();
    if (t) setSearchParams({ q: t }, { replace: true });
    else setSearchParams({}, { replace: true });
  }, [headerSearchDraft, setSearchParams]);

  const closeAiPanel = useCallback(() => setAiPanelOpen(false), []);
  const toggleAiPanel = useCallback(() => setAiPanelOpen((o) => !o), []);

  useEffect(() => {
    if (serpResultsMode !== "pm_updating") return;
    const id = window.setTimeout(() => setSerpResultsMode("pm_results"), PM_RECOMMENDATIONS_REFRESH_MS);
    return () => window.clearTimeout(id);
  }, [serpResultsMode]);

  useEffect(() => {
    const previous = prevSerpResultsMode.current;
    prevSerpResultsMode.current = serpResultsMode;

    if (serpResultsMode === "default" || serpResultsMode === "pm_updating") {
      setFollowUpPillsReady(false);
      return;
    }
    if (serpResultsMode === "pm_results" && previous === "pm_updating") {
      setFollowUpPillsReady(true);
    }
  }, [serpResultsMode]);

  const handlePmAssistantComplete = useCallback(() => {
    setSerpResultsMode("pm_updating");
  }, []);

  return (
    <div className="bg-white min-h-screen w-full" data-name="SERP - DW">
      <div className="sticky top-0 z-40 bg-white">
        <MetaNav />
        <AppPageHeader
          className="max-w-[1440px] mx-auto"
          serp={{
            query: headerSearchDraft,
            onQueryChange: setHeaderSearchDraft,
            onSearchSubmit: submitHeaderSearch,
            aiPanelOpen,
            onAiSparkleClick: toggleAiPanel,
          }}
        />
      </div>

      <div className="w-full max-w-[1440px] mx-auto relative">
        <main
          className={`w-full min-w-0 py-6 pb-10 pl-[46px] pr-[46px] ${aiPanelOpen ? "sm:pr-[430px]" : ""}`}
          data-name="Results panel"
          aria-busy={!resultsReady || serpResultsMode === "pm_updating"}
          aria-label={
            !resultsReady
              ? "Loading search results"
              : serpResultsMode === "pm_updating"
                ? "Updating recommendations"
                : undefined
          }
        >
          {resultsReady ? (
            !(comparisonActive && selectedCourses.length >= 2) ? (
              <SerpFilterBar />
            ) : null
          ) : (
            <SerpFilterBarSkeleton />
          )}
          <div
            className={
              resultsReady && comparisonActive && selectedCourses.length >= 2 ? "mt-0" : "mt-6"
            }
          >
            {!resultsReady ? (
              <SerpResultsSkeleton />
            ) : comparisonActive && selectedCourses.length >= 2 ? (
              <CourseComparisonView
                courses={selectedCourses}
                onBack={exitComparison}
                serpResultsMode={serpResultsMode}
                loadingColumnIndexes={comparisonColumnLoading}
                onComparisonMenuAction={handleComparisonMenuAction}
              />
            ) : serpResultsMode === "default" ? (
              <List selectedIds={selectedCourseIds} onToggle={toggleCourseSelection} />
            ) : serpResultsMode === "pm_updating" ? (
              <SerpResultsSkeleton aria-label="Updating recommendations" slowPulse />
            ) : (
              <ListPmFiltered selectedIds={selectedCourseIds} onToggle={toggleCourseSelection} />
            )}
          </div>
        </main>
        {aiPanelOpen && resultsReady ? (
          <ChatPanel
            onPmAssistantComplete={handlePmAssistantComplete}
            recommendationsReady={serpResultsMode === "pm_results"}
            courseSelectionFeaturesReady={courseSelectionFeaturesReady}
            onClose={closeAiPanel}
            selectedCourses={selectedCourses}
            onRemoveSelectedCourse={removeCourseSelection}
            onCompareSelected={handleCompareSelectedFromChat}
            compareChatExchanges={compareChatExchanges}
            moreLikeThisChatExchanges={moreLikeThisChatExchanges}
            exploreAlternativesChatExchanges={exploreAlternativesChatExchanges}
            removeCourseChatExchanges={removeCourseChatExchanges}
            comparisonActive={comparisonActive}
          />
        ) : aiPanelOpen ? (
          <ChatPanelSkeleton onClose={closeAiPanel} />
        ) : null}
      </div>
    </div>
  );
}