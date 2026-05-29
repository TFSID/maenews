import { ArticleViewTracker } from "@/app/components/ArticleViewTracker";
import { ArticleDetailPage } from "@/app/components/pages/ArticleDetailPage";
import {
  getAllArticles,
  getArticleBySlug,
  getTrendingItems,
  getUpcomingEvents,
} from "@/app/lib/api";
import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

type Props = {
  params: Promise<{ slug: string; title: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) {
    return { title: "Artikel Tidak Ditemukan - Maenews" };
  }
  return {
    title: `${article.title} - Maenews`,
    description: article.excerpt,
  };
}

export default async function ArticleSlugPage({ params }: Props) {
  const { slug, title } = await params;
  const [article, allArticles, trendingItems, upcomingEvents] = await Promise.all([
    getArticleBySlug(slug),
    getAllArticles(),
    getTrendingItems(),
    getUpcomingEvents(),
  ]);

  if (!article) {
    notFound();
  }

  const canonicalTitle = article.slug.split("/").slice(1).join("/");
  if (canonicalTitle && title !== canonicalTitle) {
    redirect(`/article/${article.slug}`);
  }

  const relatedArticles = (allArticles ?? [])
    .filter((item) => item.category === article.category && item.slug !== article.slug)
    .slice(0, 4);

  const recommendationArticles = (allArticles ?? [])
    .filter((item) => item.slug !== article.slug)
    .slice(0, 6);

  return (
    <>
      <ArticleViewTracker slug={article.slug} />
      <ArticleDetailPage
        article={article}
        relatedArticles={relatedArticles}
        recommendationArticles={recommendationArticles}
        trendingItems={trendingItems ?? []}
        upcomingEvents={upcomingEvents ?? []}
      />
    </>
  );
}
