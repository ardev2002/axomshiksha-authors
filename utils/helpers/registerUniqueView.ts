import "server-only";

import { docClient } from "@/lib/dynamoClient";
import { PutCommand } from "@aws-sdk/lib-dynamodb";

/**
 * @param postId - The ID of the post to register a view for.
 * @param ipHash - A hash of the viewer's IP address.
 * @returns `true` if the view is unique, `false` if the viewer has already viewed the post.
 */
export async function registerUniqueView(postId: string, ipHash: string) {
  const now = Math.floor(Date.now() / 1000);
  const ttl = now + 7 * 24 * 60 * 60; // 7 days

  try {
    await docClient.send(
      new PutCommand({
        TableName: "post_views",
        Item: {
          postId,
          ipHash,
          createdAt: now,
          ttl
        },
        ConditionExpression: "attribute_not_exists(ipHash)" // ensures uniqueness
      })
    );

    return true; // view is unique
  } catch (err: any) {
    if (err.name === "ConditionalCheckFailedException") {
      return false; // already recorded
    }
    throw err; // real error
  }
}
