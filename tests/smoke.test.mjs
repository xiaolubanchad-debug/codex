import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { spawn, spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const workspaceRoot = process.cwd();
const port = Number(process.env.SMOKE_TEST_PORT ?? 3101);
const baseUrl = process.env.SMOKE_TEST_BASE_URL ?? `http://127.0.0.1:${port}`;
const envFilePath = join(workspaceRoot, ".env");
const useExistingServer = process.env.SMOKE_TEST_USE_EXISTING_SERVER === "true";

let serverProcess;
let sessionCookie = "";
const createdPostIds = [];
const uploadedFileNames = [];
let originalSiteSettings = null;
let originalAccount = null;

function readEnvFile(filePath) {
  const content = readFileSync(filePath, "utf8");
  const entries = {};

  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const rawValue = trimmed.slice(separatorIndex + 1).trim();
    entries[key] = rawValue.replace(/^"(.*)"$/, "$1");
  }

  return entries;
}

function spawnServer() {
  if (useExistingServer) {
    return null;
  }

  if (process.platform === "win32") {
    return spawn("cmd.exe", ["/d", "/s", "/c", `npm run start -- --port ${port}`], {
      cwd: workspaceRoot,
      env: { ...process.env, PORT: String(port) },
      stdio: ["ignore", "pipe", "pipe"],
    });
  }

  return spawn("npm", ["run", "start", "--", "--port", String(port)], {
    cwd: workspaceRoot,
    env: { ...process.env, PORT: String(port) },
    stdio: ["ignore", "pipe", "pipe"],
  });
}

async function waitUntilHttpReady(deadline) {
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`${baseUrl}/`);
      if (response.ok) {
        return;
      }
    } catch {}

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  throw new Error("等待测试服务器真正可访问超时");
}

async function waitForServer(processHandle) {
  const deadline = Date.now() + 30000;

  if (!processHandle) {
    await waitUntilHttpReady(deadline);
    return;
  }

  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      cleanup();
      reject(new Error("等待测试服务器启动超时"));
    }, 30000);

    function cleanup() {
      clearTimeout(timeout);
      processHandle.stdout?.off("data", onData);
      processHandle.stderr?.off("data", onData);
      processHandle.off("exit", onExit);
    }

    async function onData(chunk) {
      const text = chunk.toString();
      if (text.includes("Ready in") || text.includes(`http://localhost:${port}`)) {
        cleanup();
        try {
          await waitUntilHttpReady(deadline);
          resolve();
        } catch (error) {
          reject(error);
        }
      }
    }

    function onExit(code) {
      cleanup();
      reject(new Error(`测试服务器意外退出，code=${code ?? "unknown"}`));
    }

    processHandle.stdout?.on("data", onData);
    processHandle.stderr?.on("data", onData);
    processHandle.on("exit", onExit);
  });
}

async function loginAsAdmin() {
  const env = readEnvFile(envFilePath);
  const response = await fetch(`${baseUrl}/api/admin/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: env.ADMIN_EMAIL,
      password: env.ADMIN_PASSWORD,
    }),
  });

  assert.equal(response.status, 200, "管理员登录应该成功");
  const cookieHeader = response.headers.get("set-cookie");
  assert.ok(cookieHeader, "登录后应该写入会话 cookie");
  sessionCookie = cookieHeader.split(";")[0];
}

async function authedFetch(pathname, init = {}) {
  const headers = new Headers(init.headers ?? {});
  if (sessionCookie) {
    headers.set("cookie", sessionCookie);
  }

  return fetch(`${baseUrl}${pathname}`, {
    ...init,
    headers,
  });
}

async function createFeaturedPost(index) {
  const suffix = `${Date.now()}-${index}`;
  const response = await authedFetch("/api/admin/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: `自动测试推荐文章 ${index}`,
      slug: `smoke-featured-${suffix}`,
      author: "自动化测试",
      category: "测试栏目",
      excerpt: `这是自动化测试创建的推荐文章 ${index}。`,
      publishedAt: "2026-03-23",
      readingTime: "3 分钟",
      status: "published",
      featured: true,
      coverLabel: "自动测试",
      tags: ["自动测试", "推荐轮播"],
      bodyText: `<p>自动化测试正文 ${index}</p><p>用于校验首页推荐轮播是否同时渲染多篇推荐文章。</p>`,
    }),
  });

  assert.equal(response.status, 201, "创建推荐文章应该成功");
  const payload = await response.json();
  createdPostIds.push(payload.data.id);
  return payload.data;
}

async function createPost(values) {
  const response = await authedFetch("/api/admin/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });

  assert.equal(response.status, 201, "创建文章应该成功");
  const payload = await response.json();
  createdPostIds.push(payload.data.id);
  return payload.data;
}

async function updatePost(id, values) {
  const response = await authedFetch(`/api/admin/posts/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });

  assert.equal(response.status, 200, "更新文章应该成功");
  const payload = await response.json();
  return payload.data;
}

async function readSiteSettings() {
  const response = await authedFetch("/api/admin/site");
  assert.equal(response.status, 200, "站点文案接口应该可访问");
  const payload = await response.json();
  return payload.data;
}

async function updateSiteSettings(values) {
  const response = await authedFetch("/api/admin/site", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });

  assert.equal(response.status, 200, "更新站点文案应该成功");
  const payload = await response.json();
  return payload.data;
}

async function uploadTestImage() {
  const formData = new FormData();
  const file = new File(
    [Buffer.from("R0lGODlhAQABAIABAP///wAAACwAAAAAAQABAAACAkQBADs=", "base64")],
    `smoke-${Date.now()}.gif`,
    { type: "image/gif" },
  );
  formData.append("file", file);

  const response = await authedFetch("/api/admin/uploads", {
    method: "POST",
    body: formData,
  });

  assert.equal(response.status, 201, "上传测试图片应该成功");
  const payload = await response.json();
  uploadedFileNames.push(payload.data.fileName);
  return payload.data;
}

async function readAccount() {
  const response = await authedFetch("/api/admin/account");
  assert.equal(response.status, 200, "账户接口应该可访问");
  const payload = await response.json();
  return payload.data;
}

async function updateAccount(values) {
  const response = await authedFetch("/api/admin/account", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });

  assert.equal(response.status, 200, "更新账户信息应该成功");
  const payload = await response.json();
  return payload.data;
}

async function cleanupPosts() {
  while (createdPostIds.length) {
    const id = createdPostIds.pop();
    await authedFetch(`/api/admin/posts/${id}`, {
      method: "DELETE",
    });
  }
}

async function cleanupUploads() {
  while (uploadedFileNames.length) {
    const fileName = uploadedFileNames.pop();
    await authedFetch(`/api/admin/uploads?fileName=${encodeURIComponent(fileName)}`, {
      method: "DELETE",
    });
  }
}

before(async () => {
  serverProcess = spawnServer();
  await waitForServer(serverProcess);
  await loginAsAdmin();
  originalSiteSettings = await readSiteSettings();
  originalAccount = await readAccount();
});

after(async () => {
  await cleanupPosts();
  await cleanupUploads();

  if (originalSiteSettings) {
    await updateSiteSettings(originalSiteSettings);
  }

  if (originalAccount) {
    await updateAccount({ name: originalAccount.name });
  }

  if (serverProcess && !serverProcess.killed) {
    if (process.platform === "win32") {
      spawnSync("taskkill", ["/pid", String(serverProcess.pid), "/t", "/f"], {
        stdio: "ignore",
      });
    } else {
      serverProcess.kill("SIGTERM");
    }
  }
});

test("关于页读取后台站点文案", async () => {
  const settingsPayload = await readSiteSettings();

  const aboutResponse = await fetch(`${baseUrl}/about`);
  assert.equal(aboutResponse.status, 200, "关于页应该可访问");
  const aboutHtml = await aboutResponse.text();

  assert.ok(aboutHtml.includes(settingsPayload.aboutCoverageTitle));
  assert.ok(aboutHtml.includes(settingsPayload.aboutBannerTitle));
});

test("首页会同时渲染多篇推荐文章轮播", async () => {
  const firstPost = await createFeaturedPost(1);
  const secondPost = await createFeaturedPost(2);

  const homeResponse = await fetch(`${baseUrl}/`);
  assert.equal(homeResponse.status, 200, "首页应该可访问");
  const homeHtml = await homeResponse.text();

  assert.ok(homeHtml.includes("hero-carousel"));
  assert.ok(homeHtml.includes(firstPost.title));
  assert.ok(homeHtml.includes(secondPost.title));
});

test("后台文章新建页可访问，并保留富文本编辑入口", async () => {
  const response = await authedFetch("/admin/posts/create");
  assert.equal(response.status, 200, "后台文章新建页应该可访问");

  const html = await response.text();
  assert.ok(html.includes("新建文章"));
  assert.ok(html.includes("富文本编辑"));
});

test("公开内容链路会读取新发布文章", async () => {
  const post = await createFeaturedPost(3);

  const listResponse = await fetch(`${baseUrl}/posts`);
  assert.equal(listResponse.status, 200, "归档页应该可访问");
  const listHtml = await listResponse.text();
  assert.ok(listHtml.includes(post.title));

  const searchResponse = await fetch(`${baseUrl}/search?q=${encodeURIComponent(post.title)}`);
  assert.equal(searchResponse.status, 200, "搜索页应该可访问");
  const searchHtml = await searchResponse.text();
  assert.ok(searchHtml.includes(post.title));

  const detailResponse = await fetch(`${baseUrl}/posts/${post.slug}`);
  assert.equal(detailResponse.status, 200, "详情页应该可访问");
  const detailHtml = await detailResponse.text();
  assert.ok(detailHtml.includes(post.title));
  assert.ok(detailHtml.includes(`自动化测试正文 3`));
});

test("后台核心管理路由可访问", async () => {
  const targets = ["/admin/media", "/admin/account", "/admin/site", "/admin/posts"];

  for (const pathname of targets) {
    const response = await authedFetch(pathname);
    assert.equal(response.status, 200, `${pathname} 应该可访问`);
  }
});

test("草稿文章不会进入前台，发布后会立即可见", async () => {
  const slug = `smoke-draft-${Date.now()}`;
  const post = await createPost({
    title: "自动测试草稿文章",
    slug,
    author: "自动化测试",
    category: "测试栏目",
    excerpt: "这是一篇先作为草稿保存的测试文章。",
    publishedAt: "2026-03-23",
    readingTime: "4 分钟",
    status: "draft",
    featured: false,
    coverLabel: "自动测试",
    tags: ["自动测试", "草稿流程"],
    bodyText: "<p>草稿内容</p>",
  });

  const draftDetailResponse = await fetch(`${baseUrl}/posts/${slug}`);
  assert.equal(draftDetailResponse.status, 404, "草稿文章不应直接出现在前台详情页");

  await updatePost(post.id, {
    status: "published",
    bodyText: "<p>已发布内容</p>",
    excerpt: "这是一篇已经发布的测试文章。",
  });

  const publishedDetailResponse = await fetch(`${baseUrl}/posts/${slug}`);
  assert.equal(publishedDetailResponse.status, 200, "发布后的文章应出现在前台详情页");
  const html = await publishedDetailResponse.text();
  assert.ok(html.includes("已发布内容"));
});

test("后台修改关于页文案后，前台会同步读取最新内容", async () => {
  const marker = `自动测试横幅 ${Date.now()}`;

  await updateSiteSettings({
    aboutBannerTitle: marker,
    aboutCoverageTitle: "自动测试栏目覆盖",
  });

  const aboutResponse = await fetch(`${baseUrl}/about`);
  assert.equal(aboutResponse.status, 200, "关于页应该可访问");
  const aboutHtml = await aboutResponse.text();

  assert.ok(aboutHtml.includes(marker));
  assert.ok(aboutHtml.includes("自动测试栏目覆盖"));
});

test("媒体库支持上传，并能在列表中读到新素材", async () => {
  const uploaded = await uploadTestImage();

  const mediaResponse = await authedFetch("/api/admin/uploads");
  assert.equal(mediaResponse.status, 200, "媒体库接口应该可访问");
  const mediaPayload = await mediaResponse.json();

  const matched = mediaPayload.data.find((item) => item.fileName === uploaded.fileName);
  assert.ok(matched, "新上传的素材应该出现在媒体库列表中");
  assert.equal(matched.mimeType, "image/gif");
});

test("后台更新文章后，详情读取会返回最新字段", async () => {
  const created = await createPost({
    title: "自动测试待更新文章",
    slug: `smoke-update-${Date.now()}`,
    author: "自动化测试",
    category: "测试栏目",
    excerpt: "这是一篇待更新的测试文章。",
    publishedAt: "2026-03-23",
    readingTime: "4 分钟",
    status: "review",
    featured: false,
    coverLabel: "自动测试",
    tags: ["自动测试", "更新流程"],
    bodyText: "<p>初始正文</p>",
  });

  const updated = await updatePost(created.id, {
    title: "自动测试已更新文章",
    excerpt: "这是一篇已经完成更新的测试文章。",
    status: "published",
    featured: true,
    bodyText: "<h2>更新后的正文</h2><p>这段内容用于校验编辑后的读取结果。</p>",
  });

  assert.equal(updated.title, "自动测试已更新文章");
  assert.equal(updated.status, "published");
  assert.equal(updated.featured, true);

  const response = await authedFetch(`/api/admin/posts/${created.id}`);
  assert.equal(response.status, 200, "后台文章详情接口应该可访问");
  const payload = await response.json();

  assert.equal(payload.data.title, "自动测试已更新文章");
  assert.equal(payload.data.status, "published");
  assert.ok(payload.data.body.includes("更新后的正文"));

  const publicDetailResponse = await fetch(`${baseUrl}/posts/${created.slug}`);
  assert.equal(publicDetailResponse.status, 200, "已编辑并发布的文章应同步出现在前台详情页");
  const publicDetailHtml = await publicDetailResponse.text();

  assert.ok(publicDetailHtml.includes("自动测试已更新文章"));
  assert.ok(publicDetailHtml.includes("这是一篇已经完成更新的测试文章。"));
  assert.ok(publicDetailHtml.includes("这段内容用于校验编辑后的读取结果。"));
});

test("媒体库图片插入正文后，前台详情页会渲染图片", async () => {
  const uploaded = await uploadTestImage();
  const slug = `smoke-image-post-${Date.now()}`;

  await createPost({
    title: "自动测试图片正文文章",
    slug,
    author: "自动化测试",
    category: "测试栏目",
    excerpt: "这是一篇带正文图片的测试文章。",
    publishedAt: "2026-03-23",
    readingTime: "3 分钟",
    status: "published",
    featured: false,
    coverLabel: "自动测试",
    tags: ["自动测试", "图片正文"],
    bodyText: `<figure><img src="${uploaded.url}" alt="测试图片" /><figcaption>测试图片</figcaption></figure><p>图片后的正文内容。</p>`,
  });

  const detailResponse = await fetch(`${baseUrl}/posts/${slug}`);
  assert.equal(detailResponse.status, 200, "带图片的详情页应该可访问");
  const html = await detailResponse.text();

  assert.ok(html.includes(uploaded.url));
  assert.ok(html.includes("测试图片"));
  assert.ok(html.includes("图片后的正文内容"));
});

test("超级管理员名称修改后可以立即读取到最新值", async () => {
  const nextName = `测试管理员-${Date.now()}`;
  const updatedAccount = await updateAccount({ name: nextName });

  assert.equal(updatedAccount.name, nextName);

  const account = await readAccount();
  assert.equal(account.name, nextName);
});

test("搜索页会按栏目、作者与时间范围筛选，并在无结果时展示空状态", async () => {
  await createPost({
    title: "搜索筛选目标文章",
    slug: `smoke-search-hit-${Date.now()}`,
    author: "筛选作者甲",
    category: "筛选栏目甲",
    excerpt: "这是一篇用于命中搜索筛选的测试文章。",
    publishedAt: "2026-03-23",
    readingTime: "4 分钟",
    status: "published",
    featured: false,
    coverLabel: "搜索筛选",
    tags: ["搜索", "筛选"],
    bodyText: "<p>命中正文</p>",
  });

  await createPost({
    title: "搜索筛选干扰文章",
    slug: `smoke-search-miss-${Date.now()}`,
    author: "筛选作者乙",
    category: "筛选栏目乙",
    excerpt: "这是一篇用于排除搜索筛选的测试文章。",
    publishedAt: "2026-02-01",
    readingTime: "6 分钟",
    status: "published",
    featured: false,
    coverLabel: "搜索筛选",
    tags: ["搜索", "筛选"],
    bodyText: "<p>排除正文</p>",
  });

  const filteredResponse = await fetch(
    `${baseUrl}/search?category=${encodeURIComponent("筛选栏目甲")}&author=${encodeURIComponent("筛选作者甲")}&dateRange=7d`,
  );
  assert.equal(filteredResponse.status, 200, "带筛选条件的搜索页应该可访问");
  const filteredHtml = await filteredResponse.text();
  assert.ok(filteredHtml.includes("搜索筛选目标文章"));
  assert.ok(!filteredHtml.includes("搜索筛选干扰文章"));

  const emptyResponse = await fetch(
    `${baseUrl}/search?q=${encodeURIComponent("不存在的关键词")}&author=${encodeURIComponent("筛选作者甲")}`,
  );
  assert.equal(emptyResponse.status, 200, "空结果搜索页应该可访问");
  const emptyHtml = await emptyResponse.text();
  assert.ok(emptyHtml.includes("没有找到相关内容"));
});
