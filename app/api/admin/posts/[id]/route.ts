import { NextRequest, NextResponse } from "next/server";

import { requireAdminSession } from "@/lib/admin-route";
import { deletePost, getPost, updatePost } from "@/lib/admin-store";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

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
  const body = await request.json();
  const record = await updatePost(id, body);

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
