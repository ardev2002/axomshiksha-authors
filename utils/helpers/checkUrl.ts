import { createClient } from "@/utils/supabase/server";
import { PostgrestError } from "@supabase/supabase-js";
import * as z from "zod";
import { URLOptions } from "../types";
import { db } from "@/lib/dynamoClient";
import { GetCommand } from "@aws-sdk/lib-dynamodb";

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
    const getCmd = new GetCommand({
      TableName: process.env.AWS_POST_TABLE,
      Key: { slug },
    });

    const { Item } = await db.send(getCmd);

    if (!Item) return { isAvailable: true, successMsg: "URL is available" };

    if (Item.status === "draft") {
      return {
        isAvailable: true,
        successMsg: "URL is available",
        draftPost: Item,
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
