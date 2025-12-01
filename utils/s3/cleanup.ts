"use server";

import { removeMultipleImagesFromS3 } from "@/utils/s3/action";

/**
 * Server action to clean up orphaned images that were uploaded but not associated with a post
 * @param imageKeys - Array of S3 object keys to remove
 * @returns Promise with result of cleanup operation
 */
export async function cleanupOrphanedImages(imageKeys: string[]) {
  if (!imageKeys || imageKeys.length === 0) {
    return { success: true, message: "No images to cleanup" };
  }

  try {
    await removeMultipleImagesFromS3(imageKeys);
    return { 
      success: true, 
      message: `Successfully cleaned up ${imageKeys.length} orphaned images`,
      cleanedUpImages: imageKeys.length
    };
  } catch (error) {
    console.error("Failed to cleanup orphaned images:", error);
    return { 
      success: false, 
      message: "Failed to cleanup orphaned images",
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}