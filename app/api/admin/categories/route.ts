import { NextRequest, NextResponse } from "next/server";

import { requireAdminSession } from "@/lib/admin-route";
import { createCategory, listCategories } from "@/lib/admin-store";

export async function GET() {
  const session = await requireAdminSession();

  if (!session.ok) {
    return session.response;
  }

  return NextResponse.json(await listCategories());
}

export async function POST(request: NextRequest) {
  const session = await requireAdminSession();

  if (!session.ok) {
    return session.response;
  }

  const body = await request.json();
  const record = await createCategory(body);
  return NextResponse.json({ data: record }, { status: 201 });
}
