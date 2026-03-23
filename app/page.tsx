import Link from "next/link";

import { FeaturedCarousel } from "@/components/home/featured-carousel";
import { StoryArt } from "@/components/story-art";
import { getPublicCategories, listPublicPosts } from "@/lib/public-site";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [posts, categories] = await Promise.all([listPublicPosts({ limit: 14 }), getPublicCategories()]);

  if (!posts.length) {
    return (
      <section className="shell home-editorial home-editorial-upgraded">
        <div className="archive-card">
          <p className="module-title">前台已接入后台内容</p>
          <p>当前还没有已发布文章。你可以先去后台创建并发布内容，首页会自动显示最新结果。</p>
          <Link href="/admin/posts">进入后台文章管理</Link>
        </div>
      </section>
    );
  }

  const featuredPosts = posts.filter((post) => post.featured);
  const heroPosts = featuredPosts.length ? featuredPosts : posts.slice(0, Math.min(3, posts.length));
  const nonHeroPosts = posts.filter((post) => !heroPosts.some((heroPost) => heroPost.slug === post.slug));
  const fallbackHeroPosts = heroPosts.filter((post) => !nonHeroPosts.some((item) => item.slug === post.slug));
  const editorialPool = [...nonHeroPosts, ...fallbackHeroPosts];
  const latestFeature = editorialPool[0] ?? posts[0];
  const latestBriefs = editorialPool.slice(1, 5);
  const horizon = editorialPool.slice(5, 8);
  const observation = editorialPool.slice(8, 14);

  return (
    <section className="shell home-editorial home-editorial-upgraded">
      <div className="home-main home-main-full">
        <FeaturedCarousel posts={heroPosts} />

        <div className="ticker-bar upgraded">
          <span>今日信号</span>
          {posts.slice(0, 4).map((post) => (
            <p key={post.slug}>{post.title}</p>
          ))}
        </div>

        <section className="home-section feature-zone">
          <div className="section-headline">
            <h2>最新情报</h2>
            <Link href="/posts">查看全部文章</Link>
          </div>

          <div className="latest-magazine-grid">
            <Link className="latest-feature-card" href={`/posts/${latestFeature.slug}`}>
              <StoryArt
                className="latest-feature-art"
                label={latestFeature.coverLabel}
                palette={latestFeature.coverPalette}
              />
              <div className="latest-feature-copy">
                <p className="story-kicker">{latestFeature.category}</p>
                <h3>{latestFeature.title}</h3>
                <p>{latestFeature.excerpt}</p>
                <span className="story-meta">
                  {latestFeature.author} / {latestFeature.publishedAt} / {latestFeature.readingTime}
                </span>
              </div>
            </Link>

            <div className="latest-brief-grid">
              {latestBriefs.map((post) => (
                <Link className="latest-brief-card" href={`/posts/${post.slug}`} key={post.slug}>
                  <p className="story-kicker">{post.category}</p>
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                  <span className="story-meta">{post.publishedAt}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="red-panel upgraded">
          <div>
            <p className="micro-kicker">站点状态</p>
            <h2>前后台内容链路已经打通，前台不再依赖本地 mock 数据。</h2>
            <p>现在你在后台创建、编辑、发布文章，首页和归档页都会实时读取数据库里的已发布内容。</p>
          </div>
          <div className="panel-actions">
            <input aria-label="后台入口提示" placeholder="下一步可继续接评论、SEO 或定时发布" type="text" />
            <button type="button">继续迭代</button>
          </div>
        </section>

        <section className="home-section horizon-section">
          <div className="section-headline">
            <h2>趋势横切面</h2>
            <Link href="/search?q=趋势">搜索更多趋势文章</Link>
          </div>
          <div className="horizon-grid">
            {horizon.map((post) => (
              <Link className="horizon-card" href={`/posts/${post.slug}`} key={post.slug}>
                <p className="story-kicker">{post.category}</p>
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
                <span className="story-meta">
                  {post.author} / {post.publishedAt}
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="home-section observation-section">
          <div className="section-tags upgraded">
            {categories.map((category) => (
              <span key={category}>{category}</span>
            ))}
          </div>

          <div className="mini-grid dense-grid">
            {observation.map((post) => (
              <Link className="mini-card" href={`/posts/${post.slug}`} key={post.slug}>
                <StoryArt className="mini-art" label={post.coverLabel} palette={post.coverPalette} />
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
