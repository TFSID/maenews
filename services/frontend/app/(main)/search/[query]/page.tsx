import { searchArticles, getTrendingItems, getUpcomingEvents } from "@/app/lib/api";
import { LatestNewsArticle } from "@/app/components/article/LatestNewsArticle";
import { Sidebar } from "@/app/components/layout/Sidebar";
import { EmptyState } from "@/app/components/ui/EmptyState";
import { Search } from "lucide-react";

export default async function SearchPage({ params }: { params: { query: string } }) {
  const query = decodeURIComponent(params.query);
  const [articles, trending, events] = await Promise.all([
    searchArticles(query),
    getTrendingItems(),
    getUpcomingEvents(),
  ])

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3 mb-8 pb-4 border-b">
            <Search className="text-primary w-6 h-6" />
            <h1 className="text-2xl font-bold">Hasil Cari: <span className="italic">{`"${query}"`}</span></h1>
          </div>
          {articles && articles.length > 0 ? (
            <div className="flex flex-col gap-6">
              {articles.map((a) => <LatestNewsArticle key={a.id} article={a} />)}
            </div>
          ) : (
            <EmptyState title="Pencarian Nihil" message={`Tidak ada hasil untuk "${query}". Coba kata kunci lain.`} />
          )}
        </div>
        <Sidebar trendingItems={trending ?? []} upcomingEvents={events ?? []} />
      </div>
    </main>
  );
}