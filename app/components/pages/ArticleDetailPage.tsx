"use client";

import Link from "next/link";
import Image from "next/image";
import { Article, TrendingItem, Event } from "@/app/typing";
import { Breadcrumb } from "../ui/Breadcrumb";
import { ReadingProgress } from "../ui/ReadingProgress";
import { ArticleHeader } from "./ArticleDetailPage/ArticleHeader";
import { ArticleContent } from "./ArticleDetailPage/ArticleContent";
import { TagList } from "./ArticleDetailPage/TagList";
import { ShareSection } from "./ArticleDetailPage/ShareSection";
import { RelatedArticles } from "./ArticleDetailPage/RelatedArticles";
import { RecommendationGrid } from "./ArticleDetailPage/RecommendationGrid";

interface ArticleDetailPageProps {
  article: Article;
  relatedArticles: Article[];
  recommendationArticles: Article[];
  trendingItems: TrendingItem[];
  upcomingEvents: Event[];
}

export function ArticleDetailPage({
  article,
  relatedArticles,
  recommendationArticles,
  trendingItems,
  upcomingEvents,
}: ArticleDetailPageProps) {
  return (
    <main className="relative">
      <ReadingProgress />

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 lg:px-8 xl:px-[150px] pt-4 pb-2">
        <Breadcrumb
          items={[
            { label: article.category, href: `/category/${article.category.toLowerCase()}` },
            { label: "Detail", href: "#" },
          ]}
        />
      </div>

      {/* Two-column layout: Content + Sidebar */}
      <div className="container mx-auto px-4 lg:px-8 xl:px-[150px] pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] xl:grid-cols-[1fr_340px] gap-8 lg:gap-10">
          {/* LEFT COLUMN — Article Content */}
          <div>
            {/* Header: Title + Date + Image */}
            <ArticleHeader article={article} />

            {/* Body: Location + Description */}
            <ArticleContent htmlContent={article.content || article.description || ""} />

            {/* Tags */}
            <TagList tags={article.tags} />
          </div>

          {/* RIGHT SIDEBAR */}
          <aside className="space-y-8">
            {/* Share Section */}
            <ShareSection
              url={typeof window !== "undefined" ? window.location.href : ""}
              title={article.title}
            />

            {/* Artikel Terkait */}
            <RelatedArticles articles={relatedArticles} />

            {/* Event Mendatang */}
            {upcomingEvents.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-lg font-black uppercase text-primary font-adlam tracking-wide">
                    Event Mendatang
                  </h3>
                </div>
                <div className="space-y-4">
                  {upcomingEvents.slice(0, 4).map((event) => (
                    <Link
                      href={`/event/${event.slug}`}
                      key={event.id}
                      className="block group"
                    >
                      <div className="flex gap-3">
                        <div className="w-[80px] h-[60px] flex-shrink-0 overflow-hidden bg-[#090909] relative">
                          <Image
                            src={event.thumbnailUrl || `https://placehold.co/100x100/f3e8ff/c084fc?text=Event`}
                            alt={event.title}
                            fill
                            unoptimized
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-[#090909] text-xs leading-tight mb-1 group-hover:text-primary transition-colors line-clamp-2">
                            {event.title}
                          </h4>
                          <div className="flex items-center gap-1 text-[#A6A6A6]">
                            <img src="/icon/location-icon.svg" alt="location" width={12} height={12} />
                            <span className="text-[10px] font-medium truncate">{event.location}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>

      {/* Recommendation Section — Full Width */}
      <RecommendationGrid articles={recommendationArticles} />
    </main>
  );
}