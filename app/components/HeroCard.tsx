import Link from "next/link";
import { Article } from "@/app/typing";
import Image from "next/image";

interface HeroCardProps {
  article: Article;
  className?: string;
  isLarge?: boolean;
}

export function HeroCard({ article, className, isLarge = false }: HeroCardProps) {
  return (
    <Link
      href={`/article/${article.slug}`}
      className={`${className || ""} relative overflow-hidden cursor-pointer block bg-[#090909] rounded-none group`}
    >
      {/* Image — subtle hover zoom */}
      <Image
        src={article.thumbnailUrl || article.imageUrl || ""}
        alt={article.title}
        fill
        unoptimized
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="absolute inset-0 w-full h-full object-cover opacity-[0.85] transition-transform duration-500 ease-out group-hover:scale-105"
      />

      {/* Bottom gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 p-4 sm:p-5 text-white w-full flex flex-col items-start z-10">
        {/* Category Tag — larger text for readability */}
        <span className={`font-adlam font-black uppercase px-2 py-0.5 bg-primary rounded-none mb-2 tracking-wider ${isLarge ? "text-sm" : "text-xs"}`}>
          {article.category}
        </span>
        {/* Title — ADLaM display font */}
        <h3 className={`font-bold leading-tight drop-shadow-md font-adlam ${isLarge ? "text-xl sm:text-2xl md:text-3xl" : "text-sm sm:text-base"
          } line-clamp-3`}>
          {article.title}
        </h3>
      </div>
    </Link>
  );
}
