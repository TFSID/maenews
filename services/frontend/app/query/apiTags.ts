import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../lib/apiClient";
import { Tag, Category } from "../typing";

export const useApiTags = () => {
  return useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      const { data } = await apiClient.get<Tag[]>("/tags");
      return data;
    },
  });
};

export const useApiCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await apiClient.get<Category[]>("/categories");
      return data;
    },
  });
};