import { NextRequest, NextResponse } from "next/server";

import { requireAdminSession } from "@/lib/admin-route";
import { createTag, listTags } from "@/lib/admin-store";

export async function GET() {
  const session = await requireAdminSession();

  if (!session.ok) {
    return session.response;
  }

  return NextResponse.json(await listTags());
}

export async function POST(request: NextRequest) {
  const session = await requireAdminSession();

  if (!session.ok) {
    return session.response;
  }

  const body = await request.json();
  const record = await createTag(body);
  return NextResponse.json({ data: record }, { status: 201 });
}
