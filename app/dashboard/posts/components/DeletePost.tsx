"use client";

import { Spinner } from "@/components/ui/spinner";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useActionState, useState } from "react";
import { deletePost, DeletePostState } from "@/utils/post/delete/action";

interface DeletePostProps {
  post: Record<string, any>;
}
export default function DeletePost({
  post,
}: DeletePostProps) {
  const [open, setOpen] = useState(false);
  const [state, action, isPending] = useActionState<DeletePostState, FormData>(deletePost, { success: false });
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          type="button"
          variant={"ghost"}
          disabled={isPending}
          className={`rounded-md p-2 transition hover:cursor-pointer text-red-500 hover:text-red-500`}
          title="Delete Post"
        >
          {!isPending ? <Trash2 size={16} /> : <Spinner />}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <form action={action}>
          <input type="hidden" name="slug" value={post.slug} />
          <input type="hidden" name="contentKey" value={post.contentKey} />
          <input type="hidden" name="thumbnailKey" value={post.thumbnailKey} />
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              post <span className="font-semibold truncate">"{post.title}"</span>{" "}
              and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel className="hover:cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                type="submit"
                className="bg-red-500 text-white hover:cursor-pointer hover:bg-red-500/90"
              >
                Delete
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
