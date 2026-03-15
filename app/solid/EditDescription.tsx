"use client";
import { FC, useEffect } from "react";
import {
  Thing,
  getStringNoLocale,
  setStringNoLocale,
} from "@inrupt/solid-client";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";

interface EditDescriptionProps {
  thing: Thing;
  predicate: string; // e.g. DC("description").value
  onSave: (html: string) => void; // only on explicit save
}

const EditDescription: FC<EditDescriptionProps> = ({
  thing,
  predicate,
  onSave,
}) => {
  const savedHtml = getStringNoLocale(thing, predicate) || "";

  const editor = useEditor({
    extensions: [StarterKit, Link, Image],
    content: savedHtml,
    editorProps: { attributes: { class: "outline-none p-2 min-h-[150px]" } },
    immediatelyRender: false,
  });

  // Only set content when a **different resource** is loaded
  useEffect(() => {
    if (editor && savedHtml !== editor.getHTML()) {
      editor.commands.setContent(savedHtml, { emitUpdate: false });
    }
  }, [editor, savedHtml]);

  const handleSave = () => {
    if (!editor) return;
    const html = editor.getHTML();
    onSave(html); // parent updates Thing here
  };

  return (
    <div className="flex flex-col">
      <label htmlFor="editor" className="font-medium mb-1">
        Description:
      </label>
      <div className="border border-border mb-3 w-full p-1 rounded">
        <EditorContent editor={editor} />
      </div>
      <button
        onClick={handleSave}
        className="bg-blue-500 text-white px-3 py-1 rounded"
      >
        Save Description
      </button>
    </div>
  );
};

export default EditDescription;
