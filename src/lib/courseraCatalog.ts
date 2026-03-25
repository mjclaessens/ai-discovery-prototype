import type { CourseHit } from "./courseraTypes";

/** Curated real Coursera offerings for offline / production fallback and enrichment. */
export const COURSERA_CATALOG: CourseHit[] = [
  { title: "Python for Everybody", partner: "University of Michigan", productType: "Specialization" },
  { title: "Python for Data Science, AI & Development", partner: "IBM", productType: "Course" },
  { title: "Machine Learning", partner: "Stanford University", productType: "Course" },
  { title: "Deep Learning", partner: "DeepLearning.AI", productType: "Specialization" },
  { title: "IBM Data Science", partner: "IBM", productType: "Professional Certificate" },
  { title: "Google Data Analytics", partner: "Google", productType: "Professional Certificate" },
  { title: "Google UX Design", partner: "Google", productType: "Professional Certificate" },
  { title: "Google Project Management", partner: "Google", productType: "Professional Certificate" },
  { title: "Google IT Support", partner: "Google", productType: "Professional Certificate" },
  { title: "Crash Course on Python", partner: "Google", productType: "Course" },
  { title: "Generative AI for Everyone", partner: "DeepLearning.AI", productType: "Course" },
  { title: "AI For Everyone", partner: "DeepLearning.AI", productType: "Course" },
  { title: "Mathematics for Machine Learning", partner: "Imperial College London", productType: "Specialization" },
  { title: "SQL for Data Science", partner: "University of California, Davis", productType: "Course" },
  { title: "Excel Skills for Business", partner: "Macquarie University", productType: "Specialization" },
  { title: "Financial Markets", partner: "Yale University", productType: "Course" },
  { title: "The Science of Well-Being", partner: "Yale University", productType: "Course" },
  { title: "Learning How to Learn", partner: "McMaster University", productType: "Course" },
  { title: "Introduction to Psychology", partner: "Yale University", productType: "Course" },
  { title: "Algorithms, Part I", partner: "Princeton University", productType: "Course" },
  { title: "Java Programming and Software Engineering Fundamentals", partner: "Duke University", productType: "Specialization" },
  { title: "HTML, CSS, and Javascript for Web Developers", partner: "Johns Hopkins University", productType: "Course" },
  { title: "Meta Front-End Developer", partner: "Meta", productType: "Professional Certificate" },
  { title: "Meta Back-End Developer", partner: "Meta", productType: "Professional Certificate" },
  { title: "IBM Full Stack Software Developer", partner: "IBM", productType: "Professional Certificate" },
  { title: "IBM Data Analyst", partner: "IBM", productType: "Professional Certificate" },
  { title: "IBM AI Engineering", partner: "IBM", productType: "Professional Certificate" },
  { title: "Microsoft Power BI Data Analyst", partner: "Microsoft", productType: "Professional Certificate" },
  { title: "Prompt Engineering for ChatGPT", partner: "Vanderbilt University", productType: "Course" },
  { title: "LangChain for LLM Application Development", partner: "DeepLearning.AI", productType: "Course" },
  { title: "Natural Language Processing", partner: "DeepLearning.AI", productType: "Specialization" },
  { title: "TensorFlow Developer", partner: "DeepLearning.AI", productType: "Professional Certificate" },
  { title: "AWS Cloud Solutions Architect", partner: "Amazon Web Services", productType: "Professional Certificate" },
  { title: "Cloud Computing", partner: "University of Illinois", productType: "MasterTrack Certificate" },
  { title: "Agile with Atlassian Jira", partner: "Atlassian", productType: "Course" },
  { title: "Foundations of User Experience (UX) Design", partner: "Google", productType: "Course" },
  { title: "R Programming", partner: "Johns Hopkins University", productType: "Course" },
  { title: "Statistics with R", partner: "Duke University", productType: "Specialization" },
  { title: "Business Analytics", partner: "University of Pennsylvania", productType: "Specialization" },
  { title: "Digital Marketing", partner: "University of Illinois", productType: "Course" },
  { title: "Social Media Marketing", partner: "Northwestern University", productType: "Specialization" },
  { title: "Supply Chain Management", partner: "Rutgers University", productType: "Specialization" },
  { title: "Leading People and Teams", partner: "University of Michigan", productType: "Specialization" },
  { title: "Introduction to Finance", partner: "University of Michigan", productType: "Specialization" },
  { title: "Wharton Business Analytics", partner: "University of Pennsylvania", productType: "Specialization" },
  { title: "Epidemiology", partner: "University of North Carolina", productType: "Specialization" },
  { title: "Medical Neuroscience", partner: "Duke University", productType: "Course" },
  { title: "Introduction to TensorFlow for Artificial Intelligence, Machine Learning, and Deep Learning", partner: "DeepLearning.AI", productType: "Course" },
  { title: "Convolutional Neural Networks", partner: "DeepLearning.AI", productType: "Course" },
  { title: "Sequences, Time Series and Prediction", partner: "DeepLearning.AI", productType: "Course" },
  { title: "Databases and SQL for Data Science with Python", partner: "IBM", productType: "Course" },
  { title: "Data Analysis with Python", partner: "IBM", productType: "Course" },
  { title: "Applied Data Science with Python", partner: "University of Michigan", productType: "Specialization" },
  { title: "Applied Plotting, Charting & Data Representation in Python", partner: "University of Michigan", productType: "Course" },
  { title: "Machine Learning with Python", partner: "IBM", productType: "Course" },
  { title: "Python 3 Programming", partner: "University of Michigan", productType: "Specialization" },
  { title: "Programming for Everybody (Getting Started with Python)", partner: "University of Michigan", productType: "Course" },
  { title: "JavaScript for Beginners", partner: "University of California, Davis", productType: "Course" },
  { title: "React Basics", partner: "Meta", productType: "Course" },
  { title: "Version Control", partner: "Meta", productType: "Course" },
  { title: "Programming with JavaScript", partner: "Meta", productType: "Course" },
  { title: "Introduction to Cybersecurity Tools & Cyber Attacks", partner: "IBM", productType: "Course" },
  { title: "Cybersecurity Analyst", partner: "IBM", productType: "Professional Certificate" },
];

function tokenize(q: string): string[] {
  return q
    .toLowerCase()
    .split(/[^a-z0-9+#]+/)
    .filter((t) => t.length > 1);
}

/** Rank catalog + optional live titles from Coursera search HTML by relevance to the query. */
export function rankCoursesByQuery(query: string, extraTitles: string[]): CourseHit[] {
  const q = query.trim();
  if (!q) return [...COURSERA_CATALOG];

  const tokens = tokenize(q);
  const liveSet = new Set(extraTitles.filter(Boolean));

  const pool: CourseHit[] = [];
  const seen = new Set<string>();

  for (const t of extraTitles) {
    if (!t || seen.has(t)) continue;
    const fromCat = COURSERA_CATALOG.find((c) => c.title === t);
    pool.push(fromCat ?? { title: t, partner: "Coursera", productType: "Course" });
    seen.add(t);
  }
  for (const c of COURSERA_CATALOG) {
    if (!seen.has(c.title)) pool.push(c);
  }

  const score = (c: CourseHit): number => {
    const hay = `${c.title} ${c.partner}`.toLowerCase();
    let s = 0;
    if (liveSet.has(c.title)) s += 12;
    for (const tok of tokens) {
      if (hay.includes(tok)) s += 3;
    }
    if (hay.startsWith(q.toLowerCase().slice(0, 12))) s += 2;
    return s;
  };

  return pool.sort((a, b) => score(b) - score(a) || a.title.localeCompare(b.title));
}
