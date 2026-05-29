import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../lib/apiClient";
import { Article } from "../typing";

export const useApiArticles = (params?: any) => {
  return useQuery({
    queryKey: ["articles", params],
    queryFn: async () => {
      const { data } = await apiClient.get<Article[]>("/articles", { params });
      return data;
    },
  });
};

export const useApiArticleDetail = (slug: string) => {
  return useQuery({
    queryKey: ["article", slug],
    queryFn: async () => {
      const { data } = await apiClient.get<Article>(`/articles/${slug}`);
      return data;
    },
    enabled: !!slug,
  });
};