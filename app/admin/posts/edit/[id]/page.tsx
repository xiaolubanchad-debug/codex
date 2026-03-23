"use client";

import { Edit } from "@refinedev/antd";
import { useOne, useUpdate } from "@refinedev/core";
import { Button, Form, Space, Spin } from "antd";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

import { PostForm, type PostFormValues } from "@/components/admin/post-form";
import type { AdminPostRecord, AdminStatus } from "@/lib/admin-types";

function toFormValues(record: AdminPostRecord): PostFormValues {
  return {
    title: record.title,
    slug: record.slug,
    author: record.author,
    category: record.category,
    excerpt: record.excerpt,
    publishedAt: record.publishedAt,
    readingTime: record.readingTime,
    status: record.status,
    featured: record.featured,
    coverLabel: record.coverLabel,
    tags: record.tags,
    bodyText: record.body,
  };
}

export default function AdminPostEditPage() {
  const params = useParams<{ id: string }>();
  const [form] = Form.useForm<PostFormValues>();
  const router = useRouter();
  const hydratedPostIdRef = useRef<string | null>(null);
  const { result, query } = useOne<AdminPostRecord>({
    resource: "posts",
    id: params.id,
  });
  const { mutate } = useUpdate();

  useEffect(() => {
    if (!result || hydratedPostIdRef.current === result.id) {
      return;
    }

    form.setFieldsValue(toFormValues(result));
    hydratedPostIdRef.current = result.id;
  }, [form, result]);

  if (query.isLoading) {
    return <Spin />;
  }

  const submitWithStatus = (status: AdminStatus) => {
    form.setFieldValue("status", status);
    form.submit();
  };

  return (
    <Edit
      title="编辑文章"
      footerButtons={() => (
        <Space wrap>
          <Button onClick={() => submitWithStatus("draft")}>更新草稿</Button>
          <Button onClick={() => submitWithStatus("review")}>送审</Button>
          <Button type="primary" onClick={() => submitWithStatus("published")}>
            发布更新
          </Button>
        </Space>
      )}
    >
      <PostForm
        autoGenerateSlug={false}
        form={form}
        onFinish={(values) => {
          mutate(
            {
              resource: "posts",
              id: params.id,
              values,
            },
            {
              onSuccess: () => {
                router.push("/admin/posts");
              },
            },
          );
        }}
      />
    </Edit>
  );
}
