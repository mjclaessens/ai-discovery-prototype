import { useCallback, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { ArrowRight, Check, ChevronDown, Globe, GraduationCap, Wrench } from "lucide-react";
import actionsAdd from "../assets/actions-add.svg";
import actionsAudio from "../assets/actions-audio.svg";
import actionsClose from "../assets/actions-close.svg";
import actionsCopy from "../assets/actions-copy.svg";
import actionsMore from "../assets/actions-more.svg";
import actionsReload from "../assets/actions-reload.svg";
import actionsThumbsDown from "../assets/actions-thumbsdown.svg";
import actionsThumbsUp from "../assets/actions-thumbsup.svg";
import { ProductDetailsHero } from "@/components/product/ProductDetailsHero";
import { CHAT_PANEL_ASIDE_CLASS, ChatPanelHeader } from "@/components/chat/ChatPanelChrome";
import AppPageHeader from "@/components/layout/AppPageHeader";
import MetaNav from "@/components/layout/MetaNav";
import { BackLink } from "@/components/ui/BackLink";
import {
  parseMetaForStats,
  parseRatingDisplay,
  partnerLogoForDefaultSerp,
  resolveCompareCourseDetail,
  resolveSerpCourseId,
} from "@/data/serpCourses";
import { ROUTES } from "@/routes";

type TabId = "about" | "outcomes" | "courses" | "testimonials" | "recommendations";

function splitSkillTags(line: string): string[] {
  return line
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function ProductDetailsNotFound() {
  return (
    <div className="mx-auto flex min-h-[40vh] max-w-[560px] flex-col items-center justify-center gap-4 px-6 py-16 text-center">
      <p className="font-['Source_Sans_3',sans-serif] text-[20px] font-semibold text-[#0f1114]">We couldn’t find this product</p>
      <p className="font-['Source_Sans_3',sans-serif] text-[14px] leading-[20px] text-[#5b6780]">
        Try returning to search and picking a course from the results.
      </p>
      <Link
        to={ROUTES.search}
        className="rounded border border-[#0056d2] px-6 py-3 font-['Source_Sans_3',sans-serif] text-[16px] font-bold text-[#0056d2] hover:bg-[#f2f5fa]"
      >
        Back to search
      </Link>
    </div>
  );
}

function ProductDetailsAiSidebar({
  courseTitle,
  onClose,
}: {
  courseTitle: string;
  onClose: () => void;
}) {
  const suggestions = ["What skills will I gain?", "Compare to similar courses", "Is there a certificate?"];
  return (
    <aside
      className={`${CHAT_PANEL_ASIDE_CLASS} sm:!right-0`}
      data-name="Product PDP Chat Panel"
    >
      <ChatPanelHeader onClose={onClose} />
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-6">
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-[#e6f4ea] px-3 py-2">
          <Check className="size-4 shrink-0 text-[#137333]" strokeWidth={2.5} aria-hidden />
          <span className="font-['Source_Sans_3',sans-serif] text-[13px] font-semibold text-[#137333]">
            Recommendations updated
          </span>
        </div>
        <p className="mb-3 font-['Source_Sans_3',sans-serif] text-[14px] leading-[22px] text-[#0f1114]">
          Here is why this course is a strong fit for your goals. Review the summary and ask follow-up questions anytime.
        </p>
        <button
          type="button"
          className="mb-6 w-full rounded-lg border border-[#dae1ed] bg-white px-3 py-2 text-left font-['Source_Sans_3',sans-serif] text-[13px] font-semibold leading-[18px] text-[#0056d2] transition-colors hover:bg-[#f2f5fa]"
        >
          View {courseTitle}
        </button>
        <p className="mb-3 font-['Source_Sans_3',sans-serif] text-[14px] leading-[22px] text-[#0f1114]">
          This offering lines up with the skills and pace shown on the product card. Use the questions below to go deeper
          before you enroll.
        </p>
        <p className="mb-2 font-['Source_Sans_3',sans-serif] text-[14px] font-semibold text-[#0f1114]">
          Do you have any questions?
        </p>
        <div className="flex flex-col gap-2">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              className="rounded-full border border-[#dae1ed] bg-white px-3 py-2 text-left font-['Source_Sans_3',sans-serif] text-[13px] text-[#0f1114] hover:bg-[#f2f5fa]"
            >
              {s}
            </button>
          ))}
        </div>
      </div>
      <div className="shrink-0 border-t border-[#e5e7e8] bg-white px-4 pb-4 pt-3">
        <div className="mb-2 flex items-center gap-1 rounded-md border border-[#dae1ed] bg-[#f5f7f8] px-2 py-1">
          <span className="min-w-0 flex-1 truncate font-['Source_Sans_3',sans-serif] text-[11px] text-[#5b6780]">
            {courseTitle}
          </span>
          <button type="button" className="shrink-0 rounded p-0.5 text-[#5b6780]" aria-label="Remove context">
            <img alt="" src={actionsClose} className="size-4" />
          </button>
        </div>
        <div className="flex items-end gap-2 rounded-xl bg-[#f2f5fa] p-2">
          <button type="button" className="shrink-0 rounded-lg p-2 text-[#5b6780]" aria-label="Attach">
            <img alt="" src={actionsAdd} className="size-5" />
          </button>
          <div className="min-h-[44px] min-w-0 flex-1 rounded-lg border border-transparent bg-white px-3 py-2 font-['Source_Sans_3',sans-serif] text-[14px] text-[#5b6780]">
            Ask a question…
          </div>
          <button type="button" className="shrink-0 rounded-lg p-2 text-[#5b6780]" aria-label="Voice input">
            <img alt="" src={actionsAudio} className="size-5" />
          </button>
          <button
            type="button"
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#0056d2] text-white"
            aria-label="Send"
          >
            <ArrowRight className="size-5" aria-hidden />
          </button>
        </div>
        <div className="mt-3 flex items-center justify-center gap-1">
          {[actionsThumbsUp, actionsThumbsDown, actionsCopy, actionsReload, actionsMore].map((src, i) => (
            <button
              key={i}
              type="button"
              className="rounded-lg p-1.5 text-[#5b6780] hover:bg-[#f2f5fa]"
              aria-label="Message action"
            >
              <img alt="" src={src} className="size-5" />
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}

export default function ProductDetailsPage() {
  const { courseId: rawCourseId } = useParams();
  const navigate = useNavigate();
  const courseId = rawCourseId ?? "";
  const course = useMemo(() => resolveSerpCourseId(courseId), [courseId]);
  const detail = useMemo(() => (course ? resolveCompareCourseDetail(course.id) : null), [course]);

  const [aiPanelOpen, setAiPanelOpen] = useState(true);
  const [headerSearchDraft, setHeaderSearchDraft] = useState("");
  const [activeTab, setActiveTab] = useState<TabId>("about");

  const submitHeaderSearch = useCallback(() => {
    const t = headerSearchDraft.trim();
    navigate(t ? `${ROUTES.search}?q=${encodeURIComponent(t)}` : ROUTES.search);
  }, [headerSearchDraft, navigate]);

  const onHeaderAutocompletePick = useCallback(
    (q: string) => {
      const t = q.trim();
      if (!t) return;
      setHeaderSearchDraft(t);
      navigate(`${ROUTES.search}?q=${encodeURIComponent(t)}`);
    },
    [navigate],
  );

  if (!course || !detail) {
    return (
      <div className="min-h-screen w-full bg-white" data-name="Product details — not found">
        <div className="sticky top-0 z-40 bg-white">
          <MetaNav />
          <AppPageHeader className="max-w-[1440px] mx-auto" />
        </div>
        <ProductDetailsNotFound />
      </div>
    );
  }

  const { stars, reviews } = parseRatingDisplay(course.rating);
  const metaParts = parseMetaForStats(course.meta);
  const partnerLogo = detail.logo ?? partnerLogoForDefaultSerp(course.partner);
  const skills = splitSkillTags(detail.skillsLine);
  const tools = splitSkillTags(detail.toolsLine);
  const isSpecialization = metaParts.productType.toLowerCase().includes("specialization");
  const courseCountLabel = isSpecialization ? "4 courses" : "1 course";

  const learnBullets = [
    "Apply generative AI concepts to real product and workplace scenarios.",
    "Communicate trade-offs between models, data, and user trust.",
    "Practice hands-on prompts and workflows you can reuse on the job.",
    "Earn a shareable certificate to showcase your skills.",
  ];

  const accordionItems = [
    { title: "Introduction to Generative AI", sub: "Module 1 · 2 hours" },
    { title: "Generative AI: Foundation Models & Platforms", sub: "Module 2 · 3 hours" },
    { title: "Generative AI: Ethics and Responsible Use", sub: "Module 3 · 2 hours" },
  ];

  return (
    <div className="min-h-screen w-full bg-white" data-name="Product details">
      <div className="sticky top-0 z-40 bg-white">
        <MetaNav />
        <AppPageHeader
          className="max-w-[1440px] mx-auto"
          serp={{
            query: headerSearchDraft,
            onQueryChange: setHeaderSearchDraft,
            onSearchSubmit: submitHeaderSearch,
            onAutocompletePick: onHeaderAutocompletePick,
            aiPanelOpen,
            onAiSparkleClick: () => setAiPanelOpen((o) => !o),
          }}
        />
      </div>

      <div className="relative w-full">
        <main
          className={`w-full min-w-0 px-4 py-6 pb-12 sm:pl-[46px] sm:pr-[46px] ${aiPanelOpen ? "sm:pr-[430px]" : ""}`}
          data-name="PDP main"
        >
          <div className="mb-6">
            <BackLink onClick={() => navigate(ROUTES.search)} aria-label="Back to search results" />
          </div>

          <div className="mb-8 min-w-0 w-full">
              <div className="mb-10">
                <ProductDetailsHero
                  partnerLogo={partnerLogo}
                  partnerFallbackLetter={course.partner.slice(0, 1)}
                  title={course.title}
                  subtitle={detail.description ?? ""}
                  courseThumb={course.thumb}
                  instructorPrimary={course.partner}
                  matchPercent={detail.matchPercent}
                  showAiSkillsTag={detail.showAiSkillsTag}
                  stars={stars}
                  reviews={reviews}
                  courseCountLabel={courseCountLabel}
                  productTypeSub={metaParts.productType}
                  levelLabel={metaParts.level}
                  scheduleSub={metaParts.duration ? `${metaParts.duration} approx.` : ""}
                />
              </div>

              <div className="mb-8 border-b border-[#dae1ed]">
                <div className="flex flex-wrap gap-6">
                  {(
                    [
                      ["about", "About"],
                      ["outcomes", "Outcomes"],
                      ["courses", "Courses"],
                      ["testimonials", "Testimonials"],
                      ["recommendations", "Recommendations"],
                    ] as const
                  ).map(([id, label]) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setActiveTab(id)}
                      className={`border-b-2 pb-3 font-['Source_Sans_3',sans-serif] text-[14px] font-semibold transition-colors ${
                        activeTab === id
                          ? "border-[#0056d2] text-[#0056d2]"
                          : "border-transparent text-[#5b6780] hover:text-[#0f1114]"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {activeTab === "about" ? (
                <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_280px]">
                  <div className="min-w-0 space-y-8">
                    <section>
                      <h2 className="mb-3 font-['Source_Sans_3',sans-serif] text-[18px] font-semibold text-[#0f1114]">
                        What you&apos;ll learn
                      </h2>
                      <ul className="space-y-2">
                        {learnBullets.map((b) => (
                          <li key={b} className="flex gap-2 font-['Source_Sans_3',sans-serif] text-[14px] leading-[22px] text-[#0f1114]">
                            <Check className="mt-0.5 size-4 shrink-0 text-[#0056d2]" strokeWidth={2.5} aria-hidden />
                            {b}
                          </li>
                        ))}
                      </ul>
                    </section>

                    <section>
                      <h2 className="mb-3 font-['Source_Sans_3',sans-serif] text-[18px] font-semibold text-[#0f1114]">
                        Details to know
                      </h2>
                      <div className="flex flex-wrap gap-6">
                        {[
                          { icon: GraduationCap, t: "Shareable certificate" },
                          { icon: Check, t: "Assessments" },
                          { icon: Wrench, t: detail.handsOnLine },
                          { icon: Globe, t: "Taught in English" },
                        ].map(({ icon: Icon, t }) => (
                          <div key={t} className="flex max-w-[140px] flex-col items-center gap-2 text-center">
                            <Icon className="size-8 text-[#5b6780]" strokeWidth={1.5} aria-hidden />
                            <span className="font-['Source_Sans_3',sans-serif] text-[12px] leading-[16px] text-[#0f1114]">{t}</span>
                          </div>
                        ))}
                      </div>
                    </section>

                    <section>
                      <h2 className="mb-2 font-['Source_Sans_3',sans-serif] text-[16px] font-semibold text-[#0f1114]">
                        Key skills you&apos;ll build
                      </h2>
                      <div className="flex flex-wrap gap-2">
                        {skills.map((s) => (
                          <span
                            key={s}
                            className="rounded-full border border-[#dae1ed] bg-[#f5f7f8] px-3 py-1 font-['Source_Sans_3',sans-serif] text-[12px] text-[#0f1114]"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </section>

                    <section>
                      <h2 className="mb-2 font-['Source_Sans_3',sans-serif] text-[16px] font-semibold text-[#0f1114]">
                        Tools you&apos;ll use
                      </h2>
                      <div className="flex flex-wrap gap-2">
                        {tools.map((s) => (
                          <span
                            key={s}
                            className="rounded-full border border-[#dae1ed] bg-[#f5f7f8] px-3 py-1 font-['Source_Sans_3',sans-serif] text-[12px] text-[#0f1114]"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </section>

                    <section>
                      <p className="font-['Source_Sans_3',sans-serif] text-[14px] leading-[22px] text-[#0f1114]">
                        {detail.summaryLine}{" "}
                        <button type="button" className="text-[#0056d2] hover:underline">
                          Read more
                        </button>
                      </p>
                    </section>

                    <section className="space-y-2">
                      {accordionItems.map((item) => (
                        <button
                          key={item.title}
                          type="button"
                          className="flex w-full items-center gap-3 rounded-xl border border-[#dae1ed] bg-white p-3 text-left hover:bg-[#fafbfc]"
                        >
                          <img alt="" src={course.thumb} className="size-14 shrink-0 rounded-lg object-cover" />
                          <div className="min-w-0 flex-1">
                            <p className="font-['Source_Sans_3',sans-serif] text-[14px] font-semibold text-[#0f1114]">
                              {item.title}
                            </p>
                            <p className="font-['Source_Sans_3',sans-serif] text-[12px] text-[#5b6780]">{item.sub}</p>
                          </div>
                          <ChevronDown className="size-5 shrink-0 text-[#0056d2]" aria-hidden />
                        </button>
                      ))}
                    </section>
                  </div>

                  <aside className="rounded-xl border border-[#dae1ed] bg-white p-4">
                    <p className="mb-3 font-['Source_Sans_3',sans-serif] text-[14px] font-semibold text-[#0f1114]">
                      Offered by
                    </p>
                    <div className="mb-3 flex items-center gap-2">
                      {partnerLogo ? (
                        <img alt="" src={partnerLogo} className="size-12 object-contain" />
                      ) : null}
                      <span className="font-['Source_Sans_3',sans-serif] text-[16px] font-semibold">{course.partner}</span>
                    </div>
                    <p className="font-['Source_Sans_3',sans-serif] text-[13px] text-[#5b6780]">386 courses</p>
                    <p className="font-['Source_Sans_3',sans-serif] text-[13px] text-[#5b6780]">15,032,780 learners</p>
                  </aside>
                </div>
              ) : (
                <p className="font-['Source_Sans_3',sans-serif] text-[14px] text-[#5b6780]">
                  Content for this tab is coming soon.
                </p>
              )}
          </div>
        </main>

        {aiPanelOpen ? (
          <ProductDetailsAiSidebar courseTitle={course.title} onClose={() => setAiPanelOpen(false)} />
        ) : null}
      </div>
    </div>
  );
}
