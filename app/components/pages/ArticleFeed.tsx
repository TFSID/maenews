"use client";

import { useState, useRef, useCallback } from "react";
import { Article } from "@/app/typing";
import { LatestNewsArticle } from "@/app/components/article/LatestNewsArticle";
import { Loader2 } from "lucide-react";

export function ArticleFeed({ initialArticles, articlesToLoad }: { initialArticles: Article[], articlesToLoad: Article[] }) {
  const [page, setPage] = useState(0);
  const [loadedArticles, setLoadedArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(articlesToLoad.length > 0);
  const observer = useRef<IntersectionObserver | null>(null);

  const loadMoreArticles = useCallback(() => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);

    setTimeout(() => {
      const start = page * 5;
      const end = start + 5;
      const newBatch = articlesToLoad.slice(start, end);

      if (newBatch.length > 0) {
        setLoadedArticles((prev) => [...prev, ...newBatch]);
        setPage((prev) => prev + 1);
      } else {
        setHasMore(false);
      }
      setIsLoading(false);
    }, 800);
  }, [page, isLoading, hasMore, articlesToLoad]);

  const lastElementRef = useCallback((node: HTMLElement | null) => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) loadMoreArticles();
    });
    if (node) observer.current.observe(node);
  }, [isLoading, hasMore, loadMoreArticles]);

  return (
    <section className="space-y-6">
      {/* No title — this is a continuation of the TERBARU section above */}
      <div className="flex flex-col gap-6">
        {initialArticles.map((article, idx) => (
          <LatestNewsArticle key={`feed-init-${article.id}-${idx}`} article={article} />
        ))}

        {loadedArticles.map((article, index) => (
          <div
            key={`feed-load-${article.id}-${index}`}
            ref={loadedArticles.length === index + 1 ? lastElementRef : null}
          >
            <LatestNewsArticle article={article} />
          </div>
        ))}
      </div>

      {isLoading && (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      )}
    </section>
  );
}