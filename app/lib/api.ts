// app/lib/api.ts
// ===================================================================
// API Service — Strategy Pattern (Mock / Live)
// Konfigurasi mode via environment variable NEXT_PUBLIC_API_MODE.
// Lihat .env.example untuk detail.
// ===================================================================

import { Article, TrendingItem, Event, ApiMode, ApiConfig } from "@/app/typing";
import {
  featuredArticle,
  mockArticles,
  trendingItems,
  upcomingEvents,
} from "@/app/data/mocks-data";

// --------------- Configuration ---------------

const API_CONFIG: ApiConfig = {
  baseUrl:
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://golang-maenews-animae-id2569-ksgm0g96.leapcell.dev/api/v1",
  mode: (process.env.NEXT_PUBLIC_API_MODE as ApiMode) || "mock",
}

// --------------- Service Interface ---------------

interface ArticleService {
  getAllArticles: () => Promise<Article[] | null>;
  getArticleBySlug: (slug: string) => Promise<Article | null>;
  getArticlesByCategory: (categoryName: string) => Promise<Article[] | null>;
  getArticlesByTag: (tagName: string) => Promise<Article[] | null>;
  searchArticles: (query: string) => Promise<Article[] | null>;
  incrementArticleView: (slug: string) => void;
  getTrendingItems: () => Promise<TrendingItem[] | null>;
  getUpcomingEvents: () => Promise<Event[] | null>;
  getEventBySlug: (slug: string) => Promise<Event | null>;
}

// --------------- Live API Service ---------------

async function fetchAPI<T>(endpoint: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_CONFIG.baseUrl}${endpoint}`, {
      cache: "no-cache",
    });

    if (!res.ok) {
      console.error(`API Error on ${endpoint}: ${res.statusText}`);
      return null;
    }
    return res.json() as Promise<T>;
  } catch (error) {
    console.error("API Fetch Error:", error);
    return null;
  }
}

const liveService: ArticleService = {
  getAllArticles: () => fetchAPI<Article[]>("/articles"),
  getArticleBySlug: (slug) => fetchAPI<Article>(`/articles/${slug}`),
  getArticlesByCategory: (categoryName) =>
    fetchAPI<Article[]>(`/category/${categoryName}`),
  getArticlesByTag: (tagName) => fetchAPI<Article[]>(`/tag/${tagName}`),
  searchArticles: (query) => fetchAPI<Article[]>(`/search/${query}`),
  incrementArticleView: (slug) => {
    fetch(`${API_CONFIG.baseUrl}/articles/${slug}/view`, { method: "POST" });
  },
  getTrendingItems: () => fetchAPI<TrendingItem[]>("/trending"),
  getUpcomingEvents: () => fetchAPI<Event[]>("/events/upcoming"),
  getEventBySlug: (slug) => fetchAPI<Event>(`/events/${slug}`),
};

// --------------- Mock Service ---------------

const allMockArticles: Article[] = [featuredArticle, ...mockArticles];

/** Normalizes a URL slug (e.g. "content-creator") to title case ("Content Creator"). */
function normalizeSlug(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

const mockService: ArticleService = {
  getAllArticles: async () => allMockArticles,

  getArticleBySlug: async (slug) =>
    allMockArticles.find((a) => a.slug === slug) ?? null,

  getArticlesByCategory: async (categoryName) => {
    const normalized = normalizeSlug(categoryName);
    return allMockArticles.filter(
      (a) => a.category.toLowerCase() === normalized.toLowerCase()
    );
  },

  getArticlesByTag: async (tagName) => {
    const normalized = normalizeSlug(tagName);
    return allMockArticles.filter((a) =>
      a.tags.some((t) => t.toLowerCase() === normalized.toLowerCase())
    );
  },

  searchArticles: async (query) => {
    const q = query.toLowerCase();
    return allMockArticles.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.tags.some((t) => t.toLowerCase().includes(q))
    );
  },

  incrementArticleView: (slug) => {
    console.log(`[MOCK] View tracked for: ${slug}`);
  },

  getTrendingItems: async () => trendingItems,

  getUpcomingEvents: async () => upcomingEvents,

  getEventBySlug: async (slug) =>
    upcomingEvents.find((e) => e.slug === slug) ?? null,
};

// --------------- Export Active Service ---------------

const activeService: ArticleService =
  API_CONFIG.mode === "live" ? liveService : mockService;

export const getAllArticles = activeService.getAllArticles;
export const getArticleBySlug = activeService.getArticleBySlug;
export const getArticlesByCategory = activeService.getArticlesByCategory;
export const getArticlesByTag = activeService.getArticlesByTag;
export const searchArticles = activeService.searchArticles;
export const incrementArticleView = activeService.incrementArticleView;
export const getTrendingItems = activeService.getTrendingItems;
export const getUpcomingEvents = activeService.getUpcomingEvents;
export const getEventBySlug = activeService.getEventBySlug;