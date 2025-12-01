// app/dashboard/posts/sectionsTypes.ts

export interface Paragraph {
  id: string;
  type: "paragraph";
  content: string;
}

export interface CodeBlock {
  id: string;
  type: "code";
  content: string;
  subtitle?: string;
  language?: string;
}

export interface ListGroupItem {
  id: string;
  content: string;
}

export interface ListGroupBlock {
  id: string;
  type: "list-group";
  subtitle: string;
  items: ListGroupItem[];
}

export type ContentBlock = Paragraph | CodeBlock | ListGroupBlock;

export interface Section {
  id: string;
  title: string;
  contentBlocks: ContentBlock[];
}
