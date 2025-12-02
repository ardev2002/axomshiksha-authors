import { removeWhiteSpaces } from "./removeWhiteSpaces";

export function slugify(text: string) {
  return removeWhiteSpaces(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}