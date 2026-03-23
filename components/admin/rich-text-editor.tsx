"use client";

import {
  BoldOutlined,
  ClearOutlined,
  CodeOutlined,
  ItalicOutlined,
  OrderedListOutlined,
  PicLeftOutlined,
  RedoOutlined,
  StrikethroughOutlined,
  UndoOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { Button, Divider, Space, Tooltip, Typography } from "antd";
import { useEffect, useRef } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";

type RichTextEditorProps = {
  value?: string;
  onChange?: (value: string) => void;
  latestImageUrl?: string;
};

export function RichTextEditor({ value = "", onChange, latestImageUrl }: RichTextEditorProps) {
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Image,
    ],
    content: value || "<p></p>",
    editorProps: {
      attributes: {
        class: "admin-rich-editor-surface ProseMirror",
      },
    },
    onUpdate: ({ editor: currentEditor }) => {
      onChangeRef.current?.(currentEditor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) {
      return;
    }

    const currentHtml = editor.getHTML();
    const nextHtml = value || "<p></p>";

    if (currentHtml === nextHtml) {
      return;
    }

    editor.commands.setContent(nextHtml, { emitUpdate: false });
  }, [editor, value]);

  if (!editor) {
    return null;
  }

  const insertLatestImage = () => {
    if (!latestImageUrl) {
      return;
    }

    editor.chain().focus().setImage({ src: latestImageUrl, alt: "文章配图" }).run();
  };

  return (
    <div className="admin-rich-editor">
      <Space className="admin-rich-toolbar" size={[8, 8]} wrap>
        <Tooltip title="加粗">
          <Button icon={<BoldOutlined />} type={editor.isActive("bold") ? "primary" : "default"} onClick={() => editor.chain().focus().toggleBold().run()} />
        </Tooltip>
        <Tooltip title="斜体">
          <Button icon={<ItalicOutlined />} type={editor.isActive("italic") ? "primary" : "default"} onClick={() => editor.chain().focus().toggleItalic().run()} />
        </Tooltip>
        <Tooltip title="删除线">
          <Button icon={<StrikethroughOutlined />} type={editor.isActive("strike") ? "primary" : "default"} onClick={() => editor.chain().focus().toggleStrike().run()} />
        </Tooltip>
        <Divider type="vertical" />
        <Button type={editor.isActive("heading", { level: 2 }) ? "primary" : "default"} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          标题 2
        </Button>
        <Button type={editor.isActive("heading", { level: 3 }) ? "primary" : "default"} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
          标题 3
        </Button>
        <Tooltip title="引用">
          <Button icon={<CodeOutlined />} type={editor.isActive("blockquote") ? "primary" : "default"} onClick={() => editor.chain().focus().toggleBlockquote().run()} />
        </Tooltip>
        <Tooltip title="无序列表">
          <Button icon={<UnorderedListOutlined />} type={editor.isActive("bulletList") ? "primary" : "default"} onClick={() => editor.chain().focus().toggleBulletList().run()} />
        </Tooltip>
        <Tooltip title="有序列表">
          <Button icon={<OrderedListOutlined />} type={editor.isActive("orderedList") ? "primary" : "default"} onClick={() => editor.chain().focus().toggleOrderedList().run()} />
        </Tooltip>
        <Divider type="vertical" />
        <Button disabled={!latestImageUrl} icon={<PicLeftOutlined />} onClick={insertLatestImage}>
          插入最新图片
        </Button>
        <Button icon={<ClearOutlined />} onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}>
          清除样式
        </Button>
        <Divider type="vertical" />
        <Tooltip title="撤销">
          <Button disabled={!editor.can().undo()} icon={<UndoOutlined />} onClick={() => editor.chain().focus().undo().run()} />
        </Tooltip>
        <Tooltip title="重做">
          <Button disabled={!editor.can().redo()} icon={<RedoOutlined />} onClick={() => editor.chain().focus().redo().run()} />
        </Tooltip>
      </Space>

      <Typography.Paragraph className="search-results-line" style={{ marginBottom: 12 }}>
        使用 Tiptap 富文本编辑器进行排版，支持标题、引用、列表、图片与撤销重做。
      </Typography.Paragraph>

      <EditorContent editor={editor} />
    </div>
  );
}
