import Link from "next/link";

import { navigation, siteMeta } from "@/lib/site-data";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link className="brand" href="/">
          <strong>{siteMeta.name}</strong>
        </Link>

        <nav className="nav">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <Link aria-label="搜索" className="search-link" href="/search">
            搜索
          </Link>
          <Link className="subscribe-button" href="/about">
            订阅周刊
          </Link>
        </div>
      </div>
    </header>
  );
}
