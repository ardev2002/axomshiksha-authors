"use server";

import { s3Client } from "@/lib/s3";
import { generatePostUrl } from "@/utils/helpers/generatePostUrl";
import { createClient } from "@/utils/supabase/server";
import { Tables } from "@/utils/supabase/types";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { revalidatePath } from "next/cache";

export async function deletePost(formData: FormData) {
  const subject =
    (formData.get("subject") as NonNullable<Tables<"posts">["subject"]>) ||
    null;
  const classNo =
    (formData.get("classNo") as NonNullable<Tables<"posts">["class"]>) || null;
  const chapterNo =
    (formData.get("chapterNo") as unknown as NonNullable<
      Tables<"posts">["chapter_no"]
    >) || null;
  const topic = formData.get("topic") as string;
  const page = formData.get("page") as string;

  const { urlOptions, generatedUrl } = generatePostUrl(subject, classNo, chapterNo, topic);
  try {
    const supabase = await createClient();
    let query = supabase.from("posts").delete();
    if (urlOptions.subject) query = query.eq("subject", urlOptions.subject);
    if (urlOptions.classNo) query = query.eq("class", urlOptions.classNo);
    if (urlOptions.chapterNo) query = query.eq("chapter_no", urlOptions.chapterNo);

    const { error } = await query.eq("topic", urlOptions.topic);

    if(!error){
        const command = new DeleteObjectCommand({
            Bucket: process.env.NEXT_PUBLIC_BUCKET_NAME!,
            Key: generatedUrl
        })

        await s3Client.send(command);
    }
  } catch (error) {}

  revalidatePath(`/dashboard/posts?page=${page}`);
}
