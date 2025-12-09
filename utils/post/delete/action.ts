"use server";

import { db } from "@/lib/dynamoClient";
import { s3Client } from "@/lib/s3";
import { urlToContentKey } from "@/utils/helpers/generatePostUrl";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { revalidatePath } from "next/cache";

export interface DeletePostState {
  success: boolean;
}

export async function deletePost(state: DeletePostState, formData: FormData): Promise<DeletePostState> {
  const slug = formData.get("slug") as string;

  try {

    await db.send(new DeleteCommand({
      TableName: process.env.AWS_POST_TABLE!,
      Key: { slug }
    }))

    await s3Client.send(new DeleteObjectCommand({
      Bucket: process.env.NEXT_PUBLIC_BUCKET_NAME!,
      Key: `md/${urlToContentKey(slug)}.mdx`
    }));

    revalidatePath(`/dashboard/posts`);
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}
