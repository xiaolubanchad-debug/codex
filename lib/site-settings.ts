import type {
  AdminSiteSettingsInput,
  AdminSiteSettingsRecord,
  AdminStructuredTextItem,
} from "@/lib/admin-types";
import { ensurePrismaReady, prisma } from "@/lib/prisma";

const SITE_SETTINGS_ID = "site";

const DEFAULT_PRINCIPLES: AdminStructuredTextItem[] = [
  {
    title: "优先解释结构性变化",
    body: "我们关心的不只是新闻发生了什么，更关心它会怎样改变行业的运行方式。",
  },
  {
    title: "控制信息密度",
    body: "减少噪音、压缩重复，帮助读者在有限时间里理解更关键的线索。",
  },
  {
    title: "坚持长期视角",
    body: "每篇文章都应该能在一周之后、一个月之后，依然对读者有解释力。",
  },
];

const DEFAULT_TIMELINE: AdminStructuredTextItem[] = [
  {
    title: "基础设施",
    body: "算力、网络、数据中心、能源与物理层资源。",
  },
  {
    title: "产品形态",
    body: "浏览器、开发工具、代理工作流与新的软件入口。",
  },
  {
    title: "产业结构",
    body: "平台竞争、供应链协同、资本流向与政策变化。",
  },
  {
    title: "文化转向",
    body: "技术如何改变职业、表达方式与日常生活。",
  },
];

function serializeItems(items: AdminStructuredTextItem[]) {
  return JSON.stringify(
    items.map((item) => ({
      title: item.title.trim(),
      body: item.body.trim(),
    })),
  );
}

function deserializeItems(value: string, fallback: AdminStructuredTextItem[]) {
  try {
    const parsed = JSON.parse(value) as AdminStructuredTextItem[];
    const normalized = parsed
      .map((item) => ({
        title: item.title?.trim() ?? "",
        body: item.body?.trim() ?? "",
      }))
      .filter((item) => item.title || item.body);

    return normalized.length ? normalized : fallback;
  } catch {
    return fallback;
  }
}

function toRecord(settings: {
  id: string;
  aboutHeroKicker: string;
  aboutHeroTitle: string;
  aboutHeroHighlight: string;
  aboutHeroDescription: string;
  aboutMissionTitle: string;
  aboutMissionBody: string;
  aboutPrinciplesJson: string;
  aboutTimelineJson: string;
  aboutCoverageTitle: string;
  aboutCoverageBody: string;
  aboutBannerTitle: string;
  aboutBannerBody: string;
  createdAt: Date;
  updatedAt: Date;
}): AdminSiteSettingsRecord {
  return {
    id: settings.id,
    aboutHeroKicker: settings.aboutHeroKicker,
    aboutHeroTitle: settings.aboutHeroTitle,
    aboutHeroHighlight: settings.aboutHeroHighlight,
    aboutHeroDescription: settings.aboutHeroDescription,
    aboutMissionTitle: settings.aboutMissionTitle,
    aboutMissionBody: settings.aboutMissionBody,
    aboutPrinciples: deserializeItems(settings.aboutPrinciplesJson, DEFAULT_PRINCIPLES),
    aboutTimeline: deserializeItems(settings.aboutTimelineJson, DEFAULT_TIMELINE),
    aboutCoverageTitle: settings.aboutCoverageTitle,
    aboutCoverageBody: settings.aboutCoverageBody,
    aboutBannerTitle: settings.aboutBannerTitle,
    aboutBannerBody: settings.aboutBannerBody,
    createdAt: settings.createdAt.toISOString(),
    updatedAt: settings.updatedAt.toISOString(),
  };
}

export async function ensureSiteSettings() {
  await ensurePrismaReady();

  const existing = await prisma.siteSettings.findUnique({
    where: { id: SITE_SETTINGS_ID },
  });

  if (existing) {
    return existing;
  }

  return prisma.siteSettings.create({
    data: {
      id: SITE_SETTINGS_ID,
      aboutHeroKicker: "关于站点",
      aboutHeroTitle: "我们用更有秩序的方式，记录",
      aboutHeroHighlight: "技术时代",
      aboutHeroDescription:
        "技术策展不是追热点的快讯站，而是一个把技术基础设施、产品结构、产业变化和文化转向放到同一张编辑地图里讲清楚的内容站。",
      aboutMissionTitle: "我们的写作原则",
      aboutMissionBody: "通过更清晰的结构和更稳定的叙事节奏，帮助读者理解长期变化。",
      aboutPrinciplesJson: serializeItems(DEFAULT_PRINCIPLES),
      aboutTimelineJson: serializeItems(DEFAULT_TIMELINE),
      aboutCoverageTitle: "当前栏目覆盖",
      aboutCoverageBody: "这里会结合后台实际分类，展示当前已经纳入前后台联动体系的栏目。",
      aboutBannerTitle: "保持对变化的敏感",
      aboutBannerBody: "如果你想继续看这套前后台一体化博客如何扩展，我们下一步可以继续接评论、SEO 和定时发布。",
    },
  });
}

export async function getSiteSettings() {
  const settings = await ensureSiteSettings();
  return toRecord(settings);
}

export async function updateSiteSettings(input: AdminSiteSettingsInput) {
  await ensureSiteSettings();

  const updated = await prisma.siteSettings.update({
    where: { id: SITE_SETTINGS_ID },
    data: {
      ...(input.aboutHeroKicker !== undefined ? { aboutHeroKicker: input.aboutHeroKicker.trim() } : {}),
      ...(input.aboutHeroTitle !== undefined ? { aboutHeroTitle: input.aboutHeroTitle.trim() } : {}),
      ...(input.aboutHeroHighlight !== undefined ? { aboutHeroHighlight: input.aboutHeroHighlight.trim() } : {}),
      ...(input.aboutHeroDescription !== undefined
        ? { aboutHeroDescription: input.aboutHeroDescription.trim() }
        : {}),
      ...(input.aboutMissionTitle !== undefined ? { aboutMissionTitle: input.aboutMissionTitle.trim() } : {}),
      ...(input.aboutMissionBody !== undefined ? { aboutMissionBody: input.aboutMissionBody.trim() } : {}),
      ...(input.aboutPrinciples !== undefined
        ? { aboutPrinciplesJson: serializeItems(input.aboutPrinciples.filter((item) => item.title || item.body)) }
        : {}),
      ...(input.aboutTimeline !== undefined
        ? { aboutTimelineJson: serializeItems(input.aboutTimeline.filter((item) => item.title || item.body)) }
        : {}),
      ...(input.aboutCoverageTitle !== undefined ? { aboutCoverageTitle: input.aboutCoverageTitle.trim() } : {}),
      ...(input.aboutCoverageBody !== undefined ? { aboutCoverageBody: input.aboutCoverageBody.trim() } : {}),
      ...(input.aboutBannerTitle !== undefined ? { aboutBannerTitle: input.aboutBannerTitle.trim() } : {}),
      ...(input.aboutBannerBody !== undefined ? { aboutBannerBody: input.aboutBannerBody.trim() } : {}),
    },
  });

  return toRecord(updated);
}
