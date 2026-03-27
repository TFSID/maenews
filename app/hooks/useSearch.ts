import { useState } from "react";
import { useApiSearch } from "../query/apiSearch";

export function useSearch(initialQuery: string = "") {
  const [query, setQuery] = useState(initialQuery);
  const [filters, setFilters] = useState({ type: "Semua", category: "" });

  const { data: results, isLoading } = useApiSearch(query, filters);

  return {
    query,
    setQuery,
    filters,
    setFilters,
    results: results || { articles: [], events: [] },
    isLoading
  };
}