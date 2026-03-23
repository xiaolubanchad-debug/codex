"use client";

import { Create, SaveButton } from "@refinedev/antd";
import { useCreate } from "@refinedev/core";
import { Form } from "antd";
import { useRouter } from "next/navigation";

import { TaxonomyForm } from "@/components/admin/taxonomy-form";

export default function AdminCategoryCreatePage() {
  const [form] = Form.useForm();
  const router = useRouter();
  const { mutate } = useCreate();

  return (
    <Create
      title="新建分类"
      footerButtons={() => <SaveButton onClick={() => form.submit()}>保存分类</SaveButton>}
    >
      <TaxonomyForm
        form={form}
        mode="category"
        onFinish={(values) => {
          mutate(
            {
              resource: "categories",
              values,
            },
            {
              onSuccess: () => {
                router.push("/admin/categories");
              },
            },
          );
        }}
      />
    </Create>
  );
}
