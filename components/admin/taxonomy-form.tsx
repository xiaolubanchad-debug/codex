"use client";

import { Form, Input } from "antd";

type TaxonomyFormValues = {
  name: string;
  slug: string;
  description?: string;
};

type TaxonomyFormProps = {
  form: any;
  onFinish: (values: TaxonomyFormValues) => void;
  mode: "category" | "tag";
};

export function TaxonomyForm({ form, onFinish, mode }: TaxonomyFormProps) {
  return (
    <Form<TaxonomyFormValues> form={form} layout="vertical" onFinish={onFinish}>
      <Form.Item label={mode === "category" ? "分类名称" : "标签名称"} name="name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Form.Item label="Slug" name="slug" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      {mode === "category" ? (
        <Form.Item label="说明" name="description" rules={[{ required: true }]}>
          <Input.TextArea rows={4} />
        </Form.Item>
      ) : null}
    </Form>
  );
}
