import { useEffect, useMemo, useState } from "react";
import { mergeLiveTitles } from "@/lib/courseraTypingAutocomplete";
import type { TypingAutocompleteData } from "@/lib/courseraTypingAutocomplete";

/**
 * Loads Coursera search–aligned suggestions: dev server hits `/api/coursera-search`
 * (live HTML parse); production / failed fetch uses the curated catalog only.
 */
export function useCourseraTypingAutocomplete(query: string): {
  data: TypingAutocompleteData | null;
  loading: boolean;
} {
  const [liveTitles, setLiveTitles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setLiveTitles([]);
      setLoading(false);
      return;
    }
    setLiveTitles([]);
    const handle = window.setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/coursera-search?q=${encodeURIComponent(q)}`);
        if (!res.ok) {
          setLiveTitles([]);
          return;
        }
        const json: unknown = await res.json();
        const courses = json && typeof json === "object" && "courses" in json ? (json as { courses: unknown }).courses : [];
        const titles = Array.isArray(courses)
          ? courses.map((c) => (typeof c === "string" ? c : c && typeof c === "object" && "title" in c ? String((c as { title: unknown }).title) : "")).filter(Boolean)
          : [];
        setLiveTitles(titles as string[]);
      } catch {
        setLiveTitles([]);
      } finally {
        setLoading(false);
      }
    }, 240);

    return () => clearTimeout(handle);
  }, [query]);

  const data = useMemo(() => {
    const q = query.trim();
    if (!q) return null;
    return mergeLiveTitles(q, liveTitles);
  }, [query, liveTitles]);

  return { data, loading };
}
