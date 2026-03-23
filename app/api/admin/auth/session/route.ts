import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { getIdentityByToken, getSessionCookieName } from "@/lib/admin-auth";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(getSessionCookieName())?.value;
  const identity = await getIdentityByToken(token);

  if (!identity) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    data: identity,
  });
}
