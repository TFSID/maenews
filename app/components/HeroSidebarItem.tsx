import Link from "next/link";
import Image from "next/image";
import { Article } from "@/app/typing";

interface HeroSidebarItemProps {
  article: Article;
}

export function HeroSidebarItem({ article }: HeroSidebarItemProps) {
  return (
    <Link href={`/article/${article.slug}`} className="block group">
      <div className="flex items-center gap-3 p-2 hover:bg-gray-700/50 transition-colors duration-200">
        <div className="relative w-20 h-14 flex-shrink-0 overflow-hidden">
          <Image
            src={article.thumbnailUrl || article.imageUrl || ""}
            alt={article.title}
            fill
            sizes="80px"
            unoptimized
            className="object-cover"
          />
        </div>
        <h3 className="text-sm font-semibold text-gray-300 group-hover:text-white transition-colors line-clamp-3">
          {article.title}
        </h3>
      </div>
    </Link>
  );
}
