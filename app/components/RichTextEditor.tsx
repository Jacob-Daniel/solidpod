// components/RichTextEditor.tsx
"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";

interface Props {
  value?: any; // JSON format
  onChange: (json: any) => void;
}

export default function RichTextEditor({ value, onChange }: Props) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value || "",
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      onChange(json); // pass JSON to parent
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && value) {
      editor.commands.setContent(value);
    }
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="space-y-2">
      <div className="flex gap-2 border p-2 rounded">
        <button
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={
            editor.isActive("paragraph")
              ? "bg-blue-200 text-blue-400 rounded-sm px-1"
              : ""
          }
        >
          ¶
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={
            editor.isActive("heading", { level: 1 })
              ? "bg-blue-200 text-blue-400 rounded-sm px-1"
              : ""
          }
        >
          H1
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={
            editor.isActive("heading", { level: 2 })
              ? "bg-blue-200 text-blue-400 rounded-sm px-1"
              : ""
          }
        >
          H2
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={
            editor.isActive("heading", { level: 3 })
              ? "bg-blue-200 text-blue-400 rounded-sm px-1"
              : ""
          }
        >
          H3
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`font-bold ${
            editor.isActive("bold")
              ? "bg-blue-200 text-blue-400 rounded-sm px-1"
              : ""
          }`}
        >
          B
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`italic ${
            editor.isActive("italic")
              ? "bg-blue-200 text-blue-400 rounded-sm px-1"
              : ""
          }`}
        >
          I
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={
            editor.isActive("bulletList")
              ? "bg-blue-200 text-blue-400 rounded-sm px-1"
              : ""
          }
        >
          • List
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={
            editor.isActive("orderedList")
              ? "bg-blue-200 text-blue-400 rounded-sm px-1"
              : ""
          }
        >
          1. List
        </button>
      </div>
      <div className="border p-3 rounded min-h-[150px]">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
