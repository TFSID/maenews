"use client";

import { useState, useRef, useCallback } from "react";
import { Article } from "@/app/typing";
import { LatestNewsArticle } from "./article/LatestNewsArticle";
import { Loader2 } from "lucide-react";

export function InfiniteScrollArticles({ articlesToLoad }: { articlesToLoad: Article[] }) {
  const [page, setPage] = useState(0);
  const [loadedArticles, setLoadedArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(articlesToLoad.length > 0);
  const observer = useRef<IntersectionObserver | null>(null);

  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    setTimeout(() => {
      const start = page * 5;
      const end = start + 5;
      const newBatch = articlesToLoad.slice(start, end);
      if (newBatch.length > 0) {
        setLoadedArticles((prev) => [...prev, ...newBatch]);
        setPage((p) => p + 1);
      } else {
        setHasMore(false);
      }
      setIsLoading(false);
    }, 1000);
  }, [page, isLoading, hasMore, articlesToLoad]);

  const lastRef = useCallback((node: HTMLElement | null) => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) loadMore();
    });
    if (node) observer.current.observe(node);
  }, [isLoading, hasMore, loadMore]);

  return (
    <div className="flex flex-col gap-6">
      {loadedArticles.map((article, index) => (
        <div
          key={`infinite-${article.id}-${index}`}
          ref={loadedArticles.length === index + 1 ? lastRef : null}
        >
          <LatestNewsArticle article={article} />
        </div>
      ))}
      {isLoading && (
        <div className="flex justify-center py-6">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      )}
    </div>
  );
}