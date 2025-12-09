import * as z from "zod";
import { AUTHORS } from "../CONSTANT";

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
  description: z
    .string()
    .min(10, "It must be atleast 10 characters long.")
    .max(300, "It must be less than 300 characters long"),
  classLevel: z.string().optional(),
  subject: z.string().optional(),
  chapterNo: z.number().optional(),
  readingTime: z.number().optional(),
  content: z.string().optional(),
  contentKey: z.string().optional(),
  scheduled_at: z.string().optional(), // Changed from scheduledAt to match frontend
});