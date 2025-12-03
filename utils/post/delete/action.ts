"use server";

import { s3Client } from "@/lib/s3";
import { generatePostUrl, urlToContentKey } from "@/utils/helpers/generatePostUrl";
import { createClient } from "@/utils/supabase/server";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { revalidatePath } from "next/cache";
import { Database, Tables } from "@/utils/supabase/types";

export interface DeletePostState{
  success: boolean;
}

export async function deletePost(state: DeletePostState, formData: FormData):Promise<DeletePostState> {
  const subject =
    (formData.get("subject") as Database["public"]["Enums"]["Subject"]) ||
    null;
  const classNo =
    (formData.get("classNo") as Database["public"]["Enums"]["Class"]) || null;
  const chapterNo =
    (formData.get("chapterNo") as string) || null;

  const topic = formData.get("topic") as string;
  const page = formData.get("page") as string;

  const { urlOptions, generatedUrl } = generatePostUrl(
    subject,
    classNo,
    chapterNo ? parseInt(chapterNo) : null,
    topic
  );

  try {
    const supabase = await createClient();
    let query = supabase.from("posts").delete();
    if (subject) query = query.eq("subject", subject);
    if (classNo) query = query.eq("class", classNo);
    if (chapterNo) query = query.eq("chapter_no", parseInt(chapterNo));

    const { error } = await query.eq("topic", urlOptions.topicSlug);

    if(!error){
        // Delete associated content from S3
        const contentKey = urlToContentKey(generatedUrl);
        const command = new DeleteObjectCommand({
            Bucket: process.env.NEXT_PUBLIC_BUCKET_NAME!,
            Key: contentKey
        });

        try {
          await s3Client.send(command);
          revalidatePath(`/dashboard/posts?page=${page}`);
          return { success: true }
        } catch (s3Error) {
          return { success: false }
        }
    }
    return { success: false };
  } catch (error) {
    return { success: false };
  }
}
