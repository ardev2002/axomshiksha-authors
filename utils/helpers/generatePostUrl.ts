// utils/helpers/generatePostUrl.ts
import { Database, Tables } from "@/utils/supabase/types";
import { URLOptions } from "@/utils/types";
import { removeWhiteSpaces } from "./removeWhiteSpaces";

/**
 * Build the canonical URL for a post.
 * Pattern (optional segments): subject / class / chapter / topic
 */
export function generatePostUrl(
  subject: Database["public"]["Enums"]["Subject"] | null,
  classValue: Database["public"]["Enums"]["Class"] | null,
  chapterNo: Tables<"posts">["chapter_no"] | null,
  topic: string
): { generatedUrl: string; urlOptions: URLOptions } {
  const subjectSlug = subject ? removeWhiteSpaces(subject) : "";
  const classSlug = classValue ? `class-${classValue}` : "";
  const chapterSlug = chapterNo ? `chapter-${chapterNo}` : "";
  const topicSlug = removeWhiteSpaces(topic);

  const segments = [subjectSlug, classSlug, chapterSlug, topicSlug].filter(Boolean);

  const generatedUrl = segments.join("/");

  const urlOptions:URLOptions = {
    subjectSlug,
    classSlug,
    chapterSlug,
    topicSlug,
  };

  return { generatedUrl, urlOptions };
}

export function urlToContentKey(url: string): string {
  const safe = url.replace(/\//g, "-");
  return `md/${safe}.mdx`;
}
