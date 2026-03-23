"use client";

import { useLogin } from "@refinedev/core";
import { Button, Card, Form, Input, Typography } from "antd";

type LoginValues = {
  email: string;
  password: string;
};

export default function AdminLoginPage() {
  const [form] = Form.useForm<LoginValues>();
  const { mutate: login } = useLogin<LoginValues>();

  return (
    <div className="admin-login-page">
      <Card className="admin-login-card" bordered={false}>
        <Typography.Text className="story-kicker">后台入口</Typography.Text>
        <Typography.Title level={2}>编辑部管理台</Typography.Title>
        <Typography.Paragraph>
          这是一个面向内容编辑、栏目维护与发布流转的后台。当前版本已经接入真实数据库用户与会话登录。
        </Typography.Paragraph>

        <Form<LoginValues>
          form={form}
          layout="vertical"
          onFinish={(values) => {
            login(values);
          }}
        >
          <Form.Item label="邮箱" name="email" rules={[{ required: true, message: "请输入邮箱" }]}>
            <Input placeholder="editor@example.com" />
          </Form.Item>

          <Form.Item label="密码" name="password" rules={[{ required: true, message: "请输入密码" }]}>
            <Input.Password placeholder="请输入管理员密码" />
          </Form.Item>

          <Button block htmlType="submit" size="large" type="primary">
            登录后台
          </Button>
        </Form>

        <Typography.Paragraph style={{ marginTop: 16, marginBottom: 0 }}>
          默认管理员邮箱来自本地环境变量 <code>ADMIN_EMAIL</code>。
        </Typography.Paragraph>
      </Card>
    </div>
  );
}
