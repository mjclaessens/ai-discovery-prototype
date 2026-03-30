import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { Check } from "lucide-react";
import {
  ProductDetailsAnchorLinks,
  type ProductDetailsAnchorId,
} from "@/components/product/ProductDetailsAnchorLinks";
import { ProductDetailsHero } from "@/components/product/ProductDetailsHero";
import {
  getSyllabusSectionTitle,
  ProductDetailsSyllabus,
  type ProductDetailsSyllabusItem,
} from "@/components/product/ProductDetailsSyllabus";
import { ProductDetailsToKnow } from "@/components/product/ProductDetailsToKnow";
import AppPageHeader from "@/components/layout/AppPageHeader";
import { useGlobalChat } from "@/context/GlobalChatContext";
import MetaNav from "@/components/layout/MetaNav";
import { BackLink } from "@/components/ui/BackLink";
import {
  parseMetaForStats,
  parseRatingDisplay,
  partnerLogoForDefaultSerp,
  partnerLogoLgForPartner,
  resolveCompareCourseDetail,
  resolveSerpCourseId,
  type ResolvedSerpCourse,
} from "@/data/serpCourses";
import { ROUTES } from "@/routes";

const PRODUCT_ANCHOR_LINKS = [
  { id: "about" as const, label: "About" },
  { id: "outcomes" as const, label: "Outcomes" },
  { id: "courses" as const, label: "Courses" },
  { id: "testimonials" as const, label: "Testimonials" },
  { id: "recommendations" as const, label: "Recommendations" },
] satisfies { id: ProductDetailsAnchorId; label: string }[];

function splitSkillTags(line: string): string[] {
  return line
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Noun phrase for PDP assistant copy (matches “This specialization is a strong fit…” style). */
function productNounForAiFromType(productType: string): string {
  const t = productType.toLowerCase();
  if (t.includes("specialization")) return "specialization";
  if (t.includes("professional certificate")) return "program";
  if (t.includes("certificate")) return "certificate";
  return "course";
}

const PDP_SYLLABUS_ROWS = [
  { title: "Introduction to Generative AI", sub: "Module 1 · 2 hours" },
  { title: "Generative AI: Foundation Models & Platforms", sub: "Module 2 · 3 hours" },
  { title: "Generative AI: Ethics and Responsible Use", sub: "Module 3 · 2 hours" },
] as const;

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

export default function ProductDetailsPage() {
  const { courseId: rawCourseId } = useParams();
  const navigate = useNavigate();
  const courseId = rawCourseId ?? "";
  const course = useMemo(() => resolveSerpCourseId(courseId), [courseId]);
  const detail = useMemo(() => (course ? resolveCompareCourseDetail(course.id) : null), [course]);

  const { aiPanelOpen, toggleAiPanel, setPdpContinuation } = useGlobalChat();
  const [headerSearchDraft, setHeaderSearchDraft] = useState("");
  const [activeTab, setActiveTab] = useState<ProductDetailsAnchorId>("about");

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
        <div className="relative w-full max-w-[1440px] mx-auto">
          <ProductDetailsNotFound />
        </div>
      </div>
    );
  }

  const { stars, reviews } = parseRatingDisplay(course.rating);
  const metaParts = parseMetaForStats(course.meta);
  const partnerLogo =
    partnerLogoLgForPartner(course.partner) ?? detail.logo ?? partnerLogoForDefaultSerp(course.partner);
  const skills = splitSkillTags(detail.skillsLine);
  const tools = splitSkillTags(detail.toolsLine);
  const isSpecialization = metaParts.productType.toLowerCase().includes("specialization");
  const isProfessionalCertificate = metaParts.productType.toLowerCase().includes("professional certificate");
  const courseCountLabel = isSpecialization ? "4 courses" : "1 course";

  const learnBullets = [
    "Apply generative AI concepts to real product and workplace scenarios.",
    "Communicate trade-offs between models, data, and user trust.",
    "Practice hands-on prompts and workflows you can reuse on the job.",
    "Earn a shareable certificate to showcase your skills.",
  ];

  const syllabusItems: ProductDetailsSyllabusItem[] = useMemo(() => {
    return PDP_SYLLABUS_ROWS.map((row, i) => {
      const parts = row.sub.split("·").map((s) => s.trim());
      const duration = parts[1] ?? "2 hours";
      const segmentLabel = isProfessionalCertificate ? `Course ${i + 1}` : parts[0] || `Module ${i + 1}`;
      return {
        id: `syllabus-${i}`,
        title: row.title,
        segmentLabel,
        duration,
        thumb: course.thumb,
      };
    });
  }, [course.thumb, isProfessionalCertificate]);

  const syllabusTitle = getSyllabusSectionTitle(metaParts.productType, syllabusItems.length);

  useEffect(() => {
    setPdpContinuation({
      courseId: course.id,
      courseTitle: course.title,
      courseThumb: course.thumb,
      productNounForAi: productNounForAiFromType(metaParts.productType),
    });
    return () => setPdpContinuation(null);
  }, [course.id, course.title, course.thumb, metaParts.productType, setPdpContinuation]);

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
            onAiSparkleClick: toggleAiPanel,
          }}
        />
      </div>

      <div className="relative w-full max-w-[1440px] mx-auto">
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
                  instructorName={course.instructorName}
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

              <div className="mb-8">
                <ProductDetailsAnchorLinks
                  items={PRODUCT_ANCHOR_LINKS}
                  activeId={activeTab}
                  onNavigate={setActiveTab}
                />
              </div>

              {activeTab === "about" ? (
                <div className="min-w-0 w-full space-y-8">
                  <section className="w-full min-w-0">
                    <h2 className="mb-3 font-['Source_Sans_3',sans-serif] text-[18px] font-semibold text-[#0f1114]">
                      What you&apos;ll learn
                    </h2>
                    <ul className="space-y-2">
                      {learnBullets.map((b) => (
                        <li key={b} className="flex gap-2 font-['Source_Sans_3',sans-serif] text-[14px] leading-[22px] text-[#0f1114]">
                          <Check className="mt-0.5 size-4 shrink-0 text-[#5b6780]" strokeWidth={2.5} aria-hidden />
                          {b}
                        </li>
                      ))}
                    </ul>
                  </section>

                  <div className="w-full min-w-0">
                    <ProductDetailsToKnow handsOnSubtitle={detail.handsOnLine} />
                  </div>

                  <section className="w-full min-w-0">
                    <h2 className="mb-2 font-['Source_Sans_3',sans-serif] text-[16px] font-semibold text-[#0f1114]">
                      Key skills you&apos;ll build
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {skills.map((s) => (
                        <span
                          key={s}
                          className="rounded-full border border-[#dae1ed] bg-white px-3 py-1 font-['Source_Sans_3',sans-serif] text-[12px] text-[#0f1114]"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </section>

                  <section className="w-full min-w-0">
                    <h2 className="mb-2 font-['Source_Sans_3',sans-serif] text-[16px] font-semibold text-[#0f1114]">
                      Tools you&apos;ll use
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {tools.map((s) => (
                        <span
                          key={s}
                          className="rounded-full border border-[#dae1ed] bg-white px-3 py-1 font-['Source_Sans_3',sans-serif] text-[12px] text-[#0f1114]"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </section>

                  <ProductDetailsSyllabus
                    title={syllabusTitle}
                    description={detail.summaryLine}
                    items={syllabusItems}
                    sidebar={
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
                    }
                  />
                </div>
              ) : (
                <p className="font-['Source_Sans_3',sans-serif] text-[14px] text-[#5b6780]">
                  Content for this tab is coming soon.
                </p>
              )}
          </div>
        </main>
      </div>
    </div>
  );
}
