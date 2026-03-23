import type { Metadata } from "next";

import { AppChrome } from "@/components/app-chrome";
import { siteMeta } from "@/lib/site-data";

import "./globals.css";

export const metadata: Metadata = {
  title: siteMeta.title,
  description: siteMeta.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>
        <AppChrome>{children}</AppChrome>
      </body>
    </html>
  );
}
