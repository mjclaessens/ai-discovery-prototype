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
export function SerpResultsSkeleton({
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
