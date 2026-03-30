import iconAssessments from "@/assets/icon-assessments.svg";
import iconHandson from "@/assets/icon-handson.svg";
import iconLanguage from "@/assets/icon-language.svg";
import iconLinkedin from "@/assets/icon-linkedin.svg";

const body = "font-['Source_Sans_3',sans-serif] text-[12px] text-[#0f1114]";

/** Figma 2109:77001 — horizontal “Details to know” row with icons + two-line labels. */
export type ProductDetailsToKnowProps = {
  /** Second line under “Hands-on” (e.g. from course detail). */
  handsOnSubtitle: string;
};

export function ProductDetailsToKnow({ handsOnSubtitle }: ProductDetailsToKnowProps) {
  return (
    <section
      className="flex flex-col items-start gap-3"
      data-name="Details to know"
      data-node-id="2109:77001"
    >
      <h2 className="w-full font-['Source_Sans_3',sans-serif] text-[16px] font-semibold leading-5 tracking-[-0.048px] text-black">
        Details to know
      </h2>
      <div
        className="flex w-full flex-wrap items-center gap-8"
        data-name="Details"
        data-node-id="2109:77003"
      >
        <div className="flex shrink-0 items-start gap-1" data-name="Cert" data-node-id="2109:77004">
          <div className="flex shrink-0 items-center p-px" data-name="icon-linkedin" data-node-id="2109:77005">
            <img alt="" src={iconLinkedin} className="size-[14px] max-w-none" width={14} height={14} />
          </div>
          <p className={`${body} whitespace-nowrap`} data-node-id="2109:77007">
            <span className="block font-semibold leading-[18px]">Sharable certificate</span>
            <span className="block font-normal leading-[18px]">Add to your LinkedIn</span>
          </p>
        </div>

        <div className="flex shrink-0 items-start gap-1" data-name="Assessments" data-node-id="2109:77008">
          <div
            className="flex shrink-0 items-center py-0.5"
            data-name="icon-assessments"
            data-node-id="2109:77009"
          >
            <img
              alt=""
              src={iconAssessments}
              className="h-4 w-4 max-w-none object-contain object-left"
              width={16}
              height={20}
            />
          </div>
          <p className={`${body} whitespace-nowrap`} data-node-id="2109:77011">
            <span className="block font-semibold leading-[18px]">Assessments</span>
            <span className="block font-normal leading-[18px] text-[rgba(91,103,128,1)]">22 assignments</span>
          </p>
        </div>

        <div className="flex shrink-0 items-start gap-1" data-name="Hands-on" data-node-id="2109:77012">
          <div
            className="flex shrink-0 items-center py-0.5"
            data-name="icon-handson"
            data-node-id="2109:77013"
          >
            <img
              alt=""
              src={iconHandson}
              className="h-4 w-4 max-w-none object-contain object-left"
              width={16}
              height={20}
            />
          </div>
          <p className={`${body} min-w-0 whitespace-normal`} data-node-id="2109:77015">
            <span className="block font-semibold leading-[18px]">Hands-on</span>
            <span className="block font-normal leading-[18px] text-[#5b6780]">{handsOnSubtitle}</span>
          </p>
        </div>

        <div className="flex shrink-0 items-start gap-1" data-name="Language" data-node-id="2109:77016">
          <div
            className="flex shrink-0 items-center py-0.5"
            data-name="icon-language"
            data-node-id="2109:77017"
          >
            <img
              alt=""
              src={iconLanguage}
              className="h-4 w-4 max-w-none object-contain object-left"
              width={16}
              height={20}
            />
          </div>
          <p className={`${body} whitespace-nowrap`} data-node-id="2109:77019">
            <span className="block font-semibold leading-[18px]">Taught in English</span>
            <span className="block font-normal leading-[18px] text-[#5b6780] underline decoration-solid [text-decoration-skip-ink:none]">
              22 languages
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
