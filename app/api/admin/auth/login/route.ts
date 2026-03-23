import { NextRequest, NextResponse } from "next/server";

import {
  authenticateAdmin,
  getSessionCookieName,
  getSessionMaxAgeSeconds,
  shouldUseSecureAdminCookie,
} from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;

  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ message: "请求体不是合法的 JSON" }, { status: 400 });
  }

  const email = String(body.email ?? "").trim();
  const password = String(body.password ?? "");

  if (!email || !password) {
    return NextResponse.json({ message: "请输入邮箱和密码" }, { status: 400 });
  }

  const session = await authenticateAdmin(email, password);

  if (!session) {
    return NextResponse.json({ message: "邮箱或密码不正确" }, { status: 401 });
  }

  const response = NextResponse.json({ data: session.identity });
  response.cookies.set(getSessionCookieName(), session.token, {
    httpOnly: true,
    sameSite: "lax",
    secure: shouldUseSecureAdminCookie(),
    path: "/",
    maxAge: getSessionMaxAgeSeconds(),
    expires: session.expiresAt,
  });

  return response;
}
