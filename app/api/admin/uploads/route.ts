import { mkdir, readdir, readFile, stat, unlink, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

import { NextRequest, NextResponse } from "next/server";

import { requireAdminSession } from "@/lib/admin-route";
import type { AdminUploadRecord } from "@/lib/admin-types";

const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "articles");
const UPLOAD_MANIFEST_PATH = path.join(process.cwd(), "data", "upload-manifest.json");

type UploadManifest = Record<
  string,
  {
    originalName: string;
    mimeType: string;
  }
>;

function getMimeTypeByExtension(fileName: string) {
  const extension = path.extname(fileName).toLowerCase();

  if (extension === ".png") return "image/png";
  if (extension === ".webp") return "image/webp";
  if (extension === ".gif") return "image/gif";
  return "image/jpeg";
}

function getFileExtension(file: File) {
  const originalExtension = path.extname(file.name).toLowerCase();

  if (originalExtension) {
    return originalExtension;
  }

  if (file.type === "image/png") return ".png";
  if (file.type === "image/webp") return ".webp";
  if (file.type === "image/gif") return ".gif";

  return ".jpg";
}

async function readUploadManifest(): Promise<UploadManifest> {
  try {
    const content = await readFile(UPLOAD_MANIFEST_PATH, "utf8");
    const parsed = JSON.parse(content) as UploadManifest;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

async function writeUploadManifest(manifest: UploadManifest) {
  await mkdir(path.dirname(UPLOAD_MANIFEST_PATH), { recursive: true });
  await writeFile(UPLOAD_MANIFEST_PATH, JSON.stringify(manifest, null, 2));
}

async function listUploads() {
  await mkdir(UPLOAD_DIR, { recursive: true });
  const manifest = await readUploadManifest();
  const entries = await readdir(UPLOAD_DIR, { withFileTypes: true });

  const files = await Promise.all(
    entries
      .filter((entry) => entry.isFile())
      .map(async (entry) => {
        const fullPath = path.join(UPLOAD_DIR, entry.name);
        const metadata = await stat(fullPath);

        return {
          fileName: entry.name,
          originalName: manifest[entry.name]?.originalName || entry.name,
          mimeType: manifest[entry.name]?.mimeType || getMimeTypeByExtension(entry.name),
          size: metadata.size,
          url: `/uploads/articles/${entry.name}`,
          modifiedAt: metadata.mtime.toISOString(),
        } satisfies AdminUploadRecord;
      }),
  );

  return files.sort((left, right) => (right.modifiedAt ?? "").localeCompare(left.modifiedAt ?? ""));
}

export async function GET() {
  const session = await requireAdminSession();

  if (!session.ok) {
    return session.response;
  }

  const data = await listUploads();
  return NextResponse.json({ data, total: data.length });
}

export async function POST(request: NextRequest) {
  const session = await requireAdminSession();

  if (!session.ok) {
    return session.response;
  }

  const formData = await request.formData();
  const entry = formData.get("file");

  if (!(entry instanceof File)) {
    return NextResponse.json({ message: "请先选择一张图片" }, { status: 400 });
  }

  if (!ALLOWED_MIME_TYPES.has(entry.type)) {
    return NextResponse.json({ message: "当前仅支持 JPG、PNG、WebP 和 GIF 图片" }, { status: 400 });
  }

  if (entry.size > 5 * 1024 * 1024) {
    return NextResponse.json({ message: "图片大小不能超过 5MB" }, { status: 400 });
  }

  const extension = getFileExtension(entry);
  const fileName = `${Date.now()}-${randomUUID()}${extension}`;
  const filePath = path.join(UPLOAD_DIR, fileName);

  await mkdir(UPLOAD_DIR, { recursive: true });
  await writeFile(filePath, Buffer.from(await entry.arrayBuffer()));

  const manifest = await readUploadManifest();
  manifest[fileName] = {
    originalName: entry.name,
    mimeType: entry.type,
  };
  await writeUploadManifest(manifest);

  const payload: AdminUploadRecord = {
    fileName,
    originalName: entry.name,
    mimeType: entry.type,
    size: entry.size,
    url: `/uploads/articles/${fileName}`,
    modifiedAt: new Date().toISOString(),
  };

  return NextResponse.json({ data: payload }, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const session = await requireAdminSession();

  if (!session.ok) {
    return session.response;
  }

  const fileName = request.nextUrl.searchParams.get("fileName")?.trim();

  if (!fileName) {
    return NextResponse.json({ message: "缺少文件名" }, { status: 400 });
  }

  const safeName = path.basename(fileName);
  const targetPath = path.join(UPLOAD_DIR, safeName);

  try {
    await unlink(targetPath);
    const manifest = await readUploadManifest();
    if (manifest[safeName]) {
      delete manifest[safeName];
      await writeUploadManifest(manifest);
    }
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error && "code" in error && error.code === "ENOENT"
            ? "文件不存在或已被删除"
            : "删除文件失败，请稍后重试",
      },
      { status: error instanceof Error && "code" in error && error.code === "ENOENT" ? 404 : 409 },
    );
  }

  return NextResponse.json({ success: true });
}
