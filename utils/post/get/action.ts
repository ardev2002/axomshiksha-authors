"use server";
import * as z from "zod";
import { createClient } from "@/utils/supabase/server";
import { PostgrestError } from "@supabase/supabase-js";
import { Database, Tables } from "@/utils/supabase/types";
import { redirect, RedirectType } from "next/navigation";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "@/lib/s3";

export interface GetPostReturnType {
  post: Tables<"posts"> | null;
  content?: string;
  errMsg?: string;
}

interface GetSinglePostParams {
  filters?: Partial<Omit<Tables<"posts">, "id" | "created_at" | "thumbnail">>;
}

export async function getSinglePost({ filters }: GetSinglePostParams = {}): Promise<GetPostReturnType> {
  try {
    const supabase = await createClient();
    let query: any = supabase
      .from("posts")
      .select("*")
      .single();

    // Apply filters if provided
    if (filters) {
      for (const [column, value] of Object.entries(filters)) {
        if (
          value !== undefined &&
          value !== "" &&
          value !== null &&
          column !== "created_at" &&
          column !== "id" &&
          column !== "thumbnail"
        ) {
          query = query.eq(column, value);
        }
      }
    }

    const { data: post, error } = await query;

    if (error) throw error;
    
    // Retrieve content from S3 if content_key exists
    let content = "";
    if (post?.content_key) {
      try {
        const command = new GetObjectCommand({
          Bucket: "axomshiksha",
          Key: post.content_key,
        });
        
        const response = await s3Client.send(command);
        content = await response.Body?.transformToString() || "";
      } catch (error) {
        console.error("Error retrieving content from S3:", error);
        // Don't throw error here, just return empty content
      }
    }
    
    return { post, content };
  } catch (err) {
    if (err instanceof z.ZodError) {
      return { errMsg: err.issues[0].message, post: null };
    } else if (err instanceof PostgrestError) {
      return { errMsg: err.message, post: null };
    }
    return { errMsg: "Unexpected error! Try again", post: null };
  }
}

interface GetPaginatedPostsParams {
  page?: number;
  limit?: number;
  sortOrder?: "ascending" | "descending";
  search?: string;
  filters?: Partial<Omit<Tables<"posts">, "id" | "created_at" | "thumbnail">>;
}

export interface GetPaginatedPostsResult {
  posts: Tables<"posts">[] | [];
  totalPages: number;
  currentPage: number;
}

export async function getPaginatedPosts({
  page = 1,
  limit = 5,
  sortOrder = "descending",
  search = "",
  filters,
}: GetPaginatedPostsParams): Promise<GetPaginatedPostsResult> {
  const supabase = await createClient();

  const start = (page - 1) * limit;
  const end = start + limit - 1;

  let query = supabase
    .from("posts")
    .select("*", { count: "exact" });

  if (filters?.status) query = query.eq("status", filters.status);

  if (filters) {
    for (const [column, value] of Object.entries(filters)) {
      if (
        value !== undefined &&
        value !== "" &&
        value !== null &&
        column !== "created_at" &&
        column !== "id" &&
        column !== "thumbnail"
      ) {
        query = query.eq(column, value);
      }
    }
  }

  if (search.trim() !== "") {
    query = query.textSearch("title", search.trim(), {
      type: "websearch",
      config: "english",
    });
  }

  query = query
    .order("created_at", { ascending: sortOrder === "ascending" })
    .range(start, end);

  const { data, error, count } = await query;
  if (error) {
    return {
      posts: [],
      totalPages: 1,
      currentPage: page,
    };
  }

  const totalPages = Math.ceil((count ?? 0) / limit) || 1;

  return {
    posts: data || [],
    totalPages,
    currentPage: page,
  };
}

export async function getPostsByFilter(formData: FormData) {
  const formDataObject = Object.fromEntries(formData);
  const page = Number(formDataObject.page);
  const classValue = formDataObject.class as
    | Database["public"]["Enums"]["Class"]
    | "";
  const subject = formDataObject.subject as
    | Database["public"]["Enums"]["Subject"]
    | "";
  const status = formDataObject.status as
    | Database["public"]["Enums"]["Status"]
    | "";
  const sortby = formDataObject.sortby as "latest" | "oldest" | "";

  const params = [];
  if (page) params.push(`page=${page}`);
  if (classValue) params.push(`class=${classValue}`);
  if (subject) params.push(`subject=${subject}`);
  if (status) params.push(`status=${status}`);
  if (sortby) params.push(`sortby=${sortby}`);

  const queryString = params.length > 0 ? `?${params.join("&")}` : "";
  redirect(`/dashboard/posts${queryString}`, RedirectType.push);
}
