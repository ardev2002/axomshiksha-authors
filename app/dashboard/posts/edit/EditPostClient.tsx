"use client";

import { useEffect, useState, startTransition, useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  BookOpen,
  CheckCircle,
  Edit,
  FileText,
  Home,
  Layers3,
  Layout,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import EnhancedInput from "@/components/custom/EnhancedInput";
import EnhancedTextArea from "@/components/custom/EnhancedTextArea";
import FileUpload from "@/components/custom/FileUpload";
import BreadCrumb from "@/components/custom/BreadCrumb";
import { Spinner } from "@/components/ui/spinner";
import ValidationErrorCard from "@/components/custom/ValidationErrorCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; import { editPost } from "@/utils/post/edit/action";
import SectionsEditor from "../components/SectionsEditor";
import type { Section } from "../components/sectionTypes";
import { removeWhiteSpaces } from "@/utils/helpers/removeWhiteSpaces";
import { convertSectionsToMDXWithMeta } from "@/utils/helpers/mdx-convert";
import { SUBJECTS_BY_LEVEL, LEVELS } from "@/utils/CONSTANT";
// Add AlertDialog components for the publish notification
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

export default function EditPostClient({
  post,
  sections: initialSections,
}: {
  post: Record<string, any>;
  sections?: Section[];
}) {
  const [title, setTitle] = useState(post.title);
  const [description, setDescription] = useState(post.description);
  const [readingTime, setReadingTime] = useState(
    post.readingTime?.toString() || ""
  );
  const [thumbnail, setThumbnail] = useState(post.thumbnail);
  const [sections, setSections] = useState<Section[]>(initialSections || []);
  const [charLeft, setCharLeft] = useState(300 - (post.description?.length || 0));
  const [editState, editAction, isEditing] = useActionState(editPost, {});
  // State for the publish notification dialog
  const [showPublishDialog, setShowPublishDialog] = useState(false);

  useEffect(() => {
    setCharLeft(300 - (description?.length || 0));
  }, [description]);

  // Check if the post is scheduled and its publish time has passed
  useEffect(() => {
    if (post.status === "scheduled" && post.publishTime) {
      const publishDate = new Date(post.publishTime);
      const now = new Date();

      if (publishDate <= now) {
        setShowPublishDialog(true);
      }
    }
  }, [post]);

  const buildMDX = () =>
    convertSectionsToMDXWithMeta(sections, {
      title,
      description,
      chapterNo: parseInt(post.chapterNo),
      readingTime: readingTime ? parseInt(readingTime) : null,
      classLevel: post.classLevel,
      subject: post.subject,
    });

  const validateSections = () => {
    const hasContent = sections.some(
      (section) =>
        removeWhiteSpaces(section.title) !== "" ||
        section.contentBlocks.some((block) => {
          if (block.type === "paragraph") {
            return removeWhiteSpaces(block.content) !== "";
          }
          if (block.type === "code") {
            const cb = block as any;
            return (
              cb.content.trim() !== "" ||
              (cb.subtitle && removeWhiteSpaces(cb.subtitle) !== "")
            );
          }
          if (block.type === "list-group") {
            const lg = block as any;
            return (
              removeWhiteSpaces(lg.subtitle) !== "" ||
              lg.items.some(
                (item: any) => removeWhiteSpaces(item.content) !== ""
              )
            );
          }
          return false;
        })
    );

    return hasContent;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateSections()) return;

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    formData.set("content", buildMDX());

    startTransition(() => {
      editAction(formData);
    });
  };

  useEffect(() => {
    if ((editState as any).successMsg) {
      toast.success("Success", {
        description: (editState as any).successMsg,
        icon: <CheckCircle />,
      });
    }

    if ((editState as any).errorMsg) {
      toast.error("Error", {
        description: (editState as any).errorMsg,
      });
    }
  }, [editState]);

  return (
    <>
      <BreadCrumb
        paths={[
          { icon: <Home size={16} />, path: "/", title: "Home" },
          {
            icon: <Layout size={16} />,
            path: "/dashboard",
            title: "Dashboard",
          },
          {
            icon: <BookOpen size={16} />,
            path: "/dashboard/posts",
            title: "Posts",
          },
          { icon: <Edit size={16} />, path: "#", title: "Edit Post" },
        ]}
      />

      <ValidationErrorCard
        errors={
          (editState as any).errorMsg ? [(editState as any).errorMsg] : []
        }
      />

      {/* Publish Notification Dialog */}
      <AlertDialog open={showPublishDialog} onOpenChange={setShowPublishDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-500" />
              Post Published!
            </AlertDialogTitle>
            <AlertDialogDescription>
              Your post is published just now
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-end">
            <AlertDialogAction 
              onClick={() => setShowPublishDialog(false)}
              className="bg-violet-600 hover:bg-violet-700 hover:cursor-pointer text-white"
            >
              Got it
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <form className="space-y-8" onSubmit={handleSubmit}>
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-violet-500/10 text-violet-500 border border-violet-500/30">
              <FileText className="w-5 h-5" />
            </div>
            <h1 className="md:text-2xl font-semibold tracking-tight text-foreground">
              Edit Post
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Button
              type="submit"
              title="Update Post"
              disabled={isEditing}
              className="bg-violet-600 hover:bg-violet-700 hover:cursor-pointer text-white flex items-center gap-2"
            >
              {isEditing ? (
                <>
                  <Spinner /> Updating...
                </>
              ) : (
                <>Update</>
              )}
            </Button>
          </div>
        </div>

        <Card className="bg-background/70 border border-accent shadow-sm">
          <CardHeader>
            <CardTitle className="flex gap-2 items-center">
              <Layers3 className="text-violet-400" size={16} />
              Post Details
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-5">
            <EnhancedInput
              tooltipContent="Topic (locked after publish)"
              type="text"
              name="topic"
              defaultValue={post.topic}
              readOnly
            />

            {/* Title (editable) */}
            <Input
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              required
            />

            {/* descriptionription (editable) */}
            <EnhancedTextArea
              name="description"
              value={description}
              charLeft={charLeft}
              maxLength={300}
              onChange={(e) => {
                const value = e.target.value;
                setDescription(value);
                setCharLeft(300 - (value?.length || 0));
              }}
            />

            {/* Thumbnail (editable) */}
            <FileUpload
              label="Post Thumbnail"
              imgType="thumbnail"
              currentImage={thumbnail}
              onUploaded={(url) => setThumbnail(url)}
            />

            {/* Subject / Class / Chapter – locked (once published) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                name="classLevel"
                defaultValue={post.classLevel || ""}
                disabled
              >
                <SelectTrigger className="hover:cursor-not-allowed border-white/20 bg-background/60 w-full">
                  <SelectValue placeholder="Select Class Level" />
                </SelectTrigger>
                <SelectContent className="bg-background/95 border border-white/10">
                  {LEVELS.map((level) => (
                    <SelectItem key={level.id} value={level.id}>
                      {level.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                name="subject"
                defaultValue={post.subject || ""}
                disabled
              >
                <SelectTrigger className="hover:cursor-not-allowed border-white/20 bg-background/60 w-full">
                  <SelectValue placeholder="Select Subject" />
                </SelectTrigger>
                <SelectContent className="bg-background/95 border border-white/10">
                  {post.classLevel && SUBJECTS_BY_LEVEL[post.classLevel as keyof typeof SUBJECTS_BY_LEVEL]?.map((subjectOption) => (
                    <SelectItem key={subjectOption.id} value={subjectOption.id}>
                      {subjectOption.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                type="number"
                name="chapterNo"
                placeholder="Chapter Number"
                defaultValue={post.chapterNo}
                disabled
              />

              <Input
                type="number"
                name="readingTime"
                placeholder="Reading Time (minutes)"
                value={readingTime}
                onChange={(e) => setReadingTime(e.target.value)}
                min="1"
              />
            </div>

            <input type="hidden" name="thumbnail" value={thumbnail} />
            <input type="hidden" name="classLevel" value={post.classLevel || ""} />
            <input type="hidden" name="subject" value={post.subject || ""} />
            <input type="hidden" name="chapterNo" value={post.chapterNo || ""} />
            <input
              type="hidden"
              name="readingTime"
              value={readingTime || ""}
            />
            <input type="hidden" name="status" value={post.status} />
          </CardContent>
        </Card>

        <Separator className="bg-white/10" />

        <Card className="bg-background/70 border border-accent shadow-sm">
          <CardContent className="space-y-4 pt-6">
            <SectionsEditor
              sections={sections}
              onSectionsChange={setSections}
            />
          </CardContent>
        </Card>
      </form>
    </>
  );
}