import Link from "next/link";

import type { Post } from "@/lib/site-data";

type PostCardProps = {
  post: Post;
  variant?: "default" | "feature";
};

export function PostCard({ post, variant = "default" }: PostCardProps) {
  return (
    <article className={`post-card post-card-${variant}`}>
      <Link className="post-card-link" href={`/posts/${post.slug}`}>
        <div
          className="post-cover"
          style={{
            background: `linear-gradient(135deg, ${post.coverPalette[0]}, ${post.coverPalette[1]})`,
          }}
        >
          <span>{post.coverLabel}</span>
        </div>

        <div className="post-body">
          <div className="meta-row">
            <span>{post.category}</span>
            <span>{post.readingTime}</span>
          </div>
          <h3>{post.title}</h3>
          <p>{post.excerpt}</p>

          <div className="post-footer">
            <span>{post.publishedAt}</span>
            <span>{post.author}</span>
          </div>
        </div>
      </Link>
    </article>
  );
}
