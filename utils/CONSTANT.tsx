export const LEVELS = [
  { id: "lower_primary", name: "Primary School (1-5)" },
  { id: "upper_primary", name: "Upper Primary (6-8)" },
  { id: "high_school", name: "High School (9-10)" },
  { id: "secondary", name: "Higher Secondary (11-12)" },
  { id: "ug", name: "Undergraduate" },
  { id: "pg", name: "Postgraduate" },
  { id: "phd", name: "Doctorate" },
  { id: "competitive", name: "Competitive Exams" },
] as const;

export const SUBJECTS_BY_LEVEL = {
  lower_primary: [
    { id: "english", name: "English" },
    { id: "assamese", name: "Assamese" },
    { id: "mathematics", name: "Mathematics" },
    { id: "evs", name: "Environmental Studies" },
    { id: "general-science", name: "General Science" },
    { id: "social-science", name: "Social Science" },
  ],

  upper_primary: [
    { id: "english", name: "English" },
    { id: "assamese", name: "Assamese" },
    { id: "mathematics", name: "Mathematics" },
    { id: "science", name: "Science" },
    { id: "social-science", name: "Social Science" },
    { id: "hindi", name: "Hindi" },
  ],

  high_school: [
    { id: "english", name: "English" },
    { id: "assamese", name: "Assamese" },
    { id: "mathematics", name: "Mathematics" },
    { id: "science", name: "Science" },
    { id: "social-science", name: "Social Science" },
    { id: "hindi", name: "Hindi(E)" },
    { id: "computer", name: "Computer Science(E)" },
    { id: "advanced-mathematics", name: "Advanced Mathematics(E)" },
    { id: "sanskrit", name: "Sanskrit(E)" },
    { id: "arabic", name: "Arabic(E)" },
    { id: "music", name: "Music(E)" },
    { id: "fine-arts", name: "Fine Arts(E)" },
  ],

  higher_secondary: [
    { id: "physics", name: "Physics" },
    { id: "chemistry", name: "Chemistry" },
    { id: "biology", name: "Biology" },
    { id: "mathematics", name: "Mathematics" },
    { id: "english", name: "English" },
    { id: "sociology", name: "Sociology" },
    { id: "economics", name: "Economics" },
    { id: "political-science", name: "Political Science" },
    { id: "history", name: "History" },
    { id: "geography", name: "Geography" },
    { id: "logic-philosophy", name: "Logic & Philosophy" },
    { id: "csa", name: "Computer Science & Application" },
  ],

  ug: [
    { id: "bsc-physics", name: "B.Sc Physics" },
    { id: "bsc-chemistry", name: "B.Sc Chemistry" },
    { id: "bsc-mathematics", name: "B.Sc Mathematics" },
    { id: "ba-english", name: "B.A English" },
    { id: "ba-assamese", name: "B.A Assamese" },
    { id: "bcom-accountancy", name: "B.Com Accountancy" },
  ],

  pg: [
    { id: "msc-physics", name: "M.Sc Physics" },
    { id: "msc-chemistry", name: "M.Sc Chemistry" },
    { id: "ma-english", name: "M.A English" },
    { id: "ma-assamese", name: "M.A Assamese" },
  ],

  phd: [
    { id: "phd-physics", name: "PhD in Physics" },
    { id: "phd-literature", name: "PhD in Literature" },
  ],

  competitive: [
    { id: "upsc-gs", name: "UPSC General Studies" },
    { id: "apsc-gs", name: "APSC General Studies" },
    { id: "neet-biology", name: "NEET Biology" },
    { id: "jee-mathematics", name: "JEE Mathematics" },
  ],
} as const;

export const AUTHORS = [
  { id: "dekalasit", name: "Ankur Rajbongshi" },
  { id: "manabendra847", name: "Manabendra Nath" },
] as const;

export const STATUSES = ["published", "draft", "scheduled"] as const;
export const PAGE_SIZE_TOP = 5;
export const PAGE_SIZE_REPLIES = 3;