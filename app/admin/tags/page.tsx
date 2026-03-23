"use client";

import { DeleteButton, EditButton, List, useTable } from "@refinedev/antd";
import { Button, Space, Table } from "antd";
import Link from "next/link";

import type { AdminTagRecord } from "@/lib/admin-types";

export default function AdminTagsPage() {
  const { tableProps } = useTable<AdminTagRecord>({
    resource: "tags",
    syncWithLocation: true,
  });

  return (
    <List
      headerButtons={() => (
        <Link href="/admin/tags/create">
          <Button type="primary">新建标签</Button>
        </Link>
      )}
      title="标签管理"
    >
      <Table {...tableProps} pagination={false} rowKey="id">
        <Table.Column<AdminTagRecord> dataIndex="name" key="name" title="标签" />
        <Table.Column<AdminTagRecord> dataIndex="slug" key="slug" title="Slug" />
        <Table.Column<AdminTagRecord> dataIndex="usageCount" key="usageCount" title="使用次数" />
        <Table.Column<AdminTagRecord>
          key="actions"
          title="操作"
          render={(_, record) => (
            <Space>
              <EditButton hideText recordItemId={record.id} size="small" />
              <DeleteButton hideText recordItemId={record.id} size="small" />
            </Space>
          )}
        />
      </Table>
    </List>
  );
}
