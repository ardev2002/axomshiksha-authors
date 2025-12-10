import * as z from "zod";
import { db } from "@/lib/dynamoClient";
import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { getPost } from "../post/get/action";

export interface CheckUrl {
  isAvailable: boolean;
  successMsg?: string;
  errMsg?: string;
  draftPost?: Record<string, any> | undefined | null;
}

export async function checkUrlAvailability(
  slug: string
): Promise<CheckUrl> {
  try {
    const {post} = await getPost(slug)
    if (!post) return { isAvailable: true, successMsg: "URL is available" };

    if (post.status === "draft") {
      return {
        isAvailable: true,
        successMsg: "URL is available",
        draftPost: post,
      };
    }

    return {
      isAvailable: false,
      errMsg: "This URL combination already exists",
    };
  } catch (error) {
    if (error instanceof z.ZodError)
      return { errMsg: error.issues[0].message, isAvailable: false };
    return { errMsg: "Unexpected error. Try again.", isAvailable: false };
  }
}
