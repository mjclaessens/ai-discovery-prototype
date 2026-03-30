import imgBusinessIntelligenceAnalyst from "@/assets/business-intelligence-analyst.png";
import imgComputerSupportSpecialist from "@/assets/computer-support-specialist.png";
import imgCyberSecurityAnalyst from "@/assets/cyber-security-analyst.png";
import imgDataAnalyst from "@/assets/data-analyst.png";
import imgDataScientist from "@/assets/data-scientist.png";
import imgDigitalMarketingSpecialist from "@/assets/digital-marketing-specialist.png";
import imgMachineLearningEngineer from "@/assets/machine-learning-engineer.png";
import imgProjectManager from "@/assets/project-manager.png";
import imgSocialMediaStrategist from "@/assets/social-media-strategist.png";
import imgUiUxDesigner from "@/assets/ui-ux-designer.png";
import googleLogo from "@/assets/google.png";
import ibmLogo from "@/assets/ibm.png";
import deeplearningLogo from "@/assets/deeplearning.png";
import type { RoleCredential, RoleHeroImageId, RolesPageRole } from "@/data/rolesPageContent";

const ROLE_HERO_IMAGES: Record<RoleHeroImageId, string> = {
  "data-analyst": imgDataAnalyst,
  "data-scientist": imgDataScientist,
  "project-manager": imgProjectManager,
  "cyber-security-analyst": imgCyberSecurityAnalyst,
  "business-intelligence-analyst": imgBusinessIntelligenceAnalyst,
  "digital-marketing-specialist": imgDigitalMarketingSpecialist,
  "ui-ux-designer": imgUiUxDesigner,
  "machine-learning-engineer": imgMachineLearningEngineer,
  "social-media-strategist": imgSocialMediaStrategist,
  "computer-support-specialist": imgComputerSupportSpecialist,
};

const PARTNER_LOGO: Record<RoleCredential["partner"], string> = {
  google: googleLogo,
  ibm: ibmLogo,
  deeplearning: deeplearningLogo,
};

export function ExploreRoleCard({ role }: { role: RolesPageRole }) {
  const heroSrc = ROLE_HERO_IMAGES[role.heroImage];

  return (
    <article
      className="flex h-full flex-col overflow-hidden rounded-2xl border-2 border-solid border-[#e5e7e8] bg-white p-2"
      data-name="Role Card"
    >
      <div className="relative h-[171px] w-full shrink-0 overflow-hidden rounded-[12px] bg-[#f2f5fa]">
        <img alt="" className="h-full w-full object-cover object-top" src={heroSrc} />
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-3 px-2 pb-2 pt-3">
        <div className="flex flex-col gap-1">
          <h3 className="font-['Source_Sans_3',sans-serif] text-[20px] font-semibold leading-6 tracking-[-0.06px] text-black">
            {role.title}
          </h3>
          <p className="font-['Source_Sans_3',sans-serif] text-[14px] font-normal leading-5 text-[#636363]">{role.description}</p>
        </div>

        <p className="font-['Source_Sans_3',sans-serif] text-[14px] font-normal leading-5 text-[#636363]">
          <span className="font-semibold text-[#1f1f1f]">If you like</span>
          <span className="text-[#1f1f1f]">:</span>
          <span className="text-[#636363]">{role.ifYouLike}</span>
        </p>

        <div className="flex flex-col gap-0.5 text-[14px] leading-5">
          <div className="flex flex-wrap items-center gap-1">
            <span className="font-['Source_Sans_3',sans-serif] font-semibold tracking-[0.14px] text-[#0f1114]">{role.medianSalary}</span>
            <span className="font-['Source_Sans_3',sans-serif] font-normal text-[#636363]">median salary ¹</span>
          </div>
          <div className="flex flex-wrap items-center gap-1">
            <span className="font-['Source_Sans_3',sans-serif] font-semibold tracking-[0.14px] text-[#0f1114]">{role.jobsAvailable}</span>
            <span className="font-['Source_Sans_3',sans-serif] font-normal text-[#636363]">jobs available ¹</span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <p className="font-['Source_Sans_3',sans-serif] text-[14px] font-semibold leading-5 tracking-[0.14px] text-[#1f1f1f]">Credentials</p>
          <ul className="flex flex-col gap-1">
            {role.credentials.map((c) => (
              <li key={c.label} className="flex items-center gap-2">
                <div className="flex size-[25px] shrink-0 items-center justify-center rounded-[2px] border border-solid border-[#e5e7e8] bg-white p-0.5">
                  <img alt="" className="size-[18px] object-contain" src={PARTNER_LOGO[c.partner]} />
                </div>
                <button
                  type="button"
                  className="min-w-0 flex-1 text-left font-['Source_Sans_3',sans-serif] text-[14px] font-normal leading-5 text-[#0056d2] underline decoration-solid [text-decoration-skip-ink:none]"
                >
                  {c.label}
                </button>
              </li>
            ))}
          </ul>
          {role.moreCredentialsCount > 0 ? (
            <button
              type="button"
              className="w-fit font-['Source_Sans_3',sans-serif] text-[14px] font-normal leading-5 text-[#0056d2]"
            >
              + {role.moreCredentialsCount} more
            </button>
          ) : null}
        </div>
      </div>
    </article>
  );
}
