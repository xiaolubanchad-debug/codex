"use client";

import { Empty } from "antd";

import { bodyToHtml, getPlainTextFromBody } from "@/lib/editorial-content";

type ArticlePreviewProps = {
  body: string;
  excerpt?: string;
  title?: string;
};

export function ArticlePreview({ body, excerpt, title }: ArticlePreviewProps) {
  const html = bodyToHtml(body);

  if (!getPlainTextFromBody(body)) {
    return <Empty description="还没有可预览的正文内容" />;
  }

  return (
    <div className="admin-article-preview">
      {title ? <h1>{title}</h1> : null}
      {excerpt ? <p className="admin-article-preview-deck">{excerpt}</p> : null}
      <div className="rich-text-content" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
