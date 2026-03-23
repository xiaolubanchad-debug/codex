import { NextRequest, NextResponse } from "next/server";

import { requireAdminSession } from "@/lib/admin-route";
import { createPost, listPosts } from "@/lib/admin-store";

function toPostWriteErrorResponse(error: unknown) {
  if (typeof error === "object" && error && "code" in error && error.code === "P2002") {
    const target = Array.isArray((error as { meta?: { target?: string[] } }).meta?.target)
      ? (error as { meta?: { target?: string[] } }).meta?.target
      : [];

    if (target?.includes("slug")) {
      return NextResponse.json({ message: "Slug 已存在，请换一个更唯一的地址" }, { status: 409 });
    }
  }

  return NextResponse.json({ message: "文章保存失败，请稍后重试" }, { status: 500 });
}

export async function GET(request: NextRequest) {
  const session = await requireAdminSession();

  if (!session.ok) {
    return session.response;
  }

  const searchParams = request.nextUrl.searchParams;
  const payload = await listPosts({
    q: searchParams.get("q") ?? undefined,
    status: searchParams.get("status") ?? undefined,
    category: searchParams.get("category") ?? undefined,
  });

  return NextResponse.json(payload);
}

export async function POST(request: NextRequest) {
  const session = await requireAdminSession();

  if (!session.ok) {
    return session.response;
  }

  try {
    const body = await request.json();
    const record = await createPost(body);
    return NextResponse.json({ data: record }, { status: 201 });
  } catch (error) {
    return toPostWriteErrorResponse(error);
  }
}
