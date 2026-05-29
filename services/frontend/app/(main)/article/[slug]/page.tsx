import { getArticleBySlug, getAllArticles, getTrendingItems, getUpcomingEvents } from "@/app/lib/api";
import { ArticleDetailPage } from "@/app/components/pages/ArticleDetailPage";
import { notFound, redirect } from "next/navigation";
import { ArticleViewTracker } from "@/app/components/ArticleViewTracker";
import { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) {
    return { title: "Artikel Tidak Ditemukan — Maenews" };
  }
  return {
    title: `${article.title} — Maenews`,
    description: article.excerpt,
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const [article, allArticles, trendingItems, upcomingEvents] = await Promise.all([
    getArticleBySlug(slug),
    getAllArticles(),
    getTrendingItems(),
    getUpcomingEvents(),
  ]);

  if (!article) {
    notFound();
  }

  if (article.slug !== slug) {
    redirect(`/article/${article.slug}`);
  }

  // Artikel terkait: kategori sama, bukan artikel ini, max 4
  const relatedArticles = (allArticles ?? [])
    .filter((a) => a.category === article.category && a.slug !== article.slug)
    .slice(0, 4);

  // Artikel rekomendasi: semua artikel selain ini, max 6
  const recommendationArticles = (allArticles ?? [])
    .filter((a) => a.slug !== article.slug)
    .slice(0, 6);

  return (
    <>
      <ArticleViewTracker slug={slug} />
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
