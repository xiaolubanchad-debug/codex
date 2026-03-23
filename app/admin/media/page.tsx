"use client";

import { CopyOutlined, DeleteOutlined, UploadOutlined } from "@ant-design/icons";
import { Alert, Button, Card, Empty, Popconfirm, Space, Spin, Typography, message } from "antd";
import { useEffect, useState } from "react";

import type { AdminUploadRecord } from "@/lib/admin-types";

async function readUploads() {
  const response = await fetch("/api/admin/uploads", { cache: "no-store" });
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.message || "加载媒体库失败");
  }

  return payload.data as AdminUploadRecord[];
}

async function uploadAsset(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/admin/uploads", {
    method: "POST",
    body: formData,
  });
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.message || "上传失败");
  }

  return payload.data as AdminUploadRecord;
}

async function removeAsset(fileName: string) {
  const response = await fetch(`/api/admin/uploads?fileName=${encodeURIComponent(fileName)}`, {
    method: "DELETE",
  });
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.message || "删除失败");
  }
}

export default function AdminMediaPage() {
  const [messageApi, contextHolder] = message.useMessage();
  const [items, setItems] = useState<AdminUploadRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      setItems(await readUploads());
    } catch (error) {
      messageApi.error(error instanceof Error ? error.message : "加载媒体库失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const handleUpload = async (file?: File | null) => {
    if (!file) {
      return;
    }

    try {
      setUploading(true);
      await uploadAsset(file);
      messageApi.success("图片已上传到媒体库");
      await load();
    } catch (error) {
      messageApi.error(error instanceof Error ? error.message : "上传失败");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (fileName: string) => {
    try {
      await removeAsset(fileName);
      messageApi.success("素材已删除");
      await load();
    } catch (error) {
      messageApi.error(error instanceof Error ? error.message : "删除失败");
    }
  };

  const handleCopy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      messageApi.success("素材地址已复制");
    } catch {
      messageApi.warning("复制失败，请手动复制");
    }
  };

  return (
    <div className="admin-media-page">
      {contextHolder}

      <div className="admin-dashboard-head">
        <Typography.Title level={2}>媒体库</Typography.Title>
        <Typography.Paragraph>
          统一管理文章封面与正文配图。上传后的素材可直接插入块编辑器中的图片块。
        </Typography.Paragraph>
      </div>

      <Card className="admin-dashboard-panel">
        <Space direction="vertical" size={12} style={{ width: "100%" }}>
          <Alert showIcon type="info" message="当前仅支持图片素材，单张图片最大 5MB。" />
          <div className="admin-media-actions">
            <label className="admin-upload-button">
              <UploadOutlined />
              <span>{uploading ? "上传中..." : "上传新图片"}</span>
              <input
                accept="image/png,image/jpeg,image/webp,image/gif"
                type="file"
                onChange={(event) => {
                  void handleUpload(event.target.files?.[0] ?? null);
                  event.currentTarget.value = "";
                }}
              />
            </label>
            <Button onClick={() => void load()}>刷新媒体库</Button>
          </div>
        </Space>
      </Card>

      {loading ? (
        <Spin />
      ) : items.length === 0 ? (
        <Card className="admin-dashboard-panel">
          <Empty description="媒体库还是空的，先上传第一张图片吧。" />
        </Card>
      ) : (
        <div className="admin-media-grid">
          {items.map((item) => (
            <Card className="admin-media-card" key={item.fileName} cover={<img alt={item.originalName} src={item.url} />}>
              <Typography.Title level={5}>{item.originalName}</Typography.Title>
              <Typography.Paragraph type="secondary" style={{ marginBottom: 8 }}>
                {item.modifiedAt ? new Date(item.modifiedAt).toLocaleString("zh-CN") : "未知时间"}
              </Typography.Paragraph>
              <Typography.Paragraph className="admin-media-url">{item.url}</Typography.Paragraph>
              <Space wrap>
                <Button icon={<CopyOutlined />} onClick={() => void handleCopy(item.url)}>
                  复制地址
                </Button>
                <Popconfirm title="确认删除这张素材吗？" onConfirm={() => void handleDelete(item.fileName)}>
                  <Button danger icon={<DeleteOutlined />}>删除</Button>
                </Popconfirm>
              </Space>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
