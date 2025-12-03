"use client";

import { Spinner } from "@/components/ui/spinner";
import { Trash2 } from "lucide-react";
import { useFormStatus } from "react-dom";
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
import { Database } from "@/utils/supabase/types";

interface DeletePostBtnProps {
  postTitle: string;
  subject: Database["public"]["Enums"]["Subject"] | null;
  classValue: Database["public"]["Enums"]["Class"] | null;
  chapter_no: number | null;
  topic: string;
  page: number;
}
export default function DeletePost({
  postTitle,
  subject,
  classValue,
  chapter_no,
  topic,
  page,
}: DeletePostBtnProps) {
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
          {subject && <input type="hidden" name="subject" value={subject} />}
          {classValue && (
            <input type="hidden" name="classNo" value={classValue} />
          )}
          {chapter_no && (
            <input type="hidden" name="chapterNo" value={chapter_no} />
          )}
          <input type="hidden" name="topic" value={topic} />
          <input type="hidden" name="page" value={page} />
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              post <span className="font-semibold truncate">"{postTitle}"</span>{" "}
              and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
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
