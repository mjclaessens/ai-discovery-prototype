import adobeLogo from "../assets/adobe.png";
import courseraLogo from "../assets/coursera.png";
import deeplearningLogo from "../assets/deeplearning.png";
import googleLogo from "../assets/google.png";
import ibmLogo from "../assets/ibm.png";
import simplilearnLogo from "../assets/simplilearn.png";
import skillupLogo from "../assets/skillup.png";
import starweaverLogo from "../assets/starweaver.png";
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

export type PmResultCardConfig = {
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

export const PM_RESULT_CARDS: PmResultCardConfig[] = [
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

/** Titles for default SERP ProductCard grid (ProductCard → ProductCard8), for selection aria-labels. */
export const SERP_DEFAULT_RESULT_TITLES = [
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
export const SERP_DEFAULT_THUMBS = [serp1, serp2, serp3, serp4, serp5, serp6, serp7, serp8, serp9] as const;

/** Partner labels from default grid headers (ProductCard0–8). */
export const SERP_DEFAULT_PARTNERS = [
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

export const SERP_DEFAULT_META = "Beginner · Course · 1-4 weeks";
export const SERP_DEFAULT_RATING = "4.9 · 3.4k reviews";

/** Figma 2219:125198 — compare stripe rows (prototype copy shared across columns). */
export const COMPARISON_SKILLS_LINE =
  "Business communication, Human Resources, Interviewing Skills, Verbal Communication";
export const COMPARISON_TOOLS_LINE = "ChatGPT, Claude, Gemini, Perplexity AI";
export const COMPARISON_HANDS_ON_LINE = "3 coding assignments, 1 role play";
export const COMPARISON_SUMMARY_LINE =
  "Learners say the course makes it easy to build practical generative AI skills through hands-on exercises. They find they can quickly apply what they learn to real-world tasks.";

/** Figma 1971:51712 — Product type / Level rows from SERP meta (e.g. "Beginner · Course · 1-4 weeks"). */
export function parseMetaForCompare(meta: string): { levelLine: string; productTypeLine: string } {
  const parts = meta
    .split(/\s*·\s*/u)
    .map((s) => s.trim())
    .filter(Boolean);
  if (parts.length >= 3) {
    return {
      levelLine: parts[0] ?? "Beginner",
      productTypeLine: `${parts[1]} (${parts[2]})`,
    };
  }
  if (parts.length === 2) {
    return { levelLine: parts[0] ?? "Beginner", productTypeLine: parts[1] ?? "" };
  }
  return { levelLine: "Beginner", productTypeLine: meta };
}

/** Level, product type label, and duration segment from card `meta` string. */
export function parseMetaForStats(meta: string): { level: string; productType: string; duration: string } {
  const parts = meta
    .split(/\s*·\s*/u)
    .map((s) => s.trim())
    .filter(Boolean);
  return {
    level: parts[0] ?? "Beginner",
    productType: parts[1] ?? "Course",
    duration: parts[2] ?? "",
  };
}

/** Split rating line like `4.9 · 3.4k reviews` for hero stats. */
export function parseRatingDisplay(rating: string): { stars: string; reviews: string } {
  const parts = rating.split(/\s*·\s*/u).map((s) => s.trim());
  return { stars: parts[0] ?? "", reviews: parts.slice(1).join(" · ") || "" };
}

export type SerpResultsMode = "default" | "pm_updating" | "pm_results";

export function getSerpResultIds(mode: SerpResultsMode): string[] {
  if (mode === "default") {
    return Array.from({ length: SERP_DEFAULT_RESULT_TITLES.length }, (_, i) => `default:${i}`);
  }
  if (mode === "pm_results") {
    return Array.from({ length: PM_RESULT_CARDS.length }, (_, i) => `pm:${i}`);
  }
  return [];
}

export function pickNextFromPool(current: string[], mode: SerpResultsMode): string | undefined {
  return getSerpResultIds(mode).find((id) => !current.includes(id));
}

export function pickReplacementForSlot(
  current: string[],
  slotIndex: number,
  mode: SerpResultsMode,
): string | undefined {
  const others = current.filter((_, i) => i !== slotIndex);
  return getSerpResultIds(mode).find((id) => !others.includes(id) && id !== current[slotIndex]);
}

export type ResolvedSerpCourse = {
  id: string;
  title: string;
  partner: string;
  thumb: string;
  meta: string;
  rating: string;
};

export type CompareCourseDetail = ResolvedSerpCourse & {
  logo?: string;
  partnerInitial?: string;
  description?: string;
  matchPercent?: number;
  showAiSkillsTag?: boolean;
  productTypeLine: string;
  levelLine: string;
  skillsLine: string;
  toolsLine: string;
  handsOnLine: string;
  summaryLine: string;
};

/** Stable IDs: `default:0`…`default:8`, `pm:0`…`pm:5`. */
export function resolveSerpCourseId(id: string): ResolvedSerpCourse | null {
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

export function resolveSelectedCourses(ids: Set<string>): ResolvedSerpCourse[] {
  return Array.from(ids)
    .map((courseId) => resolveSerpCourseId(courseId))
    .filter((c): c is ResolvedSerpCourse => c != null);
}

export function partnerLogoForDefaultSerp(partner: string): string | undefined {
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

export function resolveCompareCourseDetail(id: string): CompareCourseDetail | null {
  const base = resolveSerpCourseId(id);
  if (!base) return null;
  const staticRows = {
    skillsLine: COMPARISON_SKILLS_LINE,
    toolsLine: COMPARISON_TOOLS_LINE,
    handsOnLine: COMPARISON_HANDS_ON_LINE,
    summaryLine: COMPARISON_SUMMARY_LINE,
  };
  const metaRows = parseMetaForCompare(base.meta);
  if (id.startsWith("pm:")) {
    const idx = Number(id.slice("pm:".length));
    if (!Number.isInteger(idx) || idx < 0 || idx >= PM_RESULT_CARDS.length) return null;
    const c = PM_RESULT_CARDS[idx];
    const comparisonMatchFallback =
      c.matchPercent ?? (idx >= 3 && idx <= 5 ? ([68, 65, 62] as const)[idx - 3] : 58);
    return {
      ...base,
      logo: c.logo,
      partnerInitial: c.partnerInitial,
      description: c.description,
      matchPercent: comparisonMatchFallback,
      showAiSkillsTag: c.showAiSkillsTag,
      productTypeLine: metaRows.productTypeLine,
      levelLine: metaRows.levelLine,
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
      productTypeLine: metaRows.productTypeLine,
      levelLine: metaRows.levelLine,
      ...staticRows,
    };
  }
  return null;
}
