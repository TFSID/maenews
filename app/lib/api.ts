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
    process.env.NEXT_PUBLIC_USER_API_BASE_URL ||
    "http://localhost:8080/api/v1",
  mode: (process.env.NEXT_PUBLIC_API_MODE as ApiMode) || "live",
}

interface BackendArticle {
  id: number;
  judul: string;
  kategori: string;
  konten: string;
  cuplikan: string;
  thumbnail_url: string;
  author_id: number;
  author_name?: string;
  author_nickname?: string;
  status: string;
  is_pinned: boolean;
  view_events?: string[] | null;
  published_at: string | null;
  created_at: string;
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
  getAllArticles: async () => {
    const articles = await fetchAPI<BackendArticle[]>("/articles?homepage=true");
    return articles?.map(mapBackendArticle) ?? null;
  },
  getArticleBySlug: async (slug) => {
    const articleID = extractArticleID(slug);
    if (!articleID) return null;

    const article = await fetchAPI<BackendArticle>(`/articles/${articleID}`);
    return article ? mapBackendArticle(article) : null;
  },
  getArticlesByCategory: async (categoryName) => {
    const category = normalizeArticleCategory(categoryName);
    const articles = await fetchAPI<BackendArticle[]>(
      `/articles?status=published&kategori=${encodeURIComponent(category)}`
    );
    return articles?.map(mapBackendArticle) ?? null;
  },
  getArticlesByTag: (tagName) => fetchAPI<Article[]>(`/tag/${tagName}`),
  searchArticles: (query) => fetchAPI<Article[]>(`/search/${query}`),
  incrementArticleView: (slug) => {
    const articleID = extractArticleID(slug);
    if (!articleID) return;

    fetch(`${API_CONFIG.baseUrl}/articles/${articleID}/view`, { method: "POST" });
  },
  getTrendingItems: async () => trendingItems,
  getUpcomingEvents: async () => upcomingEvents,
  getEventBySlug: (slug) => fetchAPI<Event>(`/events/${slug}`),
};

function mapBackendArticle(article: BackendArticle): Article {
  return {
    id: String(article.id),
    title: article.judul,
    slug: `${article.id}/${slugifyArticleTitle(article.judul)}`,
    excerpt: article.cuplikan,
    description: article.cuplikan,
    content: article.konten,
    imageUrl: article.thumbnail_url || "/images/banner-animae.png",
    thumbnailUrl: article.thumbnail_url || "/images/banner-animae.png",
    author: article.author_nickname || article.author_name || `User ${article.author_id}`,
    tags: [],
    category: article.kategori,
    publishedAt: article.published_at || article.created_at,
    featured: article.is_pinned,
    views: article.view_events?.length ?? 0,
  };
}

function normalizeArticleCategory(categoryName: string): string {
  return categoryName.trim().toLowerCase().replace(/\s+/g, "-");
}

function extractArticleID(slug: string): string | null {
  const [id] = slug.split("/");
  return /^\d+$/.test(id) ? id : null;
}

function slugifyArticleTitle(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

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

export const getAllArticles = liveService.getAllArticles;
export const getArticleBySlug = liveService.getArticleBySlug;
export const getArticlesByCategory = liveService.getArticlesByCategory;
export const getArticlesByTag = activeService.getArticlesByTag;
export const searchArticles = activeService.searchArticles;
export const incrementArticleView = activeService.incrementArticleView;
export const getTrendingItems = activeService.getTrendingItems;
export const getUpcomingEvents = activeService.getUpcomingEvents;
export const getEventBySlug = activeService.getEventBySlug;
