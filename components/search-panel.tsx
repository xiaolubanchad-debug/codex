import Link from "next/link";

import { StoryArt } from "@/components/story-art";
import type { PublicPost, PublicSearchDateRange, PublicSearchOptions } from "@/lib/public-site";

type SearchPanelProps = {
  query: string;
  category: string;
  author: string;
  dateRange?: PublicSearchDateRange;
  options: PublicSearchOptions;
  results: PublicPost[];
};

const DATE_RANGE_OPTIONS: { value: PublicSearchDateRange; label: string }[] = [
  { value: "24h", label: "过去 24 小时" },
  { value: "7d", label: "过去一周" },
  { value: "30d", label: "过去一个月" },
];

export function SearchPanel({ query, category, author, dateRange, options, results }: SearchPanelProps) {
  const normalizedQuery = query.trim();
  const lead = results[0];
  const side = results[1];
  const cards = results.slice(2, 8);

  return (
    <div className="search-editorial">
      <form action="/search" className="search-filters" id="search-filters-form">
        <p className="module-title">筛选条件</p>
        <div className="filter-group">
          <span>栏目分类</span>
          <label>
            <input defaultChecked={!category} name="category" type="radio" value="" />
            全部栏目
          </label>
          {options.categories.map((item) => (
            <label key={item}>
              <input defaultChecked={category === item} name="category" type="radio" value={item} />
              {item}
            </label>
          ))}
        </div>
        <div className="filter-group">
          <span>时间范围</span>
          <label>
            <input defaultChecked={!dateRange} name="dateRange" type="radio" value="" />
            不限时间
          </label>
          {DATE_RANGE_OPTIONS.map((item) => (
            <label key={item.value}>
              <input defaultChecked={dateRange === item.value} name="dateRange" type="radio" value={item.value} />
              {item.label}
            </label>
          ))}
        </div>
        <div className="filter-group">
          <span>作者</span>
          <label>
            <input defaultChecked={!author} name="author" type="radio" value="" />
            全部作者
          </label>
          {options.authors.length ? (
            options.authors.map((item) => (
              <label key={item}>
                <input defaultChecked={author === item} name="author" type="radio" value={item} />
                {item}
              </label>
            ))
          ) : (
            <p>当前还没有可筛选的作者。</p>
          )}
        </div>
        <div className="search-filter-actions">
          <button type="submit">应用筛选</button>
          <Link href="/search">清除筛选</Link>
        </div>
      </form>

      <div className="search-content">
        <div className="search-bar">
          <input
            aria-label="搜索文章"
            defaultValue={query}
            form="search-filters-form"
            name="q"
            placeholder="搜索标题、摘要、正文、标签或作者"
            type="search"
          />
          <button form="search-filters-form" type="submit">
            搜索
          </button>
        </div>

        <p className="search-results-line">
          共找到 {results.length} 条与“{normalizedQuery || "全部内容"}”相关的内容
          {category ? ` · 栏目：${category}` : ""}
          {author ? ` · 作者：${author}` : ""}
          {dateRange === "24h" ? " · 最近 24 小时" : ""}
          {dateRange === "7d" ? " · 最近 7 天" : ""}
          {dateRange === "30d" ? " · 最近 30 天" : ""}
        </p>

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
        ) : (
          <div className="archive-card">
            <p className="module-title">没有找到相关内容</p>
            <p>可以换个关键词或筛选条件，或者先去归档页浏览最近发布的文章。</p>
            <Link href="/posts">进入内容归档</Link>
          </div>
        )}

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
      </div>
    </div>
  );
}
