"use client";

import { useEffect, useRef, useState } from "react";
import type { FormInstance } from "antd";
import { Form, Input } from "antd";

type TaxonomyFormValues = {
  name: string;
  slug: string;
  description?: string;
};

type TaxonomyFormProps = {
  form: FormInstance<TaxonomyFormValues>;
  onFinish: (values: TaxonomyFormValues) => void;
  mode: "category" | "tag";
};

function slugifyInput(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\u4e00-\u9fa5\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function TaxonomyForm({ form, onFinish, mode }: TaxonomyFormProps) {
  const [slugTouched, setSlugTouched] = useState(false);
  const lastGeneratedSlugRef = useRef("");
  const name = Form.useWatch("name", form) ?? "";

  useEffect(() => {
    const nextSlug = slugifyInput(name);
    const currentSlug = form.getFieldValue("slug") ?? "";

    if (!nextSlug) {
      return;
    }

    if (!slugTouched || currentSlug === lastGeneratedSlugRef.current || !currentSlug) {
      lastGeneratedSlugRef.current = nextSlug;
      form.setFieldValue("slug", nextSlug);
    }
  }, [form, name, slugTouched]);

  return (
    <Form<TaxonomyFormValues> form={form} layout="vertical" onFinish={onFinish}>
      <Form.Item
        label={mode === "category" ? "分类名称" : "标签名称"}
        name="name"
        rules={[{ required: true, message: mode === "category" ? "请输入分类名称" : "请输入标签名称" }]}
      >
        <Input placeholder={mode === "category" ? "例如：互联网 / 人工智能" : "例如：基础设施 / 平台治理"} />
      </Form.Item>

      <Form.Item label="Slug" name="slug" rules={[{ required: true, message: "请输入 slug" }]}>
        <Input
          placeholder="例如：internet / ai-policy"
          onChange={(event) => {
            setSlugTouched(Boolean(event.target.value.trim()));
            form.setFieldValue("slug", slugifyInput(event.target.value));
          }}
        />
      </Form.Item>

      {mode === "category" ? (
        <Form.Item label="分类说明" name="description" rules={[{ required: true, message: "请输入分类说明" }]}>
          <Input.TextArea rows={4} placeholder="说明这个分类下主要覆盖什么类型的内容。" />
        </Form.Item>
      ) : null}
    </Form>
  );
}
