import { Article } from "@/app/typing";
import { NewsCard } from "../../NewsCard";

export function FeaturedRow({ articles }: { articles: Article[] }) {
  // Mengambil artikel ke-2, 3, dan 4 (indeks 1, 2, 3)
  const featuredSet = articles.slice(1, 4);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
      {featuredSet.map((article, i) => (
        <NewsCard key={article.id} article={article} index={i} />
      ))}
    </div>
  );
}