import Link from "next/link";
import { notFound } from "next/navigation";

import { StoryArt } from "@/components/story-art";
import { bodyToHtml } from "@/lib/editorial-content";
import { getPublicPostBySlug, getRelatedPublicPosts } from "@/lib/public-site";

export const dynamic = "force-dynamic";

type PostDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { slug } = await params;
  const post = await getPublicPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPublicPosts(post.slug, post.category);

  return (
    <section className="article-page shell article-page-upgraded">
      <div className="detail-hero upgraded">
        <div className="detail-hero-copy">
          <p className="micro-kicker">{post.category} / 深度文章</p>
          <h1>{post.title}</h1>
          <p className="article-deck">{post.excerpt}</p>
          <div className="story-meta">
            作者：{post.author} / {post.publishedAt} / {post.readingTime}
          </div>
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
          <div className="rich-text-content" dangerouslySetInnerHTML={{ __html: bodyToHtml(post.body) }} />

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
                <StoryArt className="sidebar-art" label={relatedPost.coverLabel} palette={relatedPost.coverPalette} />
                <span>{relatedPost.title}</span>
              </Link>
            ))}
          </div>
          <div className="signal-box compact">
            <p className="module-title">内容联动</p>
            <h3>这篇文章来自后台已发布内容，编辑更新后这里会直接读取最新正文。</h3>
            <button type="button">继续浏览归档</button>
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
