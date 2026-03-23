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

export type AdminUploadRecord = {
  fileName: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  modifiedAt?: string;
};

export type AdminAccountRecord = {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
};

export type AdminStructuredTextItem = {
  title: string;
  body: string;
};

export type AdminSiteSettingsRecord = {
  id: string;
  aboutHeroKicker: string;
  aboutHeroTitle: string;
  aboutHeroHighlight: string;
  aboutHeroDescription: string;
  aboutMissionTitle: string;
  aboutMissionBody: string;
  aboutPrinciples: AdminStructuredTextItem[];
  aboutTimeline: AdminStructuredTextItem[];
  aboutCoverageTitle: string;
  aboutCoverageBody: string;
  aboutBannerTitle: string;
  aboutBannerBody: string;
  createdAt: string;
  updatedAt: string;
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

export type AdminSiteSettingsInput = Partial<AdminSiteSettingsRecord>;
