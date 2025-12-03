import * as z from "zod";
import { AUTHORS } from "../CONSTANT";
import { Database } from "@/utils/supabase/types";

export const fullPostSchema = z.object({
  topic: z.string().trim(),
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
  class: z.enum(["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"] as const).nullable().optional(),
  subject: z.enum([
    "assamese",
    "english",
    "mathematics",
    "sscience",
    "science",
    "hindi",
    "advmaths",
    "sanskrit",
    "csa",
    "biology",
    "physics",
    "chemistry",
    "history",
    "geography",
    "logic&philosophy",
    "political-science",
    "statistics",
    "others",
  ] as const).nullable().optional(),
  chapter_no: z.number().nullable().optional(),
  reading_time: z.number().nullable().optional(),
  content: z.string().optional(),
  content_key: z.string().optional(),
});