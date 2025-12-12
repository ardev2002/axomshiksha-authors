"use server";
import { s3Client } from "@/lib/s3";
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

/**
 * 
 * @param url Presigned URL
 * @param file File to upload
 * @returns {Promise<{ message: string }>} A promise that resolves with a message indicating success or failure
 */
export async function uploadToPresignedUrlFetch(url: string, file: File) {
  const res = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
    },
    body: file,
  });

  if (!res.ok) throw new Error("Failed to upload image to S3");
  return { message: "Image uploaded successfully" };
}

/**
 * 
 * @param Key The key of the object to remove from S3
 */
export async function removeImageFromS3(
  Key: string
) {
  const command = new DeleteObjectCommand({
    Bucket: process.env.NEXT_PUBLIC_BUCKET_NAME,
    Key
  });

  try {
    await s3Client.send(command);
  } catch (error) {
    console.error("Error removing image from S3:", error);
    throw error;
  }
}

/**
 * 
 * @param Keys An array of keys of the objects to remove from S3
 * @returns {Promise<{ message: string }>} A promise that resolves with a message indicating success or failure
 */
export async function removeMultipleImagesFromS3(
  Keys: string[]
) {
  const results = await Promise.allSettled(
    Keys.map(Key => removeImageFromS3(Key))
  );
  
  const errors = results
    .map((result, index) => ({ result, index }))
    .filter(({ result }) => result.status === "rejected")
    .map(({ index }) => Keys[index]);
    
  if (errors.length > 0) {
    console.error("Failed to remove some images:", errors);
    throw new Error(`Failed to remove ${errors.length} images`);
  }
  
  return { message: "Images removed successfully" };
}

/**
 * 
 * @param fileName The name of the image to upload
 * @param ContentType The content type of the file to upload
 * @param imgType The type of the image to upload
 * @returns {Promise<{ signedUrl: string, Key: string }>} A promise that resolves with the signed URL and key of the uploaded file
 */
export async function getSignedUrlForImgUpload(
  fileName: string,
  ContentType: string,
  imgType: "block" | "thumbnail",
) {
  const Key = `post/${imgType}/${Date.now()}-${fileName}`;
  const command = new PutObjectCommand({
    Bucket: process.env.NEXT_PUBLIC_BUCKET_NAME,
    Key,
    ContentType
  });
  try {
    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    });
    return { signedUrl, Key };
  } catch (error) {
    throw error;
  }
}

/**
 * 
 * @param fileName The name of the asset to upload
 * @param ContentType The content type of the file to upload
 * @returns {Promise<{ signedUrl: string, Key: string }>} A promise that resolves with the signed URL and key of the uploaded asset
 */
export async function getSignedUrlForAssetUpload(
  fileName: string,
  ContentType: string,
) {
  const Key = `assets/${Date.now()}-${fileName}`;
  const command = new PutObjectCommand({
    Bucket: process.env.NEXT_PUBLIC_BUCKET_NAME,
    Key,
    ContentType
  });
  try {
    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    });
    return { signedUrl, Key };
  } catch (error) {
    throw error;
  }
}

/**
 * 
 * @param Key The key of the object to download from S3
 * @returns {Promise<{ signedUrl: string }>} A promise that resolves with the signed URL of the downloaded file
 */
export async function getSignedUrlForDownload(Key: string) {
  const command = new GetObjectCommand({
    Bucket: process.env.NEXT_PUBLIC_BUCKET_NAME,
    Key,
  });
  
  try {
    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    });
    return { signedUrl };
  } catch (error) {
    throw error;
  }
}
