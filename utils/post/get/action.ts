"use server";
import { redirect, RedirectType } from "next/navigation";
import { db } from "@/lib/dynamoClient";
import { QueryCommand, QueryCommandInput, ScanCommand, ScanCommandInput } from "@aws-sdk/lib-dynamodb";
import { s3Client } from "@/lib/s3";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import matter from "gray-matter";
import { getFreshUser } from "@/utils/helpers/getFreshUser";
import { DBPost } from "@/utils/types";
import { extractPostUrlParams } from "@/utils/helpers/slugify";

export async function getPost(postSlug: string) {
  const params: QueryCommandInput = {
    TableName: process.env.AWS_POST_TABLE!,
    KeyConditionExpression: "#slug = :slug",
    ExpressionAttributeNames: {
      "#slug": "slug",
    },
    ExpressionAttributeValues: {
      ":slug": postSlug,
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

    const postWithMetadata = {
      slug: Items?.[0]?.slug,
      topic: extractPostUrlParams(Items?.[0]?.slug)?.topic,
      title: Items?.[0]?.title,
      chapterNo: data.chapterNo,
      readingTime: data.readingTime,
      classLevel: data.classLevel,
      subject: data.subject,
      description: data.description,
      thumbnail: data.thumbnail,
      createdAt: data.createdAt
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
  status?: DBPost['status'];
}

export async function getPaginatedPosts(
  filters?: GetPaginatedPostsParams
): Promise<PaginatedPostsResponse> {

  const authorId = (await getFreshUser())?.email?.split("@")[0];

  const params: QueryCommandInput = {
    TableName: process.env.AWS_POST_TABLE!,
    IndexName: 'GSI_PublishedByDate',
    KeyConditionExpression: "#status = :status",
    FilterExpression: "#authorId = :authorId",
    ExpressionAttributeNames: {
      "#status": "status",
      "#authorId": "authorId",
    },
    ExpressionAttributeValues: {
      ":status": filters?.status || "published",
      ":authorId": authorId,
    },
    ScanIndexForward: filters?.sortDirection !== "latest",
    Limit: filters?.limit || 10,
  };

  if (filters?.lastKey) {
    params.ExclusiveStartKey = filters?.lastKey;
  }

  const {Items, LastEvaluatedKey} = await db.send(new QueryCommand(params));
  
  // Process items to add metadata from S3
  if (Items && Items.length > 0) {
    const processedItems = await Promise.all(Items.map(async (item) => {
      try {
        const {Body} = await s3Client.send(new GetObjectCommand({
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
    | string
    | "";
  const sortby = formDataObject.sortby as "latest" | "oldest" | "";

  const params = [];
  if (status) params.push(`status=${status}`);
  if (sortby) params.push(`sortby=${sortby}`);

  const queryString = params.length > 0 ? `?${params.join("&")}` : "";
  redirect(`/dashboard/posts${queryString}`, RedirectType.push);
}

export async function searchPosts(
  searchTerm: string,
  lastEvaluatedKey?: Record<string, any>,
  limit: number = 10,
): Promise<PaginatedPostsResponse> {
  const params: ScanCommandInput = {
    TableName: process.env.AWS_POST_TABLE!,
    FilterExpression: "contains(#title, :searchTerm) AND #status = :published",
    ExpressionAttributeNames: {
      "#title": "title",
      "#status": "status",
    },
    ExpressionAttributeValues: {
      ":searchTerm": searchTerm,
      ":published": "published",
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