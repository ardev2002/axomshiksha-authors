import "server-only";
import { createClient } from "@/utils/supabase/server";
import { formatTimeAgo } from "@/utils/helpers/formatTimeAgo";
import { getSession } from "./getSession";
import { cache } from "react";
import { generatePostUrl } from "./generatePostUrl";

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
      .select("id, title, subject, created_at, topic, class, chapter_no")
      .eq("authorId", authorId)
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      return [];
    }

    return posts.map((post) => {
      const { generatedUrl } = generatePostUrl(post.subject, post.class, post.chapter_no, post.topic);
      return {
        id: post.id,
        title: post.title,
        date: formatTimeAgo(post.created_at),
        url: generatedUrl,
      };
    });
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
      .select("id, title, created_at, subject, topic, class, chapter_no")
      .eq("authorId", authorId)
      .eq("status", "draft")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      return [];
    }

    return posts.map((post) => {
      const { generatedUrl } = generatePostUrl(post.subject, post.class, post.chapter_no, post.topic);
      return {
        id: post.id,
        title: post.title,
        date: formatTimeAgo(post.created_at),
        url: generatedUrl,
      };
    });
  }
);
