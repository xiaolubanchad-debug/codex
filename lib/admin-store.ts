import { ensurePrismaReady, prisma } from "@/lib/prisma";
import { posts as sitePosts } from "@/lib/site-data";
import type {
  AdminCategoryInput,
  AdminCategoryRecord,
  AdminListResponse,
  AdminPostInput,
  AdminPostRecord,
  AdminTagInput,
  AdminTagRecord,
} from "@/lib/admin-types";

const DEFAULT_CATEGORY_NAME = "General";
const DEFAULT_CATEGORY_DESCRIPTION = "Longform reporting, analysis, and editorial curation.";
const DEFAULT_POST_TITLE = "Untitled post";
const DEFAULT_AUTHOR = "Editorial Desk";
const DEFAULT_READING_TIME = "5 min";
const DEFAULT_COVER_LABEL = "Admin Draft";
const DEFAULT_TAG_NAME = "untagged";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\u4e00-\u9fa5\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const normalizeTags = (tags?: string[] | string) => {
  if (!tags) {
    return [];
  }

  if (Array.isArray(tags)) {
    return tags.map((tag) => tag.trim()).filter(Boolean);
  }

  return tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
};

const formatDate = (value: Date) => value.toISOString().slice(0, 10);

let seedPromise: Promise<void> | null = null;

async function ensureTagRecords(postId: string, tags: string[]) {
  await prisma.postTag.deleteMany({
    where: { postId },
  });

  for (const rawTagName of tags) {
    const tagName = rawTagName || DEFAULT_TAG_NAME;
    const tag = await prisma.tag.upsert({
      where: { name: tagName },
      create: {
        name: tagName,
        slug: slugify(tagName) || `tag-${Date.now()}`,
      },
      update: {},
    });

    await prisma.postTag.create({
      data: {
        postId,
        tagId: tag.id,
      },
    });
  }
}

async function getOrCreateCategory(name: string) {
  const categoryName = name.trim() || DEFAULT_CATEGORY_NAME;

  return prisma.category.upsert({
    where: { name: categoryName },
    create: {
      name: categoryName,
      slug: slugify(categoryName) || `category-${Date.now()}`,
      description: `${categoryName} related longform reporting and editorial curation.`,
    },
    update: {},
  });
}

async function syncSeed() {
  const postCount = await prisma.post.count();

  if (postCount > 0) {
    return;
  }

  for (const post of sitePosts) {
    const category = await getOrCreateCategory(post.category || DEFAULT_CATEGORY_NAME);

    const createdPost = await prisma.post.create({
      data: {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        author: post.author,
        publishedAt: new Date(post.publishedAt),
        readingTime: post.readingTime,
        status: "published",
        featured: Boolean(post.featured),
        coverLabel: post.coverLabel,
        body: post.body.join("\n\n"),
        categoryId: category.id,
      },
    });

    await ensureTagRecords(createdPost.id, post.tags);
  }
}

async function ensureSeeded() {
  await ensurePrismaReady();

  if (!seedPromise) {
    seedPromise = syncSeed().finally(() => {
      seedPromise = null;
    });
  }

  await seedPromise;
}

function mapPostRecord(post: {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  publishedAt: Date;
  readingTime: string;
  status: string;
  featured: boolean;
  coverLabel: string;
  body: string;
  category: { name: string } | null;
  tags: { tag: { name: string } }[];
}): AdminPostRecord {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    category: post.category?.name || DEFAULT_CATEGORY_NAME,
    excerpt: post.excerpt,
    author: post.author,
    publishedAt: formatDate(post.publishedAt),
    readingTime: post.readingTime,
    status: post.status as AdminPostRecord["status"],
    featured: post.featured,
    tags: post.tags.map((item) => item.tag.name),
    coverLabel: post.coverLabel,
    body: post.body,
  };
}

export async function listPosts(params?: {
  q?: string;
  status?: string;
  category?: string;
}): Promise<AdminListResponse<AdminPostRecord>> {
  await ensureSeeded();

  const data = await prisma.post.findMany({
    where: {
      ...(params?.status ? { status: params.status } : {}),
      ...(params?.category ? { category: { name: params.category } } : {}),
      ...(params?.q
        ? {
            OR: [
              { title: { contains: params.q } },
              { excerpt: { contains: params.q } },
              { author: { contains: params.q } },
              { category: { name: { contains: params.q } } },
              { tags: { some: { tag: { name: { contains: params.q } } } } },
            ],
          }
        : {}),
    },
    orderBy: {
      publishedAt: "desc",
    },
    include: {
      category: true,
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });

  return {
    data: data.map(mapPostRecord),
    total: data.length,
  };
}

export async function getPost(id: string) {
  await ensureSeeded();

  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      category: true,
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });

  return post ? mapPostRecord(post) : null;
}

export async function createPost(input: AdminPostInput) {
  await ensureSeeded();

  const category = await getOrCreateCategory(input.category?.trim() || DEFAULT_CATEGORY_NAME);
  const post = await prisma.post.create({
    data: {
      title: input.title?.trim() || DEFAULT_POST_TITLE,
      slug: input.slug?.trim() || slugify(input.title?.trim() || "") || `post-${Date.now()}`,
      excerpt: input.excerpt?.trim() || "",
      author: input.author?.trim() || DEFAULT_AUTHOR,
      publishedAt: new Date(input.publishedAt?.trim() || new Date().toISOString().slice(0, 10)),
      readingTime: input.readingTime?.trim() || DEFAULT_READING_TIME,
      status: input.status || "draft",
      featured: Boolean(input.featured),
      coverLabel: input.coverLabel?.trim() || DEFAULT_COVER_LABEL,
      body: input.bodyText?.trim() || input.body?.trim() || "",
      categoryId: category.id,
    },
  });

  await ensureTagRecords(post.id, normalizeTags(input.tags));
  return getPost(post.id);
}

export async function updatePost(id: string, input: AdminPostInput) {
  await ensureSeeded();

  const current = await prisma.post.findUnique({
    where: { id },
    include: {
      category: true,
    },
  });

  if (!current) {
    return null;
  }

  const categoryName = input.category?.trim() || current.category?.name || DEFAULT_CATEGORY_NAME;
  const category = await getOrCreateCategory(categoryName);

  await prisma.post.update({
    where: { id },
    data: {
      title: input.title?.trim() || current.title,
      slug: input.slug?.trim() || current.slug,
      excerpt: input.excerpt?.trim() || current.excerpt,
      author: input.author?.trim() || current.author,
      publishedAt: new Date(input.publishedAt?.trim() || formatDate(current.publishedAt)),
      readingTime: input.readingTime?.trim() || current.readingTime,
      status: input.status || current.status,
      featured: typeof input.featured === "boolean" ? input.featured : current.featured,
      coverLabel: input.coverLabel?.trim() || current.coverLabel,
      body: input.bodyText?.trim() || input.body?.trim() || current.body,
      categoryId: category.id,
    },
  });

  if (input.tags) {
    await ensureTagRecords(id, normalizeTags(input.tags));
  }

  return getPost(id);
}

export async function deletePost(id: string) {
  await ensureSeeded();

  const existing = await prisma.post.findUnique({
    where: { id },
    include: {
      category: true,
      tags: { include: { tag: true } },
    },
  });

  if (!existing) {
    return null;
  }

  await prisma.post.delete({ where: { id } });
  return mapPostRecord(existing);
}

export async function listCategories(): Promise<AdminListResponse<AdminCategoryRecord>> {
  await ensureSeeded();

  const data = await prisma.category.findMany({
    include: {
      _count: {
        select: { posts: true },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  return {
    data: data.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      postCount: category._count.posts,
    })),
    total: data.length,
  };
}

export async function getCategory(id: string) {
  await ensureSeeded();

  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      _count: {
        select: { posts: true },
      },
    },
  });

  if (!category) {
    return null;
  }

  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    postCount: category._count.posts,
  } satisfies AdminCategoryRecord;
}

export async function createCategory(input: AdminCategoryInput) {
  await ensureSeeded();

  const name = input.name?.trim() || DEFAULT_CATEGORY_NAME;
  const category = await prisma.category.create({
    data: {
      name,
      slug: input.slug?.trim() || slugify(name) || `category-${Date.now()}`,
      description: input.description?.trim() || DEFAULT_CATEGORY_DESCRIPTION,
    },
    include: {
      _count: {
        select: { posts: true },
      },
    },
  });

  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    postCount: category._count.posts,
  } satisfies AdminCategoryRecord;
}

export async function updateCategory(id: string, input: AdminCategoryInput) {
  await ensureSeeded();

  const current = await prisma.category.findUnique({ where: { id } });

  if (!current) {
    return null;
  }

  const category = await prisma.category.update({
    where: { id },
    data: {
      name: input.name?.trim() || current.name,
      slug: input.slug?.trim() || current.slug,
      description: input.description?.trim() || current.description,
    },
    include: {
      _count: {
        select: { posts: true },
      },
    },
  });

  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    postCount: category._count.posts,
  } satisfies AdminCategoryRecord;
}

export async function deleteCategory(id: string) {
  await ensureSeeded();

  const current = await prisma.category.findUnique({
    where: { id },
    include: {
      _count: {
        select: { posts: true },
      },
    },
  });

  if (!current) {
    return null;
  }

  await prisma.category.delete({ where: { id } });

  return {
    id: current.id,
    name: current.name,
    slug: current.slug,
    description: current.description,
    postCount: current._count.posts,
  } satisfies AdminCategoryRecord;
}

export async function listTags(): Promise<AdminListResponse<AdminTagRecord>> {
  await ensureSeeded();

  const data = await prisma.tag.findMany({
    include: {
      _count: {
        select: { posts: true },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  return {
    data: data.map((tag) => ({
      id: tag.id,
      name: tag.name,
      slug: tag.slug,
      usageCount: tag._count.posts,
    })),
    total: data.length,
  };
}

export async function getTag(id: string) {
  await ensureSeeded();

  const tag = await prisma.tag.findUnique({
    where: { id },
    include: {
      _count: {
        select: { posts: true },
      },
    },
  });

  if (!tag) {
    return null;
  }

  return {
    id: tag.id,
    name: tag.name,
    slug: tag.slug,
    usageCount: tag._count.posts,
  } satisfies AdminTagRecord;
}

export async function createTag(input: AdminTagInput) {
  await ensureSeeded();

  const name = input.name?.trim() || DEFAULT_TAG_NAME;
  const tag = await prisma.tag.create({
    data: {
      name,
      slug: input.slug?.trim() || slugify(name) || `tag-${Date.now()}`,
    },
    include: {
      _count: {
        select: { posts: true },
      },
    },
  });

  return {
    id: tag.id,
    name: tag.name,
    slug: tag.slug,
    usageCount: tag._count.posts,
  } satisfies AdminTagRecord;
}

export async function updateTag(id: string, input: AdminTagInput) {
  await ensureSeeded();

  const current = await prisma.tag.findUnique({ where: { id } });

  if (!current) {
    return null;
  }

  const tag = await prisma.tag.update({
    where: { id },
    data: {
      name: input.name?.trim() || current.name,
      slug: input.slug?.trim() || current.slug,
    },
    include: {
      _count: {
        select: { posts: true },
      },
    },
  });

  return {
    id: tag.id,
    name: tag.name,
    slug: tag.slug,
    usageCount: tag._count.posts,
  } satisfies AdminTagRecord;
}

export async function deleteTag(id: string) {
  await ensureSeeded();

  const current = await prisma.tag.findUnique({
    where: { id },
    include: {
      _count: {
        select: { posts: true },
      },
    },
  });

  if (!current) {
    return null;
  }

  await prisma.tag.delete({ where: { id } });

  return {
    id: current.id,
    name: current.name,
    slug: current.slug,
    usageCount: current._count.posts,
  } satisfies AdminTagRecord;
}
