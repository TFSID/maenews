"use client";

import Link from "next/link";
import { Article, TrendingItem, Event } from "@/app/typing";
import { HeroCard } from "@/app/components/HeroCard";
import { Sidebar } from "@/app/components/layout/Sidebar";
import { LatestNewsArticle } from "@/app/components/article/LatestNewsArticle";
import { Breadcrumb } from "@/app/components/ui/Breadcrumb";

interface CategoryPageLayoutProps {
    categoryName: string;
    articles: Article[];
    trendingItems: TrendingItem[];
    upcomingEvents: Event[];
    currentPage: number;
    totalPages: number;
    basePath: string;
}

export function CategoryPageLayout({
    categoryName,
    articles,
    trendingItems,
    upcomingEvents,
    currentPage,
    totalPages,
    basePath,
}: CategoryPageLayoutProps) {
    // Split 9 articles per page: top 3 for carousel, rest for article list.
    const carouselArticles = articles.slice(0, 3);
    const listArticles = articles.slice(3, 9);

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
                        {listArticles.length > 0 && (
                            <div className="flex flex-col gap-6 mt-6">
                                {listArticles.map((article) => (
                                    <LatestNewsArticle key={article.id} article={article} />
                                ))}
                            </div>
                        )}

                        <CategoryPagination
                            basePath={basePath}
                            currentPage={currentPage}
                            totalPages={totalPages}
                        />
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

function CategoryPagination({
    basePath,
    currentPage,
    totalPages,
}: {
    basePath: string;
    currentPage: number;
    totalPages: number;
}) {
    if (totalPages <= 1) return null;

    const pageHref = (page: number) => (page === 1 ? basePath : `${basePath}?page=${page}`);

    return (
        <div className="mt-8 flex items-center justify-center gap-4">
            <Link
                href={pageHref(Math.max(1, currentPage - 1))}
                aria-disabled={currentPage === 1}
                className={`border px-4 py-2 text-sm font-black uppercase tracking-wide transition ${currentPage === 1
                    ? "pointer-events-none border-gray-100 text-gray-300"
                    : "border-gray-200 text-[#090909] hover:border-primary hover:text-primary"
                    }`}
            >
                Prev
            </Link>
            <span className="text-sm font-bold text-[#090909]">
                Halaman {currentPage} dari {totalPages}
            </span>
            <Link
                href={pageHref(Math.min(totalPages, currentPage + 1))}
                aria-disabled={currentPage === totalPages}
                className={`border px-4 py-2 text-sm font-black uppercase tracking-wide transition ${currentPage === totalPages
                    ? "pointer-events-none border-gray-100 text-gray-300"
                    : "border-gray-200 text-[#090909] hover:border-primary hover:text-primary"
                    }`}
            >
                Next
            </Link>
        </div>
    );
}
