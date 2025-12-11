"use server";
import { redirect, RedirectType } from "next/navigation";
import { db } from "@/lib/dynamoClient";
import { QueryCommand, QueryCommandInput, ScanCommand, ScanCommandInput } from "@aws-sdk/lib-dynamodb";
import { s3Client } from "@/lib/s3";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import matter from "gray-matter";
import { DBPost } from "@/utils/types";
import { extractPostUrlParams } from "@/utils/helpers/slugify";
import { getSignedUrlForDownload } from "@/utils/s3/action";
import { getSession } from "@/utils/helpers/getSession";
import { cacheTag, revalidatePath, updateTag } from "next/cache";

export async function getPost(slug: string) {
  const params: QueryCommandInput = {
    TableName: process.env.AWS_POST_TABLE!,
    KeyConditionExpression: "#slug = :slug",
    ExpressionAttributeNames: {
      "#slug": "slug",
    },
    ExpressionAttributeValues: {
      ":slug": slug,
    },
  };

  try {
    const { Items } = await db.send(new QueryCommand(params));

    if (!Items) throw new Error("Post not found");

    const { Body } = await s3Client.send(new GetObjectCommand({
      Bucket: process.env.NEXT_PUBLIC_BUCKET_NAME!,
      Key: Items[0]?.contentKey
    }))

    if (!Body) throw new Error("Post content not found");
    const rawContent = await Body.transformToString();
    const { data, content } = matter(rawContent);
    const {signedUrl} = await getSignedUrlForDownload(Items?.[0]?.thumbnailKey);

    const postWithMetadata = {
      slug: Items?.[0]?.slug,
      topic: extractPostUrlParams(Items?.[0]?.slug)?.topic,
      title: Items?.[0]?.title,
      status: Items?.[0]?.status,
      entryTime: Items?.[0]?.entryTime,
      chapterNo: data.chapterNo,
      readingTime: data.readingTime,
      classLevel: data.classLevel,
      subject: data.subject,
      description: data.description,
      thumbnail: signedUrl,
    }

    return { post: postWithMetadata || null, content };
  } catch (error) {
    return { post: null }
  }
}


export interface PaginatedPostsResponse {
  posts: Record<string, any>[];
  nextKey: Record<string, any> | null;
}

export interface GetPaginatedPostsParams {
  lastKey?: Record<string, any>;
  sortDirection?: "latest" | "oldest";
  limit?: number,
  status: DBPost['status'] | "all";
}

export async function getPaginatedPosts(
  filters: GetPaginatedPostsParams
): Promise<PaginatedPostsResponse> {
  "use cache: private"
  cacheTag(`posts-${filters.status}`)
  if (filters.status === "all") {
    const { status, ...rest } = filters;
    return getAllPaginatedPosts(rest as any);
  }

  const authorId = (await getSession())?.user.email?.split("@")[0];

  const params: QueryCommandInput = {
    TableName: process.env.AWS_POST_TABLE!,
    IndexName: 'GSI_StatusEntryTime',
    KeyConditionExpression: "#status = :status",
    FilterExpression: "#authorId = :authorId",
    ExpressionAttributeNames: {
      "#status": "status",
      "#authorId": "authorId",
    },
    ExpressionAttributeValues: {
      ":status": filters.status,
      ":authorId": authorId,
    },
    ScanIndexForward: filters?.sortDirection !== "latest",
    Limit: filters?.limit || 5,
  };

  if (filters?.lastKey) {
    params.ExclusiveStartKey = filters?.lastKey;
  }

  const { Items, LastEvaluatedKey } = await db.send(new QueryCommand(params));

  if (Items && Items.length > 0) {
    const processedItems = await Promise.all(Items.map(async (item) => {
      try {
        const { Body } = await s3Client.send(new GetObjectCommand({
          Bucket: process.env.NEXT_PUBLIC_BUCKET_NAME!,
          Key: item?.contentKey
        }));

        if (Body) {
          const rawContent = await Body.transformToString();
          const { data } = matter(rawContent);
          return {
            ...item,
            ...data,
          };
        }
        return item;
      } catch (error) {
        return item;
      }
    }));

    return {
      posts: processedItems,
      nextKey: LastEvaluatedKey || null,
    };
  }

  return {
    posts: Items || [],
    nextKey: LastEvaluatedKey || null,
  };
}


export async function getPostsByFilter(formData: FormData) {
  const formDataObject = Object.fromEntries(formData);
  const status = formDataObject.status as
    | "published"
    | "draft"
    | "scheduled"
    | "";
  const sortby = formDataObject.sortby as "latest" | "oldest" | "";
  redirect(`/dashboard/posts/${status}${sortby ? `?sortby=${sortby}` : ''}`, RedirectType.push);
}

export async function searchPosts(
  searchTerm: string,
  lastEvaluatedKey?: Record<string, any>,
  limit: number = 10,
): Promise<PaginatedPostsResponse> {
  const params: ScanCommandInput = {
    TableName: process.env.AWS_POST_TABLE!,
    FilterExpression: "contains(#title, :searchTerm) AND #status = :status",
    ExpressionAttributeNames: {
      "#title": "title",
      "#status": "status",
    },
    ExpressionAttributeValues: {
      ":searchTerm": searchTerm,
      ":status": "published",
    },
    Limit: limit,
  };

  if (lastEvaluatedKey) {
    params.ExclusiveStartKey = lastEvaluatedKey;
  }

  const result = await db.send(new ScanCommand(params));

  return {
    posts: result.Items || [],
    nextKey: result.LastEvaluatedKey || null,
  };
}

// New function to get posts with all statuses
export async function getAllPaginatedPosts(
  filters: Omit<GetPaginatedPostsParams, 'status'> & { status?: "all" }
): Promise<PaginatedPostsResponse> {

  // Run parallel queries for all three statuses
  const [publishedResult, draftResult, scheduledResult] = await Promise.all([
    getPaginatedPosts({ ...filters, status: "published" }),
    getPaginatedPosts({ ...filters, status: "draft" }),
    getPaginatedPosts({ ...filters, status: "scheduled" })
  ]);

  // Combine all posts
  const allPosts = [
    ...publishedResult.posts,
    ...draftResult.posts,
    ...scheduledResult.posts
  ];

  // Sort by entryTime according to sortDirection
  allPosts.sort((a, b) => {
    const timeA = new Date(a.entryTime).getTime();
    const timeB = new Date(b.entryTime).getTime();
    
    if (filters.sortDirection === "latest") {
      return timeB - timeA; // Newest first
    } else {
      return timeA - timeB; // Oldest first
    }
  });

  // Apply limit
  const limit = filters.limit || 5;
  const limitedPosts = allPosts.slice(0, limit);

  // For pagination with mixed statuses, we'll need to handle it differently
  // For simplicity in this implementation, we're returning null for nextKey
  // A more robust solution would track pagination state for each status separately
  
  return {
    posts: limitedPosts,
    nextKey: null // Simplified pagination for mixed statuses
  };
}
