"use client";

import { Show } from "@refinedev/antd";
import { useOne } from "@refinedev/core";
import { Descriptions, Divider, Space, Spin, Tag, Typography } from "antd";
import { useParams } from "next/navigation";

import type { AdminPostRecord } from "@/lib/admin-types";

export default function AdminPostShowPage() {
  const params = useParams<{ id: string }>();
  const { result, query } = useOne<AdminPostRecord>({
    resource: "posts",
    id: params.id,
  });

  if (query.isLoading || !result) {
    return <Spin />;
  }

  const post = result;

  return (
    <Show title="文章详情">
      <Descriptions bordered column={2}>
        <Descriptions.Item label="标题" span={2}>
          {post.title}
        </Descriptions.Item>
        <Descriptions.Item label="Slug">{post.slug}</Descriptions.Item>
        <Descriptions.Item label="分类">{post.category}</Descriptions.Item>
        <Descriptions.Item label="作者">{post.author}</Descriptions.Item>
        <Descriptions.Item label="日期">{post.publishedAt}</Descriptions.Item>
        <Descriptions.Item label="状态">
          <Tag>{post.status}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="阅读时长">{post.readingTime}</Descriptions.Item>
        <Descriptions.Item label="摘要" span={2}>
          {post.excerpt}
        </Descriptions.Item>
        <Descriptions.Item label="标签" span={2}>
          <Space wrap>
            {post.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </Space>
        </Descriptions.Item>
      </Descriptions>

      <Divider />

      <Typography.Title level={4}>正文内容</Typography.Title>
      <div className="admin-article-preview">
        {post.body.split("\n\n").map((paragraph) => (
          <Typography.Paragraph key={paragraph}>{paragraph}</Typography.Paragraph>
        ))}
      </div>
    </Show>
  );
}
