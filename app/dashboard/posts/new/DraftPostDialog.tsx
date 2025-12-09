import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, FileText } from "lucide-react";
import Image from "next/image";
import { Dispatch, SetStateAction } from "react";

interface DraftPostDialogProps {
  draftPost: Record<string, any> | null;
  setDraftPost: Dispatch<
    SetStateAction<Record<string, any> | null>
  >;
  draftPostConfirmation: boolean;
  setDraftPostConfirmation: Dispatch<SetStateAction<boolean>>;
  handleFreshPublish: () => Promise<void>;
  handleConfirmedPublish: () => Promise<void>;
}

export default function DraftPostDialog(props: DraftPostDialogProps) {
  return (
    <>
      <AlertDialog
        open={props.draftPostConfirmation}
        onOpenChange={props.setDraftPostConfirmation}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="text-yellow-500" />
              Existing Post Found
            </AlertDialogTitle>
            <AlertDialogDescription>
              A draft post already exists with this URL. What would you like to
              do?
            </AlertDialogDescription>
          </AlertDialogHeader>

          {props.draftPost && (
            <Card className="border border-yellow-500/30 bg-yellow-500/5 shadow-sm transition-all duration-200 hover:shadow-md hover:border-yellow-500/50 text-sm">
              <CardHeader className="pb-2 pt-3 space-y-2">
                {/* Title Row */}
                <div className="flex items-center justify-between gap-3 min-w-0">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <FileText className="w-3.5 h-3.5 text-yellow-500 shrink-0" />

                    <CardTitle className="text-sm font-semibold truncate leading-tight">
                      {props.draftPost.title}
                    </CardTitle>
                  </div>

                  <span className="inline-flex items-center rounded-full bg-yellow-500/10 px-2 py-0.5 text-[10px] font-medium text-yellow-500 border border-yellow-500/30 shrink-0">
                    Draft
                  </span>
                </div>

                {/* Meta — all in one line */}
                <div className="flex items-center gap-3 min-w-0 text-[11px]">
                  <div className="flex min-w-0 items-center gap-1">
                    <span className="text-muted-foreground shrink-0">
                      Class:
                    </span>
                    <span className="capitalize truncate min-w-0">
                      {props.draftPost.class}
                    </span>
                  </div>
                  
                  <div className="flex min-w-0 items-center gap-1">
                    <span className="text-muted-foreground shrink-0">
                      Subject:
                    </span>
                    <span className="capitalize truncate min-w-0">
                      {props.draftPost.subject}
                    </span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-2 pb-3">
                {props.draftPost.thumbnail && (
                  <div className="overflow-hidden rounded-md border border-white/10 bg-background/50">
                    <AspectRatio ratio={8 / 3} className="bg-muted">
                      <Image
                        src={props.draftPost.thumbnail}
                        alt="Draft thumbnail"
                        fill
                        className="object-cover"
                      />
                    </AspectRatio>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <AlertDialogFooter className="flex justify-center!">
            <AlertDialogCancel className="hover:cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <Button
              variant="outline"
              className="hover:cursor-pointer border-yellow-500/30 hover:bg-yellow-500/10"
              onClick={(e) => {
                e.preventDefault();
                props.handleFreshPublish();
              }}
            >
              Fresh Publish
            </Button>
            <Button
              className="hover:cursor-pointer bg-violet-600 hover:bg-violet-700"
              onClick={(e) => {
                e.preventDefault();
                props.handleConfirmedPublish();
              }}
            >
              Proceed with Draft
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}