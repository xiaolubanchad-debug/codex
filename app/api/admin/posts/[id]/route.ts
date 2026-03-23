import { NextRequest, NextResponse } from "next/server";

import { requireAdminSession } from "@/lib/admin-route";
import { deletePost, getPost, updatePost } from "@/lib/admin-store";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

function toPostWriteErrorResponse(error: unknown) {
  if (typeof error === "object" && error && "code" in error && error.code === "P2002") {
    const target = Array.isArray((error as { meta?: { target?: string[] } }).meta?.target)
      ? (error as { meta?: { target?: string[] } }).meta?.target
      : [];

    if (target?.includes("slug")) {
      return NextResponse.json({ message: "Slug 已存在，请换一个更唯一的地址" }, { status: 409 });
    }
  }

  return NextResponse.json({ message: "文章更新失败，请稍后重试" }, { status: 500 });
}

export async function GET(_: NextRequest, context: RouteContext) {
  const session = await requireAdminSession();

  if (!session.ok) {
    return session.response;
  }

  const { id } = await context.params;
  const record = await getPost(id);

  if (!record) {
    return NextResponse.json({ message: "Post not found" }, { status: 404 });
  }

  return NextResponse.json({ data: record });
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const session = await requireAdminSession();

  if (!session.ok) {
    return session.response;
  }

  const { id } = await context.params;
  let record = null;

  try {
    const body = await request.json();
    record = await updatePost(id, body);
  } catch (error) {
    return toPostWriteErrorResponse(error);
  }

  if (!record) {
    return NextResponse.json({ message: "Post not found" }, { status: 404 });
  }

  return NextResponse.json({ data: record });
}

export async function DELETE(_: NextRequest, context: RouteContext) {
  const session = await requireAdminSession();

  if (!session.ok) {
    return session.response;
  }

  const { id } = await context.params;
  const record = await deletePost(id);

  if (!record) {
    return NextResponse.json({ message: "Post not found" }, { status: 404 });
  }

  return NextResponse.json({ data: record });
}
