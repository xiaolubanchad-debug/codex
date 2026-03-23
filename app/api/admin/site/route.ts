import { NextRequest, NextResponse } from "next/server";

import { requireAdminSession } from "@/lib/admin-route";
import { getSiteSettings, updateSiteSettings } from "@/lib/site-settings";

export async function GET() {
  const session = await requireAdminSession();

  if (!session.ok) {
    return session.response;
  }

  const data = await getSiteSettings();
  return NextResponse.json({ data });
}

export async function PUT(request: NextRequest) {
  const session = await requireAdminSession();

  if (!session.ok) {
    return session.response;
  }

  const body = await request.json();
  const data = await updateSiteSettings(body);

  return NextResponse.json({ data });
}
