"use client";

import { Article } from "@/app/typing";
import { LatestNewsArticle } from "./LatestNewsArticle";

interface LatestNewsSectionProps {
  articles: Article[];
  title?: string;
}

export function LatestNewsSection({ title, articles }: LatestNewsSectionProps) {
  return (
    <section>
      {title && (
        <div className="flex items-center gap-2 mb-5">
          <img src="/icon/fire.svg" alt="" width={22} height={22} />
          <h2 className="text-lg font-black uppercase text-primary font-adlam">{title}</h2>
        </div>
      )}
      <div className="flex flex-col gap-6">
        {articles.map((article, idx) => (
          <LatestNewsArticle key={article.id} article={article} priority={idx === 0} />
        ))}
      </div>
    </section>
  );
}
