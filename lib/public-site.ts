import type { Prisma } from "@prisma/client";
import { unstable_noStore as noStore } from "next/cache";

import type { AdminSiteSettingsRecord } from "@/lib/admin-types";
import { ensureSeeded } from "@/lib/admin-store";
import { getPlainTextFromBody } from "@/lib/editorial-content";
import { ensurePrismaReady, prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/site-settings";

const STORY_PALETTES: [string, string][] = [
  ["#0f172a", "#0ea5e9"],
  ["#111827", "#ef4444"],
  ["#1f2937", "#10b981"],
  ["#172554", "#f97316"],
  ["#1e1b4b", "#ec4899"],
  ["#292524", "#fb7185"],
  ["#082f49", "#22c55e"],
  ["#111111", "#7c3aed"],
];

type PostWithRelations = Prisma.PostGetPayload<{
  include: {
    category: true;
    tags: {
      include: {
        tag: true;
      };
    };
  };
}>;

export type PublicPost = {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  publishedAt: string;
  readingTime: string;
  author: string;
  featured: boolean;
  tags: string[];
  coverLabel: string;
  coverPalette: [string, string];
  body: string;
  plainText: string;
};

export type PublicSiteStats = {
  publishedPosts: number;
  categories: number;
  tags: number;
  latestPublishedAt: string | null;
};

export type PublicSiteSettings = Omit<AdminSiteSettingsRecord, "id" | "createdAt" | "updatedAt">;
export type PublicSearchDateRange = "24h" | "7d" | "30d";
export type PublicSearchOptions = {
  categories: string[];
  authors: string[];
};

function hashSeed(value: string) {
  return Array.from(value).reduce((total, character) => total + character.charCodeAt(0), 0);
}

function resolvePalette(seed: string): [string, string] {
  return STORY_PALETTES[hashSeed(seed) % STORY_PALETTES.length] ?? STORY_PALETTES[0];
}

function formatDate(value: Date) {
  return value.toISOString().slice(0, 10);
}

function normalizeLegacySlug(value: string) {
  return value
    .normalize("NFKC")
    .toLowerCase()
    .replace(/['"“”‘’`~!@#$%^&*()_+=|\\[\]{}:;,./<>?·！￥…（）—【】、；：。，《》？\s-]+/g, "")
    .trim();
}

function decodeSlugCandidate(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function resolvePublishedAfter(dateRange: PublicSearchDateRange | undefined) {
  if (!dateRange) {
    return undefined;
  }

  const now = new Date();

  if (dateRange === "24h") {
    return new Date(now.getTime() - 24 * 60 * 60 * 1000);
  }

  if (dateRange === "7d") {
    return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  }

  return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
}

function mapPost(post: PostWithRelations): PublicPost {
  const category = post.category?.name || "未分类";

  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    category,
    excerpt: post.excerpt,
    publishedAt: formatDate(post.publishedAt),
    readingTime: post.readingTime,
    author: post.author,
    featured: post.featured,
    tags: post.tags.map((item) => item.tag.name),
    coverLabel: post.coverLabel,
    coverPalette: resolvePalette(`${category}:${post.coverLabel || post.slug}`),
    body: post.body,
    plainText: getPlainTextFromBody(post.body),
  };
}

async function ensurePublicContentReady() {
  noStore();
  await ensurePrismaReady();
  await ensureSeeded();
}

const PUBLIC_POST_INCLUDE = {
  category: true,
  tags: {
    include: {
      tag: true,
    },
  },
} satisfies Prisma.PostInclude;

function buildPublicPostWhere(input?: {
  category?: string;
  author?: string;
  dateRange?: PublicSearchDateRange;
  q?: string;
  excludeSlug?: string;
}) {
  const publishedAfter = resolvePublishedAfter(input?.dateRange);

  return {
    status: "published",
    ...(input?.category ? { category: { name: input.category } } : {}),
    ...(input?.author ? { author: input.author } : {}),
    ...(publishedAfter ? { publishedAt: { gte: publishedAfter } } : {}),
    ...(input?.excludeSlug ? { slug: { not: input.excludeSlug } } : {}),
    ...(input?.q
      ? {
          OR: [
            { title: { contains: input.q } },
            { excerpt: { contains: input.q } },
            { author: { contains: input.q } },
            { body: { contains: input.q } },
            { category: { name: { contains: input.q } } },
            { tags: { some: { tag: { name: { contains: input.q } } } } },
          ],
        }
      : {}),
  } satisfies Prisma.PostWhereInput;
}

export async function listPublicPosts(input?: {
  category?: string;
  author?: string;
  dateRange?: PublicSearchDateRange;
  q?: string;
  limit?: number;
  excludeSlug?: string;
}) {
  await ensurePublicContentReady();

  const posts = await prisma.post.findMany({
    where: buildPublicPostWhere(input),
    include: PUBLIC_POST_INCLUDE,
    orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
    ...(input?.limit ? { take: input.limit } : {}),
  });

  return posts.map(mapPost);
}

export async function getPublicPostBySlug(slug: string) {
  await ensurePublicContentReady();
  const decodedSlug = decodeSlugCandidate(slug);

  const exactPost = await prisma.post.findFirst({
    where: {
      slug: {
        in: Array.from(new Set([slug, decodedSlug])),
      },
      status: "published",
    },
    include: PUBLIC_POST_INCLUDE,
  });

  if (exactPost) {
    return mapPost(exactPost);
  }

  const normalizedSlug = normalizeLegacySlug(decodedSlug);

  if (!normalizedSlug) {
    return null;
  }

  const legacyCandidates = await prisma.post.findMany({
    where: {
      status: "published",
    },
    include: PUBLIC_POST_INCLUDE,
    orderBy: { publishedAt: "desc" },
  });

  const matchedPost = legacyCandidates.find((post) => {
    return (
      normalizeLegacySlug(post.slug) === normalizedSlug ||
      normalizeLegacySlug(post.title) === normalizedSlug
    );
  });

  return matchedPost ? mapPost(matchedPost) : null;
}

export async function getRelatedPublicPosts(currentSlug: string, category: string, limit = 3) {
  return listPublicPosts({
    category,
    excludeSlug: currentSlug,
    limit,
  });
}

export async function getPublicCategories() {
  await ensurePublicContentReady();

  const categories = await prisma.category.findMany({
    where: {
      posts: {
        some: {
          status: "published",
        },
      },
    },
    orderBy: {
      name: "asc",
    },
    select: {
      name: true,
    },
  });

  return categories.map((category) => category.name);
}

export async function getPublicSearchOptions(): Promise<PublicSearchOptions> {
  await ensurePublicContentReady();

  const [categories, authors] = await Promise.all([
    getPublicCategories(),
    prisma.post.findMany({
      where: { status: "published" },
      distinct: ["author"],
      orderBy: { author: "asc" },
      select: { author: true },
    }),
  ]);

  return {
    categories,
    authors: authors.map((item) => item.author).filter(Boolean),
  };
}

export async function getPublicSiteStats(): Promise<PublicSiteStats> {
  await ensurePublicContentReady();

  const [publishedPosts, categories, tags, latestPost] = await Promise.all([
    prisma.post.count({ where: { status: "published" } }),
    prisma.category.count({
      where: {
        posts: {
          some: {
            status: "published",
          },
        },
      },
    }),
    prisma.tag.count({
      where: {
        posts: {
          some: {
            post: {
              status: "published",
            },
          },
        },
      },
    }),
    prisma.post.findFirst({
      where: { status: "published" },
      orderBy: { publishedAt: "desc" },
      select: { publishedAt: true },
    }),
  ]);

  return {
    publishedPosts,
    categories,
    tags,
    latestPublishedAt: latestPost ? formatDate(latestPost.publishedAt) : null,
  };
}

export async function getPublicSiteSettings(): Promise<PublicSiteSettings> {
  await ensurePublicContentReady();
  const settings = await getSiteSettings();

  return {
    aboutHeroKicker: settings.aboutHeroKicker,
    aboutHeroTitle: settings.aboutHeroTitle,
    aboutHeroHighlight: settings.aboutHeroHighlight,
    aboutHeroDescription: settings.aboutHeroDescription,
    aboutMissionTitle: settings.aboutMissionTitle,
    aboutMissionBody: settings.aboutMissionBody,
    aboutPrinciples: settings.aboutPrinciples,
    aboutTimeline: settings.aboutTimeline,
    aboutCoverageTitle: settings.aboutCoverageTitle,
    aboutCoverageBody: settings.aboutCoverageBody,
    aboutBannerTitle: settings.aboutBannerTitle,
    aboutBannerBody: settings.aboutBannerBody,
  };
}

export async function listPublicPostSlugs() {
  await ensurePublicContentReady();

  const posts = await prisma.post.findMany({
    where: { status: "published" },
    orderBy: { publishedAt: "desc" },
    select: { slug: true },
  });

  return posts.map((post) => post.slug);
}
