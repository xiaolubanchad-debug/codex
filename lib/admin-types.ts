export type AdminStatus = "draft" | "review" | "published";

export type AdminPostRecord = {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  readingTime: string;
  status: AdminStatus;
  featured: boolean;
  tags: string[];
  coverLabel: string;
  body: string;
};

export type AdminCategoryRecord = {
  id: string;
  name: string;
  slug: string;
  description: string;
  postCount: number;
};

export type AdminTagRecord = {
  id: string;
  name: string;
  slug: string;
  usageCount: number;
};

export type AdminListResponse<T> = {
  data: T[];
  total: number;
};

export type AdminPostInput = Partial<AdminPostRecord> & {
  bodyText?: string;
  tags?: string[] | string;
};

export type AdminCategoryInput = Partial<AdminCategoryRecord>;

export type AdminTagInput = Partial<AdminTagRecord>;
