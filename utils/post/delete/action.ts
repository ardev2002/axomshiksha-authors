"use server";

import { db } from "@/lib/dynamoClient";
import { s3Client } from "@/lib/s3";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { revalidatePath } from "next/cache";

export interface DeletePostState {
  success: boolean;
}

export async function deletePost(state: DeletePostState, formData: FormData): Promise<DeletePostState> {
  const slug = formData.get("slug") as string;
  const contentKey = formData.get("contentKey") as string;
  const thumbnailKey = formData.get("thumbnailKey") as string;

  try {
    await db.send(new DeleteCommand({
      TableName: process.env.AWS_POST_TABLE!,
      Key: { slug }
    }))

    // delete .mdx file
    await s3Client.send(new DeleteObjectCommand({
      Bucket: process.env.NEXT_PUBLIC_BUCKET_NAME,
      Key: contentKey
    }));

    await s3Client.send(new DeleteObjectCommand({
      Bucket: process.env.NEXT_PUBLIC_BUCKET_NAME,
      Key: thumbnailKey
    }));
    
    revalidatePath(`/dashboard/posts`);
    return { success: true };
  } catch (error) {
    console.error("Error deleting post:", error);
    return { success: false };
  }
}
