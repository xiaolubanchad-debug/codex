"use client";

import { Edit, SaveButton } from "@refinedev/antd";
import { useOne, useUpdate } from "@refinedev/core";
import { Form, Spin } from "antd";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

import { TaxonomyForm } from "@/components/admin/taxonomy-form";
import type { AdminTagRecord } from "@/lib/admin-types";

export default function AdminTagEditPage() {
  const params = useParams<{ id: string }>();
  const [form] = Form.useForm();
  const router = useRouter();
  const { result, query } = useOne<AdminTagRecord>({
    resource: "tags",
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
    <Edit title="编辑标签" footerButtons={() => <SaveButton onClick={() => form.submit()}>更新标签</SaveButton>}>
      <TaxonomyForm
        form={form}
        mode="tag"
        onFinish={(values) => {
          mutate(
            {
              resource: "tags",
              id: params.id,
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
    </Edit>
  );
}
