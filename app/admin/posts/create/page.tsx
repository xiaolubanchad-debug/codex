"use client";

import { Create, SaveButton } from "@refinedev/antd";
import { useCreate } from "@refinedev/core";
import { Form } from "antd";
import { useRouter } from "next/navigation";

import { PostForm, type PostFormValues } from "@/components/admin/post-form";

export default function AdminPostCreatePage() {
  const [form] = Form.useForm<PostFormValues>();
  const router = useRouter();
  const { mutate } = useCreate();

  return (
    <Create
      footerButtons={() => (
        <SaveButton onClick={() => form.submit()}>
          保存文章
        </SaveButton>
      )}
      title="新建文章"
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
