import { CircleHelp } from "lucide-react";
import type { ReactNode } from "react";
import courseraPlusLogo from "@/assets/courseraplus.png";
import { cn } from "@/lib/utils";
import svgPaths from "@/components/svg/svg-blndo5mrzw";

/** Figma 2109:76875 — Product PDP hero (emphasis background, KIM stats card). */
export type ProductDetailsHeroProps = {
  partnerLogo?: string;
  partnerFallbackLetter: string;
  title: string;
  subtitle: string;
  courseThumb: string;
  /** Figma 2109:76898 — single instructor name beside avatar. */
  instructorName: string;
  matchPercent?: number | null;
  showAiSkillsTag: boolean;
  /** Rating number string e.g. "4.9" */
  stars: string;
  /** Reviews line e.g. "3.4k reviews" */
  reviews: string;
  courseCountLabel: string;
  productTypeSub: string;
  levelLabel: string;
  scheduleSub: string;
};

function StarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 10 9" fill="none" aria-hidden>
      <path d={svgPaths.p63e9900} fill="currentColor" />
    </svg>
  );
}

function HeroStatColumn({
  primary,
  secondary,
  primaryUnderline,
  primaryPlain,
  className,
}: {
  primary: ReactNode;
  secondary: ReactNode;
  primaryUnderline?: boolean;
  /** Stars row: no default semibold on wrapper */
  primaryPlain?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex min-h-px min-w-0 flex-1 flex-col gap-1 border-[#dae1ed] sm:border-r sm:pr-6 last:sm:border-r-0 last:sm:pr-0",
        className,
      )}
    >
      <div
        className={`font-['Source_Sans_3',sans-serif] text-[16px] leading-[20px] tracking-[-0.048px] text-[#0f1114] ${
          primaryPlain ? "font-normal" : "font-semibold"
        } ${primaryUnderline ? "underline decoration-solid underline-offset-2" : ""}`}
      >
        {primary}
      </div>
      <div className="font-['Source_Sans_3',sans-serif] text-[14px] font-normal leading-[20px] text-[#5b6780]">{secondary}</div>
    </div>
  );
}

export function ProductDetailsHero({
  partnerLogo,
  partnerFallbackLetter,
  title,
  subtitle,
  courseThumb,
  instructorName,
  matchPercent,
  showAiSkillsTag,
  stars,
  reviews,
  courseCountLabel,
  productTypeSub,
  levelLabel,
  scheduleSub,
}: ProductDetailsHeroProps) {
  return (
    <div
      className="flex w-full flex-col gap-2 rounded-[20px] bg-[#f0f6ff] p-6"
      data-name="Hero"
      data-node-id="2109:76875"
    >
      <div className="flex w-full min-w-0 flex-col gap-1.5" data-name="Title">
        <div className="flex items-center py-1.5" data-name="Partner Branding">
          {partnerLogo ? (
            <div className="relative h-6 max-w-[120px] shrink-0">
              <img
                alt=""
                className="h-full max-h-6 w-auto max-w-full object-contain object-left"
                src={partnerLogo}
              />
            </div>
          ) : (
            <div className="flex h-6 min-w-[48px] items-center justify-center rounded border border-[#e5e7e8] bg-white px-2 font-['Source_Sans_3',sans-serif] text-[11px] font-semibold text-[#5b6780]">
              {partnerFallbackLetter}
            </div>
          )}
        </div>

        <h1 className="font-['Source_Sans_3',sans-serif] text-[30px] font-semibold leading-[36px] tracking-[-0.15px] text-black">
          {title}
        </h1>

        {subtitle.trim() ? (
          <p className="max-w-[720px] font-['Source_Sans_3',sans-serif] text-[16px] font-normal leading-[24px] text-[#0f1114]">
            {subtitle}
          </p>
        ) : null}

        <div className="flex w-full min-w-0 flex-col gap-8 pt-1 sm:flex-row sm:flex-wrap sm:items-center sm:gap-8">
          <div
            className="flex w-fit min-w-0 shrink-0 items-center gap-2"
            data-name="Instructors at the header"
            data-node-id="2109:76898"
          >
            <div className="flex shrink-0 items-start">
              <div className="relative size-9 shrink-0 overflow-hidden rounded-full border border-solid border-[#e5e7e8] bg-white p-0.5">
                <img alt="" src={courseThumb} className="size-full rounded-full object-cover" />
              </div>
            </div>
            <div className="flex min-w-0 flex-col justify-center">
              <div className="flex flex-wrap items-center gap-1 font-['Source_Sans_3',sans-serif] text-[16px] font-normal leading-[24px] text-[#1f1f1f]">
                <span>Instructor:</span>
                <span>{instructorName}</span>
              </div>
            </div>
          </div>

          <div className="flex min-w-0 flex-1 flex-wrap content-start items-start gap-1 py-1" data-name="Pills">
            {matchPercent != null ? (
              <div className="flex h-[25px] min-h-[25px] shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-[#6923de] to-[#3587fc] px-2">
                <span className="whitespace-nowrap font-['Source_Sans_3',sans-serif] text-[14px] font-semibold leading-[22px] text-white">
                  {matchPercent}% match
                </span>
              </div>
            ) : null}
            <div className="flex h-[25px] min-h-[25px] shrink-0 items-center justify-center rounded-full border-[1.19px] border-solid border-[#dae1ed] bg-white px-2.5">
              <span className="whitespace-nowrap font-['Source_Sans_3',sans-serif] text-[14px] font-normal leading-[22px] text-[#5b6780]">
                Top instructor
              </span>
            </div>
            {showAiSkillsTag ? (
              <div className="flex h-[25px] min-h-[25px] shrink-0 items-center justify-center rounded-full border-[1.19px] border-solid border-[#dae1ed] bg-white px-2.5">
                <span className="whitespace-nowrap font-['Source_Sans_3',sans-serif] text-[14px] font-normal leading-[22px] text-[#5b6780]">
                  AI Skills
                </span>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="flex w-full max-w-full flex-col items-start gap-[7px] pt-6" data-name="CTA">
        <button
          type="button"
          className="rounded-lg bg-[#0056d2] px-8 py-3 font-['Source_Sans_3',sans-serif] text-[16px] font-semibold leading-[24px] tracking-[0.16px] text-white hover:bg-[#0048b0]"
        >
          Join for free
        </button>
        <div className="flex min-h-[18px] flex-wrap items-start gap-1 text-[12px] leading-[18px] text-[#5b6780]">
          <span className="font-semibold">306,003 already enrolled</span>
          <span className="font-semibold">·</span>
          <span className="font-normal">Included with </span>
          <img
            alt="Coursera Plus"
            src={courseraPlusLogo}
            className="h-[14px] w-auto max-w-[70px] shrink-0 self-center object-contain object-left"
          />
          <button
            type="button"
            className="font-normal text-[12px] leading-[18px] text-[#5b6780] underline decoration-solid"
          >
            learn more
          </button>
        </div>
      </div>

      <div
        className="flex w-full flex-col rounded-2xl border border-solid border-[#dae1ed] bg-white px-4 py-4 sm:flex-row sm:items-stretch sm:px-6 sm:py-4"
        data-name="KIM"
      >
        <HeroStatColumn primary={courseCountLabel} secondary={productTypeSub} primaryUnderline />
        <HeroStatColumn
          className="pl-6"
          primaryPlain
          primary={
            <span className="inline-flex flex-wrap items-center gap-1">
              {[0, 1, 2, 3, 4].map((i) => (
                <StarIcon key={i} className="size-4 shrink-0 text-[#0f1114]" />
              ))}
              <span className="font-['Source_Sans_3',sans-serif] text-[16px] font-semibold leading-[20px] tracking-[-0.048px] text-[#0f1114]">
                {stars}
              </span>
            </span>
          }
          secondary={reviews ? `(${reviews})` : ""}
        />
        <HeroStatColumn
          className="pl-6"
          primary={`${levelLabel} level`}
          secondary={
            <span className="inline-flex items-center gap-1">
              <span>Recommended experience</span>
              <button
                type="button"
                className="inline-flex size-5 shrink-0 items-center justify-center rounded-full text-[#5b6780] hover:bg-[#f2f5fa]"
                aria-label="More about recommended experience"
              >
                <CircleHelp className="size-4" strokeWidth={1.75} aria-hidden />
              </button>
            </span>
          }
        />
        <HeroStatColumn className="ml-6" primary="Flexible schedule" secondary={scheduleSub} />
      </div>
    </div>
  );
}
