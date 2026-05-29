export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  description?: string;
  content?: string;
  imageUrl?: string;
  thumbnailUrl?: string;
  author: string;
  tags: string[];
  category: string;
  publishedAt: string;
  readTimeMinutes?: number;
  featured?: boolean;
  views?: number;
  shares?: number;
}