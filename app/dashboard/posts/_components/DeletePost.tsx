"use client";

import { Spinner } from "@/components/ui/spinner";
import { Trash2, Clock, Calendar, Check } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { motion } from "motion/react";
import { useActionState, useState, useEffect } from "react";
import { deletePost, DeletePostState } from "@/utils/post/delete/action";

interface DeletePostProps {
  post: Record<string, any>;
}

// CountdownTimer component for scheduled posts
function CountdownTimer({ publishTime }: { publishTime?: string }) {
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    if (!publishTime) return;

    const calculateTimeLeft = () => {
      const now = new Date();
      const publishDate = new Date(publishTime);
      const difference = publishDate.getTime() - now.getTime();

      if (difference <= 0) {
        return "Published";
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      if (days > 0) {
        return `${days}d ${hours}h`;
      } else if (hours > 0) {
        return `${hours}h ${minutes}m`;
      } else {
        return `${minutes}m ${seconds}s`;
      }
    };

    // Set initial time left
    setTimeLeft(calculateTimeLeft());

    // Update every second
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);
    }, 1000);

    return () => clearInterval(timer);
  }, [publishTime]);

  if (!publishTime) return null;

  return (
    <div className="flex items-center gap-2 text-sm text-purple-400">
      <Clock className="w-4 h-4" />
      <span className="font-mono">{timeLeft}</span>
    </div>
  );
}

export default function DeletePost({
  post,
}: DeletePostProps) {
  const [open, setOpen] = useState(false);
  const [state, action, isPending] = useActionState<DeletePostState, FormData>(deletePost, { success: false });
  const [isChecked, setIsChecked] = useState(false);

  // Reset checkbox when dialog closes
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setIsChecked(false);
    }
  };
  
  // Format the creation date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>
        <Button
          type="button"
          variant={"ghost"}
          disabled={isPending}
          className={`rounded-md p-2 transition hover:cursor-pointer text-red-500 hover:text-red-500`}
          title="Delete Post"
        >
          <Trash2 size={16} />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl max-h-[80vh] overflow-y-auto">
        <form className="p-4 sm:p-6">
          <input type="hidden" name="slug" value={post.slug} />
          <input type="hidden" name="contentKey" value={post.contentKey} />
          <input type="hidden" name="thumbnailKey" value={post.thumbnailKey} />
          <input type="hidden" name="status" value={post.status} />
          <input type="hidden" name="publishTime" value={post.publishTime} />
          
          <AlertDialogHeader className="mb-4">
            <AlertDialogTitle className="wrap-break-word">Are you absolutely sure?</AlertDialogTitle>
            {post.status === "published" ? (
              // Standard dialog for published posts
              <div className="wrap-break-word text-muted-foreground text-sm">
                This action cannot be undone. This will permanently delete the
                post <span className="font-semibold wrap-break-word">&quot;{post.title}&quot;</span>{" "}
                and remove all associated data.
              </div>
            ) : (
              // Enhanced dialog for draft/scheduled posts
              <div className="space-y-4 wrap-break-word text-muted-foreground text-sm">
                <span className="block wrap-break-word">
                  This action cannot be undone. This will permanently delete the
                  post <span className="font-semibold wrap-break-word">&quot;{post.title}&quot;</span>{" "}
                  and remove all associated data.
                </span>
                
                {post.status === "scheduled" && post.publishTime && (
                  <div className="pt-2 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>Scheduled to publish in:</span>
                    </div>
                    <CountdownTimer publishTime={post.publishTime} />
                  </div>
                )}
                
                {post.entryTime && (
                  <div className="pt-2 flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>Created on: {formatDate(post.entryTime)}</span>
                  </div>
                )}
              </div>
            )}
          </AlertDialogHeader>
          <div className="flex items-center mb-4">
            <CheckboxPrimitive.Root
              id="confirm-delete"
              checked={isChecked}
              onCheckedChange={(checked) => setIsChecked(checked as boolean)}
              className="peer h-4 w-4 shrink-0 rounded-sm flex justify-center items-center p-2 border border-gray-300 shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-red-600 data-[state=checked]:text-primary-foreground data-[state=checked]:border-red-600 focus-visible:border-ring focus-visible:ring-ring/50"
            >
              <CheckboxPrimitive.Indicator
                className="grid place-content-center text-current transition-none"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: isChecked ? 1 : 0 }}
                  transition={isChecked ? { type: "spring", stiffness: 300, damping: 20 } : { duration: 0 }}
                >
                  <Check className="h-3.5 w-3.5 text-white" />
                </motion.div>
              </CheckboxPrimitive.Indicator>
            </CheckboxPrimitive.Root>
            <label htmlFor="confirm-delete" className="ml-2 select-none block text-sm text-muted-foreground">
              I confirm that I want to delete this post
            </label>
          </div>
          <AlertDialogFooter className="mt-4 flex flex-col sm:flex-row justify-end gap-2">
            <AlertDialogCancel className="hover:cursor-pointer w-full sm:w-auto">
              Cancel
            </AlertDialogCancel>
            <Button
              type="submit"
              formAction={action}
              disabled={!isChecked || isPending}
              className="bg-red-500 text-white hover:cursor-pointer hover:bg-red-500/90 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
            >
              {isPending ? <Spinner /> : "Delete"}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}