import "server-only";
import { createClient } from "@/utils/supabase/server";
import { formatTimeAgo } from "@/utils/helpers/formatTimeAgo";
import { getSession } from "./getSession";
import { cache } from "react";

interface RecentPost {
  id: number;
  title: string;
  date: string;
  url: string;
}

export const getRecentPublishedPosts = cache(
  async (limit: number = 2): Promise<RecentPost[]> => {
    const sp = await createClient();
    const session = await getSession();
    if (!session?.user) return [];

    const authorId = session.user.email?.split("@")[0];
    if (!authorId) return [];

    const { data: posts, error } = await sp
      .from("posts")
      .select("id, title, created_at, url")
      .eq("authorId", authorId)
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      return [];
    }

    return posts.map((post) => ({
      id: post.id,
      title: post.title,
      date: formatTimeAgo(post.created_at),
      url: post.url,
    }));
  }
);

export const getRecentDraftPosts = cache(
  async (limit: number = 2): Promise<RecentPost[]> => {
    const sp = await createClient();
    const session = await getSession();
    if (!session?.user) return [];

    const authorId = session.user.email?.split("@")[0];
    if (!authorId) return [];

    const { data: posts, error } = await sp
      .from("posts")
      .select("id, title, created_at, url")
      .eq("authorId", authorId)
      .eq("status", "draft")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      return [];
    }

    return posts.map((post) => ({
      id: post.id,
      title: post.title,
      date: formatTimeAgo(post.created_at),
      url: post.url,
    }));
  }
);
