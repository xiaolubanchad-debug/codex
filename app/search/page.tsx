import { SearchPanel } from "@/components/search-panel";
import { getPublicSearchOptions, listPublicPosts, type PublicSearchDateRange } from "@/lib/public-site";

export const dynamic = "force-dynamic";

type SearchPageProps = {
  searchParams: Promise<{
    q?: string;
    category?: string;
    author?: string;
    dateRange?: PublicSearchDateRange;
  }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  const category = params.category?.trim() ?? "";
  const author = params.author?.trim() ?? "";
  const dateRange = params.dateRange;

  const [results, options] = await Promise.all([
    listPublicPosts({
      q: query || undefined,
      category: category || undefined,
      author: author || undefined,
      dateRange,
      limit: 24,
    }),
    getPublicSearchOptions(),
  ]);

  return (
    <section className="shell page-block">
      <SearchPanel
        query={query}
        category={category}
        author={author}
        dateRange={dateRange}
        options={options}
        results={results}
      />
    </section>
  );
}
