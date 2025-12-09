export function removeWhiteSpaces(str: string | undefined) {
  if (str === undefined) return "";
  return str.replace(/\s+/g, " ").trim();
}