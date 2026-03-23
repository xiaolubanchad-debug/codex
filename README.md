# Red Loom Editorial Blog

一个基于 `Next.js App Router` 的博客站点 MVP，视觉方向参考传统编辑型博客首页，并重构为更现代的内容阅读体验。

## 页面

- `/` 首页
- `/posts` 列表页
- `/posts/[slug]` 详情页
- `/search` 搜索页
- `/about` 关于页

## 文档

- [MVP 文档](./docs/mvp.md)
- [UI 设计说明](./docs/ui-spec.md)

## 本地启动

```bash
npm install
npm run dev
```

## 当前实现

- 本地 Mock 内容数据
- 统一卡片系统
- 搜索页前端过滤
- 响应式布局

## 后续建议

- 接入 Markdown 或 Headless CMS
- 增加分页和栏目聚合页
- 增加 SEO metadata、RSS 和 sitemap
- 引入真实封面图和作者页
