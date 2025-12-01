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

export interface SavedPostResult {
  successMsg?: string;
  errUrlMsg?: string;
  statusText: "ok" | "fail" | "not_submitted";
  fieldErrors?: Record<string, string>; // field-level errors
  values?: Record<string, string | number>; // prefilled values
  draftPost?: Pick<
    Tables<"posts">,
    "url" | "title" | "class" | "subject" | "authorId" | "status" | "thumbnail"
  >;
  requiresConfirmation?: boolean;
}

export async function saveToDB(
  rawPost: Pick<
    Tables<"posts">,
    "url" | "title" | "desc" | "class" | "subject" | "chapter_no" | "reading_time" | "status" | "thumbnail"
  > & { content?: string },
  confirmed: boolean = false
): Promise<SavedPostResult> {
  try {
    const { url, title, thumbnail, status, desc, class: classValue, subject, chapter_no, reading_time, content } =
      fullPostSchema.parse(rawPost);

    // Only check URL availability for published posts, not drafts
    let isAvailable = true;
    let errMsg = "";
    let draftPost = null;

    if (status === "published" && !confirmed) {
      const result = await checkUrlAvailability(url);
      isAvailable = result.isAvailable;
      errMsg = result.errMsg || "";
      draftPost = result.draftPost || null;

      // If a draft post exists, we need confirmation before proceeding
      if (draftPost) {
        return {
          statusText: "fail" as const,
          requiresConfirmation: true,
          draftPost: {
            url: draftPost.url,
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

    if (isAvailable) {
      const supabase = await createClient();
      const authorId = (await getFreshUser())?.email?.split("@")[0] ||
        "anonymous";
      
      // Upload content to S3 as MDX file
      let contentKey = null;
      if (content && (status === "published" || status === "draft")) {
        const key = `md/${url}.mdx`;
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
        .insert([{ 
          url, 
          title, 
          thumbnail, 
          desc, 
          authorId, 
          class: classValue, 
          subject, 
          chapter_no, 
          reading_time, 
          status,
          content_key: contentKey // Store the S3 key in the database
        }])
        .select("id")
        .single();

      if (postError) throw postError;

      const successMsg =
        status === "published"
          ? "Post published successfully"
          : "Draft saved successfully";

      return { statusText: "ok" as const, successMsg };
    } else return { statusText: "fail" as const, errUrlMsg: errMsg };
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