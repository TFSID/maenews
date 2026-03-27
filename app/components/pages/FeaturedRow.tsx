"use client";

import Link from "next/link";
import Image from "next/image";
import { Article } from "@/app/typing";

// Sub-komponen untuk kartu individual di dalam baris
function FeaturedRowCard({ article }: { article: Article }) {
  return (
    <Link
      href={`/article/${article.slug}`}
      className="block group relative overflow-hidden"
    >
      <div className="relative aspect-video">
        <Image
          src={article.thumbnailUrl || article.imageUrl || ""}
          alt={article.title}
          fill
          unoptimized
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 p-4">
        <h3 className="text-white font-bold text-base leading-tight line-clamp-3">
          {article.title}
        </h3>
      </div>
    </Link>
  );
}

interface FeaturedRowProps {
  articles: Article[];
}

export function FeaturedRow({ articles }: FeaturedRowProps) {
  const displayArticles = articles.slice(0, 4);

  return (
    <section className="py-6">
      <div className="container mx-auto px-2 md:px-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {displayArticles.map((article) => (
            <FeaturedRowCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
}
