"use client";

import { useEffect, useRef, useState } from "react";
import type { FormInstance } from "antd";
import { Alert, Button, Card, Flex, Form, Input, Select, Space, Switch, Tabs, Typography, message } from "antd";
import { useList } from "@refinedev/core";

import { ArticlePreview } from "@/components/admin/article-preview";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import type {
  AdminCategoryRecord,
  AdminPostRecord,
  AdminTagRecord,
  AdminUploadRecord,
} from "@/lib/admin-types";
import {
  buildExcerptFromBody,
  estimateReadingTime,
  extractFirstImage,
  getPlainTextFromBody,
  prependImageToBody,
} from "@/lib/editorial-content";

export type PostFormValues = Pick<
  AdminPostRecord,
  | "title"
  | "slug"
  | "author"
  | "category"
  | "excerpt"
  | "publishedAt"
  | "readingTime"
  | "status"
  | "featured"
  | "coverLabel"
> & {
  tags: string[];
  bodyText: string;
};

type PostFormProps = {
  form: FormInstance<PostFormValues>;
  onFinish: (values: PostFormValues) => void;
  autoGenerateSlug?: boolean;
};

function slugifyInput(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\u4e00-\u9fa5\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

async function uploadAsset(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/admin/uploads", {
    method: "POST",
    body: formData,
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.message || "上传失败");
  }

  return payload.data as AdminUploadRecord;
}

export function PostForm({ form, onFinish, autoGenerateSlug = true }: PostFormProps) {
  const { result: categories } = useList<AdminCategoryRecord>({ resource: "categories" });
  const { result: tags } = useList<AdminTagRecord>({ resource: "tags" });
  const [messageApi, contextHolder] = message.useMessage();
  const [uploading, setUploading] = useState(false);
  const [latestUpload, setLatestUpload] = useState<AdminUploadRecord | null>(null);
  const lastGeneratedSlugRef = useRef("");

  const title = Form.useWatch("title", form) ?? "";
  const slug = Form.useWatch("slug", form) ?? "";
  const excerpt = Form.useWatch("excerpt", form) ?? "";
  const bodyText = Form.useWatch("bodyText", form) ?? "";
  const readingTime = Form.useWatch("readingTime", form) ?? "";

  useEffect(() => {
    if (!autoGenerateSlug) {
      return;
    }

    const nextSlug = slugifyInput(title);
    const currentSlug = form.getFieldValue("slug") ?? "";

    if (!nextSlug) {
      return;
    }

    if (!currentSlug || currentSlug === lastGeneratedSlugRef.current) {
      lastGeneratedSlugRef.current = nextSlug;
      form.setFieldValue("slug", nextSlug);
    }
  }, [autoGenerateSlug, form, title]);

  const plainTextLength = getPlainTextFromBody(bodyText).replace(/\s+/g, "").length;
  const estimatedReadingTime = estimateReadingTime(bodyText);
  const firstImage = extractFirstImage(bodyText);

  const handleGenerateExcerpt = () => {
    const nextExcerpt = buildExcerptFromBody(bodyText);

    if (!nextExcerpt) {
      messageApi.warning("正文还没有足够内容，暂时无法生成摘要");
      return;
    }

    form.setFieldValue("excerpt", nextExcerpt);
    messageApi.success("已根据正文生成摘要");
  };

  const handleEstimateReadingTime = () => {
    form.setFieldValue("readingTime", estimatedReadingTime);
    messageApi.success("已按当前正文估算阅读时长");
  };

  const handleAssetUpload = async (file?: File | null) => {
    if (!file) {
      return;
    }

    try {
      setUploading(true);
      const uploaded = await uploadAsset(file);
      setLatestUpload(uploaded);
      messageApi.success("图片已上传");
    } catch (error) {
      messageApi.error(error instanceof Error ? error.message : "上传失败");
    } finally {
      setUploading(false);
    }
  };

  const handleInsertLatestImage = () => {
    if (!latestUpload) {
      return;
    }

    form.setFieldValue(
      "bodyText",
      prependImageToBody(form.getFieldValue("bodyText") ?? "", latestUpload.url, "文章配图"),
    );
    messageApi.success("已把图片插入到正文顶部");
  };

  const handleCopyLatestImage = async () => {
    if (!latestUpload) {
      return;
    }

    try {
      await navigator.clipboard.writeText(latestUpload.url);
      messageApi.success("图片地址已复制");
    } catch {
      messageApi.warning("复制失败，请手动复制图片地址");
    }
  };

  return (
    <>
      {contextHolder}

      <Form<PostFormValues> form={form} layout="vertical" onFinish={onFinish}>
        <div className="admin-editor-layout">
          <div className="admin-editor-main">
            <div className="admin-form-grid">
              <Form.Item label="文章标题" name="title" rules={[{ required: true, message: "请输入文章标题" }]}>
                <Input placeholder="例如：算力基础设施的下一轮竞赛" />
              </Form.Item>

              <Form.Item label="Slug" name="slug" rules={[{ required: true, message: "请输入 slug" }]}>
                <Input
                  placeholder="例如：compute-infra-next-wave"
                  onChange={(event) => {
                    form.setFieldValue("slug", slugifyInput(event.target.value));
                  }}
                />
              </Form.Item>

              <Form.Item label="作者" name="author" rules={[{ required: true, message: "请输入作者名" }]}>
                <Input placeholder="例如：编辑部" />
              </Form.Item>

              <Form.Item label="分类" name="category" rules={[{ required: true, message: "请选择分类" }]}>
                <Select
                  options={(categories?.data ?? []).map((category) => ({ label: category.name, value: category.name }))}
                  placeholder="选择分类"
                />
              </Form.Item>

              <Form.Item label="发布日期" name="publishedAt" rules={[{ required: true, message: "请输入发布日期" }]}>
                <Input placeholder="2026-03-23" />
              </Form.Item>

              <Form.Item label="阅读时长" name="readingTime" rules={[{ required: true, message: "请输入阅读时长" }]}>
                <Input
                  addonAfter={
                    <Button size="small" type="link" onClick={handleEstimateReadingTime}>
                      自动估算
                    </Button>
                  }
                  placeholder="6 分钟"
                />
              </Form.Item>

              <Form.Item label="发布状态" name="status" rules={[{ required: true, message: "请选择发布状态" }]}>
                <Select
                  options={[
                    { label: "草稿", value: "draft" },
                    { label: "待审核", value: "review" },
                    { label: "已发布", value: "published" },
                  ]}
                />
              </Form.Item>

              <Form.Item label="封面标识" name="coverLabel" rules={[{ required: true, message: "请输入封面标识" }]}>
                <Input placeholder="例如：封面专题 / 趋势观察 / 深度评论" />
              </Form.Item>
            </div>

            <Form.Item
              label="摘要"
              name="excerpt"
              rules={[{ required: true, message: "请输入文章摘要" }]}
              extra="列表页和详情页导语会优先使用这段文字。"
            >
              <Input.TextArea placeholder="概括这篇文章最重要的结论、问题意识和阅读价值。" rows={4} />
            </Form.Item>

            <Flex justify="space-between" align="center" wrap gap={12} className="admin-inline-actions">
              <Typography.Text type="secondary">也可以从正文自动提炼一版摘要，再手动微调。</Typography.Text>
              <Button onClick={handleGenerateExcerpt}>从正文生成摘要</Button>
            </Flex>

            <Form.Item label="标签" name="tags" rules={[{ required: true, message: "至少保留一个标签" }]}>
              <Select
                mode="tags"
                options={(tags?.data ?? []).map((tag) => ({ label: tag.name, value: tag.name }))}
                placeholder="输入或选择标签"
              />
            </Form.Item>

            <Form.Item name="bodyText" hidden rules={[{ required: true, message: "请输入正文内容" }]}>
              <Input.TextArea />
            </Form.Item>

            <Tabs
              defaultActiveKey="rich"
              items={[
                {
                  key: "rich",
                  label: "富文本编辑",
                  children: (
                    <div className="admin-editor-panel">
                      <Typography.Paragraph type="secondary" style={{ marginBottom: 0 }}>
                        使用成熟的 Tiptap 富文本编辑器排版，适合标题、引用、列表和图片混排。
                      </Typography.Paragraph>
                      <RichTextEditor
                        latestImageUrl={latestUpload?.url}
                        value={bodyText}
                        onChange={(nextValue) => form.setFieldValue("bodyText", nextValue)}
                      />
                    </div>
                  ),
                },
                {
                  key: "source",
                  label: "HTML 源码",
                  children: (
                    <Form.Item label="正文 HTML" extra="适合做精细微调，也可以直接粘贴已有 HTML 片段。">
                      <Input.TextArea
                        placeholder="编辑器内容会同步成 HTML。"
                        rows={18}
                        value={bodyText}
                        onChange={(event) => form.setFieldValue("bodyText", event.target.value)}
                      />
                    </Form.Item>
                  ),
                },
                {
                  key: "preview",
                  label: "效果预览",
                  children: <ArticlePreview body={bodyText} excerpt={excerpt} title={title} />,
                },
              ]}
            />

            <Form.Item label="置顶推荐" name="featured" valuePropName="checked">
              <Switch checkedChildren="推荐" unCheckedChildren="普通" />
            </Form.Item>
          </div>

          <div className="admin-editor-side">
            <Card title="发布检查" size="small">
              <div className="admin-stat-grid">
                <div>
                  <span>正文字符</span>
                  <strong>{plainTextLength}</strong>
                </div>
                <div>
                  <span>建议阅读</span>
                  <strong>{estimatedReadingTime}</strong>
                </div>
                <div>
                  <span>当前 slug</span>
                  <strong>{slug || "待生成"}</strong>
                </div>
                <div>
                  <span>已填阅读时长</span>
                  <strong>{readingTime || "待填写"}</strong>
                </div>
              </div>
            </Card>

            <Card title="素材上传" size="small">
              <Space direction="vertical" size={14} style={{ width: "100%" }}>
                <Alert
                  type="info"
                  showIcon
                  message="上传后的图片会保存在本地 public/uploads/articles 目录，可直接插入正文或在媒体库中复用。"
                />

                <input
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  type="file"
                  onChange={(event) => {
                    void handleAssetUpload(event.target.files?.[0] ?? null);
                    event.currentTarget.value = "";
                  }}
                />

                <Button loading={uploading} onClick={handleInsertLatestImage} disabled={!latestUpload}>
                  插入到正文顶部
                </Button>
                <Button onClick={handleCopyLatestImage} disabled={!latestUpload}>
                  复制图片地址
                </Button>

                {latestUpload ? (
                  <div className="admin-upload-preview">
                    <img alt={latestUpload.originalName} src={latestUpload.url} />
                    <div>
                      <strong>{latestUpload.originalName}</strong>
                      <span>{latestUpload.url}</span>
                    </div>
                  </div>
                ) : null}
              </Space>
            </Card>

            <Card title="首图提示" size="small">
              {firstImage ? (
                <div className="admin-upload-preview">
                  <img alt={firstImage.alt} src={firstImage.src} />
                  <div>
                    <strong>{firstImage.alt}</strong>
                    <span>{firstImage.src}</span>
                  </div>
                </div>
              ) : (
                <Typography.Paragraph type="secondary" style={{ marginBottom: 0 }}>
                  正文里还没有图片。你可以先上传素材，再把图片插入到正文顶部，作为文章的主视觉。
                </Typography.Paragraph>
              )}
            </Card>
          </div>
        </div>
      </Form>
    </>
  );
}
