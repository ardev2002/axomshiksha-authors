"use client";

import {
  useActionState,
  useEffect,
  useState,
  useRef,
  startTransition,
} from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Plus,
  FileText,
  Layers3,
  CheckCircle,
  BookOpen,
  Home,
  Rocket,
  Layout,
} from "lucide-react";
import { publishPost } from "@/utils/post/publish/action";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { MotionCard } from "@/components/custom/Motion";
import EnhancedInput from "@/components/custom/EnhancedInput";
import EnhancedTextArea from "@/components/custom/EnhancedTextArea";
import { Spinner } from "@/components/ui/spinner";
import ValidationErrorCard from "@/components/custom/ValidationErrorCard";
import FileUpload from "@/components/custom/FileUpload";
import BreadCrumb from "@/components/custom/BreadCrumb";
import { SavedPostResult } from "@/utils/helpers/saveToDB";
import { saveDraft } from "@/utils/post/draft/action";
import { cleanupOrphanedImages } from "@/utils/s3/cleanup";
import DraftPostDialog from "./DraftPostDialog";
import { Tables } from "@/utils/supabase/types";
import SectionsEditor from "../components/SectionsEditor";
import { CodeBlock, Section } from "../components/sectionTypes";
import { removeWhiteSpaces } from "@/utils/helpers/removeWhiteSpaces";
import { convertSectionsToMDXWithMeta } from "@/utils/helpers/mdx-convert";
import { SUBJECTS } from "@/utils/CONSTANT";

export default function AddPostPage() {
  const [topic, setTopic] = useState("");
  const [title, setTitle] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [desc, setDesc] = useState("");
  const [charLeft, setCharLeft] = useState(300);

  const [classValue, setClassValue] = useState("");
  const [subject, setSubject] = useState("");
  const [chapterNo, setChapterNo] = useState("");
  const [readingTime, setReadingTime] = useState("");

  const [sections, setSections] = useState<Section[]>([]);

  const [publishState, publish, isPublishing] = useActionState<
    SavedPostResult,
    FormData
  >(publishPost, { statusText: "not_submitted" });

  const [draftState, draft, isSavingDraft] = useActionState<
    SavedPostResult,
    FormData
  >(saveDraft, { statusText: "not_submitted" });

  const [draftPostConfirmation, setDraftPostConfirmation] = useState(false);
  const [draftPost, setDraftPost] = useState<
    Partial<Tables<"posts">> | null
  >(null);

  useEffect(() => {
    setCharLeft(300 - desc.length);
  }, [desc]);

  // track uploaded images for cleanup
  const uploadedImagesRef = useRef<Set<string>>(new Set());
  const isPostSavedRef = useRef(false);

  const addUploadedImage = (key: string) => {
    if (!isPostSavedRef.current) {
      uploadedImagesRef.current.add(key);
    }
  };

  const removeTrackedImage = (key: string) => {
    uploadedImagesRef.current.delete(key);
  };

  const cleanupOrphanedImagesClient = async () => {
    if (isPostSavedRef.current) return;

    const imagesToRemove = Array.from(uploadedImagesRef.current);
    if (imagesToRemove.length === 0) return;

    try {
      const result = await cleanupOrphanedImages(imagesToRemove);
      if (result.success) {
        uploadedImagesRef.current.clear();
      } else {
        console.error("Failed to cleanup orphaned images:", result.error);
      }
    } catch (error) {
      console.error("Failed to cleanup orphaned images:", error);
    }
  };

  useEffect(() => {
    const handleBeforeUnload = () => {
      cleanupOrphanedImagesClient();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      cleanupOrphanedImagesClient();
    };
  }, []);

  const allErrors =
    publishState?.fieldErrors
      ? Object.entries(publishState.fieldErrors).map(
          ([field, message]) => `${field}: ${message}`
        )
      : draftState?.fieldErrors
      ? Object.entries(draftState.fieldErrors).map(
          ([field, message]) => `${field}: ${message}`
        )
      : [];

  useEffect(() => {
    if (publishState?.successMsg) {
      toast.success("Success", {
        description: publishState.successMsg,
        icon: <CheckCircle />,
      });
    } else if (draftState?.successMsg) {
      toast.success("Success", {
        description: draftState.successMsg,
        icon: <CheckCircle />,
      });
    } else if (
      publishState?.requiresConfirmation &&
      publishState?.draftPost
    ) {
      setDraftPost(publishState.draftPost);
      setDraftPostConfirmation(true);
    }
  }, [publishState, draftState]);

  const buildMDX = () =>
    convertSectionsToMDXWithMeta(sections, {
      title,
      description: desc,
      chapter_no: parseInt(chapterNo),
      class: classValue,
      reading_time: readingTime ? parseInt(readingTime) : null,
      subject,
      thumbnail,
    });

  const validateSections = () => {
    const hasContent = sections.some((section) =>
      removeWhiteSpaces(section.title) !== "" ||
      section.contentBlocks.some((block) => {
        if (block.type === "paragraph") {
          return removeWhiteSpaces(block.content) !== "";
        }
        if (block.type === "code") {
          const cb = block as CodeBlock;
          return (
            cb.content.trim() !== "" ||
            (cb.subtitle && removeWhiteSpaces(cb.subtitle) !== "")
          );
        }
        if (block.type === "list-group") {
          const lg = block as any;
          return (
            removeWhiteSpaces(lg.subtitle) !== "" ||
            lg.items.some((item: any) => removeWhiteSpaces(item.content) !== "")
          );
        }
        return false;
      })
    );

    if (!hasContent) {
      toast.error("Validation Error", {
        description:
          "Please add at least one section with content before submitting.",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = (
    formData: FormData,
    action: (formData: FormData) => void
  ) => {
    if (!validateSections()) return false;

    startTransition(() => {
      action(formData);
    });
    return true;
  };

  const handleFreshPublish = async () => {
    const formData = new FormData();
    formData.append("topic", topic);
    formData.append("title", title);
    formData.append("thumbnail", thumbnail);
    formData.append("desc", desc);
    formData.append("class", classValue);
    formData.append("subject", subject);
    formData.append("chapter_no", chapterNo);
    formData.append("reading_time", readingTime);
    formData.append("content", buildMDX());
    formData.append("confirmed", "true");

    handleSubmit(formData, publish);
  };

  const handleConfirmedPublish = async () => {
    const formData = new FormData();
    formData.append("topic", topic);
    formData.append("title", title);
    formData.append("thumbnail", thumbnail);
    formData.append("desc", desc);
    formData.append("class", classValue);
    formData.append("subject", subject);
    formData.append("chapter_no", chapterNo);
    formData.append("reading_time", readingTime);
    formData.append("content", buildMDX());

    handleSubmit(formData, publish);
  };

  useEffect(() => {
    if (publishState?.successMsg || draftState?.successMsg) {
      isPostSavedRef.current = true;
      uploadedImagesRef.current.clear();
    }
  }, [publishState, draftState]);

  return (
    <>
      <BreadCrumb
        paths={[
          { icon: <Home size={16} />, path: "/", title: "Home" },
          { icon: <Layout size={16} />, path: "/dashboard", title: "Dashboard" },
          {
            icon: <BookOpen size={16} />,
            path: "/dashboard/posts",
            title: "Posts",
          },
          {
            icon: <Plus size={16} />,
            path: "/dashboard/posts/new",
            title: "New Post",
          },
        ]}
      />

      <ValidationErrorCard errors={allErrors} />

      <DraftPostDialog
        draftPost={draftPost}
        setDraftPost={setDraftPost}
        draftPostConfirmation={draftPostConfirmation}
        setDraftPostConfirmation={setDraftPostConfirmation}
        handleFreshPublish={handleFreshPublish}
        handleConfirmedPublish={handleConfirmedPublish}
      />

      <form className="space-y-8">
        <div className="flex flex-wrap gap-3 items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-violet-500/10 text-violet-500 border border-violet-500/30">
              <FileText className="w-5 h-5" />
            </div>
            <h1 className="md:text-2xl font-semibold tracking-tight text-foreground">
              Create Post
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Button
              type="submit"
              disabled={isSavingDraft || isPublishing}
              onClick={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget.form!);
                formData.set("content", buildMDX());
                handleSubmit(formData, draft);
              }}
              variant="outline"
              className="hover:cursor-pointer"
            >
              <FileText size={16} />
              Save Draft
            </Button>

            <Button
              type="submit"
              disabled={isPublishing || isSavingDraft}
              onClick={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget.form!);
                formData.set("content", buildMDX());
                handleSubmit(formData, publish);
              }}
              className="hover:cursor-pointer bg-violet-600 hover:bg-violet-700 text-white transition flex items-center gap-2"
            >
              {isPublishing ? (
                <>
                  <Spinner /> Publishing...
                </>
              ) : (
                <>
                  <Rocket size={16} />
                </>
              )}
            </Button>
          </div>
        </div>

        <MotionCard
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.1 }}
          className="bg-background/70 border border-accent shadow-sm hover:shadow-md transition"
        >
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Layers3 className="w-4 h-4 text-violet-400" />
              Post Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <EnhancedInput
              type="text"
              name="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Topic slug"
              readOnly={isPublishing || isSavingDraft}
              tooltipContent="Use alphabets, numbers and hyphens only"
            />

            {publishState && (publishState as any).errTopicMsg && (
              <p className="text-red-500 text-sm">
                {(publishState as any).errTopicMsg}
              </p>
            )}

            <Input
              name="title"
              placeholder="Post Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              readOnly={isPublishing}
            />

            <EnhancedTextArea
              placeholder="Short Description (max 300 chars)"
              name="desc"
              value={desc}
              charLeft={charLeft}
              onChange={({ target }) => setDesc(target.value)}
              maxLength={300}
              className="text-pretty"
            />

            <FileUpload
              label="Post Thumbnail"
              imgType="thumbnail"
              currentImage={thumbnail}
              onUploaded={(url, key) => {
                setThumbnail(url);
                addUploadedImage(key);
              }}
              onRemoved={(key) => {
                setThumbnail("");
                removeTrackedImage(key);
              }}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                name="class"
                value={classValue}
                onValueChange={(value) => setClassValue(value)}
              >
                <SelectTrigger className="hover:cursor-pointer border-white/20 bg-background/60 w-full">
                  <SelectValue placeholder="Select Class" />
                </SelectTrigger>
                <SelectContent className="bg-background/95 border border-white/10">
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => (
                    <SelectItem value={String(num)} key={num}>
                      Class {num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                name="subject"
                value={subject}
                onValueChange={(value) => setSubject(value)}
              >
                <SelectTrigger className="hover:cursor-pointer border-white/20 bg-background/60 w-full">
                  <SelectValue placeholder="Select Subject" />
                </SelectTrigger>
                <SelectContent className="bg-background/95 border border-white/10">
                  {
                    Object.entries(SUBJECTS).map(([key, value]) => (
                      <SelectItem value={value} key={value}>
                        {key}
                      </SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>

              <Input
                type="number"
                name="chapter_no"
                placeholder="Chapter Number"
                value={chapterNo}
                onChange={(e) => setChapterNo(e.target.value)}
                min="1"
              />

              <Input
                type="number"
                name="reading_time"
                placeholder="Reading Time (minutes)"
                value={readingTime}
                onChange={(e) => setReadingTime(e.target.value)}
                min="1"
              />
            </div>
          </CardContent>
        </MotionCard>

        <Separator className="bg-white/10" />

        <SectionsEditor sections={sections} onSectionsChange={setSections} />

        {/* Hidden Inputs */}
        <input type="hidden" name="thumbnail" value={thumbnail} />
        <input type="hidden" name="class" value={classValue} />
        <input type="hidden" name="subject" value={subject} />
        <input type="hidden" name="chapter_no" value={chapterNo} />
        <input type="hidden" name="reading_time" value={readingTime} />
        <input type="hidden" name="content" value={buildMDX()} />
      </form>
    </>
  );
}
