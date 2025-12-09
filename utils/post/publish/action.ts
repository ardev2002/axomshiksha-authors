// utils/post/publish/action.ts
"use server";

import { SavedPostResult, saveToDB } from "@/utils/helpers/saveToDB";
import { generatePostUrl } from "@/utils/helpers/generatePostUrl";

export async function publishPost(
  state: SavedPostResult,
  formData: FormData
): Promise<SavedPostResult> {
  const raw = Object.fromEntries(formData);

  const subject = raw.subject as string
  const classLevel = raw.classLevel as string
  const chapterNo = raw.chapterNo ? parseInt(raw.chapterNo as string) : undefined;
  const topic = raw.topic as string;

  const { slug } = generatePostUrl({
    classLevel,
    subject,
    chapterNo,
    topic
  });

  const publishablePost = {
    topic,
    title: raw.title as string,
    thumbnail: raw.thumbnail as string,
    description: raw.description as string,
    classLevel: raw.classLevel as string,
    subject: raw.subject as string,
    chapterNo: chapterNo,
    readingTime: Number(raw.readingTime as string),
    content: raw.content as string,
    status: "published" as const,
    scheduledAt: undefined,
  };

  const confirmed = raw.confirmed === "true";
  return await saveToDB(publishablePost, slug, confirmed);
}