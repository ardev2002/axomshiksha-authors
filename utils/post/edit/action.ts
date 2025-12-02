// utils/post/edit/action.ts
"use server";

import * as z from "zod";
import { createClient } from "@/utils/supabase/server";
import { Database } from "@/utils/supabase/types";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "@/lib/s3";
import { urlToContentKey } from "@/utils/helpers/generatePostUrl";

export interface EditPostState {
  successMsg?: string;
  errorMsg?: string;
}

const editPostSchema = z.object({
  url: z.string().min(1),
  topic: z.string().min(1),
  title: z.string().min(1),
  desc: z.string().optional().default(""),
  thumbnail: z.string().optional().default(""),
  authorId: z.string().optional().default(""),
  class: z.string().optional().nullable(),
  subject: z.string().optional().nullable(),
  chapter_no: z
    .string()
    .optional()
    .nullable()
    .transform((v) => (v ? parseInt(v, 10) : null)),
  reading_time: z
    .string()
    .optional()
    .nullable()
    .transform((v) => (v ? parseInt(v, 10) : null)),
  content: z.string().optional().default(""),
  status: z
    .string()
    .optional()
    .default("draft") as unknown as z.ZodType<Database["public"]["Enums"]["Status"]>,
});

export async function editPost(
  state: EditPostState,
  formData: FormData
): Promise<EditPostState> {
  const raw = Object.fromEntries(formData.entries());

  try {
    const parsed = editPostSchema.parse(raw);

    const supabase = await createClient();

    // Upload new MDX content if provided
    if (parsed.content) {
      const key = urlToContentKey(parsed.url);
      const command = new PutObjectCommand({
        Bucket: process.env.NEXT_PUBLIC_BUCKET_NAME!,
        Key: key,
        Body: parsed.content,
        ContentType: "text/markdown",
      });

      try {
        await s3Client.send(command);
      } catch (error) {
        console.error("Error uploading content to S3:", error);
        throw new Error("Failed to upload content to S3");
      }
    }

    // Lock structural identity: url, topic, subject, class, chapter_no
    // We only update mutable fields: title, desc, thumbnail, reading_time, status
    const { title, desc, thumbnail, reading_time, status } = parsed;

    const { error: postError } = await supabase
      .from("posts")
      .update({
        title,
        desc,
        thumbnail,
        reading_time,
        status,
      })
      .eq("url", parsed.url);

    if (postError) {
      console.error("Supabase update error:", postError);
      throw new Error("Failed to update post.");
    }

    return { successMsg: "Post updated successfully." };
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Edit Post Zod Error:", error);
      return { errorMsg: "Invalid form data." };
    }
    console.error("Edit Post Error:", error);
    return { errorMsg: "Failed to update post." };
  }
}
