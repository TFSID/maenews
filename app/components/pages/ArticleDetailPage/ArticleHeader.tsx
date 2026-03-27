import Image from "next/image";
import { Article } from "@/app/typing";
import { formatShortDate } from "@/app/utils/dateUtils";

export function ArticleHeader({ article }: { article: Article }) {
  return (
    <header className="mb-6">
      {/* Title */}
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#090909] leading-tight mb-3">
        {article.title}
      </h1>

      {/* Date line */}
      <p className="text-sm text-[#A6A6A6] font-medium mb-5">
        {article.author} - {new Date(article.publishedAt).toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })}
      </p>

      {/* Article Image — Full width, no border radius */}
      <div className="relative w-full aspect-[16/10] overflow-hidden bg-[#090909]">
        <Image
          src={article.thumbnailUrl || article.imageUrl || ""}
          alt={article.title}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 1280px) 100vw, 900px"
        />
      </div>
    </header>
  );
}