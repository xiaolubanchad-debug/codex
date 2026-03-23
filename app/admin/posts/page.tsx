"use client";

import { DeleteButton, EditButton, List, ShowButton, useTable } from "@refinedev/antd";
import { Button, Space, Table, Tag } from "antd";
import Link from "next/link";

import type { AdminPostRecord } from "@/lib/admin-types";

const STATUS_META: Record<AdminPostRecord["status"], { color: string; label: string }> = {
  draft: { color: "default", label: "草稿" },
  review: { color: "gold", label: "待审核" },
  published: { color: "green", label: "已发布" },
};

export default function AdminPostsPage() {
  const { tableProps } = useTable<AdminPostRecord>({
    resource: "posts",
    syncWithLocation: true,
  });

  return (
    <List
      title="文章管理"
      headerButtons={() => (
        <Link href="/admin/posts/create">
          <Button type="primary">新建文章</Button>
        </Link>
      )}
    >
      <Table {...tableProps} pagination={false} rowKey="id">
        <Table.Column<AdminPostRecord> dataIndex="title" key="title" title="标题" />
        <Table.Column<AdminPostRecord> dataIndex="category" key="category" title="分类" />
        <Table.Column<AdminPostRecord> dataIndex="author" key="author" title="作者" />
        <Table.Column<AdminPostRecord>
          dataIndex="status"
          key="status"
          title="状态"
          render={(value: AdminPostRecord["status"]) => (
            <Tag color={STATUS_META[value].color}>{STATUS_META[value].label}</Tag>
          )}
        />
        <Table.Column<AdminPostRecord>
          dataIndex="featured"
          key="featured"
          title="推荐"
          render={(value: boolean) => (value ? <Tag color="red">推荐</Tag> : <Tag>普通</Tag>)}
        />
        <Table.Column<AdminPostRecord> dataIndex="publishedAt" key="publishedAt" title="日期" />
        <Table.Column<AdminPostRecord>
          key="actions"
          title="操作"
          render={(_, record) => (
            <Space>
              <ShowButton hideText recordItemId={record.id} size="small" />
              <EditButton hideText recordItemId={record.id} size="small" />
              <DeleteButton hideText recordItemId={record.id} size="small" />
            </Space>
          )}
        />
      </Table>
    </List>
  );
}
