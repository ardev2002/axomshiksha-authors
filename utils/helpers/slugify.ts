import { removeWhiteSpaces } from "./removeWhiteSpaces";

export function slugify(text: string) {
  return removeWhiteSpaces(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// create a function that extracts the classLevel(optional), subject(), chapterNo(optional), and topic(required) from the url

export function extractPostUrlParams(url: string) {
  const parts = url.split("/");
  const topic = parts[parts.length - 1]; // Last part is always topic
  const chapterNo = parts.length > 1 ? parts[parts.length - 2] : undefined;
  const subject = parts.length > 2 ? parts[parts.length - 3] : undefined;
  const classLevel = parts.length > 3 ? parts[parts.length - 4] : undefined;
  return { classLevel, subject, chapterNo, topic };
}
