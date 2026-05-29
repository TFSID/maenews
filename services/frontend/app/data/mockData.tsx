// app/data/mockData.ts
// ===================================================================
// Backward-compatibility barrel — re-exports from per-entity mocks.
// New code should import directly from "@/app/data/mocks".
// ===================================================================

export {
  featuredArticle,
  mockArticles,
} from "./mocks-data/mockArticles";

export { trendingItems } from "./mocks-data/mockTrending";

export { upcomingEvents } from "./mocks-data/mockEvents";
