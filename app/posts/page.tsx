import Link from "next/link";

import { StoryArt } from "@/components/story-art";
import { getPublicCategories, listPublicPosts } from "@/lib/public-site";

export const dynamic = "force-dynamic";

type PostsPageProps = {
  searchParams: Promise<{
    category?: string;
  }>;
};

export default async function PostsPage({ searchParams }: PostsPageProps) {
  const params = await searchParams;
  const categories = await getPublicCategories();
  const requestedCategory = params.category?.trim() ?? "";
  const activeCategory = categories.includes(requestedCategory) ? requestedCategory : "";
  const [stream, trending] = await Promise.all([
    listPublicPosts({ category: activeCategory || undefined }),
    listPublicPosts({ limit: 5 }),
  ]);

  return (
    <section className="shell category-page category-page-upgraded">
      <div className="category-hero upgraded">
        <div>
          <p className="section-chip">栏目归档</p>
          <h1>{activeCategory || "全部文章"}</h1>
          <p>
            这里展示的是已经由后台发布的正式内容。你可以按分类浏览，也可以从搜索页继续按关键词查看更细的结果。
          </p>
        </div>
        <div className="topic-box upgraded">
          <span>当前视图</span>
          <strong>{stream.length} 篇文章</strong>
          <p>前台列表页现在直接从数据库读取已发布内容，后台更新后会自动反映到这里。</p>
        </div>
      </div>

      <div className="filter-row upgraded">
        <Link className={activeCategory ? "" : "is-active"} href="/posts">
          全部
        </Link>
        {categories.map((category) => (
          <Link
            className={activeCategory === category ? "is-active" : ""}
            href={`/posts?category=${encodeURIComponent(category)}`}
            key={category}
          >
            {category}
          </Link>
        ))}
      </div>

      <div className="category-layout upgraded">
        <div className="category-list stream-list">
          {stream.length ? (
            stream.map((post) => (
              <Link className="category-story" href={`/posts/${post.slug}`} key={post.slug}>
                <StoryArt className="category-art" label={post.coverLabel} palette={post.coverPalette} />
                <div className="category-story-copy">
                  <p className="story-kicker">{post.category}</p>
                  <h2>{post.title}</h2>
                  <p>{post.excerpt}</p>
                  <span className="story-meta">作者：{post.author} / {post.publishedAt} / {post.readingTime}</span>
                </div>
              </Link>
            ))
          ) : (
            <div className="archive-card">
              <p className="module-title">这个分类下还没有已发布内容</p>
              <p>你可以去后台先发布文章，或者先回到全部文章页继续浏览。</p>
              <Link href="/posts">返回全部文章</Link>
            </div>
          )}
        </div>

        <aside className="category-sidebar upgraded">
          <div className="sidebar-module">
            <p className="module-title">正在热议</p>
            {trending.map((post) => (
              <Link href={`/posts/${post.slug}`} key={post.slug}>
                {post.title}
              </Link>
            ))}
          </div>

          <div className="signal-box">
            <p className="module-title">联动说明</p>
            <h3>后台的发布状态会直接影响这里的展示结果，只有已发布内容会进入前台归档。</h3>
            <input aria-label="快速搜索" placeholder="试试搜索一个关键词" type="text" />
            <button type="button">继续浏览</button>
          </div>

          <div className="archive-card reading-card">
            <p className="module-title">阅读建议</p>
            <p>如果你想从全局判断内容结构，可以先看首页主稿，再按分类回到这里做专题化阅读。</p>
            <Link href="/about">了解站点定位</Link>
          </div>
        </aside>
      </div>
    </section>
  );
}
