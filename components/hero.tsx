import Link from "next/link";

import { featuredPost, siteMeta } from "@/lib/site-data";

export function Hero() {
  return (
    <section className="hero shell">
      <div className="hero-stage">
        <div className="hero-noise" />
        <div className="hero-copy">
          <p className="eyebrow">Editorial spotlight</p>
          <h1>A modern editorial blog built for deep reading.</h1>
          <p className="hero-description">
            Inspired by classic editorial blogs, rebuilt as a cleaner reading system with a stronger
            front page, archive, search flow, and long-form article experience.
          </p>
        </div>

        <article className="hero-card">
          <p className="eyebrow">Featured story</p>
          <h2>{featuredPost.title}</h2>
          <p>{featuredPost.excerpt}</p>
          <div className="meta-row">
            <span>{featuredPost.publishedAt}</span>
            <span>{featuredPost.readingTime}</span>
            <span>{featuredPost.author}</span>
          </div>
          <div className="hero-actions">
            <Link className="button primary" href={`/posts/${featuredPost.slug}`}>
              Read article
            </Link>
            <Link className="button secondary" href="/posts">
              Browse archive
            </Link>
          </div>
        </article>

        <div className="hero-stats">
          <div>
            <strong>09</strong>
            <span>articles</span>
          </div>
          <div>
            <strong>05</strong>
            <span>sections</span>
          </div>
          <div>
            <strong>100%</strong>
            <span>reader-first</span>
          </div>
        </div>
      </div>

      <div className="hero-footer">
        <p>{siteMeta.mission}</p>
      </div>
    </section>
  );
}
