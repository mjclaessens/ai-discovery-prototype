import { COURSERA_CATALOG, rankCoursesByQuery } from "./courseraCatalog";
import type { CourseHit } from "./courseraTypes";

export type AiPart = { type: "parts"; prefix: string; bold: string; suffix: string; submit: string };
export type AiFull = { type: "full"; text: string; submit: string };
export type AiRow = AiPart | AiFull;

export type TypingAutocompleteData = {
  topCourse: CourseHit;
  topCourseImage: string;
  aiRows: AiRow[];
  /** Course-style search suggestions (submit = full string for search / assistant) */
  searchRows: { label: string; submit: string }[];
};

export function thumbnailForCourse(index: number): string {
  const names = ["hero1.png", "hero2.png", "spotlight1-1.png", "spotlight1-2.png"];
  const i = Math.abs(index) % names.length;
  return new URL(`../assets/${names[i]}`, import.meta.url).href;
}

function buildAiRows(q: string, qLower: string, top: CourseHit): AiRow[] {
  const t = top.title;
  return [
    {
      type: "parts",
      prefix: "What should I know before starting ",
      bold: qLower,
      suffix: "?",
      submit: `What should I know before starting ${qLower}?`,
    },
    {
      type: "full",
      text: `How does ${t} compare to other ${qLower} courses on Coursera?`,
      submit: `How does ${t} compare to other ${qLower} courses on Coursera?`,
    },
    {
      type: "parts",
      prefix: "What careers use ",
      bold: qLower,
      suffix: " in 2025?",
      submit: `What careers use ${qLower} in 2025?`,
    },
    {
      type: "full",
      text: `Is ${t} a good fit if I'm new to ${qLower}?`,
      submit: `Is ${t} a good fit if I'm new to ${qLower}?`,
    },
  ];
}

function buildSearchRows(q: string, courses: CourseHit[]): { label: string; submit: string }[] {
  const trimmed = q.trim();
  const rest = courses.slice(1, 5);
  const rows: { label: string; submit: string }[] = rest.map((c) => ({
    label: c.title,
    submit: c.title,
  }));
  while (rows.length < 4) {
    const pad = `${trimmed} — browse more on Coursera`;
    rows.push({ label: pad, submit: trimmed });
  }
  return rows.slice(0, 4);
}

export function buildTypingAutocomplete(query: string, ranked: CourseHit[]): TypingAutocompleteData {
  const q = query.trim();
  const qLower = q.toLowerCase();
  const top = ranked[0] ?? COURSERA_CATALOG[0];
  const idx = COURSERA_CATALOG.findIndex((c) => c.title === top.title);
  const topCourseImage = thumbnailForCourse(idx >= 0 ? idx : top.title.length);

  return {
    topCourse: top,
    topCourseImage,
    aiRows: buildAiRows(q, qLower, top),
    searchRows: buildSearchRows(q, ranked),
  };
}

export function mergeLiveTitles(query: string, liveTitles: string[]): TypingAutocompleteData {
  const ranked = rankCoursesByQuery(query, liveTitles);
  return buildTypingAutocomplete(query, ranked);
}
