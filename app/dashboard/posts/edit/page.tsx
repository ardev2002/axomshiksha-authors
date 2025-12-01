import { getSinglePost } from "@/utils/post/get/action";
import EditPostClient from "@/app/dashboard/posts/edit/EditPostClient";
import { Author } from "@/utils/types";
import { getSession } from "@/utils/helpers/getSession";
import type {
  Section,
  ContentBlock,
  ListGroupBlock,
  Paragraph,
  CodeBlock,
  ListGroupItem,
} from "@/app/dashboard/posts/components/sectionTypes";

export default async function EditPostPage({
  searchParams,
}: PageProps<"/dashboard/posts/edit">) {
  const slug = (await searchParams).slug as string;

  if (!slug) {
    return (
      <div className="text-center text-muted-foreground">Post not found</div>
    );
  }

  const { post, content, errMsg } = await getSinglePost({
    filters: { url: slug },
  });

  if (errMsg || !post) {
    return (
      <div className="text-red-500">Error: {errMsg || "Post not found"}</div>
    );
  }

  const session = await getSession();
  const authorId = session?.user?.email?.split("@")[0] as Author;

  const convertMDXToSections = (mdxContent: string): Section[] => {
    if (!mdxContent || !mdxContent.trim()) return [];

    const rawSections = mdxContent
      .split(/(?=^##\s)/gm)
      .map((part) => part.trim())
      .filter((part) => part !== "");

    const sections: Section[] = [];

    const genId = () => `${Date.now().toString()}-${Math.random().toString(16).slice(2)}`;

    for (const part of rawSections) {
      const lines = part.split("\n");
      let idx = 0;
      let title = "";

      if (lines[0]?.startsWith("## ")) {
        title = lines[0].substring(3).trim();
        idx = 1;
      }

      const contentBlocks: ContentBlock[] = [];
      let paragraphLines: string[] = [];

      const flushParagraph = () => {
        if (paragraphLines.length > 0) {
          const paragraph: Paragraph = {
            id: genId(),
            type: "paragraph",
            content: paragraphLines.join("\n").trim(),
          };
          if (paragraph.content) {
            contentBlocks.push(paragraph);
          }
          paragraphLines = [];
        }
      };

      const parseListGroup = (
        subtitle: string,
        startIndex: number
      ): { block: ListGroupBlock; nextIndex: number } => {
        const items: ListGroupItem[] = [];
        let i = startIndex;
        while (i < lines.length) {
          const t = lines[i].trim();
          if (!t || !t.startsWith("- ")) break;
          items.push({
            id: genId(),
            content: t.substring(2).trim(),
          });
          i++;
        }
        const listGroup: ListGroupBlock = {
          id: genId(),
          type: "list-group",
          subtitle,
          items,
        };
        return { block: listGroup, nextIndex: i };
      };

      const parseCodeBlock = (
        subtitle: string | undefined,
        fenceLine: string,
        startIndex: number
      ): { block: CodeBlock; nextIndex: number } => {
        const lang = fenceLine.substring(3).trim() || undefined;
        const codeLines: string[] = [];
        let i = startIndex;
        while (i < lines.length && !lines[i].trim().startsWith("```")) {
          codeLines.push(lines[i]);
          i++;
        }
        if (i < lines.length && lines[i].trim().startsWith("```")) {
          i++;
        }

        const codeBlock: CodeBlock = {
          id: genId(),
          type: "code",
          content: codeLines.join("\n"),
          subtitle,
          language: lang,
        };
        return { block: codeBlock, nextIndex: i };
      };

      while (idx < lines.length) {
        const rawLine = lines[idx];
        const line = rawLine.trim();

        if (!line) {
          flushParagraph();
          idx++;
          continue;
        }

        if (line.startsWith("### ")) {
          const subtitle = line.substring(4).trim();
          let look = idx + 1;
          while (look < lines.length && !lines[look].trim()) look++;
          if (look < lines.length) {
            const nextTrimmed = lines[look].trim();
            if (nextTrimmed.startsWith("- ")) {
              flushParagraph();
              const { block, nextIndex } = parseListGroup(subtitle, look);
              contentBlocks.push(block);
              idx = nextIndex;
              continue;
            }
            if (nextTrimmed.startsWith("```")) {
              flushParagraph();
              const { block, nextIndex } = parseCodeBlock(
                subtitle,
                nextTrimmed,
                look + 1
              );
              contentBlocks.push(block);
              idx = nextIndex;
              continue;
            }
          }
          // treat as paragraph text if not followed by list/code
          paragraphLines.push(line);
          idx++;
          continue;
        }

        if (line.startsWith("```")) {
          flushParagraph();
          const { block, nextIndex } = parseCodeBlock(undefined, line, idx + 1);
          contentBlocks.push(block);
          idx = nextIndex;
          continue;
        }

        if (line.startsWith("- ")) {
          flushParagraph();
          const { block, nextIndex } = parseListGroup("", idx);
          contentBlocks.push(block);
          idx = nextIndex;
          continue;
        }

        // normal paragraph
        paragraphLines.push(rawLine);
        idx++;
      }

      flushParagraph();

      if (title.trim() || contentBlocks.length > 0) {
        sections.push({
          id: genId(),
          title: title.trim(),
          contentBlocks,
        } as Section);
      }
    }

    return sections;
  };

  const sections = convertMDXToSections(content || "");

  return (
    <EditPostClient post={post} sections={sections} authorId={authorId} />
  );
}
