/**
 * Extracts likely course titles from Coursera search HTML (embedded JSON strings).
 * Used by the Vite dev middleware only.
 */
export function parseCourseraSearchHtml(html: string): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  const re = /"name":"((?:[^"\\]|\\.)*)"/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    const raw = m[1].replace(/\\"/g, '"').replace(/\\u002F/g, "/");
    if (!isLikelyCourseTitle(raw)) continue;
    if (seen.has(raw)) continue;
    seen.add(raw);
    out.push(raw);
    if (out.length >= 24) break;
  }
  return out;
}

function isLikelyCourseTitle(s: string): boolean {
  if (s.length < 10 || s.length > 140) return false;
  if (/^(isPartOf|product|subtitle|Seo_|Component|__typename|href|id$|label$)/i.test(s)) return false;
  if (/product/i.test(s) && /Level|Duration|Description|Type/i.test(s)) return false;
  if (!/^[A-Z0-9(]/.test(s)) return false;
  return true;
}
