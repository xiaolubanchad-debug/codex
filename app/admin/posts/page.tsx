"use client";

import { DeleteButton, EditButton, List, ShowButton, useTable } from "@refinedev/antd";
import { Button, Space, Table, Tag } from "antd";
import Link from "next/link";

import type { AdminPostRecord } from "@/lib/admin-types";

export default function AdminPostsPage() {
  const { tableProps } = useTable<AdminPostRecord>({
    resource: "posts",
    syncWithLocation: true,
  });

  return (
    <List
      headerButtons={() => (
        <Link href="/admin/posts/create">
          <Button type="primary">新建文章</Button>
        </Link>
      )}
      title="文章管理"
    >
      <Table {...tableProps} pagination={false} rowKey="id">
        <Table.Column<AdminPostRecord> dataIndex="title" key="title" title="标题" />
        <Table.Column<AdminPostRecord> dataIndex="category" key="category" title="分类" />
        <Table.Column<AdminPostRecord> dataIndex="author" key="author" title="作者" />
        <Table.Column<AdminPostRecord>
          dataIndex="status"
          key="status"
          title="状态"
          render={(value: AdminPostRecord["status"]) => {
            const colorMap = {
              draft: "default",
              review: "gold",
              published: "green",
            } as const;

            return <Tag color={colorMap[value]}>{value}</Tag>;
          }}
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
