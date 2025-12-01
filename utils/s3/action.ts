"use server";
import { s3Client } from "@/lib/s3";
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export async function uploadToPresignedUrl(url: string, file: File) {
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

export async function getSignedUrlForUpload(
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

// Added function to generate signed URL for downloading/retrieving objects from S3
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
