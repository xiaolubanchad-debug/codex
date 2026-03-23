"use client";

import { Form, Input, Select, Switch } from "antd";
import { useList } from "@refinedev/core";

import type {
  AdminCategoryRecord,
  AdminPostRecord,
  AdminTagRecord,
} from "@/lib/admin-types";

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
  form: any;
  onFinish: (values: PostFormValues) => void;
};

export function PostForm({ form, onFinish }: PostFormProps) {
  const { result: categories } = useList<AdminCategoryRecord>({
    resource: "categories",
  });
  const { result: tags } = useList<AdminTagRecord>({
    resource: "tags",
  });

  return (
    <Form<PostFormValues> form={form} layout="vertical" onFinish={onFinish}>
      <div className="admin-form-grid">
        <Form.Item label="文章标题" name="title" rules={[{ required: true, message: "请输入标题" }]}>
          <Input placeholder="例如：算力基础设施的新拐点" />
        </Form.Item>

        <Form.Item label="Slug" name="slug" rules={[{ required: true, message: "请输入 slug" }]}>
          <Input placeholder="例如：compute-infra-turning-point" />
        </Form.Item>

        <Form.Item label="作者" name="author" rules={[{ required: true, message: "请输入作者名" }]}>
          <Input placeholder="例如：编辑部" />
        </Form.Item>

        <Form.Item label="分类" name="category" rules={[{ required: true, message: "请选择分类" }]}>
          <Select
            options={(categories?.data ?? []).map((category) => ({
              label: category.name,
              value: category.name,
            }))}
            placeholder="选择分类"
          />
        </Form.Item>

        <Form.Item label="发布日期" name="publishedAt" rules={[{ required: true, message: "请输入日期" }]}>
          <Input placeholder="2026-03-23" />
        </Form.Item>

        <Form.Item label="阅读时长" name="readingTime" rules={[{ required: true, message: "请输入时长" }]}>
          <Input placeholder="6 分钟" />
        </Form.Item>

        <Form.Item label="发布状态" name="status" rules={[{ required: true, message: "请选择状态" }]}>
          <Select
            options={[
              { label: "草稿", value: "draft" },
              { label: "审核中", value: "review" },
              { label: "已发布", value: "published" },
            ]}
          />
        </Form.Item>

        <Form.Item label="封面标签" name="coverLabel" rules={[{ required: true, message: "请输入封面标签" }]}>
          <Input placeholder="例如：封面观察" />
        </Form.Item>
      </div>

      <Form.Item label="摘要" name="excerpt" rules={[{ required: true, message: "请输入摘要" }]}>
        <Input.TextArea placeholder="这一篇的核心摘要是什么" rows={4} />
      </Form.Item>

      <Form.Item label="标签" name="tags" rules={[{ required: true, message: "至少保留一个标签" }]}>
        <Select
          mode="tags"
          options={(tags?.data ?? []).map((tag) => ({
            label: tag.name,
            value: tag.name,
          }))}
          placeholder="输入或选择标签"
        />
      </Form.Item>

      <Form.Item label="正文" name="bodyText" rules={[{ required: true, message: "请输入正文内容" }]}>
        <Input.TextArea placeholder="每段之间空一行，后台会按段落保存" rows={14} />
      </Form.Item>

      <Form.Item label="置顶推荐" name="featured" valuePropName="checked">
        <Switch checkedChildren="是" unCheckedChildren="否" />
      </Form.Item>
    </Form>
  );
}
