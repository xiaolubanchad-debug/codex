"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { StoryArt } from "@/components/story-art";
import { posts } from "@/lib/site-data";

export function SearchPanel() {
  const [query, setQuery] = useState("算力");

  const results = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    if (!keyword) {
      return posts;
    }

    return posts.filter((post) => {
      const haystack = [post.title, post.excerpt, post.category, post.author, ...post.tags]
        .join(" ")
        .toLowerCase();

      return haystack.includes(keyword);
    });
  }, [query]);

  const lead = results[0];
  const side = results[1];
  const cards = results.slice(2, 8);

  return (
    <div className="search-editorial">
      <aside className="search-filters">
        <p className="module-title">筛选条件</p>
        <div className="filter-group">
          <span>内容类型</span>
          {["全部结果", "深度分析", "专题报道", "快讯观察"].map((item, index) => (
            <label key={item}>
              <input defaultChecked={index === 0} name="type" type="checkbox" />
              {item}
            </label>
          ))}
        </div>
        <div className="filter-group">
          <span>时间范围</span>
          {["不限时间", "过去 24 小时", "过去一周", "过去一月"].map((item, index) => (
            <label key={item}>
              <input defaultChecked={index === 0} name="date-range" type="radio" />
              {item}
            </label>
          ))}
        </div>
        <div className="filter-group">
          <span>作者</span>
          {["林川", "叶真", "周墨"].map((author) => (
            <label key={author}>
              <input name="author" type="checkbox" />
              {author}
            </label>
          ))}
        </div>
      </aside>

      <div className="search-content">
        <div className="search-bar">
          <input
            aria-label="搜索文章"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜索标题、摘要、标签或作者"
            type="search"
            value={query}
          />
          <button type="button">搜索</button>
        </div>

        <p className="search-results-line">共找到 {results.length} 条与“{query}”相关的内容</p>

        {lead ? (
          <div className="search-feature">
            <Link className="search-lead" href={`/posts/${lead.slug}`}>
              <p className="story-kicker">{lead.category}</p>
              <span className="story-meta">{lead.publishedAt}</span>
              <h1>{lead.title}</h1>
              <p>{lead.excerpt}</p>
              <strong>{lead.author}</strong>
            </Link>

            {side ? (
              <Link className="search-side-story" href={`/posts/${side.slug}`}>
                <StoryArt className="side-art" label={side.coverLabel} palette={side.coverPalette} />
                <p className="story-kicker">{side.category}</p>
                <h2>{side.title}</h2>
                <span className="story-meta">作者：{side.author}</span>
              </Link>
            ) : null}
          </div>
        ) : null}

        {cards.length ? (
          <div className="search-card-grid">
            {cards.map((post) => (
              <Link className="search-info-card" href={`/posts/${post.slug}`} key={post.slug}>
                <p className="story-kicker">{post.category}</p>
                <span className="card-meta">{post.readingTime}</span>
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
                <span className="read-more">继续阅读</span>
              </Link>
            ))}
          </div>
        ) : null}

        <button className="load-button centered" type="button">
          加载更多结果
        </button>
      </div>
    </div>
  );
}
