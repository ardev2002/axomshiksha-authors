import "server-only";
import { cache } from "react";
import { db } from "@/lib/dynamoClient";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { Select } from "@aws-sdk/client-dynamodb";
import { getFreshUser } from "./getFreshUser";

interface AuthorPostStats {
  totalPosts: number;
  totalPublishedPosts: number;
  totalDraftPosts: number;
  totalScheduledPosts: number;
  totalViews: number;
}

// Helper function to get count for a specific status
async function getCountByStatus(status: string): Promise<number> {
  try {
    const authorId = (await getFreshUser())?.email?.split("@")[0];
    if (!authorId) return 0;

    // Use DynamoDB Query to count items with specific status
    const params = {
      TableName: process.env.AWS_POST_TABLE!,
      IndexName: 'GSI_PublishedByDate',
      KeyConditionExpression: "#status = :status",
      FilterExpression: "#authorId = :authorId",
      ExpressionAttributeNames: {
        "#status": "status",
        "#authorId": "authorId",
      },
      ExpressionAttributeValues: {
        ":status": status,
        ":authorId": authorId,
      },
      Select: Select.COUNT // This makes it a count query
    };

    const result = await db.send(new QueryCommand(params));
    return result.Count || 0;
  } catch (error) {
    console.error(`Error fetching count for status ${status}:`, error);
    return 0;
  }
}

export const getAuthorPostStats = cache(
  async (): Promise<AuthorPostStats | null> => {
    try {
      // Fetch counts for each status efficiently using COUNT queries
      const [totalPublished, totalDraft, totalScheduled] = await Promise.all([
        getCountByStatus("published"),
        getCountByStatus("draft"),
        getCountByStatus("scheduled")
      ]);

      const totalPosts = totalPublished + totalDraft + totalScheduled;

      return {
        totalPosts,
        totalPublishedPosts: totalPublished,
        totalDraftPosts: totalDraft,
        totalScheduledPosts: totalScheduled,
        totalViews: 0 // Placeholder as view counting isn't implemented
      };
    } catch (error) {
      console.error("Error fetching author stats:", error);
      return null;
    }
  }
);