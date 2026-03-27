import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../lib/apiClient";
import { Article } from "../typing";

// Untuk mengambil banyak artikel (bisa filter kategori)
export function useArticles(categorySlug?: string) {
  return useQuery({
    queryKey: ["articles", categorySlug],
    queryFn: async () => {
      const { data } = await apiClient.get<Article[]>("/articles", {
        params: { category: categorySlug },
      });
      return data;
    },
  });
}

// Untuk mengambil detail satu artikel berdasarkan slug
export function useArticle(slug: string) {
  return useQuery({
    queryKey: ["article", slug],
    queryFn: async () => {
      const { data } = await apiClient.get<Article>(`/articles/${slug}`);
      return data;
    },
    enabled: !!slug, // Hanya jalan kalau slug ada isinya
  });
}