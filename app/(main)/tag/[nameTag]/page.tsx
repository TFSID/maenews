import { getArticlesByTag, getTrendingItems, getUpcomingEvents } from "@/app/lib/api";
import { LatestNewsArticle } from "@/app/components/article/LatestNewsArticle";
import { Sidebar } from "@/app/components/layout/Sidebar";
import { Hash } from "lucide-react";

export default async function TagPage({ params }: { params: { nameTag: string } }) {
  const tag = decodeURIComponent(params.nameTag);
  const [articles, trending, events] = await Promise.all([
    getArticlesByTag(tag),
    getTrendingItems(),
    getUpcomingEvents(),
  ]);

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-8 pb-4 border-b">
            <Hash className="text-primary w-6 h-6" />
            <h1 className="text-2xl font-bold uppercase tracking-tight">Tag: {tag}</h1>
          </div>
          <div className="flex flex-col gap-6">
            {articles?.map((a) => <LatestNewsArticle key={a.id} article={a} />)}
          </div>
        </div>
        <Sidebar trendingItems={trending ?? []} upcomingEvents={events ?? []} />
      </div>
    </main>
  );
}