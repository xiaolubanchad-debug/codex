import { NextResponse } from "next/server";

import { getPublicCategories } from "@/lib/public-site";

export async function GET() {
  const data = await getPublicCategories();

  return NextResponse.json({
    data,
    total: data.length,
  });
}
