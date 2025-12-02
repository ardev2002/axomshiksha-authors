"use server";

import { s3Client } from "@/lib/s3";
import { generatePostUrl, urlToContentKey } from "@/utils/helpers/generatePostUrl";
import { createClient } from "@/utils/supabase/server";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { revalidatePath } from "next/cache";
import { Database, Tables } from "@/utils/supabase/types";

export async function deletePost(formData: FormData) {
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
        } catch (s3Error) {
          console.error("Error deleting content from S3:", s3Error);
          // Don't throw error as the database deletion was successful
        }
    }
  } catch (error) {
    console.error("Error deleting post:", error);
  }

  revalidatePath(`/dashboard/posts?page=${page}`);
}
