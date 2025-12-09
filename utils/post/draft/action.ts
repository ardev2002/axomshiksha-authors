"use server";

import { generatePostUrl } from "@/utils/helpers/generatePostUrl";
import { SavedPostResult, saveToDB } from "@/utils/helpers/saveToDB";

export async function saveDraft(
  state: SavedPostResult,
  formData: FormData
): Promise<SavedPostResult> {
  const raw = Object.fromEntries(formData.entries());

  const subject = raw.subject as string
  const classLevel = raw.classLevel as string
  const chapterNo = raw.chapterNo
    ? (parseInt(raw.chapterNo as string))
    : undefined;
  const topic = raw.topic as string;

  const { slug } = generatePostUrl({
    classLevel,
    subject,
    chapterNo,
    topic
  });

  // Helper function to convert empty strings to undefined
  const parseOptionalNumber = (value: string | null | undefined): number | undefined => {
    if (!value || value === "") return undefined;
    const num = parseInt(value);
    return isNaN(num) ? undefined : num;
  };

  const draft = {
    topic,
    title: raw.title as string,
    thumbnail: raw.thumbnail as string,
    description: raw.description as string,
    classLevel: raw.classLevel as string,
    subject: raw.subject as string,
    chapterNo: chapterNo,
    readingTime: parseOptionalNumber(raw.readingTime as string), // Handle empty strings
    content: raw.content as string,
    status: "draft" as const,
    scheduled_at: undefined, // Will be handled by Zod schema
  };

  return await saveToDB(draft, slug);
}