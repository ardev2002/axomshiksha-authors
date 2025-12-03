import "server-only";
import { Tables } from "@/utils/supabase/types";
import { fullPostSchema } from "@/utils/zod/schema";
import { checkUrlAvailability } from "./checkUrl";
import { createClient } from "@/utils/supabase/server";
import { ZodError } from "zod";
import { PostgrestError } from "@supabase/supabase-js";
import { getFreshUser } from "./getFreshUser";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "@/lib/s3";
import { URLOptions } from "../types";
import { urlToContentKey } from "./generatePostUrl";

export interface SavedPostResult {
  successMsg?: string;
  errTopicMsg?: string;
  statusText: "ok" | "fail" | "not_submitted";
  fieldErrors?: Record<string, string>;
  values?: Record<string, string | number>;
  draftPost?: Partial<Tables<"posts">> | null;
  requiresConfirmation?: boolean;
}

export async function saveToDB(
  rawPost: Pick<
    Tables<"posts">,
    | "topic"
    | "title"
    | "desc"
    | "class"
    | "subject"
    | "chapter_no"
    | "reading_time"
    | "status"
    | "thumbnail"
  > & { content?: string },
  generatedUrl?: string,
  urlOptions?: URLOptions,
  confirmed: boolean = false,
): Promise<SavedPostResult> {
  try {
    const {
      topic,
      title,
      thumbnail,
      status,
      desc,
      class: classValue,
      subject,
      chapter_no,
      reading_time,
      content,
    } = fullPostSchema.parse(rawPost);

    let isAvailable = true;
    let errMsg = "";
    let draftPost: Partial<Tables<"posts">> | null = null;

    if (status === "published" && !confirmed) {
      if (!urlOptions) {
        return {
          statusText: "fail",
          errTopicMsg: "Invalid URL options. Please try again.",
        };
      }

      const result = await checkUrlAvailability(urlOptions);
      isAvailable = result.isAvailable;
      errMsg = result.errMsg || "";
      draftPost = result.draftPost || null;

      if (draftPost) {
        return {
          statusText: "fail" as const,
          requiresConfirmation: true,
          draftPost: {
            topic: draftPost.topic,
            title: draftPost.title,
            class: draftPost.class,
            subject: draftPost.subject,
            authorId: draftPost.authorId,
            status: draftPost.status,
            thumbnail: draftPost.thumbnail,
          },
        };
      }
    }

    if (!isAvailable) {
      return { statusText: "fail" as const, errTopicMsg: errMsg };
    }

    const supabase = await createClient();
    const authorId =
      (await getFreshUser())?.email?.split("@")[0] || "anonymous";

    let contentKey: string | null = null;

    if (content && (status === "published" || status === "draft")) {
      const base = generatedUrl && generatedUrl.trim().length > 0
        ? generatedUrl
        : topic;

      const key = urlToContentKey(base);

      const command = new PutObjectCommand({
        Bucket: process.env.NEXT_PUBLIC_BUCKET_NAME,
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

    const { data: post, error: postError } = await supabase
      .from("posts")
      .insert([
        {
          topic,
          title,
          thumbnail,
          desc,
          authorId,
          class: classValue,
          subject,
          chapter_no,
          reading_time,
          status,
          url: generatedUrl,
          content_key: contentKey,
        },
      ])
      .select("id")
      .single();

    if (postError) throw postError;

    const successMsg =
      status === "published"
        ? "Post published successfully"
        : "Draft saved successfully";

    await fetch("https://www.axomshiksha.com/api/revalidate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret: process.env.REVALIDATE_SECRET!, tag: "posts" }),
    })
    
    return { statusText: "ok" as const, successMsg };
  } catch (error) {
    if (error instanceof ZodError) {
      const fieldErrors: Record<string, string> = {};
      error.issues.forEach((issue) => {
        const field = issue.path[0]?.toString() ?? "general";
        fieldErrors[field] = issue.message;
      });
      return {
        statusText: "fail" as const,
        fieldErrors,
      };
    }
    if (error instanceof PostgrestError) {
      const fieldErrors: Record<string, string> = {};
      fieldErrors["supabase"] = "DB error occurred";
      return {
        statusText: "fail" as const,
        fieldErrors,
      };
    }

    const fieldErrors: Record<string, string> = {};
    fieldErrors["general"] = "Please try again";
    return {
      statusText: "fail" as const,
      fieldErrors,
    };
  }
}
