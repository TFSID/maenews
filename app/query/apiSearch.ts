import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../lib/apiClient";
import { Article, Event } from "../typing";

interface SearchResponse {
  articles: Article[];
  events: Event[];
}

export const useApiSearch = (query: string, filters?: { type: string; category: string }) => {
  return useQuery({
    queryKey: ["search", query, filters],
    queryFn: async () => {
      const { data } = await apiClient.get<SearchResponse>("/search", {
        params: {
          q: query,
          type: filters?.type !== "Semua" ? filters?.type : undefined,
          category: filters?.category || undefined
        }
      });
      return data;
    },
    enabled: query.length > 0, 
    staleTime: 1000 * 60 * 5, 
  });
};