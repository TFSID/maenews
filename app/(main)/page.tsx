import dynamic from "next/dynamic";
import { Hero } from "../components/pages/Hero";
import { Sidebar } from "../components/layout/Sidebar";
import { EventBanner } from "../components/BannerEvent";
import { LatestNewsSection } from "../components/article/LatestNewsSection";
import {
  getAllArticles,
  getTrendingItems,
  getUpcomingEvents,
} from "../lib/api";
import { ArticleFeed } from "../components/pages/ArticleFeed";

const SliderNews = dynamic(
  () => import("../components/slider/SliderNews").then((mod) => mod.SliderNews),
  {
    loading: () => (
      <div className="h-[300px] w-full bg-primary animate-pulse" />
    ),
    ssr: false,
  }
);

export default async function HomePage() {
  const [allArticles, trendingItems, upcomingEvents] = await Promise.all([
    getAllArticles(),
    getTrendingItems(),
    getUpcomingEvents(),
  ]);

  const featuredArticle = (allArticles ?? []).find((a) => a.featured);
  const allNonFeatured = (allArticles ?? []).filter((a) => !a.featured);

  const heroSidebarArticles = allNonFeatured.slice(0, 3);
  const latestArticles = allNonFeatured.slice(0, 5);
  const recommendationArticles = allNonFeatured.slice(0, 7);
  const afterRecommendationArticles = allNonFeatured.slice(5, 10);
  const dynamicLoadArticles = allNonFeatured.slice(10);

  return (
    <>
      {/* 1. Hero Bento Grid */}
      <Hero featuredArticle={featuredArticle} articles={heroSidebarArticles} />

      {/* 2. Event Countdown Timer */}
      <div className="container mx-auto px-4 lg:px-8 xl:px-[150px] py-4">
        <EventBanner events={upcomingEvents ?? []} />
      </div>

      {/* 3. Terbaru + Sidebar */}
      <div className="container mx-auto px-4 lg:px-8 xl:px-[150px] py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] xl:grid-cols-[1fr_340px] gap-8 lg:gap-10">
          <div>
            <LatestNewsSection title="Terbaru" articles={latestArticles} />
          </div>
          <div>
            <Sidebar
              trendingItems={trendingItems ?? []}
              upcomingEvents={upcomingEvents ?? []}
            />
          </div>
        </div>
      </div>

      {/* 4. Rekomendasi Carousel (Full Width Orange) */}
      <SliderNews articles={recommendationArticles} title="Rekomendasi" />

      {/* 5. More Articles After Rekomendasi */}
      <div className="container mx-auto px-4 lg:px-8 xl:px-[150px] py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] xl:grid-cols-[1fr_340px] gap-8 lg:gap-10">
          <div>
            <ArticleFeed
              initialArticles={afterRecommendationArticles}
              articlesToLoad={dynamicLoadArticles}
            />
          </div>
          <div>{/* spacer to match Terbaru grid */}</div>
        </div>
      </div>
    </>
  );
}
