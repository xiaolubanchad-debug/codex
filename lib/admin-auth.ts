import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

import { ensurePrismaReady, prisma } from "@/lib/prisma";
import type { AdminAccountRecord } from "@/lib/admin-types";

const SESSION_COOKIE_NAME = "editorial_admin_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

type SessionIdentity = {
  id: string;
  email: string;
  name: string;
  role: string;
};

function hashPassword(password: string, salt?: string) {
  const resolvedSalt = salt ?? randomBytes(16).toString("hex");
  const derivedKey = scryptSync(password, resolvedSalt, 64).toString("hex");
  return `${resolvedSalt}:${derivedKey}`;
}

export function verifyPassword(password: string, storedHash: string) {
  const [salt, originalHash] = storedHash.split(":");

  if (!salt || !originalHash) {
    return false;
  }

  const passwordHash = hashPassword(password, salt).split(":")[1];

  return timingSafeEqual(Buffer.from(originalHash, "hex"), Buffer.from(passwordHash, "hex"));
}

function mapIdentity(user: { id: string; email: string; name: string; role: string }): SessionIdentity {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };
}

function mapAccount(user: {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}): AdminAccountRecord {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}

async function getUserByToken(token: string | undefined | null) {
  if (!token) {
    return null;
  }

  await ensurePrismaReady();
  await ensureAdminUser();

  const session = await prisma.adminSession.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!session) {
    return null;
  }

  if (session.expiresAt.getTime() <= Date.now()) {
    await prisma.adminSession.delete({ where: { token } });
    return null;
  }

  return session.user;
}

export function getSessionCookieName() {
  return SESSION_COOKIE_NAME;
}

export function getSessionMaxAgeSeconds() {
  return SESSION_MAX_AGE_SECONDS;
}

export function shouldUseSecureAdminCookie() {
  return process.env.ADMIN_COOKIE_SECURE === "true";
}

export async function ensureAdminUser() {
  await ensurePrismaReady();

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || "Admin";

  if (!email || !password) {
    return null;
  }

  const existing = await prisma.adminUser.findUnique({ where: { email } });

  if (existing) {
    if (existing.role !== "super-admin") {
      return prisma.adminUser.update({
        where: { id: existing.id },
        data: { role: "super-admin" },
      });
    }

    return existing;
  }

  return prisma.adminUser.create({
    data: {
      email,
      name,
      passwordHash: hashPassword(password),
      role: "super-admin",
    },
  });
}

export async function authenticateAdmin(email: string, password: string) {
  await ensureAdminUser();

  const user = await prisma.adminUser.findUnique({ where: { email } });

  if (!user) {
    return null;
  }

  const isValid = verifyPassword(password, user.passwordHash);

  if (!isValid) {
    return null;
  }

  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_SECONDS * 1000);

  await prisma.adminSession.create({
    data: {
      token,
      userId: user.id,
      expiresAt,
    },
  });

  return {
    token,
    expiresAt,
    identity: mapIdentity(user),
  };
}

export async function getIdentityByToken(token: string | undefined | null) {
  const user = await getUserByToken(token);
  return user ? mapIdentity(user) : null;
}

export async function getAccountByToken(token: string | undefined | null) {
  const user = await getUserByToken(token);
  return user ? mapAccount(user) : null;
}

export async function updateAccountByToken(
  token: string | undefined | null,
  input: {
    name?: string;
    currentPassword?: string;
    nextPassword?: string;
  },
) {
  const user = await getUserByToken(token);

  if (!user) {
    return { ok: false as const, reason: "unauthorized" as const };
  }

  const data: { name?: string; passwordHash?: string } = {};
  const nextName = input.name?.trim();
  const nextPassword = input.nextPassword?.trim();
  const currentPassword = input.currentPassword ?? "";

  if (nextName && nextName !== user.name) {
    data.name = nextName;
  }

  if (nextPassword) {
    if (!currentPassword) {
      return { ok: false as const, reason: "missing-current-password" as const };
    }

    if (!verifyPassword(currentPassword, user.passwordHash)) {
      return { ok: false as const, reason: "invalid-current-password" as const };
    }

    if (nextPassword.length < 8) {
      return { ok: false as const, reason: "weak-password" as const };
    }

    data.passwordHash = hashPassword(nextPassword);
  }

  if (Object.keys(data).length === 0) {
    return { ok: true as const, data: mapAccount(user) };
  }

  const updated = await prisma.adminUser.update({
    where: { id: user.id },
    data,
  });

  return { ok: true as const, data: mapAccount(updated) };
}

export async function revokeSession(token: string | undefined | null) {
  if (!token) {
    return;
  }

  await ensurePrismaReady();
  await prisma.adminSession.deleteMany({
    where: { token },
  });
}
