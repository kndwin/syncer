import { forwardRef } from "react";
import {
  useEditor,
  EditorContent,
  EditorContentProps,
  PureEditorContent,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export const TiptapEditor = forwardRef<
  PureEditorContent,
  Omit<EditorContentProps, "editor">
>((props, ref) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: props.defaultValue as string,
    editorProps: {
      attributes: {
        class: "prose-sm dark:prose-invert focus:outline-none max-w-full",
      },
    },
  });

  return <EditorContent {...props} editor={editor} ref={ref} />;
});
