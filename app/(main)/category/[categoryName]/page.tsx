import { getArticlesByCategory, getTrendingItems, getUpcomingEvents } from "@/app/lib/api";
import { CategoryPageLayout } from "@/app/components/pages/CategoryPageLayout";
import { EmptyState } from "@/app/components/ui/EmptyState";

export default async function CategoryPage({ params }: { params: { categoryName: string } }) {
  const categorySlug = decodeURIComponent(params.categoryName);

  const [articles, trending, events] = await Promise.all([
    getArticlesByCategory(categorySlug),
    getTrendingItems(),
    getUpcomingEvents(),
  ]);

  // Format title (e.g., "content-creator" -> "Content Creator")
  const title = categorySlug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

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
      articles={articles}
      trendingItems={trending ?? []}
      upcomingEvents={events ?? []}
    />
  );
}