"use server";

import { Database, Tables } from "@/utils/supabase/types";
import { SavedPostResult, saveToDB } from "@/utils/helpers/saveToDB";


export async function publishPost(
  state: SavedPostResult,
  formData: FormData
): Promise<SavedPostResult> {
  const raw = Object.fromEntries(formData);

  const publishablePost: Pick<Tables<"posts">, "url" | "title" | "desc" | "class" | "subject" | "chapter_no" | "reading_time" | "status" | "thumbnail"> & { content: string } = {
    url: raw.url as string,
    title: raw.title as string,
    thumbnail: raw.thumbnail as string,
    desc: raw.desc as string,
    class: raw.class as Database["public"]["Enums"]["Class"],
    subject: raw.subject as Database["public"]["Enums"]["Subject"],
    chapter_no: raw.chapter_no ? parseInt(raw.chapter_no as string) : null,
    reading_time: raw.reading_time ? parseInt(raw.reading_time as string) : null,
    content: raw.content as string,
    status: "published"
  }
  
  console.log("Publishable Post:", publishablePost);
  
  const confirmed = raw.confirmed === "true";

  return await saveToDB(publishablePost, confirmed);
}