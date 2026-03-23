import Link from "next/link";

import { siteMeta } from "@/lib/site-config";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-shell">
        <p className="footer-brand">{siteMeta.name}</p>
        <div className="footer-nav">
          <Link href="/about">关于我们</Link>
          <Link href="/posts">内容归档</Link>
          <Link href="/search">搜索文章</Link>
          <Link href="/about">联系与合作</Link>
        </div>
        <p className="footer-copy">{siteMeta.mission}</p>
        <div className="footer-bottom">
          <span>2026 {siteMeta.name}</span>
          <span>前后台内容已经连接到同一条数据库内容链路。</span>
        </div>
      </div>
    </footer>
  );
}
