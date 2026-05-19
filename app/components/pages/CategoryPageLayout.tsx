"use client";

import Link from "next/link";
import { Article, TrendingItem, Event } from "@/app/typing";
import { HeroCard } from "@/app/components/HeroCard";
import { LatestNewsSection } from "@/app/components/article/LatestNewsSection";
import { Sidebar } from "@/app/components/layout/Sidebar";
import { LatestNewsArticle } from "@/app/components/article/LatestNewsArticle";
import { Breadcrumb } from "@/app/components/ui/Breadcrumb";

interface CategoryPageLayoutProps {
    categoryName: string;
    articles: Article[];
    trendingItems: TrendingItem[];
    upcomingEvents: Event[];
}

export function CategoryPageLayout({
    categoryName,
    articles,
    trendingItems,
    upcomingEvents,
}: CategoryPageLayoutProps) {
    // Split articles: top 3 for carousel, rest for Terbaru + feed
    const carouselArticles = articles.slice(0, 3);
    const terbaruArticles = articles.slice(3, 8);
    const remainingArticles = articles.slice(8);

    return (
        <>
            {/* Breadcrumb */}
            <div className="container mx-auto px-4 lg:px-8 xl:px-[150px] pt-4 pb-2">
                <Breadcrumb items={[{ label: categoryName, href: "#" }]} />
            </div>

            {/* Headline — centered, orange, uppercase, with underline */}
            <div className="container mx-auto px-4 lg:px-8 xl:px-[150px] pt-2 pb-4">
                <div className="flex flex-col items-center">
                    <h1 className="text-2xl sm:text-3xl font-black uppercase text-primary tracking-wider font-adlam">
                        {categoryName}
                    </h1>
                    <div className="w-32 h-[3px] bg-primary mt-3" />
                </div>
            </div>

            {/* 3-Card Carousel */}
            {carouselArticles.length > 0 && (
                <div className="container mx-auto px-4 lg:px-8 xl:px-[150px] pb-4">
                    <div
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[3px] overflow-hidden"
                    >
                        {carouselArticles.map((article, idx) => (
                            <div key={article.id} className="overflow-hidden h-[200px] sm:h-[240px] lg:h-[280px]">
                                <HeroCard
                                    article={article}
                                    className="h-full w-full"
                                    isLarge={false}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Orange separator line */}
            <div className="container mx-auto px-4 lg:px-8 xl:px-[150px] pb-6">
                <div className="h-[3px] bg-primary w-full" />
            </div>

            {/* Terbaru + Sidebar */}
            <div className="container mx-auto px-4 lg:px-8 xl:px-[150px] pb-8">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] xl:grid-cols-[1fr_340px] gap-8 lg:gap-10">
                    {/* Left — Articles */}
                    <div>
                        {terbaruArticles.length > 0 && (
                            <LatestNewsSection title="Terbaru" articles={terbaruArticles} />
                        )}

                        {/* Remaining articles (continuation) */}
                        {remainingArticles.length > 0 && (
                            <div className="flex flex-col gap-6 mt-6">
                                {remainingArticles.map((article) => (
                                    <LatestNewsArticle key={article.id} article={article} />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right — Sidebar */}
                    <div>
                        <Sidebar
                            trendingItems={trendingItems}
                            upcomingEvents={upcomingEvents}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
