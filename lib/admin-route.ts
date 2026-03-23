import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { getIdentityByToken, getSessionCookieName } from "@/lib/admin-auth";

export async function requireAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(getSessionCookieName())?.value;
  const identity = await getIdentityByToken(token);

  if (!identity) {
    return {
      ok: false as const,
      response: NextResponse.json({ message: "Unauthorized" }, { status: 401 }),
    };
  }

  return {
    ok: true as const,
    identity,
  };
}
