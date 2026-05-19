import { Article } from "@/app/typing";
import { LatestNewsArticle } from "../../article/LatestNewsArticle";

export function ArticleFeed({ articles }: { articles: Article[] }) {
  return (
    <div className="flex flex-col gap-8 py-6">
      {articles.slice(0, 8).map((article) => (
        <LatestNewsArticle key={article.id} article={article} />
      ))}
    </div>
  );
}