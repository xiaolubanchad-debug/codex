import { getPublicCategories, getPublicSiteSettings, getPublicSiteStats } from "@/lib/public-site";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const [stats, categories, settings] = await Promise.all([
    getPublicSiteStats(),
    getPublicCategories(),
    getPublicSiteSettings(),
  ]);

  return (
    <section className="shell about-editorial about-editorial-upgraded">
      <div className="about-hero upgraded">
        <p className="micro-kicker">{settings.aboutHeroKicker}</p>
        <h1>
          {settings.aboutHeroTitle} <span>{settings.aboutHeroHighlight}</span> 的长期变化。
        </h1>
        <p>{settings.aboutHeroDescription}</p>
      </div>

      <div className="philosophy-layout upgraded">
        <section className="philosophy-card upgraded">
          <h2>{settings.aboutMissionTitle}</h2>
          <p>{settings.aboutMissionBody}</p>
          <ol>
            {settings.aboutPrinciples.map((item) => (
              <li key={item.title}>
                <strong>{item.title}</strong>
                <p>{item.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <div className="about-visual upgraded">
          <div className="visual-card" />
          <div className="visual-note wide-note">
            <span>实时内容概览</span>
            <p>
              目前前台已经直接连接后台数据库，已发布文章 {stats.publishedPosts} 篇，覆盖 {stats.categories} 个分类、{stats.tags}
              个标签，最近一次发布时间为 {stats.latestPublishedAt ?? "暂无内容"}。
            </p>
          </div>
        </div>
      </div>

      <section className="timeline-section">
        <div className="section-headline">
          <h2>我们持续关注什么</h2>
        </div>
        <div className="timeline-grid">
          {settings.aboutTimeline.map((item, index) => (
            <article className="timeline-card" key={item.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="team-section upgraded">
        <div className="section-headline">
          <h2>{settings.aboutCoverageTitle}</h2>
        </div>
        <p className="about-coverage-copy">{settings.aboutCoverageBody}</p>
        <div className="team-grid upgraded">
          {categories.map((category) => (
            <article className="team-card editorial-team-card" key={category}>
              <div className="avatar-placeholder" />
              <h3>{category}</h3>
              <p className="team-role">已接入后台分类</p>
              <p>这个栏目下的内容已经由后台直接发布和维护，前台不再依赖本地 mock 数据。</p>
            </article>
          ))}
        </div>
      </section>

      <section className="black-banner upgraded">
        <div>
          <h2>{settings.aboutBannerTitle}</h2>
          <p>{settings.aboutBannerBody}</p>
        </div>
        <button type="button">继续迭代</button>
      </section>
    </section>
  );
}
