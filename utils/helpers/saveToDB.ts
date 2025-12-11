import "server-only";
import { fullPostSchema } from "@/utils/zod/schema";
import { checkUrlAvailability } from "./checkUrl";
import { ZodError } from "zod";
import { getFreshUser } from "./getFreshUser";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "@/lib/s3";
import { urlToContentKey } from "./generatePostUrl";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { db } from "@/lib/dynamoClient";
import { revalidateTag } from "next/cache";

export interface SavedPostResult {
  successMsg?: string;
  errTopicMsg?: string;
  statusText: "ok" | "fail" | "not_submitted";
  fieldErrors?: Record<string, string>;
  values?: Record<string, string | number>;
  draftPost?: Record<string, any> | null;
  requiresConfirmation?: boolean;
}

export async function saveToDB(
  rawPost: Record<string, any>,
  slug: string,
  confirmed: boolean = false,
): Promise<SavedPostResult> {
  try {
    const {
      title,
      status,
      content,
    } = fullPostSchema.parse(rawPost);

    let isAvailable = true;
    let errMsg = "";
    let draftPost: Record<string, any> | undefined | null = null;

    if (status === "published" && !confirmed) {
      const result = await checkUrlAvailability(slug);

      isAvailable = result.isAvailable;
      errMsg = result.errMsg || "";
      draftPost = result.draftPost || null;

      if (draftPost) {
        return {
          statusText: "fail" as const,
          requiresConfirmation: true,
          draftPost
        };
      }
    }

    if (!isAvailable) {
      return { statusText: "fail" as const, errTopicMsg: errMsg };
    }

    let contentKey: string | null = null;

    if (content && (status === "published" || status === "draft" || status === "scheduled")) {
      const command = new PutObjectCommand({
        Bucket: process.env.NEXT_PUBLIC_BUCKET_NAME!,
        Key: urlToContentKey(slug),
        Body: content,
        ContentType: "text/markdown",
      });

      try {
        await s3Client.send(command);
        contentKey = urlToContentKey(slug);
      } catch (error) {
        throw new Error("Failed to upload content to S3");
      }
    }

    const authorId = (await getFreshUser())?.email?.split("@")[0];
    const currentTimestamp = new Date().toISOString();

    const item: Record<string, any> = {
      slug,
      title,
      contentKey,
      status,
      authorId,
      thumbnailKey: (rawPost.thumbnail as string).split(`https://${process.env.NEXT_PUBLIC_BUCKET_NAME!}.s3.ap-south-1.amazonaws.com/`)[1],
      entryTime: currentTimestamp,
    };

    if (status === "published") {
      item.publishTime = currentTimestamp;
    }

    if (status === "scheduled") {
      item.publishTime = rawPost.scheduledAt;
    }

    await db.send(new PutCommand({
      TableName: process.env.AWS_POST_TABLE!,
      Item: item
    }))

    if (status === "scheduled") {
      await fetch("https://zzfcus8v5k.execute-api.ap-south-1.amazonaws.com/prod/schedule-post", {
        method: "POST",
        headers: {
          "x-api-key": process.env.API_KEY!,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          slug,
          at: rawPost.scheduledAt,
        }),
      })
    }

    const successMsg =
      status === "published"
        ? "Post published successfully"
        : status === "scheduled"
          ? "Post scheduled successfully"
          : "Draft saved successfully";

    await fetch("https://www.axomshiksha.com/api/revalidate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret: process.env.REVALIDATE_SECRET! }),
    })

    revalidateTag('author-post-stats', { expire: 3600 })
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

    const fieldErrors: Record<string, string> = {};
    fieldErrors["general"] = "Please try again";
    return {
      statusText: "fail" as const,
      fieldErrors,
    };
  }
}