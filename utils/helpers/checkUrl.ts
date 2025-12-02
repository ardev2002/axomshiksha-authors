import { createClient } from "@/utils/supabase/server";
import { Tables } from "@/utils/supabase/types";
import { PostgrestError } from "@supabase/supabase-js";
import * as z from "zod";
import { URLOptions } from "../types";

export interface CheckUrl {
  isAvailable: boolean;
  successMsg?: string;
  errMsg?: string;
  draftPost?: Partial<Tables<"posts">> | null;
}

export async function checkUrlAvailability(
  urlOptions: URLOptions
): Promise<CheckUrl> {
  try {
    const supabase = await createClient();

    // Build the query to check for existing posts with the same subject, class, and topic
    let query = supabase
      .from("posts")
      .select("topic, title, class, subject, authorId, status, thumbnail");

    if (urlOptions.subject) {
      query = query.eq(
        "subject",
        urlOptions.subject as NonNullable<Tables<"posts">["subject"]>
      );
    }

    if (urlOptions.classNo) {
      query = query.eq(
        "class",
        urlOptions.classNo as NonNullable<Tables<"posts">["class"]>
      );
    }

    if (urlOptions.chapterNo) {
      query = query.eq(
        "chapter_no",
        Number(urlOptions.chapterNo as unknown as string)
      );
    }

    const { data, error } = await query
      .eq("topic", urlOptions.topic)
      .maybeSingle();

    if (error) throw error;
    if (!data) return { isAvailable: true, successMsg: "URL is available" };

    if (data.status === "draft") {
      return {
        isAvailable: true,
        successMsg: "URL is available",
        draftPost: data,
      };
    }

    return {
      isAvailable: false,
      errMsg: "This URL combination already exists",
    };
  } catch (error) {
    if (error instanceof z.ZodError)
      return { errMsg: error.issues[0].message, isAvailable: false };
    if (error instanceof PostgrestError)
      return { errMsg: error.message, isAvailable: false };
    return { errMsg: "Unexpected error. Try again.", isAvailable: false };
  }
}
