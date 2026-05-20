import { getArticlesByCategory, getTrendingItems, getUpcomingEvents } from "@/app/lib/api";
import { CategoryPageLayout } from "@/app/components/pages/CategoryPageLayout";
import { EmptyState } from "@/app/components/ui/EmptyState";

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ categoryName: string }>;
  searchParams?: Promise<{ page?: string }>;
}) {
  const { categoryName } = await params;
  const query = await searchParams;
  const categorySlug = decodeURIComponent(categoryName);
  const currentPage = parsePage(query?.page);
  const perPage = 9;

  const [articles, trending, events] = await Promise.all([
    getArticlesByCategory(categorySlug),
    getTrendingItems(),
    getUpcomingEvents(),
  ]);

  // Format title (e.g., "content-creator" -> "Content Creator")
  const title = categorySlug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  const totalPages = Math.max(1, Math.ceil((articles?.length ?? 0) / perPage));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedArticles = (articles ?? []).slice(
    (safePage - 1) * perPage,
    safePage * perPage
  );

  if (!articles || articles.length === 0) {
    return (
      <main className="container mx-auto px-4 py-8">
        <EmptyState
          title="Kategori Kosong"
          message={`Belum ada berita di kategori ${title}. Tim redaksi kami sedang bekerja keras!`}
        />
      </main>
    );
  }

  return (
    <CategoryPageLayout
      categoryName={title}
      articles={paginatedArticles}
      trendingItems={trending ?? []}
      upcomingEvents={events ?? []}
      currentPage={safePage}
      totalPages={totalPages}
      basePath={`/category/${categorySlug}`}
    />
  );
}

function parsePage(page?: string) {
  const value = Number(page);
  if (!Number.isInteger(value) || value < 1) {
    return 1;
  }
  return value;
}
