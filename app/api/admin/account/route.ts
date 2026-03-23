import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { getAccountByToken, getSessionCookieName, updateAccountByToken } from "@/lib/admin-auth";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(getSessionCookieName())?.value;
  const account = await getAccountByToken(token);

  if (!account) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ data: account });
}

export async function PUT(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get(getSessionCookieName())?.value;
  const body = (await request.json()) as {
    name?: string;
    currentPassword?: string;
    nextPassword?: string;
  };

  const result = await updateAccountByToken(token, body);

  if (!result.ok) {
    if (result.reason === "unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (result.reason === "missing-current-password") {
      return NextResponse.json({ message: "修改密码时必须填写当前密码" }, { status: 400 });
    }

    if (result.reason === "invalid-current-password") {
      return NextResponse.json({ message: "当前密码不正确" }, { status: 400 });
    }

    if (result.reason === "weak-password") {
      return NextResponse.json({ message: "新密码至少需要 8 位" }, { status: 400 });
    }
  }

  return NextResponse.json({ data: result.data });
}
