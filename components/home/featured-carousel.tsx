"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { StoryArt } from "@/components/story-art";
import type { PublicPost } from "@/lib/public-site";

type FeaturedCarouselProps = {
  posts: PublicPost[];
};

export function FeaturedCarousel({ posts }: FeaturedCarouselProps) {
  const safePosts = useMemo(() => (posts.length ? posts : []), [posts]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [safePosts.length]);

  useEffect(() => {
    if (safePosts.length <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % safePosts.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [safePosts.length]);

  if (!safePosts.length) {
    return null;
  }

  return (
    <section className="home-hero-card hero-carousel">
      <div className="hero-carousel-track" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
        {safePosts.map((post) => (
          <article className="hero-carousel-slide" key={post.slug}>
            <div className="hero-carousel-copy">
              <p className="micro-kicker">本周主线</p>
              <p className="hero-overline">封面故事</p>
              <h1>{post.title}</h1>
              <p className="hero-summary">{post.excerpt}</p>
              <div className="hero-meta-row">
                <span>{post.category}</span>
                <span>{post.publishedAt}</span>
                <span>{post.readingTime}</span>
              </div>
              <div className="hero-action-row">
                <Link className="subscribe-button" href={`/posts/${post.slug}`}>
                  阅读全文
                </Link>
                <Link className="ghost-button" href="/posts">
                  进入归档
                </Link>
              </div>
            </div>

            <div className="hero-carousel-side">
              <StoryArt className="hero-carousel-art" label={post.coverLabel} palette={post.coverPalette} />
              <div className="hero-side-card compact">
                <p className="micro-kicker">本期关键词</p>
                <div className="hero-keywords">
                  {post.tags.map((tag) => (
                    <span key={`${post.slug}-${tag}`}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {safePosts.length > 1 ? (
        <div className="hero-carousel-dots" aria-label="推荐文章轮播导航">
          {safePosts.map((post, index) => (
            <button
              aria-label={`切换到 ${post.title}`}
              className={index === activeIndex ? "is-active" : undefined}
              key={post.slug}
              onClick={() => setActiveIndex(index)}
              type="button"
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
