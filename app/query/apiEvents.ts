import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../lib/apiClient";

export const useApiEvents = (params?: any) => {
  return useQuery({
    queryKey: ["events", params],
    queryFn: async () => {
      const { data } = await apiClient.get("/events", { params });
      return data;
    }
  });
};

export const useApiEventDetail = (id: string) => {
  return useQuery({
    queryKey: ["event", id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/events/${id}`);
      return data;
    },
    enabled: !!id
  });
};