"use client";

import { useState } from "react";
import { Article } from "@/app/typing";
import { FilterSidebar } from "./Homepage/ArticleListPage/FilterSidebar";
import { ArticleCard } from "./Homepage/ArticleListPage/ArticleCard";
import { SortDropdown } from "./Homepage/ArticleListPage/SortDropDown";
import { ArticleGrid } from "../layout/ArticleGrid";
import { PaginationControls } from "../ui/PaginationControls";

export function ArticleListPage({ articles }: { articles: Article[] }) {
  const [sort, setSort] = useState("newest");

  return (
    <div className="container mx-auto px-4 py-10">
      <header className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
        <h1 className="text-5xl font-black italic uppercase tracking-tighter text-gray-900">
          Daftar <span className="text-primary">Artikel</span>
        </h1>
        <SortDropdown onSortChange={setSort} />
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <div className="lg:col-span-1">
          <FilterSidebar
            categories={["Anime", "Gaming", "Cosplay", "Culture"]}
            tags={["Rumor", "Release", "Review", "Event"]}
            onFilterChange={(type: string, val: string, check: boolean) => console.log(type, val, check)}
          />
        </div>
        <div className="lg:col-span-3">
          <ArticleGrid>
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </ArticleGrid>
          <PaginationControls currentPage={1} totalPages={5} onPageChange={() => { }} />
        </div>
      </div>
    </div>
  );
}   