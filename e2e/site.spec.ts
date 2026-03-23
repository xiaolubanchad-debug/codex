import { expect, test, type APIRequestContext, type Page } from "@playwright/test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const envFilePath = join(process.cwd(), ".env");

type AccountSnapshot = {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
};

function readEnvFile(filePath: string) {
  const content = readFileSync(filePath, "utf8");
  const entries: Record<string, string> = {};

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

function randomSlug(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

test.describe.serial("站点浏览器级回归", () => {
  const env = readEnvFile(envFilePath);
  const createdPostIds: string[] = [];
  const uploadedFileNames: string[] = [];
  let originalSiteSettings: Record<string, unknown> | null = null;
  let originalAccount: AccountSnapshot | null = null;
  let currentAdminPassword = env.ADMIN_PASSWORD;

  async function loginAdminApi(request: APIRequestContext, password = currentAdminPassword) {
    const response = await request.post("/api/admin/auth/login", {
      data: {
        email: env.ADMIN_EMAIL,
        password,
      },
    });

    expect(response.ok()).toBeTruthy();
  }

  async function readSiteSettings(request: APIRequestContext) {
    await loginAdminApi(request);
    const response = await request.get("/api/admin/site");
    expect(response.ok()).toBeTruthy();
    const payload = await response.json();
    return payload.data as Record<string, unknown>;
  }

  async function readAccountApi(request: APIRequestContext) {
    await loginAdminApi(request);
    const response = await request.get("/api/admin/account");
    expect(response.ok()).toBeTruthy();
    const payload = await response.json();
    return payload.data as AccountSnapshot;
  }

  async function updateAccountApi(
    request: APIRequestContext,
    values: { name?: string; currentPassword?: string; nextPassword?: string },
  ) {
    await loginAdminApi(request);
    const response = await request.put("/api/admin/account", { data: values });
    expect(response.ok()).toBeTruthy();
    const payload = await response.json();
    return payload.data as AccountSnapshot;
  }

  async function createPost(request: APIRequestContext, values: Record<string, unknown>) {
    await loginAdminApi(request);
    const response = await request.post("/api/admin/posts", { data: values });
    expect(response.status()).toBe(201);
    const payload = await response.json();
    createdPostIds.push(payload.data.id);
    return payload.data as { id: string; slug: string; title: string };
  }

  async function loginAdminUi(page: Page, password = currentAdminPassword) {
    await page.goto("/admin/login");
    await page.getByLabel("邮箱").fill(env.ADMIN_EMAIL);
    await page.getByLabel("密码").fill(password);
    await page.getByRole("button", { name: "登录后台" }).click();
    await expect(page).toHaveURL(/\/admin(\/posts)?$/);
    await expect(page.locator(".admin-topbar")).toBeVisible();
  }

  async function logoutAdminUi(page: Page) {
    await page.getByRole("button", { name: "退出登录" }).click();
    await expect(page).toHaveURL(/\/admin\/login$/);
  }

  test.beforeAll(async ({ request }) => {
    originalSiteSettings = await readSiteSettings(request);
    originalAccount = await readAccountApi(request);
  });

  test.afterAll(async ({ request }) => {
    if (originalSiteSettings) {
      await loginAdminApi(request);
      await request.put("/api/admin/site", { data: originalSiteSettings });
    }

    for (const id of createdPostIds.reverse()) {
      await loginAdminApi(request);
      await request.delete(`/api/admin/posts/${id}`);
    }

    for (const fileName of uploadedFileNames.reverse()) {
      await loginAdminApi(request);
      await request.delete(`/api/admin/uploads?fileName=${encodeURIComponent(fileName)}`);
    }

    if (originalAccount) {
      await updateAccountApi(request, {
        name: originalAccount.name,
        ...(currentAdminPassword !== env.ADMIN_PASSWORD
          ? {
              currentPassword: currentAdminPassword,
              nextPassword: env.ADMIN_PASSWORD,
            }
          : {}),
      });
      currentAdminPassword = env.ADMIN_PASSWORD;
    }
  });

  test("前台导航、搜索与详情页链路正常", async ({ page, request }) => {
    const post = await createPost(request, {
      title: "浏览器测试公开文章",
      slug: randomSlug("browser-public"),
      author: "自动化测试",
      category: "测试栏目",
      excerpt: "这是一篇用于浏览器级导航与搜索测试的文章。",
      publishedAt: "2026-03-23",
      readingTime: "5 分钟",
      status: "published",
      featured: false,
      coverLabel: "浏览器测试",
      tags: ["自动测试", "浏览器搜索"],
      bodyText: "<h2>浏览器级详情页</h2><p>这里是浏览器测试正文。</p>",
    });

    await page.goto("/");
    const header = page.locator(".site-header");
    await expect(header.locator(".header-actions .search-link")).toBeVisible();
    await expect(header.locator(".nav").getByRole("link", { name: "归档", exact: true })).toBeVisible();

    await header.locator(".header-actions .search-link").click();
    await expect(page).toHaveURL(/\/search/);
    await page.getByRole("searchbox", { name: "搜索文章" }).fill(post.title);
    await page.getByRole("button", { name: "搜索" }).click();

    const detailLink = page.locator(`a[href="/posts/${post.slug}"]`).first();
    await expect(detailLink).toBeVisible();
    await detailLink.click();

    await expect(page).toHaveURL(new RegExp(`/posts/${post.slug}`));
    await expect(page.getByRole("heading", { name: post.title })).toBeVisible();
    await expect(page.getByText("这里是浏览器测试正文。")).toBeVisible();
  });

  test("搜索页支持真实筛选，并在无结果时展示空状态", async ({ page, request }) => {
    await createPost(request, {
      title: "搜索筛选命中文章",
      slug: randomSlug("browser-search-hit"),
      author: "筛选作者甲",
      category: "筛选栏目甲",
      excerpt: "这是一篇会被筛选命中的文章。",
      publishedAt: "2026-03-23",
      readingTime: "4 分钟",
      status: "published",
      featured: false,
      coverLabel: "搜索筛选",
      tags: ["搜索", "筛选"],
      bodyText: "<p>命中正文</p>",
    });

    await createPost(request, {
      title: "搜索筛选干扰文章",
      slug: randomSlug("browser-search-miss"),
      author: "筛选作者乙",
      category: "筛选栏目乙",
      excerpt: "这是一篇会被筛选排除的文章。",
      publishedAt: "2026-02-01",
      readingTime: "7 分钟",
      status: "published",
      featured: false,
      coverLabel: "搜索筛选",
      tags: ["搜索", "筛选"],
      bodyText: "<p>排除正文</p>",
    });

    await page.goto("/search");
    await page.getByLabel("筛选栏目甲").check();
    await page.getByLabel("筛选作者甲").check();
    await page.getByLabel("过去一周").check();
    await page.getByRole("button", { name: "应用筛选" }).click();

    await expect(page).toHaveURL(/category=%E7%AD%9B%E9%80%89%E6%A0%8F%E7%9B%AE%E7%94%B2/);
    await expect(page.getByText("搜索筛选命中文章")).toBeVisible();
    await expect(page.getByText("搜索筛选干扰文章")).toHaveCount(0);
    await expect(page.getByText("栏目：筛选栏目甲")).toBeVisible();
    await expect(page.getByText("作者：筛选作者甲")).toBeVisible();

    await page.getByRole("searchbox", { name: "搜索文章" }).fill("绝不会命中的关键词");
    await page.getByRole("button", { name: "搜索" }).click();

    await expect(page.getByText("没有找到相关内容")).toBeVisible();
  });

  test("后台登录后可通过 UI 修改关于页文案并联动前台", async ({ page }) => {
    const marker = `浏览器测试横幅-${Date.now()}`;

    await loginAdminUi(page);
    await page.goto("/admin/site");

    const bannerInput = page.locator(".ant-form-item").filter({ hasText: "底部横幅标题" }).locator("input");
    await bannerInput.fill(marker);
    await page.getByRole("button", { name: "保存关于页文案" }).click();

    await expect(page.getByText("关于页文案已更新")).toBeVisible();

    await page.goto("/about");
    await expect(page.getByText(marker)).toBeVisible();
  });

  test("后台文章编辑并发布后，前台详情页会显示编辑后的内容", async ({ page, request }) => {
    const post = await createPost(request, {
      title: "浏览器测试待编辑文章",
      slug: randomSlug("browser-edit"),
      author: "自动化测试",
      category: "测试栏目",
      excerpt: "原始摘要",
      publishedAt: "2026-03-23",
      readingTime: "4 分钟",
      status: "review",
      featured: false,
      coverLabel: "浏览器测试",
      tags: ["自动测试", "浏览器编辑"],
      bodyText: "<p>原始正文</p>",
    });

    await loginAdminUi(page);
    await page.goto(`/admin/posts/edit/${post.id}`);

    await page.getByLabel("文章标题").fill("浏览器测试已编辑文章");
    await page.getByLabel("摘要").fill("这是浏览器自动化更新后的摘要。前台详情页应该同步看到。\n");
    await page.getByRole("tab", { name: "HTML 源码" }).click();
    const sourceEditor = page.locator(".ant-tabs-tabpane-active textarea").first();
    await expect(sourceEditor).toBeVisible();
    await sourceEditor.fill("<h2>更新后的正文</h2><p>前台详情页已经显示这段编辑后的正文。</p>");
    await page.getByRole("button", { name: "发布更新" }).click();

    await expect(page).toHaveURL(/\/admin\/posts$/);
    await expect(page.getByText("浏览器测试已编辑文章")).toBeVisible();

    await page.goto(`/posts/${post.slug}`);
    await expect(page.getByRole("heading", { name: "浏览器测试已编辑文章" })).toBeVisible();
    await expect(page.locator(".article-deck")).toContainText("这是浏览器自动化更新后的摘要。前台详情页应该同步看到。");
    await expect(page.locator(".rich-text-content")).toContainText("前台详情页已经显示这段编辑后的正文。");
  });

  test("后台媒体库可通过 UI 上传图片并展示素材卡片", async ({ page }) => {
    await loginAdminUi(page);
    await page.goto("/admin/media");

    const fileName = `browser-${Date.now()}.gif`;
    const fileBuffer = Buffer.from("R0lGODlhAQABAIABAP///wAAACwAAAAAAQABAAACAkQBADs=", "base64");
    await page.locator('input[type="file"]').setInputFiles({
      name: fileName,
      mimeType: "image/gif",
      buffer: fileBuffer,
    });

    await expect(page.getByText("图片已上传到媒体库")).toBeVisible();
    await expect(page.getByText(fileName)).toBeVisible();

    const imageCard = page.locator(".admin-media-card").filter({ hasText: fileName }).first();
    const imageSrc = await imageCard.locator("img").getAttribute("src");

    expect(imageSrc).toBeTruthy();
    uploadedFileNames.push(imageSrc!.split("/").pop()!);
  });

  test("后台修改密码后可以退出并用新密码重新登录", async ({ page, request }) => {
    const temporaryPassword = `AdminTemp-${Date.now()}!`;

    await loginAdminUi(page);
    await page.goto("/admin/account");
    await page.getByLabel("当前密码").fill(currentAdminPassword);
    await page.getByLabel("新密码").fill(temporaryPassword);
    await page.getByRole("button", { name: "保存账户设置" }).click();

    await expect(page.getByText("超级管理员资料已更新")).toBeVisible();
    currentAdminPassword = temporaryPassword;

    await logoutAdminUi(page);
    await loginAdminUi(page, temporaryPassword);

    const account = await readAccountApi(request);
    expect(account.email).toBe(env.ADMIN_EMAIL);
  });

  test("关键页面截图回归保持稳定", async ({ page, request }) => {
    const featuredPost = await createPost(request, {
      title: "截图回归首页主稿",
      slug: randomSlug("browser-home-shot"),
      author: "视觉回归",
      category: "截图栏目",
      excerpt: "这篇文章用于固定首页主稿截图回归。",
      publishedAt: "2026-12-31",
      readingTime: "6 分钟",
      status: "published",
      featured: true,
      coverLabel: "截图回归",
      tags: ["截图", "首页"],
      bodyText: "<p>首页截图专用正文。</p>",
    });

    const detailPost = await createPost(request, {
      title: "截图回归详情页文章",
      slug: randomSlug("browser-detail-shot"),
      author: "视觉回归",
      category: "截图栏目",
      excerpt: "这篇文章用于固定详情页截图回归。",
      publishedAt: "2026-12-30",
      readingTime: "5 分钟",
      status: "published",
      featured: false,
      coverLabel: "截图回归",
      tags: ["截图", "详情页"],
      bodyText: "<h2>详情页截图</h2><p>这里是用于详情页回归截图的固定正文。</p>",
    });

    await page.goto("/");
    await expect(page.locator(".home-hero-card h1").first()).toContainText(featuredPost.title);
    await expect(page.locator(".home-hero-card")).toHaveScreenshot("home-hero-regression.png", {
      animations: "disabled",
      caret: "hide",
    });

    await page.goto(`/posts/${detailPost.slug}`);
    await expect(page.locator(".detail-hero")).toHaveScreenshot("detail-hero-regression.png", {
      animations: "disabled",
      caret: "hide",
    });

    await loginAdminUi(page);
    await page.goto("/admin/posts/create");
    await expect(page.locator(".admin-editor-layout")).toBeVisible();
    await expect(page.locator(".admin-editor-layout")).toHaveScreenshot("admin-create-regression.png", {
      animations: "disabled",
      caret: "hide",
    });
  });
});
