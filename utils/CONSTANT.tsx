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

export const SUBJECTS: Database["public"]["Enums"]["Subject"][] = [
  "Assamese",
  "English",
  "Mathematics",
  "S. Science",
  "Science",
  "Hindi",
  "Adv. Maths",
  "Sanskrit",
  "Computer Science & Application",
  "Biology",
  "Physics",
  "Chemistry",
  "History",
  "Geography",
  "Logic & Philosophy",
  "Political Science",
  "Statistics",
  "Others",
] as const;

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