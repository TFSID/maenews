"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Heading2, Italic, List, ListOrdered } from "lucide-react";

interface TiptapArticleEditorProps {
  content: string;
  onHTMLChange: (html: string) => void;
  onJSONChange: (json: unknown) => void;
}

export function TiptapArticleEditor({
  content,
  onHTMLChange,
  onJSONChange,
}: TiptapArticleEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "min-h-[260px] border border-gray-200 bg-[#FAFAFA] px-4 py-3 text-sm leading-7 text-[#090909] outline-none",
      },
    },
    onUpdate({ editor }) {
      onHTMLChange(editor.getHTML());
      onJSONChange(editor.getJSON());
    },
  });

  if (!editor) {
    return <div className="h-[320px] animate-pulse bg-[#FAFAFA]" />;
  }

  const tools = [
    {
      label: "Bold",
      icon: Bold,
      active: editor.isActive("bold"),
      action: () => editor.chain().focus().toggleBold().run(),
    },
    {
      label: "Italic",
      icon: Italic,
      active: editor.isActive("italic"),
      action: () => editor.chain().focus().toggleItalic().run(),
    },
    {
      label: "Heading",
      icon: Heading2,
      active: editor.isActive("heading", { level: 2 }),
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      label: "Bullet List",
      icon: List,
      active: editor.isActive("bulletList"),
      action: () => editor.chain().focus().toggleBulletList().run(),
    },
    {
      label: "Ordered List",
      icon: ListOrdered,
      active: editor.isActive("orderedList"),
      action: () => editor.chain().focus().toggleOrderedList().run(),
    },
  ];

  return (
    <div>
      <div className="mb-2 flex flex-wrap gap-2">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <button
              key={tool.label}
              type="button"
              onClick={tool.action}
              title={tool.label}
              className={`flex h-9 w-9 items-center justify-center border text-[#374151] transition ${
                tool.active
                  ? "border-primary bg-primary text-white"
                  : "border-gray-200 hover:border-primary hover:text-primary"
              }`}
            >
              <Icon className="h-4 w-4" />
            </button>
          );
        })}
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
