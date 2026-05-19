"use client";

import Link from "next/link";
import Image from "next/image";
import { Article } from "@/app/typing";
import { formatShortDate } from "@/app/utils/dateUtils";

interface RecommendationGridProps {
    articles: Article[];
}

export function RecommendationGrid({ articles }: RecommendationGridProps) {
    if (!articles || articles.length === 0) return null;

    return (
        <section className="bg-white py-8">
            <div className="container mx-auto px-4 lg:px-8 xl:px-[150px]">
                {/* Section Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <img src="/icon/recomendation-icon.svg" alt="" width={22} height={22} />
                        <h2 className="text-lg font-black uppercase text-primary tracking-wide font-adlam">
                            Rekomendasi
                        </h2>
                    </div>
                    <Link
                        href="/"
                        className="text-sm font-bold text-[#090909] hover:text-primary transition-colors"
                    >
                        Selengkapnya →
                    </Link>
                </div>

                {/* Grid: 3 columns × 2 rows = 6 articles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-8">
                    {articles.slice(0, 6).map((article) => {
                        const displayImg =
                            article.thumbnailUrl || article.imageUrl || "https://placehold.co/400x300?text=No+Image";
                        return (
                            <Link
                                key={article.id}
                                href={`/article/${article.slug}`}
                                className="block group"
                            >
                                {/* Image */}
                                <div className="relative w-full aspect-[16/10] overflow-hidden bg-[#090909] mb-3">
                                    <Image
                                        src={displayImg}
                                        alt={article.title}
                                        fill
                                        unoptimized
                                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                                    />
                                </div>

                                {/* Meta: Date + Category */}
                                <div className="flex items-center justify-between gap-2 mb-2">
                                    <span className="text-[10px] text-[#A6A6A6] font-medium">
                                        {formatShortDate(article.publishedAt)}
                                    </span>
                                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-primary text-white tracking-wider">
                                        {article.category}
                                    </span>
                                </div>

                                {/* Title */}
                                <h3 className="text-sm font-bold text-[#090909] leading-tight line-clamp-2 group-hover:text-primary transition-colors font-adlam mb-1.5">
                                    {article.title}
                                </h3>

                                {/* Excerpt */}
                                <p className="text-xs text-[#A6A6A6] leading-relaxed line-clamp-2">
                                    {article.excerpt}
                                </p>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
