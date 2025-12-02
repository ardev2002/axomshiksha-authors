// utils/helpers/mdx-convert.ts
import {
  Section,
  ContentBlock,
  ListGroupBlock,
  Paragraph,
  CodeBlock,
  ListGroupItem,
} from "@/app/dashboard/posts/components/sectionTypes";
import { removeWhiteSpaces } from "@/utils/helpers/removeWhiteSpaces";

function convertSectionsBodyToMDX(sections: Section[]): string {
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
            .filter((item) => removeWhiteSpaces(item.content))
            .map((item) => `- ${removeWhiteSpaces(item.content)}`);
          if (listItems.length > 0) {
            contentBlocksMDX.push(listItems.join("\n"));
          }
        } else if (block.type === "code") {
          const cb = block as CodeBlock;
          if (cb.subtitle && removeWhiteSpaces(cb.subtitle)) {
            contentBlocksMDX.push(`### ${removeWhiteSpaces(cb.subtitle)}`);
          }
          if (cb.content && cb.content.trim()) {
            const language = cb.language ? cb.language : "";
            contentBlocksMDX.push(
              `\`\`\`${language}\n${cb.content}\n\`\`\``
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
}

function escapeYamlString(value: string): string {
  return value.replace(/"/g, '\\"');
}

export interface PostMetaForMDX {
  title: string;
  description: string;
  thumbnail: string;
  reading_time: number | null;
  class: string | null;
  subject: string | null;
  chapter_no: number | null;
}

/**
 * Build full MDX: front matter + body (from sections).
 * Front matter is ALWAYS overwritten (M1 strategy).
 */
export function convertSectionsToMDXWithMeta(
  sections: Section[],
  meta: PostMetaForMDX
): string {
  const lines: string[] = [];

  lines.push("---");
  lines.push(`title: "${escapeYamlString(meta.title || "")}"`);
  lines.push(
    `description: "${escapeYamlString(meta.description || "")}"`
  );
  if (meta.class) lines.push(`class: "${escapeYamlString(meta.class || "")}"`);
  if (meta.subject) lines.push(`subject: "${escapeYamlString(meta.subject || "")}"`);
  if (meta.chapter_no) lines.push(`chapter_no: ${meta.chapter_no || ""}`);
  
  if (meta.thumbnail) lines.push(`thumbnail: "${escapeYamlString(meta.thumbnail)}"`);
  if (meta.reading_time != null && !Number.isNaN(meta.reading_time)) {
    lines.push(`reading_time: ${meta.reading_time}`);
  }
  lines.push("---");
  lines.push("");

  const body = convertSectionsBodyToMDX(sections);
  lines.push(body);

  return lines.join("\n");
}

/**
 * Strip YAML front matter from MDX and return only body content.
 */
function stripFrontMatter(mdx: string): string {
  const lines = mdx.split("\n");
  if (lines[0]?.trim() !== "---") return mdx;

  let endIndex = -1;
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === "---") {
      endIndex = i;
      break;
    }
  }
  if (endIndex === -1) return mdx;

  return lines.slice(endIndex + 1).join("\n").trimStart();
}

/**
 * MDX → Sections (ignores front matter, parses only body).
 */
export function convertMDXToSections(mdxContent: string): Section[] {
  if (!mdxContent || !mdxContent.trim()) return [];

  const body = stripFrontMatter(mdxContent);

  const rawSections = body
    .split(/(?=^##\s)/gm)
    .map((part) => part.trim())
    .filter((part) => part !== "");

  const sections: Section[] = [];

  const genId = () =>
    `${Date.now().toString()}-${Math.random().toString(16).slice(2)}`;

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
}
