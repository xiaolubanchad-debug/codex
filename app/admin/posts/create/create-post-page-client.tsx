"use client";

import { Create } from "@refinedev/antd";
import { useCreate } from "@refinedev/core";
import { Button, Form, Space } from "antd";
import { useRouter } from "next/navigation";

import { PostForm, type PostFormValues } from "@/components/admin/post-form";
import type { AdminStatus } from "@/lib/admin-types";

export function CreatePostPageClient() {
  const [form] = Form.useForm<PostFormValues>();
  const router = useRouter();
  const { mutate } = useCreate();

  const submitWithStatus = (status: AdminStatus) => {
    form.setFieldValue("status", status);
    form.submit();
  };

  return (
    <Create
      title="新建文章"
      footerButtons={() => (
        <Space wrap>
          <Button onClick={() => submitWithStatus("draft")}>保存为草稿</Button>
          <Button onClick={() => submitWithStatus("review")}>提交审核</Button>
          <Button type="primary" onClick={() => submitWithStatus("published")}>
            直接发布
          </Button>
        </Space>
      )}
    >
      <PostForm
        form={form}
        onFinish={(values) => {
          mutate(
            {
              resource: "posts",
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
    </Create>
  );
}
