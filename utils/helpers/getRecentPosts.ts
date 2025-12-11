"use server";
import { formatTimeAgo } from "@/utils/helpers/formatTimeAgo";
import { cache } from "react";
import { getPaginatedPosts } from "@/utils/post/get/action";
import { cacheTag } from "next/cache";

export interface RecentPost {
  id: number;
  title: string;
  date: string;
  slug: string;
}

export const getRecentPublishedPosts = cache(
  async (limit: number = 5): Promise<RecentPost[]> => {

    try {
      const { posts } = await getPaginatedPosts({
        status: "published",
        sortDirection: "latest",
        limit
      });

      return posts.map((post: Record<string, any>, index: number) => ({
        id: index, // Using index as ID since DynamoDB items don't have auto-incrementing IDs
        title: post.title,
        date: post.entryTime ? formatTimeAgo(post.publishTime) : "",
        slug: post.slug,
      }
      ));
    } catch (error) {
      console.error("Error fetching recent published posts:", error);
      return [];
    }
  }
);

export const getRecentDraftPosts = cache(
  async (limit: number = 5): Promise<RecentPost[]> => {
    try {
      const { posts } = await getPaginatedPosts({
        status: "draft",
        sortDirection: "latest",
        limit
      });

      return posts.map((post: any, index: number) => ({
        id: index, // Using index as ID since DynamoDB items don't have auto-incrementing IDs
        title: post.title,
        date: post.entryTime ? formatTimeAgo(post.entryTime) : "",
        slug: post.slug,
      }
      ))
    } catch (error) {
      console.error("Error fetching recent draft posts:", error);
      return [];
    }
  }
);

export const getRecentScheduledPosts = cache(
  async (limit: number = 5): Promise<RecentPost[]> => {
    try {
      const { posts } = await getPaginatedPosts({
        status: "scheduled",
        sortDirection: "latest",
        limit
      });

      return posts.map((post: any, index: number) => ({
        id: index,
        title: post.title,
        date: post.entryTime ? formatTimeAgo(post.publishTime) : "",
        slug: post.slug,
        publishTime: post.publishTime
      }
      ));
    } catch (error) {
      console.error("Error fetching recent scheduled posts:", error);
      return [];
    }
  }
);
