import * as z from "zod";
import { AUTHORS } from "../CONSTANT";
import { Database } from "@/utils/supabase/types";

export const fullPostSchema = z.object({
  url: z.string().trim().toLowerCase().regex(/^[a-z0-9-]+$/, "Invalid URL Slug"),
  status: z
    .enum([
      "draft",
      "published",
      "scheduled",
    ])
    .optional(),
  authorId: z
    .enum(AUTHORS.map((a) => a.id) as [string, ...string[]])
    .optional(),
  thumbnail: z.string().trim().startsWith("https://"),
  title: z
    .string()
    .trim()
    .min(3, "It must be atleast 3 characters long.")
    .max(150, "It must be less than 150 characters long"),
  desc: z
    .string()
    .min(10, "It must be atleast 10 characters long.")
    .max(300, "It must be less than 300 characters long"),
  class: z.enum(["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"] as const),
  subject: z.enum([
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
    "Others"
  ] as const),
  chapter_no: z.number().optional(),
  reading_time: z.number().optional(),
  content: z.string().optional(), // Add content field
});

export const blogUrlSchema = z
  .string()
  .regex(/^[a-z0-9-]+$/, "Invalid URL Slug")
  .trim()
  .toLowerCase();