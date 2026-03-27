"use client";

import { useState } from "react";
import { Article, TrendingItem, Event } from "@/app/typing";
import { HeroSection } from "./Homepage/HeroSection";
import { FeaturedRow } from "./Homepage/FeaturedRow";
import { EventPreviewSection } from "./Homepage/EventPreviewSection";
import { CategoryFilter } from "./Homepage/CategoryFilter";
import { ArticleFeed } from "./Homepage/ArticleFeed";
import { TrendingList } from "./Homepage/TrendingList";

interface HomePageProps {
    featuredArticle: Article;
    articles: Article[];
    trending: TrendingItem[];
    events: Event[];
}

export function HomePageComponent({ featuredArticle, articles, trending, events }: HomePageProps) {
    const [category, setCategory] = useState("");

    return (
        <div className="container mx-auto px-4 space-y-12 pb-20">
            <HeroSection article={featuredArticle} />
            <FeaturedRow articles={articles} />
            <EventPreviewSection events={events} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-8">
                <div className="lg:col-span-2">
                    <CategoryFilter onCategoryChange={setCategory} />
                    {/* Note: In mock phase, we just show all or filter locally */}
                    <ArticleFeed articles={category ? articles.filter(a => a.category === category) : articles} />
                </div>
                <aside className="space-y-8">
                    <TrendingList items={trending} />
                </aside>
            </div>
        </div>
    );
}