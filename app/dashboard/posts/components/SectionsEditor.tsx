"use client";

import { useState, SyntheticEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Plus,
  Trash2,
  List,
  Pilcrow,
  Code,
  Link2,
  Keyboard,
  ScissorsIcon,
} from "lucide-react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Section,
  ContentBlock,
  ListGroupBlock,
} from "@/app/dashboard/posts/components/sectionTypes";
import {
  MotionButton,
  MotionCardHeader,
  MotionCardTitle,
  MotionGripVertical,
  MotionInput,
  MotionMoveDown,
  MotionMoveUp,
} from "@/components/custom/Motion";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupTextarea,
} from "@/components/ui/input-group";

interface SectionsEditorProps {
  sections: Section[];
  onSectionsChange: (sections: Section[]) => void;
}

// ----- Block factories -----
const createParagraph = (): ContentBlock => ({
  id: crypto.randomUUID(),
  type: "paragraph",
  content: "",
});

const createCodeBlock = (): ContentBlock => ({
  id: crypto.randomUUID(),
  type: "code",
  content: "",
  subtitle: "",
  language: "javascript",
});

const createListGroup = (): ListGroupBlock => ({
  id: crypto.randomUUID(),
  type: "list-group",
  subtitle: "",
  items: [
    {
      id: crypto.randomUUID(),
      content: "",
    },
  ],
});

// ----- Active field tracking (for caret position) -----
type ActiveField =
  | {
      sectionId: string;
      blockId: string;
      type: "paragraph";
      itemId?: undefined;
      selectionStart: number;
      selectionEnd: number;
    }
  | {
    sectionId: string;
    blockId: string;
    type: "list-item";
    itemId: string;
    selectionStart: number;
    selectionEnd: number;
  };

// Insert snippet at a given position (ignores current selection content)
function insertAtPosition(
  text: string,
  position: number | null | undefined,
  snippet: string
): string {
  const safePos =
    position == null
      ? text.length
      : Math.min(Math.max(position, 0), text.length);
  return text.slice(0, safePos) + snippet + text.slice(safePos);
}

export default function SectionsEditor({
  sections,
  onSectionsChange,
}: SectionsEditorProps) {
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    sectionId: string | null;
    blockId?: string;
  }>({
    open: false,
    sectionId: null,
  });

  const [activeField, setActiveField] = useState<ActiveField | null>(null);

  const [linkDialog, setLinkDialog] = useState<{
    open: boolean;
    sectionId: string | null;
    blockId: string | null;
    itemId?: string;
    text: string;
    url: string;
  }>({
    open: false,
    sectionId: null,
    blockId: null,
    itemId: undefined,
    text: "",
    url: "",
  });

  const [kbdDialog, setKbdDialog] = useState<{
    open: boolean;
    sectionId: string | null;
    blockId: string | null;
    itemId?: string;
    keys: string;
  }>({
    open: false,
    sectionId: null,
    blockId: null,
    itemId: undefined,
    keys: "",
  });

  // ----- Delete dialog -----
  const openDeleteDialog = (sectionId: string, blockId?: string) => {
    setDeleteDialog({ open: true, sectionId, blockId });
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({ open: false, sectionId: null, blockId: undefined });
  };

  const confirmDelete = () => {
    if (deleteDialog.sectionId && deleteDialog.blockId) {
      // delete block
      const updated = sections.map((s) =>
        s.id === deleteDialog.sectionId
          ? {
              ...s,
              contentBlocks: s.contentBlocks.filter(
                (b) => b.id !== deleteDialog.blockId
              ),
            }
          : s
      );
      onSectionsChange(updated);
    } else if (deleteDialog.sectionId) {
      const updated = sections.filter((s) => s.id !== deleteDialog.sectionId);
      onSectionsChange(updated);
    }
    closeDeleteDialog();
  };

  // ----- Sections CRUD -----
  const addSection = () => {
    const newSection: Section = {
      id: crypto.randomUUID(),
      title: "",
      contentBlocks: [],
    };
    onSectionsChange([...sections, newSection]);
  };

  const updateSectionTitle = (id: string, title: string) => {
    const updated = sections.map((s) => (s.id === id ? { ...s, title } : s));
    onSectionsChange(updated);
  };

  const moveSection = (index: number, direction: "up" | "down") => {
    const newSections = [...sections];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newSections.length) return;
    [newSections[index], newSections[targetIndex]] = [
      newSections[targetIndex],
      newSections[index],
    ];
    onSectionsChange(newSections);
  };

  // ----- Blocks CRUD -----
  const addContentBlock = (
    sectionId: string,
    type: "paragraph" | "list-group" | "code"
  ) => {
    const newBlock: ContentBlock =
      type === "paragraph"
        ? createParagraph()
        : type === "code"
        ? createCodeBlock()
        : createListGroup();

    const updated = sections.map((s) =>
      s.id === sectionId
        ? {
            ...s,
            contentBlocks: [...s.contentBlocks, newBlock],
          }
        : s
    );
    onSectionsChange(updated);
  };

  const moveContentBlock = (
    sectionId: string,
    blockIndex: number,
    direction: "up" | "down"
  ) => {
    const section = sections.find((s) => s.id === sectionId);
    if (!section) return;

    const blocks = [...section.contentBlocks];
    const targetIndex = direction === "up" ? blockIndex - 1 : blockIndex + 1;
    if (targetIndex < 0 || targetIndex >= blocks.length) return;

    [blocks[blockIndex], blocks[targetIndex]] = [
      blocks[targetIndex],
      blocks[blockIndex],
    ];

    const updated = sections.map((s) =>
      s.id === sectionId ? { ...s, contentBlocks: blocks } : s
    );
    onSectionsChange(updated);
  };

  const updateBlockField = (
    sectionId: string,
    blockId: string,
    field: "content" | "subtitle" | "language",
    value: string
  ) => {
    const updated = sections.map((s) =>
      s.id === sectionId
        ? {
            ...s,
            contentBlocks: s.contentBlocks.map((b) =>
              b.id === blockId
                ? {
                    ...b,
                    [field]: value,
                  }
                : b
            ),
          }
        : s
    );
    onSectionsChange(updated);
  };

  // ----- List items CRUD -----
  const removeListItem = (
    sectionId: string,
    blockId: string,
    itemId: string
  ) => {
    const updated = sections.map((s) =>
      s.id === sectionId
        ? {
            ...s,
            contentBlocks: s.contentBlocks.map((b) =>
              b.id === blockId && b.type === "list-group"
                ? {
                    ...b,
                    items: b.items.filter((item) => item.id !== itemId),
                  }
                : b
            ),
          }
        : s
    );
    onSectionsChange(updated);
  };

  const addListItemAfter = (
    sectionId: string,
    blockId: string,
    afterId?: string
  ) => {
    const updated = sections.map((s) =>
      s.id === sectionId
        ? {
            ...s,
            contentBlocks: s.contentBlocks.map((b) => {
              if (b.id === blockId && b.type === "list-group") {
                const newItem = {
                  id: crypto.randomUUID(),
                  content: "",
                };
                if (!afterId) {
                  return { ...b, items: [...b.items, newItem] };
                }
                const idx = b.items.findIndex((it) => it.id === afterId);
                if (idx === -1) {
                  return { ...b, items: [...b.items, newItem] };
                }
                return {
                  ...b,
                  items: [
                    ...b.items.slice(0, idx + 1),
                    newItem,
                    ...b.items.slice(idx + 1),
                  ],
                };
              }
              return b;
            }),
          }
        : s
    );
    onSectionsChange(updated);
  };

  const updateListItemContent = (
    sectionId: string,
    blockId: string,
    itemId: string,
    value: string
  ) => {
    const updated = sections.map((s) =>
      s.id === sectionId
        ? {
            ...s,
            contentBlocks: s.contentBlocks.map((b) =>
              b.id === blockId && b.type === "list-group"
                ? {
                    ...b,
                    items: b.items.map((item) =>
                      item.id === itemId ? { ...item, content: value } : item
                    ),
                  }
                : b
            ),
          }
        : s
    );
    onSectionsChange(updated);
  };

  // ----- Caret tracking -----
  const handleParagraphSelect =
    (sectionId: string, blockId: string) =>
    (e: SyntheticEvent<HTMLTextAreaElement>) => {
      const target = e.currentTarget;
      setActiveField({
        sectionId,
        blockId,
        type: "paragraph",
        selectionStart: target.selectionStart ?? 0,
        selectionEnd: target.selectionEnd ?? 0,
      });
    };

  const handleListItemSelect =
    (sectionId: string, blockId: string, itemId: string) =>
    (e: SyntheticEvent<HTMLInputElement>) => {
      const target = e.currentTarget;
      setActiveField({
        sectionId,
        blockId,
        itemId,
        type: "list-item",
        selectionStart: target.selectionStart ?? 0,
        selectionEnd: target.selectionEnd ?? 0,
      });
    };

  // ----- Link dialog -----
  const openLinkDialog = (
    sectionId: string,
    blockId: string,
    itemId?: string
  ) => {
    setLinkDialog({
      open: true,
      sectionId,
      blockId,
      itemId,
      text: "",
      url: "",
    });
  };

  const closeLinkDialog = () => {
    setLinkDialog((prev) => ({
      ...prev,
      open: false,
      text: "",
      url: "",
    }));
  };

  const confirmAddLink = () => {
    if (!linkDialog.sectionId || !linkDialog.blockId) {
      closeLinkDialog();
      return;
    }

    const snippet = `[${linkDialog.text || linkDialog.url || "link"}](${
      linkDialog.url || "#"
    })`;

    const fieldMatchesActive =
      activeField &&
      activeField.sectionId === linkDialog.sectionId &&
      activeField.blockId === linkDialog.blockId &&
      (!linkDialog.itemId
        ? activeField.type === "paragraph"
        : activeField.type === "list-item" &&
          activeField.itemId === linkDialog.itemId);

    const position = fieldMatchesActive ? activeField!.selectionStart : null;

    if (!linkDialog.itemId) {
      // Paragraph
      const section = sections.find((s) => s.id === linkDialog.sectionId);
      const block = section?.contentBlocks.find(
        (b) => b.id === linkDialog.blockId
      );
      if (!block || block.type !== "paragraph") {
        closeLinkDialog();
        return;
      }
      const newContent = insertAtPosition(
        block.content ?? "",
        position,
        snippet
      );
      updateBlockField(
        linkDialog.sectionId,
        linkDialog.blockId,
        "content",
        newContent
      );
    } else {
      // List item
      const section = sections.find((s) => s.id === linkDialog.sectionId);
      const block = section?.contentBlocks.find(
        (b) => b.id === linkDialog.blockId && b.type === "list-group"
      ) as ListGroupBlock | undefined;
      if (!block) {
        closeLinkDialog();
        return;
      }
      const item = block.items.find((it) => it.id === linkDialog.itemId);
      if (!item) {
        closeLinkDialog();
        return;
      }
      const newContent = insertAtPosition(
        item.content ?? "",
        position,
        snippet
      );
      updateListItemContent(
        linkDialog.sectionId,
        linkDialog.blockId,
        linkDialog.itemId,
        newContent
      );
    }

    closeLinkDialog();
  };

  // ----- KBD dialog -----
  const openKbdDialog = (
    sectionId: string,
    blockId: string,
    itemId?: string
  ) => {
    setKbdDialog({
      open: true,
      sectionId,
      blockId,
      itemId,
      keys: "",
    });
  };

  const closeKbdDialog = () => {
    setKbdDialog((prev) => ({
      ...prev,
      open: false,
      keys: "",
    }));
  };

  const confirmAddKbd = () => {
    if (!kbdDialog.sectionId || !kbdDialog.blockId) {
      closeKbdDialog();
      return;
    }

    const snippet = `<kbd>${kbdDialog.keys || "Key"}</kbd>`;

    const fieldMatchesActive =
      activeField &&
      activeField.sectionId === kbdDialog.sectionId &&
      activeField.blockId === kbdDialog.blockId &&
      (!kbdDialog.itemId
        ? activeField.type === "paragraph"
        : activeField.type === "list-item" &&
          activeField.itemId === kbdDialog.itemId);

    const position = fieldMatchesActive ? activeField!.selectionStart : null;

    if (!kbdDialog.itemId) {
      // Paragraph
      const section = sections.find((s) => s.id === kbdDialog.sectionId);
      const block = section?.contentBlocks.find(
        (b) => b.id === kbdDialog.blockId
      );
      if (!block || block.type !== "paragraph") {
        closeKbdDialog();
        return;
      }
      const newContent = insertAtPosition(
        block.content ?? "",
        position,
        snippet
      );
      updateBlockField(
        kbdDialog.sectionId,
        kbdDialog.blockId,
        "content",
        newContent
      );
    } else {
      // List item
      const section = sections.find((s) => s.id === kbdDialog.sectionId);
      const block = section?.contentBlocks.find(
        (b) => b.id === kbdDialog.blockId && b.type === "list-group"
      ) as ListGroupBlock | undefined;
      if (!block) {
        closeKbdDialog();
        return;
      }
      const item = block.items.find((it) => it.id === kbdDialog.itemId);
      if (!item) {
        closeKbdDialog();
        return;
      }
      const newContent = insertAtPosition(
        item.content ?? "",
        position,
        snippet
      );
      updateListItemContent(
        kbdDialog.sectionId,
        kbdDialog.blockId,
        kbdDialog.itemId,
        newContent
      );
    }

    closeKbdDialog();
  };

  return (
    <div className="space-y-6">
      <LayoutGroup id="sections">
        <AnimatePresence>
          {sections.map((section, sectionIndex) => (
            <motion.div
              layout
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="bg-background/70 border border-white/10 shadow-sm">
                <MotionCardHeader layout className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MotionGripVertical
                        layout
                        className="w-4 h-4 text-muted-foreground"
                      />
                      <MotionCardTitle layout className="text-base font-medium">
                        Section {sectionIndex + 1}
                      </MotionCardTitle>
                    </div>
                    <div className="flex items-center gap-1">
                      <MotionButton
                        layout
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => moveSection(sectionIndex, "up")}
                        disabled={sectionIndex === 0}
                        className="h-8 w-8 p-0 hover:cursor-pointer"
                      >
                        <MotionMoveUp layout size={16} />
                      </MotionButton>
                      <MotionButton
                        layout
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          moveSection(sectionIndex, "down")
                        }
                        disabled={sectionIndex === sections.length - 1}
                        className="h-8 w-8 p-0 hover:cursor-pointer"
                      >
                        <MotionMoveDown layout size={16} />
                      </MotionButton>
                      <MotionButton
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => openDeleteDialog(section.id)}
                        className="h-8 w-8 p-0 hover:cursor-pointer text-red-500 hover:text-red-600 hover:bg-red-500/10"
                      >
                        <Trash2 size={16} />
                      </MotionButton>
                    </div>
                  </div>
                </MotionCardHeader>
                <CardContent className="space-y-4">
                  <MotionInput
                    layout
                    placeholder="Section title (e.g., Introduction, Summary)"
                    value={section.title}
                    onChange={(e) =>
                      updateSectionTitle(section.id, e.target.value)
                    }
                  />

                  <div className="space-y-3">
                    <AnimatePresence>
                      {section.contentBlocks.map((block, blockIndex) => (
                        <motion.div
                          layout
                          key={block.id}
                          className="flex gap-2"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          {block.type !== "list-group" && (
                            <motion.div
                              layout="position"
                              className="flex flex-col items-center gap-1 pt-2"
                            >
                              <MotionButton
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  moveContentBlock(section.id, blockIndex, "up")
                                }
                                disabled={blockIndex === 0}
                                className="h-6 w-6 p-0 hover:cursor-pointer"
                              >
                                <MotionMoveUp size={12} />
                              </MotionButton>

                              <MotionButton
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  moveContentBlock(
                                    section.id,
                                    blockIndex,
                                    "down"
                                  )
                                }
                                disabled={
                                  blockIndex ===
                                  section.contentBlocks.length - 1
                                }
                                className="h-6 w-6 p-0 hover:cursor-pointer"
                              >
                                <MotionMoveDown size={12} />
                              </MotionButton>
                            </motion.div>
                          )}

                          <div className="flex-1 flex flex-col gap-2">
                            {/* Paragraph block */}
                            <AnimatePresence>
                              {block.type === "paragraph" && (
                                <motion.div
                                  layout
                                  id={block.id}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -20 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <InputGroup>
                                    <InputGroupTextarea
                                      placeholder="Write a paragraph..."
                                      value={block.content}
                                      onChange={(e) =>
                                        updateBlockField(
                                          section.id,
                                          block.id,
                                          "content",
                                          e.target.value
                                        )
                                      }
                                      onSelect={handleParagraphSelect(
                                        section.id,
                                        block.id
                                      )}
                                    />
                                    <InputGroupAddon align="block-end">
                                      <InputGroupButton
                                        type="button"
                                        size="icon-xs"
                                        className="rounded-full hover:cursor-pointer"
                                        onClick={() =>
                                          openLinkDialog(section.id, block.id)
                                        }
                                      >
                                        <Link2 className="w-3 h-3" />
                                      </InputGroupButton>
                                      <InputGroupButton
                                        type="button"
                                        size="icon-xs"
                                        className="rounded-full hover:cursor-pointer"
                                        onClick={() =>
                                          openKbdDialog(section.id, block.id)
                                        }
                                      >
                                        <Keyboard className="w-3 h-3" />
                                      </InputGroupButton>
                                    </InputGroupAddon>
                                  </InputGroup>
                                </motion.div>
                              )}
                            </AnimatePresence>

                            {/* List-group */}
                            <AnimatePresence>
                              {block.type === "list-group" && (
                                <motion.div
                                  layout="position"
                                  key={block.id}
                                  className="flex gap-2"
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -20 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  {/* Left: Move controls */}
                                  <motion.div
                                    layout="position"
                                    className="flex flex-col items-center gap-1 pt-2"
                                  >
                                    <MotionButton
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        moveContentBlock(
                                          section.id,
                                          blockIndex,
                                          "up"
                                        )
                                      }
                                      disabled={blockIndex === 0}
                                      className="h-6 w-6 p-0 hover:cursor-pointer"
                                    >
                                      <MotionMoveUp size={12} />
                                    </MotionButton>

                                    <MotionButton
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        moveContentBlock(
                                          section.id,
                                          blockIndex,
                                          "down"
                                        )
                                      }
                                      disabled={
                                        blockIndex ===
                                        section.contentBlocks.length - 1
                                      }
                                      className="h-6 w-6 p-0 hover:cursor-pointer"
                                    >
                                      <MotionMoveDown size={12} />
                                    </MotionButton>
                                  </motion.div>

                                  {/* Middle: List card */}
                                  <motion.div
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.2 }}
                                    className="border border-border rounded-lg p-4 space-y-2 flex-1"
                                  >
                                    <MotionInput
                                      layout="position"
                                      placeholder="List subtitle (e.g., Benefits)"
                                      value={block.subtitle}
                                      onChange={(e) =>
                                        updateBlockField(
                                          section.id,
                                          block.id,
                                          "subtitle",
                                          e.target.value
                                        )
                                      }
                                    />

                                    {block.items.map((item, index) => (
                                      <motion.div
                                        layout="position"
                                        transition={{
                                          duration: 0.1,
                                          type: "tween",
                                        }}
                                        key={item.id}
                                        className="flex gap-2 mt-2"
                                      >
                                        <InputGroup className="flex-1">
                                          <InputGroupInput
                                            placeholder={`List item ${
                                              index + 1
                                            }`}
                                            value={item.content}
                                            onChange={(e) =>
                                              updateListItemContent(
                                                section.id,
                                                block.id,
                                                item.id,
                                                e.target.value
                                              )
                                            }
                                            onSelect={handleListItemSelect(
                                              section.id,
                                              block.id,
                                              item.id
                                            )}
                                          />
                                          <InputGroupAddon align="inline-end">
                                            <InputGroupButton
                                              type="button"
                                              size="icon-xs"
                                              className="rounded-full hover:cursor-pointer"
                                              onClick={() =>
                                                openLinkDialog(
                                                  section.id,
                                                  block.id,
                                                  item.id
                                                )
                                              }
                                            >
                                              <Link2 className="w-3 h-3" />
                                            </InputGroupButton>
                                            <InputGroupButton
                                              type="button"
                                              size="icon-xs"
                                              className="rounded-full hover:cursor-pointer"
                                              onClick={() =>
                                                openKbdDialog(
                                                  section.id,
                                                  block.id,
                                                  item.id
                                                )
                                              }
                                            >
                                              <Keyboard className="w-3 h-3" />
                                            </InputGroupButton>
                                          </InputGroupAddon>
                                        </InputGroup>

                                        <MotionButton
                                          layout="position"
                                          type="button"
                                          variant="outline"
                                          size="sm"
                                          onClick={() =>
                                            addListItemAfter(
                                              section.id,
                                              block.id,
                                              item.id
                                            )
                                          }
                                          className="hover:cursor-pointer h-10 w-10 p-0"
                                        >
                                          <Plus size={16} />
                                        </MotionButton>

                                        <MotionButton
                                          layout="position"
                                          type="button"
                                          variant="ghost"
                                          size="sm"
                                          onClick={() =>
                                            removeListItem(
                                              section.id,
                                              block.id,
                                              item.id
                                            )
                                          }
                                          disabled={block.items.length === 1}
                                          className="hover:cursor-pointer h-10 w-10 p-0 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                                        >
                                          <Trash2 size={16} />
                                        </MotionButton>
                                      </motion.div>
                                    ))}
                                  </motion.div>

                                  {/* Right: Delete block button */}
                                  <MotionButton
                                    layout="position"
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      openDeleteDialog(section.id, block.id)
                                    }
                                    className="h-8 w-8 p-0 hover:cursor-pointer text-red-500 hover:text-red-600 hover:bg-red-500/10 self-start mt-1"
                                  >
                                    <Trash2 size={16} />
                                  </MotionButton>
                                </motion.div>
                              )}
                            </AnimatePresence>

                            {/* Code block */}
                            {block.type === "code" && (
                              <div className="border border-border rounded-lg p-4 space-y-2">
                                <Input
                                  placeholder="Code block subtitle (e.g., Example, JavaScript function)"
                                  value={block.subtitle || ""}
                                  onChange={(e) =>
                                    updateBlockField(
                                      section.id,
                                      block.id,
                                      "subtitle",
                                      e.target.value
                                    )
                                  }
                                />
                                <Select
                                  value={block.language || "javascript"}
                                  onValueChange={(value) =>
                                    updateBlockField(
                                      section.id,
                                      block.id,
                                      "language",
                                      value
                                    )
                                  }
                                >
                                  <SelectTrigger className="w-full hover:cursor-pointer">
                                    <SelectValue placeholder="Select Language" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="javascript">
                                      JavaScript
                                    </SelectItem>
                                    <SelectItem value="typescript">
                                      TypeScript
                                    </SelectItem>
                                    <SelectItem value="python">
                                      Python
                                    </SelectItem>
                                    <SelectItem value="java">Java</SelectItem>
                                    <SelectItem value="cpp">C++</SelectItem>
                                    <SelectItem value="csharp">C#</SelectItem>
                                    <SelectItem value="html">HTML</SelectItem>
                                    <SelectItem value="css">CSS</SelectItem>
                                    <SelectItem value="sql">SQL</SelectItem>
                                    <SelectItem value="bash">Bash</SelectItem>
                                    <SelectItem value="json">JSON</SelectItem>
                                    <SelectItem value="xml">XML</SelectItem>
                                    <SelectItem value="plaintext">
                                      Plaintext
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                                <Textarea
                                  placeholder="Enter your code..."
                                  value={block.content}
                                  onChange={(e) =>
                                    updateBlockField(
                                      section.id,
                                      block.id,
                                      "content",
                                      e.target.value
                                    )
                                  }
                                  className="font-mono text-sm min-h-[120px]"
                                />
                              </div>
                            )}
                          </div>

                          {block.type !== "list-group" && (
                            <MotionButton
                              layout
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                openDeleteDialog(section.id, block.id)
                              }
                              className="h-8 w-8 p-0 hover:cursor-pointer text-red-500 hover:text-red-600 hover:bg-red-500/10 self-start mt-1"
                            >
                              <Trash2 size={16} />
                            </MotionButton>
                          )}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2 justify-center">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addContentBlock(section.id, "paragraph")}
                      className="flex items-center gap-1 hover:cursor-pointer"
                    >
                      <Pilcrow size={14} />
                      Add Paragraph
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addContentBlock(section.id, "list-group")}
                      className="flex items-center gap-1 hover:cursor-pointer"
                    >
                      <List size={14} />
                      Add List
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addContentBlock(section.id, "code")}
                      className="flex items-center gap-1 hover:cursor-pointer"
                    >
                      <Code size={14} />
                      Add Code
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {sections.length === 0 && (
          <motion.div
            layout
            className="text-center py-8 border border-dashed border-white/20 rounded-lg bg-background/50"
          >
            <p className="text-muted-foreground">No sections added yet</p>
            <p className="text-sm text-muted-foreground/70 mt-1">
              Click &quot;Add Section&quot; to start organizing your content.
            </p>
            <Button
              type="button"
              onClick={addSection}
              className="mt-4 bg-violet-600 hover:bg-violet-700 text-white hover:cursor-pointer"
            >
              <Plus size={16} className="mr-2" />
              Add Your First Section
            </Button>
          </motion.div>
        )}

        {sections.length > 0 && (
          <motion.div layout className="flex justify-center pt-4">
            <Button
              type="button"
              onClick={addSection}
              className="bg-violet-600 hover:bg-violet-700 text-white flex items-center gap-2 hover:cursor-pointer"
            >
              <Plus size={16} />
              Add Another Section
            </Button>
          </motion.div>
        )}
      </LayoutGroup>

      {/* Link dialog */}
      <AlertDialog
        open={linkDialog.open}
        onOpenChange={(open) => {
          if (!open) closeLinkDialog();
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Add link</AlertDialogTitle>
            <AlertDialogDescription>
              Enter link text and URL to insert into the content.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-3 py-2">
            <Input
              placeholder="Link text"
              value={linkDialog.text}
              onChange={(e) =>
                setLinkDialog((prev) => ({ ...prev, text: e.target.value }))
              }
            />
            <Input
              placeholder="https://example.com"
              value={linkDialog.url}
              onChange={(e) =>
                setLinkDialog((prev) => ({ ...prev, url: e.target.value }))
              }
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel className="hover:cursor-pointer" onClick={closeLinkDialog}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction className="hover:cursor-pointer" onClick={confirmAddLink}>
              Add link
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* KBD dialog */}
      <AlertDialog
        open={kbdDialog.open}
        onOpenChange={(open) => {
          if (!open) closeKbdDialog();
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Add keyboard shortcut</AlertDialogTitle>
            <AlertDialogDescription>
              Enter the keyboard input you want to display (e.g. Ctrl + C).
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-3 py-2">
            <Input
              placeholder="e.g. Ctrl + C"
              value={kbdDialog.keys}
              onChange={(e) =>
                setKbdDialog((prev) => ({ ...prev, keys: e.target.value }))
              }
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel className="hover:cursor-pointer" onClick={closeKbdDialog}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction className="hover:cursor-pointer" onClick={confirmAddKbd}>
              Add kbd
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete dialog */}
      <AlertDialog open={deleteDialog.open} onOpenChange={closeDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteDialog.blockId
                ? "This will permanently delete this content block."
                : "This action cannot be undone. This will permanently delete this section and all its content."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="hover:cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 text-white hover:bg-red-700 hover:cursor-pointer"
            >
              {deleteDialog.blockId ? "Delete Block" : "Delete Section"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
