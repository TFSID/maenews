import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../lib/apiClient";
import { Tag } from "../typing";

export function useTags(categorySlug?: string) {
  return useQuery({
    queryKey: ["tags", categorySlug],
    queryFn: async () => {
      const { data } = await apiClient.get<Tag[]>("/tags", {
        params: { category: categorySlug },
      });
      return data;
    },
  });
} 