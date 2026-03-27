"use client";

import { useSearch } from "@/app/hooks/useSearch";
import { SearchBar } from "./SearchPage/SearchBar";
import { SearchFilters } from "./SearchPage/SearchFilters";
import { SearchResults } from "./SearchPage/SearchResults";
import { EmptyState } from "../ui/EmptyState";
import { Spinner } from "../ui/Spinner";

export function SearchPage() {
  const { query, setQuery, filters, setFilters, results, isLoading } = useSearch("");

  const hasResults = results.articles.length > 0 || results.events.length > 0;

  return (
    <main className="container mx-auto px-4 lg:px-8 xl:px-[150px] py-12 min-h-screen">
      <SearchBar count={results.articles.length + results.events.length} onSearch={setQuery} />
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <div className="lg:col-span-1">
          <SearchFilters 
            type={filters.type} 
            category={filters.category} 
            onTypeChange={(v) => setFilters({...filters, type: v})}
            onCategoryChange={(v) => setFilters({...filters, category: v})}
          />
        </div>
        <div className="lg:col-span-3">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Spinner className="mb-4" />
              <p className="text-xs font-black uppercase tracking-[0.3em] text-gray-400">Mencari Data...</p>
            </div>
          ) : hasResults ? (
            <SearchResults 
              articles={filters.type === "Event" ? [] : results.articles} 
              events={filters.type === "Artikel" ? [] : results.events} 
            />
          ) : (
            <EmptyState 
              title="Pencarian Nihil" 
              message={`Kami tidak menemukan apapun untuk "${query}". Coba gunakan kata kunci anime atau event lain.`} 
            />
          )}
        </div>
      </div>
    </main>
  );
}