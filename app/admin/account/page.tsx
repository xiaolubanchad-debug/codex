"use client";

import { Alert, Button, Card, Col, Form, Input, Row, Spin, Typography, message } from "antd";
import { useEffect, useState } from "react";

import type { AdminAccountRecord } from "@/lib/admin-types";

type AccountFormValues = {
  name: string;
  email: string;
  role: string;
  currentPassword?: string;
  nextPassword?: string;
};

async function readAccount() {
  const response = await fetch("/api/admin/account", { cache: "no-store" });
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.message || "读取账户信息失败");
  }

  return payload.data as AdminAccountRecord;
}

async function updateAccount(values: { name: string; currentPassword?: string; nextPassword?: string }) {
  const response = await fetch("/api/admin/account", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.message || "更新账户失败");
  }

  return payload.data as AdminAccountRecord;
}

export default function AdminAccountPage() {
  const [form] = Form.useForm<AccountFormValues>();
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [account, setAccount] = useState<AdminAccountRecord | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      const nextAccount = await readAccount();
      setAccount(nextAccount);
      form.setFieldsValue({
        name: nextAccount.name,
        email: nextAccount.email,
        role: nextAccount.role,
        currentPassword: "",
        nextPassword: "",
      });
    } catch (error) {
      messageApi.error(error instanceof Error ? error.message : "读取账户失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const handleSubmit = async (values: AccountFormValues) => {
    try {
      setSaving(true);
      const nextAccount = await updateAccount({
        name: values.name,
        currentPassword: values.currentPassword,
        nextPassword: values.nextPassword,
      });
      setAccount(nextAccount);
      form.setFieldsValue({
        name: nextAccount.name,
        email: nextAccount.email,
        role: nextAccount.role,
        currentPassword: "",
        nextPassword: "",
      });
      messageApi.success("超级管理员资料已更新");
    } catch (error) {
      messageApi.error(error instanceof Error ? error.message : "更新失败");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-account-page">
      {contextHolder}

      <div className="admin-dashboard-head">
        <Typography.Title level={2}>超级管理员</Typography.Title>
        <Typography.Paragraph>
          当前后台只保留一个超级管理员账户。你可以在这里维护显示名称与登录密码。
        </Typography.Paragraph>
      </div>

      {loading ? (
        <Spin />
      ) : (
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={8}>
            <Card className="admin-dashboard-panel">
              <div className="admin-account-meta">
                <span>账户邮箱</span>
                <strong>{account?.email}</strong>
              </div>
              <div className="admin-account-meta">
                <span>角色</span>
                <strong>{account?.role}</strong>
              </div>
              <div className="admin-account-meta">
                <span>创建时间</span>
                <strong>{account?.createdAt ? new Date(account.createdAt).toLocaleString("zh-CN") : "-"}</strong>
              </div>
              <div className="admin-account-meta">
                <span>最后更新</span>
                <strong>{account?.updatedAt ? new Date(account.updatedAt).toLocaleString("zh-CN") : "-"}</strong>
              </div>
            </Card>
          </Col>
          <Col xs={24} lg={16}>
            <Card className="admin-dashboard-panel">
              <Alert
                showIcon
                type="warning"
                style={{ marginBottom: 16 }}
                message="修改密码后，下次登录请使用新密码。当前邮箱保持单账户固定，不支持新增其他管理员。"
              />
              <Form<AccountFormValues> form={form} layout="vertical" onFinish={handleSubmit}>
                <Form.Item label="显示名称" name="name" rules={[{ required: true, message: "请输入显示名称" }]}>
                  <Input placeholder="例如：小唐" />
                </Form.Item>
                <Form.Item label="登录邮箱" name="email">
                  <Input disabled />
                </Form.Item>
                <Form.Item label="角色" name="role">
                  <Input disabled />
                </Form.Item>
                <Form.Item label="当前密码" name="currentPassword" extra="仅在需要修改密码时填写。">
                  <Input.Password placeholder="输入当前密码" />
                </Form.Item>
                <Form.Item label="新密码" name="nextPassword" extra="至少 8 位；如果不改密码可留空。">
                  <Input.Password placeholder="输入新密码" />
                </Form.Item>
                <Button htmlType="submit" loading={saving} type="primary">
                  保存账户设置
                </Button>
              </Form>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
}
