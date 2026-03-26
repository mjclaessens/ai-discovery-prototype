import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import svgPaths from "@/components/svg/svg-blndo5mrzw";
import {
  SERP_FILTER_DEFS,
  getFilterPillLabel,
  serpSelectionSame,
  type SerpFilterDef,
  type SerpFilterOption,
} from "./serpFilterConstants";

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

export function SerpFilterBar() {
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

export function SerpFilterBarSkeleton() {
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
