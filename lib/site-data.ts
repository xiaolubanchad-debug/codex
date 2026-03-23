export type Category = "互联网" | "人工智能" | "硬件" | "软件" | "未来" | "文化";

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
  name: "技术策展",
  title: "技术策展",
  description: "一个关注技术系统、产业结构与未来趋势的中文编辑型内容站。",
  mission: "为技术时代提供更有秩序的观察、更有深度的分析和更耐读的内容体验。",
};

export const navigation = [
  { href: "/", label: "首页" },
  { href: "/posts", label: "归档" },
  { href: "/search", label: "搜索" },
  { href: "/about", label: "关于" },
];

export const categories: Category[] = ["互联网", "人工智能", "硬件", "软件", "未来", "文化"];

export const posts: Post[] = [
  {
    slug: "silicon-sovereignty",
    title: "硅基主权：算力如何重塑下一轮全球竞争",
    category: "人工智能",
    excerpt: "从晶圆厂、能源到模型训练，算力已经不只是技术资源，而是国家级竞争的底层筹码。",
    publishedAt: "2026-03-12",
    readingTime: "8 分钟",
    author: "林川",
    featured: true,
    tags: ["算力", "芯片", "地缘科技"],
    coverLabel: "封面专题",
    coverPalette: ["#111111", "#7f1d1d"],
    body: [
      "过去几年，算力的讨论常常被包裹在技术进步的叙事里，但真正推动产业结构变化的，是算力分配方式本身。谁能掌握更稳定、更低成本、更可控的算力供应，谁就更有机会定义下一轮平台格局。",
      "当先进制程、能源网络、云基础设施与模型公司开始形成新的权力同盟，芯片产业不再只是制造问题，而是一整套战略系统。我们正在看到一种新的现实：算力成为像港口、铁路和电网那样的国家级基础设施。",
      "对内容读者来说，理解算力战争的价值，不在于追逐每一条芯片新闻，而在于理解为什么越来越多的商业产品、政策争议和资本动作，都在围绕同一件事展开：谁来拥有未来数字社会的运行底板。"
    ]
  },
  {
    slug: "synthetic-identity-ethics",
    title: "合成身份的伦理边界：当“我”可以被生成",
    category: "文化",
    excerpt: "从数字替身到 AI 分身，合成身份不再只是娱乐工具，它正在改变信任、表达与社会关系。",
    publishedAt: "2026-03-09",
    readingTime: "6 分钟",
    author: "沈青",
    tags: ["身份", "伦理", "平台社会"],
    coverLabel: "文化观察",
    coverPalette: ["#0f172a", "#059669"],
    body: [
      "合成身份正在从边缘实验变成大规模日常工具。人们不只是使用滤镜、配音和头像，而是在逐步学会如何经营一个可以被复制、放大、再加工的“自己”。",
      "问题在于，社会原本依赖的大量信任机制，是建立在身份相对稳定的前提之上的。当图像、声音、写作风格和交互习惯都能被高度拟真地生成时，我们需要重新定义什么叫真实、什么叫授权、什么叫冒充。",
      "对平台而言，真正困难的不是技术本身，而是如何在开放表达与身份秩序之间找到新的平衡。"
    ]
  },
  {
    slug: "neo-luddism-in-valley",
    title: "硅谷新卢德主义：为什么技术人开始重新崇尚“慢”",
    category: "文化",
    excerpt: "在更快的自动化浪潮里，一部分技术从业者反而开始回到小系统、慢工具和低复杂度实践。",
    publishedAt: "2026-03-05",
    readingTime: "7 分钟",
    author: "周墨",
    tags: ["工作方式", "软件文化", "技术哲学"],
    coverLabel: "深度评论",
    coverPalette: ["#2f2f2f", "#dc2626"],
    body: [
      "“更快、更大、更自动”曾经是技术行业最主流的价值方向，但在复杂系统逐步吞噬日常工作以后，一种反向的文化开始出现。越来越多工程师重新重视可解释性、低耦合和节制式建设。",
      "这种趋势并不意味着反技术，而是反对无边界的复杂化。人们并不是不想创新，而是不愿意继续把所有问题都交给更重的工具链与更长的依赖链。",
      "新卢德主义真正要反对的，从来不是机器，而是被机器逻辑完全塑形的工作生活。"
    ]
  },
  {
    slug: "submarine-cable-boom",
    title: "海底光缆热潮：全球网络的物理边界正在重新划分",
    category: "互联网",
    excerpt: "数据世界看似无形，但决定连接权力的，仍然是海底光缆、港口节点与跨境基础设施。",
    publishedAt: "2026-03-02",
    readingTime: "5 分钟",
    author: "叶真",
    tags: ["网络基础设施", "全球互联网", "带宽"],
    coverLabel: "网络基础设施",
    coverPalette: ["#0b2537", "#0ea5e9"],
    body: [
      "每一次关于全球互联网开放性的讨论，最终都会落回到极其具体的地理设施上：哪条光缆经过哪片海域，哪个国家控制节点，哪个企业掌握运营与维护能力。",
      "海底光缆不仅是数据通道，更是商业和政治力量的延伸。控制链路，意味着控制延迟、稳定性、数据主权以及未来新平台的扩张能力。",
      "在内容层面，这类基础设施议题之所以重要，是因为它让我们看到数字经济的“物理现实”。"
    ]
  },
  {
    slug: "http4-deterministic-web",
    title: "HTTP/4 与确定性网络：下一代 Web 不只追求更快",
    category: "软件",
    excerpt: "协议的未来不只是吞吐量竞赛，更是稳定性、可预测性和复杂系统协同的重新设计。",
    publishedAt: "2026-02-28",
    readingTime: "4 分钟",
    author: "陈屿",
    tags: ["协议", "Web", "性能"],
    coverLabel: "协议演进",
    coverPalette: ["#121212", "#525252"],
    body: [
      "Web 的协议演进过去更多围绕带宽与速度展开，但在现代应用场景里，确定性越来越成为关键指标。企业服务、实时协作和 AI 接口都需要更稳定的响应模式，而不是单一峰值速度。",
      "这意味着下一代协议会更强调边缘场景、拥塞恢复、长连接策略和多终端一致性。",
      "对开发者来说，协议升级真正带来的收益，往往不是“更快一点”，而是“更少意外”。"
    ]
  },
  {
    slug: "encryption-under-siege",
    title: "加密围城：当隐私成为新的政策战场",
    category: "软件",
    excerpt: "加密技术正在被重新定义，它不只是安全手段，也成为平台责任、公共治理与个人自由的冲突交点。",
    publishedAt: "2026-02-25",
    readingTime: "9 分钟",
    author: "苏澈",
    tags: ["加密", "隐私", "政策"],
    coverLabel: "安全前线",
    coverPalette: ["#0b1320", "#14b8a6"],
    body: [
      "围绕端到端加密的争议越来越像一场长期的制度拉锯。监管部门希望保留介入能力，平台希望维持用户信任，用户则越来越依赖私密通信来构建日常关系。",
      "真正困难的地方，在于任何看似局部的技术妥协，都会成为系统性脆弱性的入口。",
      "因此，加密争议表面上是法律和技术问题，深层上却是在讨论谁来定义数字社会的边界。"
    ]
  },
  {
    slug: "quantum-commercial-reality",
    title: "量子比特与商业现实：量子计算距离真正落地还有多远",
    category: "硬件",
    excerpt: "从实验室突破到产业部署，量子计算仍然要跨过稳定性、制造、工程和场景四重门槛。",
    publishedAt: "2026-02-21",
    readingTime: "6 分钟",
    author: "顾远",
    tags: ["量子计算", "芯片", "硬科技"],
    coverLabel: "硬件分析",
    coverPalette: ["#0f172a", "#10b981"],
    body: [
      "量子计算最容易被误读的地方，是把科学突破直接等同于产业落地。事实上，实验室里的可行性、工程上的稳定性和商业上的可复制性，往往是三件完全不同的事情。",
      "目前行业最现实的问题不是“能不能做”，而是“能不能稳定重复地做、持续低成本地做”。",
      "因此，量子赛道真正值得关注的，除了算力指标，还有供应链、制冷系统、封装方案和软件工具链的成熟速度。"
    ]
  },
  {
    slug: "post-quantum-crypto",
    title: "后量子密码迁移：安全系统如何应对下一次计算跃迁",
    category: "未来",
    excerpt: "后量子密码不是远方议题，它正在逐步进入政府采购、企业安全和关键基础设施标准。",
    publishedAt: "2026-02-18",
    readingTime: "5 分钟",
    author: "江清禾",
    tags: ["密码学", "政策", "基础设施"],
    coverLabel: "政策追踪",
    coverPalette: ["#111827", "#7c3aed"],
    body: [
      "对许多机构来说，后量子密码迁移听上去像一项未来工程，但真正的准备工作其实已经开始。密钥体系、硬件模块、认证流程和长期数据存档都需要提前调整。",
      "这场迁移的难点不在于新算法本身，而在于旧系统极多、场景极碎、替换成本极高。",
      "当一个安全标准开始变化，背后往往带来的是整条产业链的再校准。"
    ]
  },
  {
    slug: "bio-quantum-interface",
    title: "生物-量子接口：模拟生命系统的新计算窗口",
    category: "未来",
    excerpt: "更高维度的模拟能力，正在把生命科学从“实验主导”推向“计算主导”的新阶段。",
    publishedAt: "2026-02-15",
    readingTime: "4 分钟",
    author: "叶真",
    tags: ["生物计算", "模拟", "前沿科技"],
    coverLabel: "未来实验",
    coverPalette: ["#1f2937", "#ef4444"],
    body: [
      "过去很多生物研究依赖大量重复实验，而新一代计算模拟正在压缩这个过程。研究者不再只是等待结果，而是可以在更高维度的模型空间里提前探索可能性。",
      "这并不意味着实验会消失，而是意味着实验的组织方式将被重新设计。",
      "谁能率先掌握模拟与实验的联动效率，谁就更可能占据新一代研发平台的高地。"
    ]
  },
  {
    slug: "small-models-enterprise-shift",
    title: "小模型回潮：企业为什么开始重新偏爱轻量 AI",
    category: "人工智能",
    excerpt: "在大模型热之后，越来越多企业开始重新审视部署成本、响应速度和领域适配能力。",
    publishedAt: "2026-02-12",
    readingTime: "6 分钟",
    author: "陆淮",
    tags: ["小模型", "企业 AI", "部署"],
    coverLabel: "AI 策略",
    coverPalette: ["#111827", "#2563eb"],
    body: [
      "企业使用 AI 的真实问题，很少只是能力上限，而更多是落地成本和可控性。轻量模型在私有部署、边缘推理和垂直场景中重新获得青睐，并不令人意外。",
      "这波趋势意味着 AI 产品将从“统一平台能力竞争”重新走回“场景适配竞争”。",
      "谁更懂业务流程，谁就更可能把模型真正嵌进生产链路。"
    ]
  },
  {
    slug: "domestic-chip-tools-race",
    title: "国产 EDA 工具竞速：芯片设计软件迎来第二战场",
    category: "硬件",
    excerpt: "当制造与封装不断被讨论时，设计工具链本身正悄悄成为新的产业焦点。",
    publishedAt: "2026-02-10",
    readingTime: "7 分钟",
    author: "顾远",
    tags: ["EDA", "芯片设计", "产业链"],
    coverLabel: "工具链",
    coverPalette: ["#1c1917", "#f97316"],
    body: [
      "芯片行业经常把注意力集中在先进制程上，但真正决定研发效率的，还有设计验证与仿真工具。",
      "EDA 软件不是单纯的开发工具，它深度嵌入设计流程、人才体系和供应链协作方式，因此替代与建设都非常漫长。",
      "这场竞速的关键，不只是产品能力，更是生态承接能力。"
    ]
  },
  {
    slug: "browser-power-war",
    title: "浏览器再变形：AI 时代入口战争卷土重来",
    category: "互联网",
    excerpt: "当搜索、助手、网页生成与工作流工具同时进入浏览器，新的入口竞争再次开始。",
    publishedAt: "2026-02-08",
    readingTime: "5 分钟",
    author: "唐舟",
    tags: ["浏览器", "入口", "AI 产品"],
    coverLabel: "平台入口",
    coverPalette: ["#172554", "#dc2626"],
    body: [
      "浏览器本来被认为是已经稳定的基础应用，但 AI 正在重新定义它的角色。它不再只是访问网页的外壳，而是内容生成、任务执行与个人知识管理的新终端。",
      "这意味着浏览器再次变成平台入口，而平台入口从来不会是小事。",
      "新一轮战争的核心不是标签页，而是谁能更早掌握用户工作流。"
    ]
  },
  {
    slug: "agent-workflow-inside-products",
    title: "代理工作流进入产品内部：软件将如何重新组织界面",
    category: "软件",
    excerpt: "当 AI 代理不再只是聊天框功能，产品界面本身就会被重新拆解与重组。",
    publishedAt: "2026-02-05",
    readingTime: "8 分钟",
    author: "陈屿",
    tags: ["Agent", "工作流", "界面设计"],
    coverLabel: "产品系统",
    coverPalette: ["#0f172a", "#22c55e"],
    body: [
      "过去的软件界面围绕固定流程展开，而 AI 代理更适合围绕意图和目标展开。这意味着用户界面会从工具栈结构，逐步转向任务编排结构。",
      "按钮不会消失，但按钮背后的逻辑会越来越多由系统动态决定。",
      "对设计师和前端来说，这种变化远比加一个聊天入口更深。"
    ]
  },
  {
    slug: "data-center-water-tension",
    title: "数据中心的水资源紧张：被忽视的 AI 环境成本",
    category: "人工智能",
    excerpt: "训练成本常常被讨论为显卡和电力问题，但冷却系统消耗的水资源正在成为新矛盾。",
    publishedAt: "2026-02-03",
    readingTime: "5 分钟",
    author: "叶真",
    tags: ["数据中心", "能耗", "AI 基础设施"],
    coverLabel: "基础设施",
    coverPalette: ["#082f49", "#0ea5e9"],
    body: [
      "AI 产业的基础设施扩张，正在让资源讨论从电力走向更复杂的综合约束。其中，水资源是最容易被忽略的一层。",
      "当高密度数据中心集中落地在特定区域，水和电的协调就会直接影响产业布局。",
      "这类问题之所以重要，是因为它会反过来塑造未来算力地图。"
    ]
  },
  {
    slug: "platform-fatigue-and-media",
    title: "平台疲劳时代，独立媒体为什么重新被需要",
    category: "文化",
    excerpt: "当信息平台变得越来越像即时情绪机器，节制、筛选和结构化表达再次变得稀缺。",
    publishedAt: "2026-01-30",
    readingTime: "6 分钟",
    author: "周墨",
    tags: ["独立媒体", "平台疲劳", "内容产品"],
    coverLabel: "媒体观察",
    coverPalette: ["#292524", "#ea580c"],
    body: [
      "今天的问题已经不是信息太少，而是太多、太快、太碎。平台把注意力组织得越来越高效，但也把判断过程切得越来越薄。",
      "独立媒体重新被需要，不是因为它更大声，而是因为它更愿意为“解释”投入时间。",
      "在新的内容环境里，深度和节奏本身就构成了一种产品差异化。"
    ]
  },
  {
    slug: "consumer-robotics-second-wave",
    title: "消费机器人第二波：从噱头演示走向家庭工具",
    category: "未来",
    excerpt: "消费级机器人正在经历从视觉奇观到功能型产品的转折期，真正的竞争才刚开始。",
    publishedAt: "2026-01-27",
    readingTime: "7 分钟",
    author: "江清禾",
    tags: ["机器人", "消费电子", "家庭场景"],
    coverLabel: "未来终端",
    coverPalette: ["#111827", "#f43f5e"],
    body: [
      "第一代消费机器人更像一种展示技术可能性的舞台产品，而第二波市场正在逼近真正的家庭需求：清洁、陪伴、照护与轻量协作。",
      "当价格、供给和模型能力同时改善，机器人产品终于开始进入“可被讨论为工具”的阶段。",
      "下一步的关键，不是再做更酷的演示，而是做更稳定的日常服务。"
    ]
  },
  {
    slug: "developer-tools-quiet-revolution",
    title: "开发工具的静默革命：从 IDE 到工作流平台",
    category: "软件",
    excerpt: "开发工具的竞争已经不再只是编辑器之争，而是围绕协作、上下文和自动化的整体平台之争。",
    publishedAt: "2026-01-24",
    readingTime: "6 分钟",
    author: "陆淮",
    tags: ["开发工具", "工作流", "平台化"],
    coverLabel: "开发生态",
    coverPalette: ["#1e293b", "#38bdf8"],
    body: [
      "开发者每天打开的工具正在从单点软件变成工作流中枢。代码编辑、调试、生成、测试、部署和知识检索都开始聚合到同一个上下文界面里。",
      "真正的变化不是功能叠加，而是工作方式的重组。开发者越来越少地在工具之间切换，而更多地在同一个环境里完成完整任务。",
      "这也是为什么开发工具正在重新成为最有战略意义的软件赛道之一。"
    ]
  },
  {
    slug: "satellite-network-density",
    title: "低轨卫星密度上升：互联网天空层的新拥堵问题",
    category: "互联网",
    excerpt: "卫星互联网正在进入更高密度运行阶段，新的性能问题不再来自覆盖不足，而来自轨道协同。",
    publishedAt: "2026-01-20",
    readingTime: "5 分钟",
    author: "叶真",
    tags: ["卫星互联网", "低轨网络", "通信"],
    coverLabel: "天空网络",
    coverPalette: ["#020617", "#6366f1"],
    body: [
      "低轨卫星网络早期的叙事重心是覆盖，但当部署数量上升到新的规模后，轨道管理、链路切换和频谱干扰开始成为更现实的问题。",
      "这意味着卫星互联网的发展，正在从“能不能建起来”转向“如何高质量运行”。",
      "越接近基础设施的后半程，工程问题就越会替代营销叙事。"
    ]
  },
  {
    slug: "memory-products-after-chatbots",
    title: "聊天机器人之后，记忆型产品会成为下一类入口吗",
    category: "人工智能",
    excerpt: "当所有人都在做会回答问题的工具，真正稀缺的反而是“能持续理解你”的系统。",
    publishedAt: "2026-01-18",
    readingTime: "6 分钟",
    author: "林川",
    tags: ["记忆系统", "AI 产品", "个人知识"],
    coverLabel: "产品前沿",
    coverPalette: ["#0f172a", "#ec4899"],
    body: [
      "聊天机器人解决的是即时交互，但长期价值可能来自记忆。一个能持续理解用户上下文、偏好和历史任务的系统，会比一次性问答更有粘性。",
      "记忆型产品的挑战也因此更复杂：它要求更高质量的长期上下文管理、更谨慎的隐私策略以及更清晰的价值表达。",
      "下一代个人 AI，也许不是最会说的那个，而是最记得你的那个。"
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
