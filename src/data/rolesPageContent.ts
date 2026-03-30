/** Static content for the Roles landing page (Figma 2019:101421). */

export type RoleCredential = {
  partner: "google" | "ibm" | "deeplearning";
  label: string;
};

/** Filenames in `src/assets/` (without extension) for role card hero art. */
export type RoleHeroImageId =
  | "data-analyst"
  | "data-scientist"
  | "project-manager"
  | "cyber-security-analyst"
  | "business-intelligence-analyst"
  | "digital-marketing-specialist"
  | "ui-ux-designer"
  | "machine-learning-engineer"
  | "social-media-strategist"
  | "computer-support-specialist";

export type RolesPageRole = {
  title: string;
  description: string;
  ifYouLike: string;
  medianSalary: string;
  jobsAvailable: string;
  credentials: RoleCredential[];
  moreCredentialsCount: number;
  /** Static import key in `ExploreRoleCard` — maps to `src/assets/{id}.png`. */
  heroImage: RoleHeroImageId;
};

export type FilterItem =
  | { type: "dropdown"; label: string }
  | { type: "divider" }
  | { type: "pill"; label: string; count?: number };

export const ROLES_PAGE_FILTERS: FilterItem[] = [
  { type: "dropdown", label: "Beginner" },
  { type: "divider" },
  { type: "pill", label: "All", count: 48 },
  { type: "pill", label: "Business", count: 10 },
  { type: "pill", label: "Sales & Marketing", count: 5 },
  { type: "dropdown", label: "Data Science & Analytics" },
];

export const ROLES_PAGE_ROLES: RolesPageRole[] = [
  {
    title: "Data Analyst",
    description: "Collect, organize, and transform data to make informed decisions",
    ifYouLike: " attention to detail, problem solving, working with numbers",
    medianSalary: "$90,500",
    jobsAvailable: "82,489",
    credentials: [
      { partner: "google", label: "Google Data Analyst" },
      { partner: "ibm", label: "IBM Data Analyst" },
    ],
    moreCredentialsCount: 3,
    heroImage: "data-analyst",
  },
  {
    title: "Data Scientist",
    description: "Build models and uncover insights from complex data",
    ifYouLike: " statistics, experimentation, telling stories with data",
    medianSalary: "$126,400",
    jobsAvailable: "59,092",
    credentials: [
      { partner: "ibm", label: "IBM Data Science" },
      { partner: "deeplearning", label: "DeepLearning.AI TensorFlow" },
    ],
    moreCredentialsCount: 4,
    heroImage: "data-scientist",
  },
  {
    title: "Project Manager",
    description: "Plan, execute, and deliver initiatives on time and on budget",
    ifYouLike: " organization, leadership, cross-functional collaboration",
    medianSalary: "$102,000",
    jobsAvailable: "121,500",
    credentials: [
      { partner: "google", label: "Google Project Management" },
      { partner: "ibm", label: "IBM IT Project Manager" },
    ],
    moreCredentialsCount: 2,
    heroImage: "project-manager",
  },
  {
    title: "Cyber Security Analyst",
    description: "Protect systems and data from threats and vulnerabilities",
    ifYouLike: " puzzles, risk assessment, continuous learning",
    medianSalary: "$112,000",
    jobsAvailable: "94,200",
    credentials: [
      { partner: "ibm", label: "IBM Cybersecurity Analyst" },
      { partner: "google", label: "Google IT Support" },
    ],
    moreCredentialsCount: 3,
    heroImage: "cyber-security-analyst",
  },
  {
    title: "Business Intelligence Analyst",
    description: "Turn data into dashboards and decisions for the business",
    ifYouLike: " visualization, SQL, stakeholder communication",
    medianSalary: "$99,200",
    jobsAvailable: "48,300",
    credentials: [
      { partner: "google", label: "Google Data Analytics" },
      { partner: "deeplearning", label: "DeepLearning.AI BI" },
    ],
    moreCredentialsCount: 2,
    heroImage: "business-intelligence-analyst",
  },
  {
    title: "Digital Marketing Specialist",
    description: "Grow audiences and revenue across digital channels",
    ifYouLike: " creativity, analytics, campaign optimization",
    medianSalary: "$76,500",
    jobsAvailable: "88,100",
    credentials: [
      { partner: "google", label: "Google Digital Marketing" },
      { partner: "ibm", label: "IBM Marketing Analytics" },
    ],
    moreCredentialsCount: 3,
    heroImage: "digital-marketing-specialist",
  },
  {
    title: "UI/UX Designer",
    description: "Craft intuitive interfaces and research-backed experiences",
    ifYouLike: " empathy, prototyping, design systems",
    medianSalary: "$98,800",
    jobsAvailable: "52,400",
    credentials: [
      { partner: "google", label: "Google UX Design" },
      { partner: "deeplearning", label: "CalArts Graphic Design" },
    ],
    moreCredentialsCount: 5,
    heroImage: "ui-ux-designer",
  },
  {
    title: "Machine Learning Engineer",
    description: "Ship ML systems that perform reliably in production",
    ifYouLike: " software engineering, modeling, MLOps",
    medianSalary: "$161,200",
    jobsAvailable: "37,800",
    credentials: [
      { partner: "deeplearning", label: "DeepLearning.AI ML Engineering" },
      { partner: "ibm", label: "IBM Machine Learning" },
    ],
    moreCredentialsCount: 4,
    heroImage: "machine-learning-engineer",
  },
  {
    title: "Social Media Specialist",
    description: "Build community and brand presence on social platforms",
    ifYouLike: " writing, trends, community management",
    medianSalary: "$58,400",
    jobsAvailable: "102,000",
    credentials: [
      { partner: "google", label: "Social Media Marketing" },
      { partner: "ibm", label: "Digital Marketing Analytics" },
    ],
    moreCredentialsCount: 2,
    heroImage: "social-media-strategist",
  },
  {
    title: "Computer Support Specialist",
    description: "Help users and organizations troubleshoot technology issues",
    ifYouLike: " helping people, hardware, IT fundamentals",
    medianSalary: "$59,200",
    jobsAvailable: "215,000",
    credentials: [
      { partner: "google", label: "Google IT Support" },
      { partner: "ibm", label: "IBM IT Support" },
    ],
    moreCredentialsCount: 3,
    heroImage: "computer-support-specialist",
  },
  {
    title: "Software Engineer",
    description: "Design, build, and maintain reliable software systems",
    ifYouLike: " coding, system design, shipping quality products",
    medianSalary: "$132,400",
    jobsAvailable: "189,000",
    credentials: [
      { partner: "google", label: "Google Software Engineering" },
      { partner: "ibm", label: "IBM Full Stack Developer" },
    ],
    moreCredentialsCount: 6,
    heroImage: "machine-learning-engineer",
  },
  {
    title: "UX Researcher",
    description: "Discover user needs through research and usability testing",
    ifYouLike: " interviews, synthesis, advocating for users",
    medianSalary: "$94,800",
    jobsAvailable: "41,200",
    credentials: [
      { partner: "google", label: "Google UX Research" },
      { partner: "deeplearning", label: "Michigan UX Research" },
    ],
    moreCredentialsCount: 2,
    heroImage: "ui-ux-designer",
  },
];
