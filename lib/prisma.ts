import path from "path";

import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var __editorialPrisma__: PrismaClient | undefined;
}

function getDatabaseUrl() {
  const configuredUrl = process.env.DATABASE_URL;

  if (configuredUrl?.startsWith("file:")) {
    const rawPath = configuredUrl.slice("file:".length);

    if (rawPath === ":memory:") {
      return configuredUrl;
    }

    const isWindowsAbsolutePath = /^[a-zA-Z]:[/\\]/.test(rawPath);
    const isUnixAbsolutePath = rawPath.startsWith("/");

    if (isWindowsAbsolutePath || isUnixAbsolutePath) {
      return `file:${rawPath.replace(/\\/g, "/")}`;
    }

    const absolutePath = path.resolve(process.cwd(), "prisma", rawPath);
    return `file:${absolutePath.replace(/\\/g, "/")}`;
  }

  const absolutePath = path.join(process.cwd(), "prisma", "dev.db");
  return `file:${absolutePath.replace(/\\/g, "/")}`;
}

const adapter = new PrismaBetterSqlite3({
  url: getDatabaseUrl(),
});

export const prisma =
  global.__editorialPrisma__ ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

let prismaReadyPromise: Promise<void> | undefined;

export async function ensurePrismaReady() {
  if (!prismaReadyPromise) {
    prismaReadyPromise = (async () => {
      await prisma.$executeRawUnsafe("PRAGMA journal_mode = MEMORY");
      await prisma.$executeRawUnsafe("PRAGMA temp_store = MEMORY");
      await prisma.$executeRawUnsafe("PRAGMA foreign_keys = ON");
    })().catch((error) => {
      prismaReadyPromise = undefined;
      throw error;
    });
  }

  await prismaReadyPromise;
}

if (process.env.NODE_ENV !== "production") {
  global.__editorialPrisma__ = prisma;
}
