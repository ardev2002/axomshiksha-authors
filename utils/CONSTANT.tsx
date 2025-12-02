// utils/constants.ts

import { Database } from "./supabase/types";

export const CLASSES = [
  { id: "1", name: "Class 1" },
  { id: "2", name: "Class 2" },
  { id: "3", name: "Class 3" },
  { id: "4", name: "Class 4" },
  { id: "5", name: "Class 5" },
  { id: "6", name: "Class 6" },
  { id: "7", name: "Class 7" },
  { id: "8", name: "Class 8" },
  { id: "9", name: "Class 9" },
  { id: "10", name: "Class 10" },
  { id: "11", name: "Class 11" },
  { id: "12", name: "Class 12" },
] as const;

export const SUBJECTS = {
  Assamese: "assamese",
  English: "english",
  Mathematics: "mathematics",
  "S. Science": "sscience",
  Science: "science",
  Hindi: "hindi",
  "Adv. Maths": "advmaths",
  Sanskrit: "sanskrit",
  "Computer Science & Application": "csa",
  Biology: "biology",
  Physics: "physics",
  Chemistry: "chemistry",
  History: "history",
  Geography: "geography",
  "Logic & Philosophy": "logic&philosophy",
  "Political Science": "political-science",
  Statistics: "statistics",
  Others: "others",
}
export const AUTHORS = [
  { id: "dekalasit", name: "Ankur Rajbongshi" },
  { id: "manabendra847", name: "Manabendra Nath" },
] as const;

export const STATUSES: Database["public"]["Enums"]["Status"][] = [
  "draft",
  "published",
  "scheduled",
];

export const PAGE_SIZE_TOP = 5;
export const PAGE_SIZE_REPLIES = 3;