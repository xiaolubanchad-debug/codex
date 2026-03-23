import { NextRequest, NextResponse } from "next/server";

import { listPublicPosts } from "@/lib/public-site";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const q = searchParams.get("q")?.trim() || undefined;
  const category = searchParams.get("category")?.trim() || undefined;
  const limitValue = Number(searchParams.get("limit"));
  const limit = Number.isFinite(limitValue) && limitValue > 0 ? limitValue : undefined;

  const data = await listPublicPosts({
    q,
    category,
    limit,
  });

  return NextResponse.json({
    data,
    total: data.length,
  });
}
