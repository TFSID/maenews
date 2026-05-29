import { getArticlesByCategory, getTrendingItems, getUpcomingEvents } from "@/app/lib/api";
import { CategoryPageLayout } from "@/app/components/pages/CategoryPageLayout";

export default async function EventsPage() {
  const [articles, trending, events] = await Promise.all([
    getArticlesByCategory("event"),
    getTrendingItems(),
    getUpcomingEvents(),
  ]);

  return (
    <CategoryPageLayout
      categoryName="Event"
      articles={articles ?? []}
      trendingItems={trending ?? []}
      upcomingEvents={events ?? []}
      currentPage={1}
      totalPages={1}
      basePath="/event"
    />
  );
}
