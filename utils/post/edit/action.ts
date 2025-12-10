// utils/post/edit/action.ts
"use server";

import * as z from "zod";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "@/lib/s3";
import { generatePostUrl, urlToContentKey } from "@/utils/helpers/generatePostUrl";
import { db } from "@/lib/dynamoClient";
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { fullPostSchema } from "@/utils/zod/schema";

export interface EditPostState {
  successMsg?: string;
  errorMsg?: string;
}

export async function editPost(
  state: EditPostState,
  formData: FormData
): Promise<EditPostState> {
  const raw = Object.fromEntries(formData.entries());

  try {
    const {classLevel, subject, chapterNo, topic, content, title} = fullPostSchema.parse(raw);
    const {slug} = generatePostUrl({classLevel, subject, chapterNo, topic})
    if (content) {
      const command = new PutObjectCommand({
        Bucket: process.env.NEXT_PUBLIC_BUCKET_NAME!,
        Key: urlToContentKey(slug),
        Body: content,
        ContentType: "text/markdown",
      });

      try {
        await s3Client.send(command);
      } catch (error) {
        throw new Error("Failed to upload content to S3");
      }
    }

    await db.send(new UpdateCommand({
      TableName: process.env.AWS_POST_TABLE!,
      Key: { slug },
      UpdateExpression: "set title = :title, updatedAt = :updatedAt",
      ExpressionAttributeValues: { ":title": title, ":updatedAt": new Date().toISOString() },
    }));

    return { successMsg: "Post updated successfully." };
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Edit Post Zod Error:", error);
      return { errorMsg: "Invalid form data." };
    }
    return { errorMsg: "Failed to update post." };
  }
}
