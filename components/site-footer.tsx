import Link from "next/link";

import { siteMeta } from "@/lib/site-data";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-shell">
        <p className="footer-brand">{siteMeta.name}</p>
        <div className="footer-nav">
          <Link href="/about">关于我们</Link>
          <Link href="/posts?category=人工智能">人工智能</Link>
          <Link href="/posts?category=硬件">硬件</Link>
          <Link href="/search">搜索</Link>
          <Link href="/about">联系与合作</Link>
        </div>
        <p className="footer-copy">{siteMeta.mission}</p>
        <div className="footer-bottom">
          <span>2026 技术策展</span>
          <span>用更清晰的结构讲述技术时代的变化。</span>
        </div>
      </div>
    </footer>
  );
}
