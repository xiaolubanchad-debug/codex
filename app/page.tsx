import Link from "next/link";

import { StoryArt } from "@/components/story-art";
import { categories, featuredPost, posts } from "@/lib/site-data";

export default function HomePage() {
  const latest = posts.slice(1, 6);
  const horizon = posts.slice(5, 8);
  const observation = posts.slice(8, 14);

  return (
    <section className="shell home-editorial home-editorial-upgraded">
      <div className="home-main home-main-full">
        <section className="home-hero-card home-hero-split">
          <div className="hero-main-copy">
            <p className="micro-kicker">本周主线</p>
            <p className="hero-overline">封面故事</p>
            <h1>{featuredPost.title}</h1>
            <p className="hero-summary">{featuredPost.excerpt}</p>
            <div className="hero-meta-row">
              <span>{featuredPost.category}</span>
              <span>{featuredPost.publishedAt}</span>
              <span>{featuredPost.readingTime}</span>
            </div>
            <div className="hero-action-row">
              <Link className="subscribe-button" href={`/posts/${featuredPost.slug}`}>
                阅读全文
              </Link>
              <Link className="ghost-button" href="/posts">
                进入归档
              </Link>
            </div>
          </div>

          <div className="hero-side-panel">
            <div className="hero-side-card">
              <p className="micro-kicker">编者按</p>
              <p>
                我们更关心那些正在慢慢改写产业结构、平台入口和技术基础设施的长期变化，而不是只追逐一天之内最响亮的热词。
              </p>
            </div>
            <div className="hero-side-card compact">
              <p className="micro-kicker">本期关键词</p>
              <div className="hero-keywords">
                {featuredPost.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="ticker-bar upgraded">
          <span>今日信号</span>
          <p>国内多地开始布局液冷算力园区。</p>
          <p>浏览器厂商加速整合 AI 助手与工作流能力。</p>
          <p>后量子密码迁移进入更多行业试点阶段。</p>
          <p>低轨卫星网络开始面临新的密度协同问题。</p>
        </div>

        <section className="home-section feature-zone">
          <div className="section-headline">
            <h2>最新情报</h2>
            <Link href="/posts">查看全部文章</Link>
          </div>

          <div className="latest-magazine-grid">
            <Link className="latest-feature-card" href={`/posts/${latest[0].slug}`}>
              <StoryArt
                className="latest-feature-art"
                label={latest[0].coverLabel}
                palette={latest[0].coverPalette}
              />
              <div className="latest-feature-copy">
                <p className="story-kicker">{latest[0].category}</p>
                <h3>{latest[0].title}</h3>
                <p>{latest[0].excerpt}</p>
                <span className="story-meta">
                  {latest[0].author} / {latest[0].publishedAt} / {latest[0].readingTime}
                </span>
              </div>
            </Link>

            <div className="latest-brief-grid">
              {latest.slice(1).map((post) => (
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
            <p className="micro-kicker">策展信号</p>
            <h2>把真正重要的技术变化，整理成更值得反复阅读的内容结构。</h2>
            <p>加入我们的周更简报，每周收到一份经过筛选、提炼和归纳的技术观察清单。</p>
          </div>
          <div className="panel-actions">
            <input aria-label="邮箱地址" placeholder="输入你的邮箱地址" type="email" />
            <button type="button">立即订阅</button>
          </div>
        </section>

        <section className="home-section horizon-section">
          <div className="section-headline">
            <h2>趋势横切面</h2>
            <Link href="/posts?category=未来">查看未来栏目</Link>
          </div>
          <div className="horizon-grid">
            {horizon.map((post) => (
              <Link className="horizon-card" href={`/posts/${post.slug}`} key={post.slug}>
                <p className="story-kicker">{post.category}</p>
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
                <span className="story-meta">{post.author} / {post.publishedAt}</span>
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
