"use client";

import { Create, SaveButton } from "@refinedev/antd";
import { useCreate } from "@refinedev/core";
import { Form } from "antd";
import { useRouter } from "next/navigation";

import { TaxonomyForm } from "@/components/admin/taxonomy-form";

export default function AdminTagCreatePage() {
  const [form] = Form.useForm();
  const router = useRouter();
  const { mutate } = useCreate();

  return (
    <Create title="新建标签" footerButtons={() => <SaveButton onClick={() => form.submit()}>保存标签</SaveButton>}>
      <TaxonomyForm
        form={form}
        mode="tag"
        onFinish={(values) => {
          mutate(
            {
              resource: "tags",
              values,
            },
            {
              onSuccess: () => {
                router.push("/admin/tags");
              },
            },
          );
        }}
      />
    </Create>
  );
}
