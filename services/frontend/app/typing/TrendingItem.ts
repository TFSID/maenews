// app/typing/TrendingItem.ts
export interface TrendingItem {
    id: string;
    title: string;
    description: string;
    slug: string;
    category: string;
    publishedAt: string;
    imageUrl?: string;
}
