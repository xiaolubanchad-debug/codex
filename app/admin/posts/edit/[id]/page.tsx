"use client";

import { Edit, SaveButton } from "@refinedev/antd";
import { useOne, useUpdate } from "@refinedev/core";
import { Form, Spin } from "antd";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

import { PostForm, type PostFormValues } from "@/components/admin/post-form";
import type { AdminPostRecord } from "@/lib/admin-types";

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
  const { result, query } = useOne<AdminPostRecord>({
    resource: "posts",
    id: params.id,
  });
  const { mutate } = useUpdate();

  useEffect(() => {
    if (result) {
      form.setFieldsValue(toFormValues(result));
    }
  }, [result, form]);

  if (query.isLoading) {
    return <Spin />;
  }

  return (
    <Edit
      footerButtons={() => (
        <SaveButton onClick={() => form.submit()}>
          更新文章
        </SaveButton>
      )}
      title="编辑文章"
    >
      <PostForm
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
