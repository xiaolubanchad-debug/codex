"use client";

import { FileTextOutlined, TagsOutlined } from "@ant-design/icons";
import { useList } from "@refinedev/core";
import { Card, Col, List, Row, Space, Spin, Tag, Typography } from "antd";
import Link from "next/link";

import type { AdminCategoryRecord, AdminPostRecord, AdminTagRecord } from "@/lib/admin-types";

const STATUS_LABEL: Record<AdminPostRecord["status"], string> = {
  draft: "草稿",
  review: "待审核",
  published: "已发布",
};

export default function AdminIndexPage() {
  const postsQuery = useList<AdminPostRecord>({ resource: "posts" });
  const categoriesQuery = useList<AdminCategoryRecord>({ resource: "categories" });
  const tagsQuery = useList<AdminTagRecord>({ resource: "tags" });

  if (postsQuery.query.isLoading || categoriesQuery.query.isLoading || tagsQuery.query.isLoading) {
    return <Spin />;
  }

  const posts = postsQuery.result?.data ?? [];
  const categories = categoriesQuery.result?.data ?? [];
  const tags = tagsQuery.result?.data ?? [];
  const publishedCount = posts.filter((post) => post.status === "published").length;
  const reviewCount = posts.filter((post) => post.status === "review").length;
  const draftCount = posts.filter((post) => post.status === "draft").length;

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard-head">
        <Typography.Title level={2}>后台总览</Typography.Title>
        <Typography.Paragraph>
          这里汇总当前内容库、待处理发布流和栏目资产情况，方便编辑快速进入今天的工作。
        </Typography.Paragraph>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card className="admin-dashboard-card">
            <span>文章总数</span>
            <strong>{posts.length}</strong>
            <p>其中已发布 {publishedCount} 篇，待审核 {reviewCount} 篇。</p>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card className="admin-dashboard-card">
            <span>分类总数</span>
            <strong>{categories.length}</strong>
            <p>覆盖主要内容频道与专题栏目。</p>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card className="admin-dashboard-card">
            <span>标签总数</span>
            <strong>{tags.length}</strong>
            <p>建议定期清理低频标签，保持内容结构清晰。</p>
          </Card>
        </Col>
      </Row>

      <div className="admin-dashboard-grid">
        <Card title="发布流提醒" className="admin-dashboard-panel">
          <Space direction="vertical" size={12} style={{ width: "100%" }}>
            <div className="admin-dashboard-line">
              <span>待审核文章</span>
              <strong>{reviewCount}</strong>
            </div>
            <div className="admin-dashboard-line">
              <span>草稿文章</span>
              <strong>{draftCount}</strong>
            </div>
            <div className="admin-dashboard-line">
              <span>推荐文章</span>
              <strong>{posts.filter((post) => post.featured).length}</strong>
            </div>
            <Link href="/admin/posts/create">去写一篇新文章</Link>
          </Space>
        </Card>

        <Card title="最近内容" className="admin-dashboard-panel">
          <List
            dataSource={posts.slice(0, 5)}
            renderItem={(post) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<FileTextOutlined />}
                  title={<Link href={`/admin/posts/show/${post.id}`}>{post.title}</Link>}
                  description={`${post.author} / ${post.publishedAt} / ${STATUS_LABEL[post.status]}`}
                />
              </List.Item>
            )}
          />
        </Card>

        <Card title="高频标签" className="admin-dashboard-panel">
          <Space wrap>
            {tags.slice(0, 10).map((tag) => (
              <Tag icon={<TagsOutlined />} key={tag.id}>
                {tag.name} · {tag.usageCount}
              </Tag>
            ))}
          </Space>
        </Card>
      </div>
    </div>
  );
}
