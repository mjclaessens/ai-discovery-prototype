import type { ReactNode } from "react";

/** Figma ProductCard -2 (node 2104:20461): padded shell with clip + 14.25px radius. */
export function SerpProductCardShell({ children }: { children: ReactNode }) {
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
export type SerpCardSelection = {
  selected: boolean;
  onToggle: () => void;
  title: string;
  /** When true, the card cannot be newly selected (e.g. max selections reached). */
  disabled?: boolean;
};

export const MAX_SELECTED_COURSES = 3;

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

export function SerpCardInteractiveWrap({
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

export function SerpCardImageSlot({
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
