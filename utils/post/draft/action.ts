// utils/post/draft/action.ts
"use server";

import { generatePostUrl } from "@/utils/helpers/generatePostUrl";
import { SavedPostResult, saveToDB } from "@/utils/helpers/saveToDB";
import { Database, Tables } from "@/utils/supabase/types";

export async function saveDraft(
  state: SavedPostResult,
  formData: FormData
): Promise<SavedPostResult> {
  const raw = Object.fromEntries(formData.entries());

  const subject = raw.subject as
    | Database["public"]["Enums"]["Subject"]
    | null;
  const classValue = raw.class as
    | Database["public"]["Enums"]["Class"]
    | null;
  const chapterNo = raw.chapter_no
    ? (parseInt(raw.chapter_no as string) as Tables<"posts">["chapter_no"])
    : null;
  const topic = raw.topic as string;

  const { generatedUrl, urlOptions } = generatePostUrl(
    subject,
    classValue,
    chapterNo,
    topic
  );

  const draft: Pick<
    Tables<"posts">,
    | "topic"
    | "title"
    | "desc"
    | "class"
    | "subject"
    | "chapter_no"
    | "reading_time"
    | "status"
    | "thumbnail"
    | "scheduled_at"
  > & { content: string } = {
    topic,
    title: raw.title as string,
    thumbnail: raw.thumbnail as string,
    desc: raw.desc as string,
    class: raw.class as Database["public"]["Enums"]["Class"],
    subject: raw.subject as Database["public"]["Enums"]["Subject"],
    chapter_no: chapterNo,
    reading_time: raw.reading_time
      ? parseInt(raw.reading_time as string)
      : null,
    content: raw.content as string,
    status: "draft" as Database["public"]["Enums"]["Status"],
    scheduled_at: null, // Draft posts don't have a scheduled time
  };

  return await saveToDB(draft, generatedUrl, urlOptions);
}