import { CreatePostPageClient } from "./create-post-page-client";

export default function AdminPostCreatePage() {
  return (
    <div className="page-block">
      <section className="archive-card">
        <p className="module-title">后台写作台</p>
        <h2>新建文章</h2>
        <p>使用富文本编辑器撰写正文，完成后可直接保存为草稿、提交审核或发布。</p>
      </section>

      <CreatePostPageClient />
    </div>
  );
}
