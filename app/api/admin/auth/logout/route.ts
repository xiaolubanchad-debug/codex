import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import {
  getSessionCookieName,
  revokeSession,
  shouldUseSecureAdminCookie,
} from "@/lib/admin-auth";

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get(getSessionCookieName())?.value;

  await revokeSession(token);

  const response = NextResponse.json({ success: true });
  response.cookies.set(getSessionCookieName(), "", {
    httpOnly: true,
    sameSite: "lax",
    secure: shouldUseSecureAdminCookie(),
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });

  return response;
}
