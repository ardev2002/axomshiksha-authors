"use server";

import { SavedPostResult, saveToDB } from "@/utils/helpers/saveToDB";
import { Database } from "@/utils/supabase/types";

export async function saveDraft(
  state: SavedPostResult,
  formData: FormData,
): Promise<SavedPostResult> {
  const raw = Object.fromEntries(formData.entries());

  const draft = {
    url: raw.url as string,
    title: raw.title as string,
    thumbnail: raw.thumbnail as string,
    desc: raw.desc as string,
    class: raw.class as Database["public"]["Enums"]["Class"],
    subject: raw.subject as Database["public"]["Enums"]["Subject"],
    chapter_no: raw.chapter_no ? parseInt(raw.chapter_no as string) : null,
    reading_time: raw.reading_time ? parseInt(raw.reading_time as string) : null,
    content: raw.content as string,
    status: "draft" as Database["public"]["Enums"]["Status"],
  };

  return await saveToDB(draft);
}