import { forwardRef, type ReactNode } from "react";
import { Link } from "react-router";
import courseraPlusWordmark from "@/assets/courseraplus.png";
import { ROUTES } from "@/routes";

const ROLES = [
  "Data Analyst",
  "Project Manager",
  "Cyber Security Analyst",
  "Data Scientist",
  "Business Intelligence Analyst",
  "Digital Marketing Specialist",
  "UI/UX Designer",
  "Machine Learning Engineer",
  "Social Media Specialist",
  "Computer Support Specialist",
] as const;

const CATEGORIES = [
  "Artificial Intelligence",
  "Business",
  "Data Science",
  "Computer Science",
  "Information Technology",
  "Language Learning",
  "Health",
  "Personal Development",
  "Physical Science and Engineering",
  "Social Sciences",
  "Arts and Humanities",
] as const;

const CERT_SUBJECTS = ["Business", "Computer Science", "Data Science", "Information Technology"] as const;

const DEGREE_ITEMS = ["Bachelor’s Degrees", "Master’s Degrees", "Postgraduate Programs"] as const;

const TRENDING_SKILLS = [
  "Python",
  "Artificial Intelligence",
  "Excel",
  "Machine Learning",
  "SQL",
  "Project Management",
  "Power BI",
  "Marketing",
] as const;

function MenuColumn({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex w-[212px] max-w-full shrink-0 flex-col gap-2 whitespace-normal">
      <p className="font-['Source_Sans_3',sans-serif] text-[16px] font-semibold leading-[20px] tracking-[-0.048px] text-[#1f1f1f]">
        {title}
      </p>
      {children}
    </div>
  );
}

function MenuLinks({
  items,
  viewAllTo,
  onViewAllClick,
}: {
  items: readonly string[];
  viewAllTo?: string;
  onViewAllClick?: () => void;
}) {
  const viewAllClass =
    "cursor-pointer text-left font-['Source_Sans_3',sans-serif] text-[14px] leading-[20px] text-[#0f1114] underline decoration-solid [text-decoration-skip-ink:none] transition-colors hover:text-[#0056d2]";

  return (
    <ul className="flex flex-col gap-1 font-['Source_Sans_3',sans-serif] text-[14px] leading-[20px] text-[#404b61]">
      {items.map((label) => (
        <li key={label}>
          <button
            type="button"
            className="w-full cursor-pointer rounded-sm text-left font-normal text-[14px] text-[#404b61] transition-colors hover:text-[#0f1114]"
          >
            {label}
          </button>
        </li>
      ))}
      <li>
        {viewAllTo ? (
          <Link
            to={viewAllTo}
            className={viewAllClass}
            onClick={() => {
              onViewAllClick?.();
            }}
          >
            View all
          </Link>
        ) : (
          <button type="button" className={viewAllClass}>
            View all
          </button>
        )}
      </li>
    </ul>
  );
}

export const ExploreMegaMenu = forwardRef<
  HTMLDivElement,
  { menuEntered: boolean; topPx: number; id?: string; onInternalNavigate?: () => void }
>(function ExploreMegaMenu({ menuEntered, topPx, id, onInternalNavigate }, ref) {
  return (
    <div
      ref={ref}
      id={id}
      style={{ top: topPx }}
      className={`fixed left-0 right-0 z-[50] overflow-x-auto overflow-y-hidden border-b border-t border-solid border-[#e5e7e8] bg-white shadow-[0_12px_32px_rgba(15,17,20,0.08)] transition-[transform,opacity] duration-300 ease-out ${
        menuEntered ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
      }`}
      data-name="Explore Menu"
      role="navigation"
      aria-label="Explore Coursera"
    >
      <div className="mx-auto flex min-h-[min(432px,70vh)] w-full max-w-[1114px] flex-col px-4 pb-1 pt-4 sm:px-6">
        <div className="flex flex-1 flex-wrap items-start justify-between gap-x-6 gap-y-8 pb-4">
          <MenuColumn title="Explore roles">
            <MenuLinks items={ROLES} viewAllTo={ROUTES.roles} onViewAllClick={onInternalNavigate} />
          </MenuColumn>
          <MenuColumn title="Explore categories">
            <MenuLinks items={CATEGORIES} />
          </MenuColumn>
          <div className="flex w-[212px] max-w-full shrink-0 flex-col gap-6">
            <div className="flex flex-col gap-2">
              <p className="font-['Source_Sans_3',sans-serif] text-[16px] font-semibold leading-[20px] tracking-[-0.048px] text-[#1f1f1f]">
                Earn a Professional Certificate
              </p>
              <MenuLinks items={CERT_SUBJECTS} />
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-['Source_Sans_3',sans-serif] text-[16px] font-semibold leading-[20px] tracking-[-0.048px] text-[#1f1f1f]">
                Earn an online degree
              </p>
              <MenuLinks items={DEGREE_ITEMS} />
            </div>
          </div>
          <div className="flex w-[212px] max-w-full shrink-0 flex-col gap-6">
            <div className="flex flex-col gap-2">
              <p className="font-['Source_Sans_3',sans-serif] text-[16px] font-semibold leading-[20px] tracking-[-0.048px] text-[#1f1f1f]">
                Explore trending skills
              </p>
              <MenuLinks items={TRENDING_SKILLS} />
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-['Source_Sans_3',sans-serif] text-[16px] font-semibold leading-[20px] tracking-[-0.048px] text-[#1f1f1f]">
                Prepare for a certification exam
              </p>
              <button
                type="button"
                className="w-fit cursor-pointer text-left font-['Source_Sans_3',sans-serif] text-[14px] leading-[20px] text-[#0f1114] underline decoration-solid [text-decoration-skip-ink:none] transition-colors hover:text-[#0056d2]"
              >
                View all
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-solid border-[#e8eef7] py-6">
          <p className="font-['Source_Sans_3',sans-serif] text-[14px] leading-[20px] text-[#404b61]">Not sure where to begin?</p>
          <div className="flex flex-wrap items-center gap-2 font-['Source_Sans_3',sans-serif] text-[14px] leading-[20px] text-[#1e2229]">
            <button
              type="button"
              className="cursor-pointer text-[14px] leading-[20px] underline decoration-solid [text-decoration-skip-ink:none] transition-colors hover:text-[#0056d2]"
            >
              Browse free courses
            </button>
            <span className="text-[#1e2229]">or</span>
            <span className="inline-flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                className="cursor-pointer text-[14px] leading-[20px] underline decoration-solid [text-decoration-skip-ink:none] transition-colors hover:text-[#0056d2]"
              >
                Learn more about
              </button>
              <img
                src={courseraPlusWordmark}
                alt="Coursera Plus"
                className="relative top-[2px] h-[9.5px] w-auto object-contain"
              />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});
