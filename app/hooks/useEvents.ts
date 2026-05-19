import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../lib/apiClient";
import { Event } from "../typing";

// Mengambil daftar semua event
export function useEvents(params?: any) {
  return useQuery({
    queryKey: ["events", params],
    queryFn: async () => {
      const { data } = await apiClient.get<Event[]>("/events", { params });
      return data;
    },
  });
}

// Mengambil detail satu event berdasarkan slug
export function useEvent(slug: string) {
  return useQuery({
    queryKey: ["event", slug],
    queryFn: async () => {
      const { data } = await apiClient.get<Event>(`/events/${slug}`);
      return data;
    },
    enabled: !!slug,
  });
}