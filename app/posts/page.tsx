import Link from "next/link";

import { StoryArt } from "@/components/story-art";
import { categories, posts } from "@/lib/site-data";

type PostsPageProps = {
  searchParams: Promise<{
    category?: string;
  }>;
};

export default async function PostsPage({ searchParams }: PostsPageProps) {
  const params = await searchParams;
  const activeCategory = params.category ?? "互联网";
  const filteredPosts = posts.filter((post) => post.category === activeCategory);
  const stream = filteredPosts;
  const trending = posts.slice(0, 5);

  return (
    <section className="shell category-page category-page-upgraded">
      <div className="category-hero upgraded">
        <div>
          <p className="section-chip">栏目归档</p>
          <h1>{activeCategory}</h1>
          <p>
            这里聚合与“{activeCategory}”相关的观察、评论与专题文章，帮助你按主题而不是按时间理解技术变化。
          </p>
        </div>
        <div className="topic-box upgraded">
          <span>栏目说明</span>
          <strong>持续更新</strong>
          <p>按专题组织阅读，而不是简单按时间刷信息。</p>
        </div>
      </div>

      <div className="filter-row upgraded">
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
          {stream.map((post) => (
            <Link className="category-story" href={`/posts/${post.slug}`} key={post.slug}>
              <StoryArt className="category-art" label={post.coverLabel} palette={post.coverPalette} />
              <div>
                <p className="story-kicker">{post.category}</p>
                <h2>{post.title}</h2>
                <p>{post.excerpt}</p>
                <span className="story-meta">作者：{post.author} / {post.publishedAt} / {post.readingTime}</span>
              </div>
            </Link>
          ))}
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
            <p className="module-title">本周信号</p>
            <h3>每周一份技术策展简报，帮你在噪音里抓住更值得继续追踪的议题。</h3>
            <input aria-label="邮箱地址" placeholder="name@example.com" type="email" />
            <button type="button">订阅</button>
          </div>

          <div className="archive-card reading-card">
            <p className="module-title">阅读建议</p>
            <p>从上往下阅读这组内容，会更容易看到这个栏目内部的主题递进和线索连接。</p>
            <Link href="/about">了解站点定位</Link>
          </div>
        </aside>
      </div>

      <button className="load-button" type="button">
        加载更多归档内容
      </button>
    </section>
  );
}