"use client";

import { DeleteButton, EditButton, List, useTable } from "@refinedev/antd";
import { Button, Space, Table } from "antd";
import Link from "next/link";

import type { AdminCategoryRecord } from "@/lib/admin-types";

export default function AdminCategoriesPage() {
  const { tableProps } = useTable<AdminCategoryRecord>({
    resource: "categories",
    syncWithLocation: true,
  });

  return (
    <List
      title="分类管理"
      headerButtons={() => (
        <Link href="/admin/categories/create">
          <Button type="primary">新建分类</Button>
        </Link>
      )}
    >
      <Table {...tableProps} pagination={false} rowKey="id">
        <Table.Column<AdminCategoryRecord> dataIndex="name" key="name" title="分类" />
        <Table.Column<AdminCategoryRecord> dataIndex="slug" key="slug" title="Slug" />
        <Table.Column<AdminCategoryRecord> dataIndex="description" key="description" title="说明" />
        <Table.Column<AdminCategoryRecord> dataIndex="postCount" key="postCount" title="文章数" />
        <Table.Column<AdminCategoryRecord>
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
