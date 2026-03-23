"use client";

import { Alert } from "antd";

import { RichTextEditor } from "@/components/admin/rich-text-editor";

type BlockEditorProps = {
  value?: string;
  onChange?: (value: string) => void;
  latestImageUrl?: string;
};

export function BlockEditor({ value = "", onChange, latestImageUrl }: BlockEditorProps) {
  return (
    <div className="admin-editor-panel">
      <Alert
        type="info"
        showIcon
        message="块编辑器已升级为基于 Tiptap 的成熟富文本方案，这里保留兼容入口。"
      />
      <RichTextEditor latestImageUrl={latestImageUrl} value={value} onChange={onChange} />
    </div>
  );
}
