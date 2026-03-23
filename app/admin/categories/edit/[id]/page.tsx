"use client";

import { Edit, SaveButton } from "@refinedev/antd";
import { useOne, useUpdate } from "@refinedev/core";
import { Form, Spin } from "antd";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

import { TaxonomyForm } from "@/components/admin/taxonomy-form";
import type { AdminCategoryRecord } from "@/lib/admin-types";

export default function AdminCategoryEditPage() {
  const params = useParams<{ id: string }>();
  const [form] = Form.useForm();
  const router = useRouter();
  const { result, query } = useOne<AdminCategoryRecord>({
    resource: "categories",
    id: params.id,
  });
  const { mutate } = useUpdate();

  useEffect(() => {
    if (result) {
      form.setFieldsValue(result);
    }
  }, [result, form]);

  if (query.isLoading) {
    return <Spin />;
  }

  return (
    <Edit title="编辑分类" footerButtons={() => <SaveButton onClick={() => form.submit()}>更新分类</SaveButton>}>
      <TaxonomyForm
        form={form}
        mode="category"
        onFinish={(values) => {
          mutate(
            {
              resource: "categories",
              id: params.id,
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
    </Edit>
  );
}
