import { URLOptions } from "@/utils/types";
import { removeWhiteSpaces } from "./removeWhiteSpaces";

/**
 * Build the canonical URL for a post.
 * Pattern (optional segments): subject / class / chapter / topic
 */
interface GeneratePostUrlParams {
  classLevel: string | undefined;
  subject: string | undefined;
  chapterNo: number | undefined;
  topic: string | undefined;
}
export function generatePostUrl({
  classLevel,
  subject,
  chapterNo,
  topic
}: GeneratePostUrlParams) {
  const classSlug = classLevel || "";
  const subjectSlug = subject ? removeWhiteSpaces(subject) : "";
  const chapterSlug = chapterNo || "";
  const topicSlug = topic ? removeWhiteSpaces(topic) : "";

  const segments = [classSlug, subjectSlug, chapterSlug, topicSlug].filter(Boolean);

  const slug = segments.join("/");

  return { slug };
}

export function urlToContentKey(url: string): string {
  const safe = url.replace(/\//g, "-");
  return `md/${safe}.mdx`;
}