"use client";

import { NavigateToResource } from "@refinedev/nextjs-router/app";

export default function AdminIndexPage() {
  return <NavigateToResource resource="posts" />;
}
