"use client";

import { useState } from "react";
import { TagCategoryFilter } from "./TagPage/TagCategoryFilter"; // Task #80
import { TagCard } from "./TagPage/TagCard";
import { useTags } from "@/app/hooks/useTags";

export function TagPage() {
    const [activeCategory, setActiveCategory] = useState("All");
    const { data: tags = [], isLoading } = useTags(activeCategory === "All" ? "" : activeCategory);

    return (
        <main className="container mx-auto px-4 py-12">
            <header className="mb-12">
                <h1 className="text-5xl font-black italic uppercase tracking-tighter text-gray-900">
                    Eksplorasi <span className="text-primary">Topik</span>
                </h1>
            </header>

            <TagCategoryFilter active={activeCategory} onSelect={setActiveCategory} />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
                {tags.map((tag: any) => <TagCard key={tag.id} tag={tag} />)}
            </div>
        </main>
    );
}