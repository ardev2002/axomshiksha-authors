import { AUTHORS } from "./CONSTANT";

export type Author = (typeof AUTHORS)[number]["id"];

export interface URLOptions{
  subjectSlug: string | null;
  classSlug: string | null;
  chapterSlug: string | null;
  topicSlug: string;
}

export interface DBPost {
  title: string;
  status: "published" | "draft" | "scheduled";
  slug: string;
  contentKey: string;
  entryTime?: string;
}