import "server-only";
import { createClient } from "@/utils/supabase/server";
import { getSession } from "./getSession";
import { cache } from "react";

interface AuthorPostStats {
  totalPosts: number;
  totalViews: number;
  totalLikes: number;
  totalPublishedPosts: number;
  totalDraftPosts: number;
}

export const getAuthorPostStats = cache(
  async (): Promise<AuthorPostStats | null> => {
    const sp = await createClient();
    const session = await getSession();
    if (!session?.user) return null;
    const authorId = session.user.email?.split("@")[0];

    if (!authorId) return null;

    const { data: posts, error } = await sp
      .from("posts")
      .select("id, views, likes, status")
      .eq("authorId", authorId);

    if (error) {
      console.error("Error fetching author stats:", error);
      return null;
    }

    const totalPosts = posts.length;
    const totalViews = posts.reduce((sum, post) => sum + (post.views || 0), 0);
    const totalLikes = posts.reduce((sum, post) => sum + (post.likes || 0), 0);

    const totalPublishedPosts = posts.filter(
      (post) => post.status === "published"
    ).length;
    const totalDraftPosts = posts.filter(
      (post) => post.status === "draft"
    ).length;

    return {
      totalPosts,
      totalViews,
      totalLikes,
      totalPublishedPosts,
      totalDraftPosts,
    };
  }
);
