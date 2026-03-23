import Link from "next/link";
import { notFound } from "next/navigation";

import { StoryArt } from "@/components/story-art";
import { getPostBySlug, getRelatedPosts, posts } from "@/lib/site-data";

type PostDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedPosts(post.slug, post.category);

  return (
    <section className="article-page shell article-page-upgraded">
      <div className="detail-hero upgraded">
        <div className="detail-hero-copy">
          <p className="micro-kicker">{post.category} / 深度文章</p>
          <h1>{post.title}</h1>
          <p className="article-deck">{post.excerpt}</p>
          <div className="story-meta">作者：{post.author} / {post.publishedAt} / {post.readingTime}</div>
        </div>
        <StoryArt className="detail-hero-art" label={post.coverLabel} palette={post.coverPalette} />
      </div>

      <div className="detail-layout upgraded">
        <aside className="share-rail upgraded">
          <span>分享</span>
          <button type="button">微</button>
          <button type="button">链</button>
          <button type="button">藏</button>
        </aside>

        <article className="detail-body upgraded">
          <p className="drop-intro">{post.body[0]}</p>

          <div className="article-divider" />
          <h2>系统性变化，往往先从边缘征兆开始</h2>
          <p>{post.body[1]}</p>
          <blockquote>
            真正值得被记录的技术变化，往往不是一次产品发布，而是底层结构开始悄悄改写整个行业的运行方式。
          </blockquote>
          <p>{post.body[2] ?? post.body[0]}</p>

          <StoryArt className="inline-art" label="现场观察" palette={post.coverPalette} />

          <h2>为什么这件事值得继续追踪</h2>
          <p>{post.body[1]}</p>
          <p>{post.body[0]}</p>

          <div className="article-tags-block">
            <p className="module-title">文章标签</p>
            <div className="tag-row static">
              {post.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </div>
        </article>

        <aside className="article-sidebar upgraded">
          <div className="sidebar-card author-card">
            <p className="module-title">作者</p>
            <h3>{post.author}</h3>
            <p>{post.excerpt}</p>
          </div>
          <div className="sidebar-card">
            <p className="module-title">继续阅读</p>
            {relatedPosts.map((relatedPost) => (
              <Link className="sidebar-story" href={`/posts/${relatedPost.slug}`} key={relatedPost.slug}>
                <StoryArt
                  className="sidebar-art"
                  label={relatedPost.coverLabel}
                  palette={relatedPost.coverPalette}
                />
                <span>{relatedPost.title}</span>
              </Link>
            ))}
          </div>
          <div className="signal-box compact">
            <p className="module-title">策展信号</p>
            <h3>每周为你筛掉大部分噪音，只保留值得继续关注的技术线索。</h3>
            <button type="button">订阅周刊</button>
          </div>
          <div className="archive-card reading-card compact">
            <p className="module-title">返回路径</p>
            <Link href={`/posts?category=${encodeURIComponent(post.category)}`}>回到 {post.category} 栏目</Link>
            <Link href="/search">去搜索页继续查找</Link>
          </div>
        </aside>
      </div>
    </section>
  );
}