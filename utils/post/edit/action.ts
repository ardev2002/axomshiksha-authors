"use server";

import * as z from "zod";
import { createClient } from "@/utils/supabase/server";
import { fullPostSchema } from "@/utils/zod/schema";
import { Database } from "@/utils/supabase/types";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "@/lib/s3";

export interface EditPostState {
  successMsg?: string;
  errorMsg?: string;
}

export async function editPost(
  state: EditPostState,
  formData: FormData,
): Promise<EditPostState> {
  const raw = Object.fromEntries(formData.entries());
  const fullPost = {
    url: raw.url as string,
    title: raw.title as string,
    desc: raw.desc as string,
    thumbnail: raw.thumbnail as string,
    authorId: raw.authorId as string,
    class: raw.class as Database["public"]["Enums"]["Class"],
    subject: raw.subject as Database["public"]["Enums"]["Subject"],
    chapter_no: raw.chapter_no ? parseInt(raw.chapter_no as string) : null,
    reading_time: raw.reading_time ? parseInt(raw.reading_time as string) : null,
    content: raw.content as string,
    status: raw.status as Database["public"]["Enums"]["Status"] || "draft", // Default to draft if not provided
  };

  try {
    const { url, title, desc, thumbnail, authorId, class: classValue, subject, chapter_no, reading_time, content, status } =
      fullPostSchema.parse(fullPost);

    const supabase = await createClient();

    let contentKey = null;
    if (content) {
      const key = `md/${url}.mdx`;
      const command = new PutObjectCommand({
        Bucket: "axomshiksha",
        Key: key,
        Body: content,
        ContentType: "text/markdown",
      });
      
      try {
        await s3Client.send(command);
        contentKey = key;
      } catch (error) {
        console.error("Error uploading content to S3:", error);
        throw new Error("Failed to upload content to S3");
      }
    }

    const { data: postData, error: postError } = await supabase
      .from("posts")
      .update({ 
        title, 
        desc, 
        authorId, 
        class: classValue, 
        subject, 
        chapter_no, 
        reading_time, 
        thumbnail,
        status,
        content_key: contentKey
      })
      .eq("url", url)
      .select("id")
      .single();

    if (postError || !postData) throw new Error("Failed to update post.");

    return { successMsg: "Post updated successfully." };
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Edit Post Error:", error);
      return { errorMsg: "Invalid form data." };
    }
    return { errorMsg: "Failed to update post." };
  }
}