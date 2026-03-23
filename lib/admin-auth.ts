import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

import { ensurePrismaReady, prisma } from "@/lib/prisma";

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

function verifyPassword(password: string, storedHash: string) {
  const [salt, originalHash] = storedHash.split(":");

  if (!salt || !originalHash) {
    return false;
  }

  const passwordHash = hashPassword(password, salt).split(":")[1];

  return timingSafeEqual(Buffer.from(originalHash, "hex"), Buffer.from(passwordHash, "hex"));
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

  const existing = await prisma.adminUser.findUnique({
    where: { email },
  });

  if (existing) {
    const nextData: Partial<{
      name: string;
      passwordHash: string;
    }> = {};

    if (existing.name !== name) {
      nextData.name = name;
    }

    if (!verifyPassword(password, existing.passwordHash)) {
      nextData.passwordHash = hashPassword(password);
    }

    if (Object.keys(nextData).length === 0) {
      return existing;
    }

    return prisma.adminUser.update({
      where: { id: existing.id },
      data: nextData,
    });
  }

  return prisma.adminUser.create({
    data: {
      email,
      name,
      passwordHash: hashPassword(password),
      role: "admin",
    },
  });
}

export async function authenticateAdmin(email: string, password: string) {
  await ensureAdminUser();

  const user = await prisma.adminUser.findUnique({
    where: { email },
  });

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
    identity: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    } satisfies SessionIdentity,
  };
}

export async function getIdentityByToken(token: string | undefined | null) {
  if (!token) {
    return null;
  }

  await ensurePrismaReady();
  await ensureAdminUser();

  const session = await prisma.adminSession.findUnique({
    where: { token },
    include: {
      user: true,
    },
  });

  if (!session) {
    return null;
  }

  if (session.expiresAt.getTime() <= Date.now()) {
    await prisma.adminSession.delete({
      where: { token },
    });
    return null;
  }

  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
    role: session.user.role,
  } satisfies SessionIdentity;
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
