import { NextRequest, NextResponse } from "next/server";

import { requireAdminSession } from "@/lib/admin-route";
import { createPost, listPosts } from "@/lib/admin-store";

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

  const body = await request.json();
  const record = await createPost(body);
  return NextResponse.json({ data: record }, { status: 201 });
}
