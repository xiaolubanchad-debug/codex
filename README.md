# Editorial Blog CMS

一个基于 `Next.js 15 + Prisma + SQLite` 的中文编辑型博客站点，包含：

- 面向读者的前台内容站
- 面向编辑的后台 CMS
- 前后台共用的数据源与 API
- Node 冒烟测试 + Playwright 浏览器回归测试

项目当前已经不是单纯的静态原型，而是一套可本地运行、可发布内容、可做基础回归验证的内容站 MVP。

## 项目特性

- 前台页面
  - 首页 `/`
  - 内容归档 `/posts`
  - 文章详情 `/posts/[slug]`
  - 搜索页 `/search`
  - 关于页 `/about`
- 后台能力
  - 登录 `/admin/login`
  - 后台总览 `/admin`
  - 文章管理 `/admin/posts`
  - 分类管理 `/admin/categories`
  - 标签管理 `/admin/tags`
  - 媒体库 `/admin/media`
  - 站点文案配置 `/admin/site`
  - 超级管理员账户 `/admin/account`
- 内容能力
  - 草稿 / 待审核 / 已发布
  - 推荐文章轮播
  - Tiptap 富文本编辑器
  - 图片上传与媒体复用
  - 前台直接读取后台已发布内容
- 测试能力
  - Node 冒烟回归
  - Playwright 浏览器级回归
  - 关键页面截图回归

## 技术栈

- `Next.js 15`
- `React 19`
- `TypeScript`
- `Prisma`
- `SQLite`
- `Refine`
- `Ant Design`
- `Tiptap`
- `Playwright`

## 本地启动

1. 安装依赖

```bash
npm install
```

2. 准备环境变量

复制 `.env.example` 为 `.env`，或直接确认本地 `.env` 内容正确：

```env
DATABASE_URL="file:../data/admin.db"
ADMIN_EMAIL="admin@example.com"
ADMIN_NAME="Admin"
ADMIN_PASSWORD="ChangeMe123!"
ADMIN_COOKIE_SECURE="false"
```

3. 初始化数据库

```bash
npm run prisma:generate
npm run prisma:push
```

4. 启动开发环境

```bash
npm run dev
```

5. 生产模式预览

```bash
npm run build
npm run start
```

默认前台地址：

- [http://127.0.0.1:3000](http://127.0.0.1:3000)

默认后台登录地址：

- [http://127.0.0.1:3000/admin/login](http://127.0.0.1:3000/admin/login)

## 后台默认账户

后台当前采用单账户超级管理员模式，账号来自 `.env`：

- 邮箱：`ADMIN_EMAIL`
- 密码：`ADMIN_PASSWORD`

如果你沿用当前仓库内的开发配置，常用本地登录信息是：

- 邮箱：`xiaolubanchad@gmail.com`
- 密码：`Admin123456!`

## 常用命令

```bash
npm run dev
npm run build
npm run start
npm run test
npm run test:smoke
npm run test:e2e
npm run test:full
npm run prisma:generate
npm run prisma:push
```

## 测试说明

### 1. Node 冒烟测试

```bash
npm test
```

当前覆盖：

- 首页推荐文章轮播
- 关于页读取后台站点文案
- 前台归档 / 搜索 / 详情链路
- 草稿发布后前台可见
- 媒体库上传后可读取
- 后台更新文章后前台同步可见
- 搜索页筛选与空结果状态

### 2. Playwright 浏览器测试

```bash
npm run test:e2e
```

当前覆盖：

- 前台导航、搜索、详情跳转
- 后台修改关于页文案并联动前台
- 后台编辑文章发布后前台显示最新内容
- 媒体库上传
- 超级管理员改密后重新登录
- 首页 / 详情页 / 后台新建文章页截图回归

截图基线位于：

- [e2e/site.spec.ts-snapshots](D:/xiangmu/web1/e2e/site.spec.ts-snapshots)

## 目录结构

```text
app/                    Next.js App Router 页面与 API
components/             前台与后台组件
lib/                    数据访问、站点配置、编辑器工具
prisma/                 Prisma schema
data/                   SQLite 数据文件
public/                 静态资源与上传目录
tests/                  Node 冒烟测试
e2e/                    Playwright 浏览器测试
docs/                   MVP 与 UI 说明文档
ui/                     设计参考图
```

## 文档

- [MVP 总览](./docs/mvp-overview.md)
- [MVP 初稿](./docs/mvp.md)
- [UI 方向](./docs/ui-direction.md)
- [UI 规格说明](./docs/ui-spec.md)
- [Agent 协作说明](./AGENTS.md)

## 当前已实现的重点

- 前后台内容链路打通
- 后台文章、分类、标签、媒体、站点文案管理
- 前台首页推荐轮播与搜索筛选
- 富文本编辑器与图片插入
- 浏览器级回归测试
- 中文旧链接兼容读取

## 后续建议

- 增加 SEO 字段与 metadata 管理
- 增加文章预览链接与定时发布
- 增加评论 / 订阅 / 留言接口
- 将 SQLite 升级为 PostgreSQL
- 为后台补更细的操作审计与发布流程
