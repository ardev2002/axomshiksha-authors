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
  FilePenLine,
  FileText,
  Home,
  Layers3,
  Layout,
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
} from "@/components/ui/select";
import { editPost } from "@/utils/post/edit/action";
import { Tables } from "@/utils/supabase/types";
import SectionsEditor from "../components/SectionsEditor";
import type { Section, ListGroupBlock, CodeBlock } from "../components/sectionTypes";
import { removeWhiteSpaces } from "@/utils/helpers/removeWhiteSpaces";

export default function EditPostClient({
  post,
  sections: initialSections,
  authorId,
}: {
  post: Tables<"posts">;
  sections?: Section[];
  authorId: string | undefined;
}) {
  const [url] = useState(post.url);
  const [title, setTitle] = useState(post.title);
  const [thumbnail, setThumbnail] = useState(post.thumbnail);
  const [desc, setDesc] = useState(post.desc);
  const [classValue, setClassValue] = useState(post.class || "");
  const [subject, setSubject] = useState(post.subject || "");
  const [chapterNo, setChapterNo] = useState(
    post.chapter_no?.toString() || ""
  );
  const [readingTime, setReadingTime] = useState(
    post.reading_time?.toString() || ""
  );
  const [sections, setSections] = useState<Section[]>(initialSections || []);
  const [charLeft, setCharLeft] = useState(150 - post.desc.length);

  const [editState, editAction, isEditing] = useActionState(editPost, {});

  useEffect(() => {
    setCharLeft(150 - desc.length);
  }, [desc]);

  // Convert sections → MDX
  const convertSectionsToMDX = (sections: Section[]) => {
    const validSections = sections.filter((section) =>
      removeWhiteSpaces(section.title) !== "" ||
      section.contentBlocks.some((block) => {
        if (block.type === "paragraph") {
          return removeWhiteSpaces(block.content) !== "";
        }
        if (block.type === "code") {
          const cb = block as CodeBlock;
          return (
            removeWhiteSpaces(cb.content) !== "" ||
            (cb.subtitle && removeWhiteSpaces(cb.subtitle) !== "")
          );
        }
        if (block.type === "list-group") {
          const lg = block as ListGroupBlock;
          return (
            removeWhiteSpaces(lg.subtitle) !== "" ||
            lg.items.some((item) => removeWhiteSpaces(item.content) !== "")
          );
        }
        return false;
      })
    );

    return validSections
      .map((section) => {
        const title = removeWhiteSpaces(section.title);
        const contentBlocksMDX: string[] = [];

        section.contentBlocks.forEach((block) => {
          if (block.type === "paragraph") {
            if (removeWhiteSpaces(block.content)) {
              contentBlocksMDX.push(removeWhiteSpaces(block.content));
            }
          } else if (block.type === "list-group") {
            const lg = block as ListGroupBlock;
            if (lg.subtitle && removeWhiteSpaces(lg.subtitle)) {
              contentBlocksMDX.push(`### ${removeWhiteSpaces(lg.subtitle)}`);
            }
            const listItems = lg.items
              .filter((item) => removeWhiteSpaces(item.content) !== "")
              .map((item) => `- ${removeWhiteSpaces(item.content)}`);
            if (listItems.length > 0) {
              contentBlocksMDX.push(listItems.join("\n"));
            }
          } else if (block.type === "code") {
            const cb = block as CodeBlock;
            if (cb.subtitle && removeWhiteSpaces(cb.subtitle)) {
              contentBlocksMDX.push(`### ${removeWhiteSpaces(cb.subtitle)}`);
            }
            if (removeWhiteSpaces(cb.content)) {
              const language = cb.language ? cb.language : "";
              contentBlocksMDX.push(
                `\`\`\`${language}\n${cb.content.trim()}\n\`\`\``
              );
            }
          }
        });

        const contentMDX = contentBlocksMDX.join("\n\n");

        if (!title && !contentMDX) return "";
        if (!title) return contentMDX;
        if (!contentMDX) return `## ${title}`;

        return `## ${title}\n\n${contentMDX}`;
      })
      .filter((section) => section !== "")
      .join("\n\n");
  };

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
            removeWhiteSpaces(cb.content) !== "" ||
            (cb.subtitle && removeWhiteSpaces(cb.subtitle) !== "")
          );
        }
        if (block.type === "list-group") {
          const lg = block as ListGroupBlock;
          return (
            removeWhiteSpaces(lg.subtitle) !== "" ||
            lg.items.some((item) => removeWhiteSpaces(item.content) !== "")
          );
        }
        return false;
      })
    );

    if (!hasContent) {
      toast.error("Validation Error", {
        description:
          "Please add at least one section with content before updating.",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateSections()) return;

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    formData.set("content", convertSectionsToMDX(sections));

    startTransition(() => {
      editAction(formData);
    });
  };

  useEffect(() => {
    if (editState.successMsg) {
      toast.success("Success", {
        description: editState.successMsg,
        icon: <CheckCircle />,
      });
    }

    if (editState.errorMsg) {
      toast.error("Error", {
        description: editState.errorMsg,
      });
    }
  }, [editState]);

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
          { icon: <Edit size={16} />, path: "#", title: "Edit Post" },
        ]}
      />

      <ValidationErrorCard
        errors={editState.errorMsg ? [editState.errorMsg] : []}
      />

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
                <>
                  Update
                </>
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
              tooltipContent="Enter the post URL"
              type="text"
              name="url"
              value={url}
              onChange={() => {}}
              inputGroupText="https://axomshiksha.com/"
              className="-ml-2"
              readOnly
            />

            <Input
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              required
            />

            <EnhancedTextArea
              name="desc"
              value={desc}
              charLeft={charLeft}
              maxLength={150}
              onChange={(e) => {
                setDesc(e.target.value);
                setCharLeft(150 - e.target.value.length);
              }}
            />

            <FileUpload
              label="Post Thumbnail"
              imgType="thumbnail"
              currentImage={thumbnail}
              onUploaded={(url) => setThumbnail(url)}
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
                  {[
                    "Assamese",
                    "English",
                    "Mathematics",
                    "S. Science",
                    "Science",
                    "Hindi",
                    "Adv. Maths",
                    "Sanskrit",
                    "Computer Science & Application",
                    "Biology",
                    "Physics",
                    "Chemistry",
                    "History",
                    "Geography",
                    "Logic & Philosophy",
                    "Political Science",
                    "Statistics",
                    "Others",
                  ].map((subj) => (
                    <SelectItem value={subj} key={subj}>
                      {subj}
                    </SelectItem>
                  ))}
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

            <input type="hidden" name="authorId" value={authorId || ""} />
            <input
              type="hidden"
              name="content"
              value={convertSectionsToMDX(sections)}
            />
            <input type="hidden" name="thumbnail" value={thumbnail} />
            <input type="hidden" name="class" value={classValue} />
            <input type="hidden" name="subject" value={subject} />
            <input type="hidden" name="chapter_no" value={chapterNo} />
            <input type="hidden" name="reading_time" value={readingTime} />
            <input
              type="hidden"
              name="status"
              value={post.status || "draft"}
            />
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
