export default function AboutPage() {
  return (
    <section className="shell about-editorial about-editorial-upgraded">
      <div className="about-hero upgraded">
        <p className="micro-kicker">关于站点</p>
        <h1>
          我们用更有秩序的方式，记录 <span>技术时代</span> 的变化。
        </h1>
        <p>
          技术策展不是一个追逐热点的快讯站点。我们更关心那些正在慢慢改写产业结构、产品逻辑和生活方式的长期变化，也希望用更稳的版式和更长的阅读节奏把这些变化讲清楚。
        </p>
      </div>

      <div className="philosophy-layout upgraded">
        <section className="philosophy-card upgraded">
          <h2>我们的写作原则</h2>
          <ol>
            <li>
              <strong>优先写结构性变化</strong>
              <p>我们希望解释趋势背后的系统，而不是只复述一条新闻。</p>
            </li>
            <li>
              <strong>控制信息密度</strong>
              <p>少而精的栏目、清晰的摘要和可持续回访的阅读节奏，比无限堆叠内容更重要。</p>
            </li>
            <li>
              <strong>坚持长期视角</strong>
              <p>一篇文章应该帮助读者看见趋势的延续性，而不是只消费一天的情绪波动。</p>
            </li>
          </ol>
        </section>

        <div className="about-visual upgraded">
          <div className="visual-card" />
          <div className="visual-note wide-note">
            <span>站点备注</span>
            <p>我们关心平台、基础设施、产业链、工具和文化如何共同塑造技术时代的下一阶段，也持续记录那些容易被忽视但真正影响深远的底层变化。</p>
          </div>
        </div>
      </div>

      <section className="timeline-section">
        <div className="section-headline">
          <h2>我们关注什么</h2>
        </div>
        <div className="timeline-grid">
          {[
            ["01", "基础设施", "算力、网络、数据中心、能源与物理层资源。"],
            ["02", "产品形态", "浏览器、开发工具、代理工作流和新入口。"],
            ["03", "产业结构", "供应链、平台竞争、资本流向与政策影响。"],
            ["04", "文化变迁", "技术如何改变职业、表达、媒体和日常生活。"],
          ].map(([index, title, copy]) => (
            <article className="timeline-card" key={index}>
              <span>{index}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="team-section upgraded">
        <div className="section-headline">
          <h2>幕后编辑团队</h2>
        </div>
        <div className="team-grid upgraded">
          {[
            ["林川", "主编", "负责站点整体内容方向与主稿选题，关注技术产业和内容产品的交叉地带。"],
            ["叶真", "基础设施编辑", "长期跟踪云、网络、数据中心与算力系统，偏爱那些“看不见但最重要”的基础层问题。"],
            ["周墨", "文化与产品编辑", "关注技术文化、创作者生态与平台结构，负责更偏长期的观察型内容。"],
          ].map(([name, role, copy]) => (
            <article className="team-card editorial-team-card" key={name}>
              <div className="avatar-placeholder" />
              <h3>{name}</h3>
              <p className="team-role">{role}</p>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="black-banner upgraded">
        <div>
          <h2>保持对变化的敏感</h2>
          <p>加入我们的周更通讯，每周收到一份经过编辑筛选的技术议题清单。</p>
        </div>
        <button type="button">立即订阅</button>
      </section>
    </section>
  );
}