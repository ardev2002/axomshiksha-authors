"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  getSignedUrlForUpload,
  uploadToPresignedUrl,
  removeImageFromS3,
  getSignedUrlForDownload,
} from "@/utils/s3/action";
import { toast } from "sonner";
import { Upload, X } from "lucide-react";
import { AspectRatio } from "../ui/aspect-ratio";
export default function FileUpload({
  label,
  onUploaded,
  onRemoved,
  imgType, // "thumbnail" | "block"
  currentImage,
}: {
  label: string;
  onUploaded: (url: string, Key: string) => void;
  onRemoved?: (value: string) => void;
  imgType: "thumbnail" | "block";
  currentImage?: string;
}) {
  const [preview, setPreview] = useState(currentImage || "");
  const [Key, setKey] = useState("");
  const [isLoading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (currentImage) {
      const Key = currentImage.split(
        `https://${process.env.NEXT_PUBLIC_BUCKET_NAME}.s3.ap-south-1.amazonaws.com/`
      )[1];

      async function fetchPreview() {
        const { signedUrl } = await getSignedUrlForDownload(Key);
        setPreview(signedUrl);
      }
      fetchPreview();
    }
    return () => {
      if (preview && !currentImage && Key) {
        onRemoved && onRemoved(Key);
      }
    };
  }, [preview, currentImage, Key, onRemoved]);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);

    try {
      const { signedUrl, Key } = await getSignedUrlForUpload(
        file.name,
        file.type,
        imgType
      );
      await uploadToPresignedUrl(signedUrl, file);
      const { signedUrl: previewUrl } = await getSignedUrlForDownload(Key);
      setPreview(previewUrl);
      setKey(Key);
      onUploaded(
        `https://${process.env.NEXT_PUBLIC_BUCKET_NAME}.s3.ap-south-1.amazonaws.com/${Key}`,
        Key
      );
    } catch (err) {
      toast.error("Upload failed");
    } finally {
      setLoading(false);
    }
  }

  async function removeImage() {
    if (!Key) return;
    const toastId = toast.loading("Removing...");
    try {
      await removeImageFromS3(Key);
      setPreview("");
      setKey("");
      onRemoved && onRemoved(Key);
      toast.success("Removed!", { id: toastId });
    } catch {
      toast.error("Failed removing", { id: toastId });
    }
  }

  return (
    <div className="space-y-2">
        {preview ? (
          <div className="relative w-full rounded-lg overflow-hidden border bg-muted">
            <AspectRatio ratio={11 / 3}>
              <Image src={preview} alt="preview" fill className="object-cover" />
            </AspectRatio>

            {/* Remove Button */}
            <Button
              variant={"ghost"}
              type="button"
              onClick={removeImage}
              className="absolute hover:cursor-pointer top-2 right-2 rounded-full p-1 transition"
            >
              <X size={16} />
            </Button>

            {/* Loading Overlay */}
            {isLoading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-white/60 border-t-white" />
              </div>
            )}
          </div>
        ) : (
          <div
            onClick={() => document.getElementById(`file-${label}`)?.click()}
            className="w-full h-36 flex flex-col gap-2 items-center justify-center border border-dashed border-violet-400 rounded-lg bg-muted/40 hover:bg-muted cursor-pointer transition text-center"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent" />
                <p className="text-xs text-muted-foreground">Uploading...</p>
              </>
            ) : (
              <>
                <div className="rounded-full bg-primary/10 p-2">
                  <Upload />
                </div>
                <p className="text-sm text-muted-foreground">
                  Click to select image
                  <br />
                  <span className="text-[10px]">(or drag & drop)</span>
                </p>
              </>
            )}

            {/* Hidden file input */}
            <input
              id={`file-${label}`}
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="hidden"
              disabled={isLoading}
            />
          </div>
        )}
    </div>
  );
}
