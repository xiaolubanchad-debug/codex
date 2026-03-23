"use client";

import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Alert, Button, Card, Form, Input, Space, Spin, Typography, message } from "antd";
import { useEffect, useState } from "react";

import type { AdminSiteSettingsRecord, AdminStructuredTextItem } from "@/lib/admin-types";

type SiteSettingsFormValues = Omit<AdminSiteSettingsRecord, "id" | "createdAt" | "updatedAt">;

async function readSiteSettings() {
  const response = await fetch("/api/admin/site", { cache: "no-store" });
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.message || "读取站点文案失败");
  }

  return payload.data as AdminSiteSettingsRecord;
}

async function saveSiteSettings(values: SiteSettingsFormValues) {
  const response = await fetch("/api/admin/site", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.message || "保存站点文案失败");
  }

  return payload.data as AdminSiteSettingsRecord;
}

function defaultItem(title = "", body = ""): AdminStructuredTextItem {
  return { title, body };
}

export default function AdminSitePage() {
  const [form] = Form.useForm<SiteSettingsFormValues>();
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void (async () => {
      try {
        setLoading(true);
        const settings = await readSiteSettings();
        form.setFieldsValue({
          aboutHeroKicker: settings.aboutHeroKicker,
          aboutHeroTitle: settings.aboutHeroTitle,
          aboutHeroHighlight: settings.aboutHeroHighlight,
          aboutHeroDescription: settings.aboutHeroDescription,
          aboutMissionTitle: settings.aboutMissionTitle,
          aboutMissionBody: settings.aboutMissionBody,
          aboutPrinciples: settings.aboutPrinciples,
          aboutTimeline: settings.aboutTimeline,
          aboutCoverageTitle: settings.aboutCoverageTitle,
          aboutCoverageBody: settings.aboutCoverageBody,
          aboutBannerTitle: settings.aboutBannerTitle,
          aboutBannerBody: settings.aboutBannerBody,
        });
      } catch (error) {
        messageApi.error(error instanceof Error ? error.message : "读取站点文案失败");
      } finally {
        setLoading(false);
      }
    })();
  }, [form, messageApi]);

  const handleSubmit = async (values: SiteSettingsFormValues) => {
    try {
      setSaving(true);
      const saved = await saveSiteSettings(values);
      form.setFieldsValue({
        aboutHeroKicker: saved.aboutHeroKicker,
        aboutHeroTitle: saved.aboutHeroTitle,
        aboutHeroHighlight: saved.aboutHeroHighlight,
        aboutHeroDescription: saved.aboutHeroDescription,
        aboutMissionTitle: saved.aboutMissionTitle,
        aboutMissionBody: saved.aboutMissionBody,
        aboutPrinciples: saved.aboutPrinciples,
        aboutTimeline: saved.aboutTimeline,
        aboutCoverageTitle: saved.aboutCoverageTitle,
        aboutCoverageBody: saved.aboutCoverageBody,
        aboutBannerTitle: saved.aboutBannerTitle,
        aboutBannerBody: saved.aboutBannerBody,
      });
      messageApi.success("关于页文案已更新");
    } catch (error) {
      messageApi.error(error instanceof Error ? error.message : "保存失败");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-account-page">
      {contextHolder}

      <div className="admin-dashboard-head">
        <Typography.Title level={2}>站点文案</Typography.Title>
        <Typography.Paragraph>
          这里可以直接修改关于页的主要文字内容，不需要再手动改前端文件。
        </Typography.Paragraph>
      </div>

      {loading ? (
        <Spin />
      ) : (
        <Form<SiteSettingsFormValues> form={form} layout="vertical" onFinish={handleSubmit}>
          <Card className="admin-dashboard-panel">
            <Alert
              message="前台关于页会直接读取这里的配置，保存后刷新前台即可看到最新内容。"
              showIcon
              style={{ marginBottom: 16 }}
              type="info"
            />

            <div className="admin-form-grid">
              <Form.Item label="页眉小标题" name="aboutHeroKicker" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item label="标题高亮词" name="aboutHeroHighlight" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </div>

            <Form.Item label="主标题前半句" name="aboutHeroTitle" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item label="页首说明" name="aboutHeroDescription" rules={[{ required: true }]}>
              <Input.TextArea rows={4} />
            </Form.Item>

            <Form.Item label="原则模块标题" name="aboutMissionTitle" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item label="原则模块说明" name="aboutMissionBody" rules={[{ required: true }]}>
              <Input.TextArea rows={3} />
            </Form.Item>

            <Typography.Title level={4}>写作原则</Typography.Title>
            <Form.List name="aboutPrinciples">
              {(fields, { add, remove }) => (
                <div className="admin-block-list">
                  {fields.map((field) => (
                    <Card
                      className="admin-block-card"
                      key={field.key}
                      size="small"
                      title={`原则 ${field.name + 1}`}
                      extra={
                        <Button danger icon={<MinusCircleOutlined />} size="small" onClick={() => remove(field.name)}>
                          删除
                        </Button>
                      }
                    >
                      <Form.Item label="标题" name={[field.name, "title"]} rules={[{ required: true }]}>
                        <Input />
                      </Form.Item>
                      <Form.Item label="说明" name={[field.name, "body"]} rules={[{ required: true }]}>
                        <Input.TextArea rows={3} />
                      </Form.Item>
                    </Card>
                  ))}

                  <Button icon={<PlusOutlined />} onClick={() => add(defaultItem())}>
                    新增原则
                  </Button>
                </div>
              )}
            </Form.List>

            <Typography.Title level={4} style={{ marginTop: 24 }}>
              关注主题
            </Typography.Title>
            <Form.List name="aboutTimeline">
              {(fields, { add, remove }) => (
                <div className="admin-block-list">
                  {fields.map((field) => (
                    <Card
                      className="admin-block-card"
                      key={field.key}
                      size="small"
                      title={`主题 ${field.name + 1}`}
                      extra={
                        <Button danger icon={<MinusCircleOutlined />} size="small" onClick={() => remove(field.name)}>
                          删除
                        </Button>
                      }
                    >
                      <Form.Item label="标题" name={[field.name, "title"]} rules={[{ required: true }]}>
                        <Input />
                      </Form.Item>
                      <Form.Item label="说明" name={[field.name, "body"]} rules={[{ required: true }]}>
                        <Input.TextArea rows={3} />
                      </Form.Item>
                    </Card>
                  ))}

                  <Button icon={<PlusOutlined />} onClick={() => add(defaultItem())}>
                    新增主题
                  </Button>
                </div>
              )}
            </Form.List>

            <div className="admin-form-grid" style={{ marginTop: 24 }}>
              <Form.Item label="栏目覆盖标题" name="aboutCoverageTitle" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item label="底部横幅标题" name="aboutBannerTitle" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </div>

            <Form.Item label="栏目覆盖说明" name="aboutCoverageBody" rules={[{ required: true }]}>
              <Input.TextArea rows={3} />
            </Form.Item>
            <Form.Item label="底部横幅说明" name="aboutBannerBody" rules={[{ required: true }]}>
              <Input.TextArea rows={3} />
            </Form.Item>

            <Space>
              <Button htmlType="submit" loading={saving} type="primary">
                保存关于页文案
              </Button>
            </Space>
          </Card>
        </Form>
      )}
    </div>
  );
}
