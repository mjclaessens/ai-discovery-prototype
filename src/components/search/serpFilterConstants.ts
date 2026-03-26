export type SerpFilterOption = { id: string; label: string; count?: number };
export type SerpFilterDef = { id: string; label: string; options: SerpFilterOption[] };

/** Realistic SERP filter options (Figma 1813:39611 Tools dropdown pattern). */
export const SERP_FILTER_DEFS: SerpFilterDef[] = [
  {
    id: "topic",
    label: "Topic",
    options: [
      { id: "data-science", label: "Data Science", count: 1240 },
      { id: "business", label: "Business", count: 892 },
      { id: "computer-science", label: "Computer Science", count: 2104 },
      { id: "health", label: "Health", count: 415 },
      { id: "arts", label: "Arts & Humanities", count: 678 },
      { id: "personal-dev", label: "Personal Development", count: 533 },
    ],
  },
  {
    id: "duration",
    label: "Duration",
    options: [
      { id: "lt2", label: "Under 2 hours", count: 412 },
      { id: "2-10", label: "2–10 hours", count: 1566 },
      { id: "10-20", label: "10–20 hours", count: 890 },
      { id: "20p", label: "20+ hours", count: 723 },
    ],
  },
  {
    id: "learning-product",
    label: "Learning Product",
    options: [
      { id: "courses", label: "Courses", count: 4200 },
      { id: "guided", label: "Guided Projects", count: 380 },
      { id: "professional", label: "Professional Certificates", count: 290 },
      { id: "specs", label: "Specializations", count: 610 },
    ],
  },
  {
    id: "level",
    label: "Level",
    options: [
      { id: "beginner", label: "Beginner", count: 3102 },
      { id: "intermediate", label: "Intermediate", count: 1840 },
      { id: "advanced", label: "Advanced", count: 920 },
    ],
  },
  {
    id: "tools",
    label: "Tools",
    options: [
      { id: "chatgpt", label: "ChatGPT", count: 219 },
      { id: "claude", label: "Claude", count: 2183 },
      { id: "gemini", label: "Gemini", count: 548 },
      { id: "perplexity", label: "Perplexity AI", count: 212 },
      { id: "copilot", label: "Microsoft Copilot", count: 176 },
      { id: "midjourney", label: "Midjourney", count: 94 },
    ],
  },
];

export function getFilterPillLabel(def: SerpFilterDef, selectedIds: string[]): string {
  if (selectedIds.length === 0) return def.label;
  if (selectedIds.length > 3) {
    return `${def.label.toLowerCase()} (${selectedIds.length})`;
  }
  const labels = selectedIds
    .map((id) => def.options.find((o) => o.id === id)?.label)
    .filter(Boolean) as string[];
  return labels.join(", ");
}

export function serpSelectionSame(committed: string[], pending: Set<string>): boolean {
  if (committed.length !== pending.size) return false;
  return committed.every((id) => pending.has(id));
}
