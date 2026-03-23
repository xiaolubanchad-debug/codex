import { NextRequest, NextResponse } from "next/server";

import { getPublicPostBySlug } from "@/lib/public-site";

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(_: NextRequest, context: RouteContext) {
  const { slug } = await context.params;
  const post = await getPublicPostBySlug(slug);

  if (!post) {
    return NextResponse.json({ message: "Post not found" }, { status: 404 });
  }

  return NextResponse.json({ data: post });
}
