export type Category = "互联网" | "游戏" | "影像" | "方法论" | "观点";

export type Post = {
  slug: string;
  title: string;
  category: Category;
  excerpt: string;
  publishedAt: string;
  readingTime: string;
  author: string;
  featured?: boolean;
  tags: string[];
  coverLabel: string;
  coverPalette: [string, string];
  body: string[];
};

export const siteMeta = {
  name: "Red Loom",
  title: "Red Loom Editorial",
  description: "一个带有编辑部气质的现代内容博客，关注互联网、游戏、创作与方法论。",
  mission:
    "用更清晰的结构和更克制的设计，整理那些值得被反复阅读的内容。",
};

export const navigation = [
  { href: "/", label: "首页" },
  { href: "/posts", label: "列表" },
  { href: "/search", label: "搜索" },
  { href: "/about", label: "关于" },
];

export const categories: Category[] = ["互联网", "游戏", "影像", "方法论", "观点"];

export const posts: Post[] = [
  {
    slug: "the-new-editorial-web",
    title: "内容网站如何摆脱模板感，重新建立编辑部气质",
    category: "互联网",
    excerpt: "从结构、节奏、留白和栏目关系切入，讨论内容型网站如何建立更强的品牌辨识度。",
    publishedAt: "2026-03-12",
    readingTime: "8 分钟",
    author: "林川",
    featured: true,
    tags: ["内容设计", "品牌", "编辑"],
    coverLabel: "封面故事",
    coverPalette: ["#111111", "#7f1d1d"],
    body: [
      "一个好的博客首页不只是文章的堆叠，更像一本杂志的封面。它需要让读者在极短时间里感受到站点的性格、栏目结构和内容密度。",
      "参考图最值得借鉴的地方，不是具体的卡片尺寸，而是它对“内容层级”的表达方式：首屏必须承担品牌、精选、氛围三重任务，栏目区则负责持续阅读。",
      "因此在 MVP 阶段，我们应该优先建立统一的内容模块，而不是过早追求复杂交互。稳定的标题层级、干净的摘要、可复用的卡片系统，才是后续扩展的基础。"
    ]
  },
  {
    slug: "notes-on-search-experience",
    title: "搜索页不是附属页面，而是内容站点的第二首页",
    category: "方法论",
    excerpt: "搜索体验决定了回访用户能否快速抵达目标内容，MVP 也应保证高质量反馈。",
    publishedAt: "2026-03-09",
    readingTime: "6 分钟",
    author: "程野",
    tags: ["搜索", "体验设计", "信息架构"],
    coverLabel: "Search",
    coverPalette: ["#3f3f46", "#d92c1f"],
    body: [
      "对于一个内容站点来说，搜索页承担的是“精准进入”的任务。首页负责发现，搜索页负责命中，两者同等重要。",
      "在实现上，MVP 阶段可以采用前端过滤，但视觉上不能做成一个只有输入框的辅助页。标题、热门关键词、结果状态与空状态，都应该帮助用户建立判断。"
    ]
  },
  {
    slug: "why-longform-still-matters",
    title: "长文为什么仍然重要：在快速消费时代保留深度阅读",
    category: "观点",
    excerpt: "信息被切碎以后，真正帮助用户建立理解的，仍然是结构完整、观点清晰的长文。",
    publishedAt: "2026-03-05",
    readingTime: "7 分钟",
    author: "林川",
    tags: ["长文", "阅读", "内容策略"],
    coverLabel: "Essay",
    coverPalette: ["#2a211d", "#b45309"],
    body: [
      "深度内容的价值，不在于篇幅，而在于它能否帮助用户跨越“知道”和“理解”之间的断层。",
      "当一个站点愿意为长文阅读保留空间，它也在向读者表达一种态度：我们不只追逐信息速度，也重视解释和判断。"
    ]
  },
  {
    slug: "games-and-digital-culture",
    title: "游戏内容为什么值得进入主流内容站点的首页",
    category: "游戏",
    excerpt: "游戏不只是娱乐话题，它天然连接技术、叙事、社群和数字文化。",
    publishedAt: "2026-03-02",
    readingTime: "5 分钟",
    author: "沈陌",
    tags: ["游戏", "文化", "内容栏目"],
    coverLabel: "Game",
    coverPalette: ["#0f172a", "#2563eb"],
    body: [
      "如果一个内容站想覆盖更完整的数字生活图景，游戏栏目不应被放在边角，它同样能承担观察当代技术文化的角色。",
      "好的游戏内容不只是攻略和资讯，而是把机制、叙事、社区和产业变化整合成可读的观点。"
    ]
  },
  {
    slug: "visual-rhythm-for-content-sites",
    title: "内容站点的视觉节奏：为什么不是所有卡片都该一样大",
    category: "影像",
    excerpt: "当卡片大小、重点、边距都完全一致时，页面会失去叙事感。",
    publishedAt: "2026-02-28",
    readingTime: "4 分钟",
    author: "许照",
    tags: ["视觉设计", "栅格", "节奏"],
    coverLabel: "Visual",
    coverPalette: ["#3b2f2f", "#f97316"],
    body: [
      "统一并不等于单调。真正好的内容页需要在一致性和节奏感之间找到平衡。",
      "可以让精选卡片更大，让某些模块更轻，让一些内容承担“停顿”和“转场”的作用，这样页面才像一篇经过编排的文章，而不是数据库导出。"
    ]
  },
  {
    slug: "from-tag-to-topic",
    title: "从标签到专题：如何让内容沉淀出可持续的栏目价值",
    category: "互联网",
    excerpt: "标签是索引工具，专题才是品牌资产。两者需要同时存在，但职责不同。",
    publishedAt: "2026-02-25",
    readingTime: "9 分钟",
    author: "程野",
    tags: ["专题", "标签", "内容系统"],
    coverLabel: "Topic",
    coverPalette: ["#111827", "#9333ea"],
    body: [
      "一个成熟的博客站点，不应只有零散文章。它还需要把反复出现的问题组织成专题或栏目。",
      "专题是一种更高层级的叙事工具，它会影响首页结构、列表页分发以及搜索结果中的聚合关系。"
    ]
  },
  {
    slug: "about-pages-need-voice",
    title: "关于页不该只是履历堆叠，它应该让读者听见站点的声音",
    category: "方法论",
    excerpt: "一个好的 About 页面，应该在简洁信息和品牌表达之间找到平衡。",
    publishedAt: "2026-02-21",
    readingTime: "6 分钟",
    author: "许照",
    tags: ["关于页", "品牌", "文案"],
    coverLabel: "About",
    coverPalette: ["#1f2937", "#14b8a6"],
    body: [
      "关于页最常见的问题，是只交代身份，却没有呈现立场。对于内容站点而言，后者往往更重要。",
      "当读者理解你为什么持续写、打算写什么、不写什么，他们才会知道是否值得长期关注。"
    ]
  },
  {
    slug: "building-a-better-reading-flow",
    title: "把阅读流设计好，比把动画做多更重要",
    category: "观点",
    excerpt: "阅读型产品不需要过量微交互，它更需要安静、明确、可信的阅读路径。",
    publishedAt: "2026-02-18",
    readingTime: "5 分钟",
    author: "林川",
    tags: ["阅读体验", "交互", "内容产品"],
    coverLabel: "Flow",
    coverPalette: ["#292524", "#ea580c"],
    body: [
      "阅读流是一个容易被低估的概念。它包括目录、段落间距、标题层级、推荐关系和返回路径。",
      "一旦这些细节是稳定且自然的，页面就会显得更专业，用户也更愿意读完全文。"
    ]
  },
  {
    slug: "the-case-for-slower-homepages",
    title: "更慢一点的首页：给精选内容更多空间",
    category: "影像",
    excerpt: "首页不一定要塞满信息，适度的留白与节奏控制会提高整体品质感。",
    publishedAt: "2026-02-15",
    readingTime: "4 分钟",
    author: "沈陌",
    tags: ["首页设计", "精选", "品牌氛围"],
    coverLabel: "Slow",
    coverPalette: ["#172554", "#dc2626"],
    body: [
      "许多内容首页的问题不是信息太少，而是太急于把所有信息一次性说完。",
      "留白不是浪费，而是帮助用户组织注意力。尤其在编辑型页面里，适度克制常常比密集堆砌更有效。"
    ]
  }
];

export const featuredPost = posts.find((post) => post.featured) ?? posts[0];

export function getPostBySlug(slug: string) {
  return posts.find((post) => post.slug === slug);
}

export function getRelatedPosts(currentSlug: string, category: Category) {
  return posts
    .filter((post) => post.slug !== currentSlug && post.category === category)
    .slice(0, 3);
}

export function getPostsByCategory(category: Category) {
  return posts.filter((post) => post.category === category);
}
