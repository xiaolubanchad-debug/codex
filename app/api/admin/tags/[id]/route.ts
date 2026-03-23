import { NextRequest, NextResponse } from "next/server";

import { requireAdminSession } from "@/lib/admin-route";
import { deleteTag, getTag, updateTag } from "@/lib/admin-store";

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
  const record = await getTag(id);

  if (!record) {
    return NextResponse.json({ message: "Tag not found" }, { status: 404 });
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
  const record = await updateTag(id, body);

  if (!record) {
    return NextResponse.json({ message: "Tag not found" }, { status: 404 });
  }

  return NextResponse.json({ data: record });
}

export async function DELETE(_: NextRequest, context: RouteContext) {
  const session = await requireAdminSession();

  if (!session.ok) {
    return session.response;
  }

  const { id } = await context.params;
  const record = await deleteTag(id);

  if (!record) {
    return NextResponse.json({ message: "Tag not found" }, { status: 404 });
  }

  return NextResponse.json({ data: record });
}
