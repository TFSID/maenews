"use client";

import Link from "next/link";
import Image from "next/image";
import { Article } from "@/app/typing";
import { formatShortDate } from "@/app/utils/dateUtils";
import { motion } from "framer-motion";

export function LatestNewsArticle({ article, priority = false }: { article: Article; priority?: boolean }) {
  const displayImg = article.thumbnailUrl || article.imageUrl || "https://placehold.co/400x300?text=No+Image";

  return (
    <Link href={`/article/${article.slug}`} className="block group">
      <motion.article
        className="flex gap-4 sm:gap-5 py-4 border-b border-gray-100 last:border-b-0"
        whileHover={{ x: 4 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        {/* Article Image */}
        <div className="relative w-[120px] h-[90px] sm:w-[180px] sm:h-[120px] md:w-[240px] md:h-[160px] shrink-0 overflow-hidden bg-[#090909]">
          <Image
            src={displayImg}
            alt={article.title}
            fill
            sizes="(max-width: 768px) 160px, 240px"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            unoptimized
            priority={priority}
          />
        </div>

        {/* Article Info */}
        <div className="flex-1 flex flex-col justify-between min-w-0 py-0.5">
          {/* Top: Category Tag + shares/views */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-primary text-white tracking-wider">
              {article.category}
            </span>
            <div className="hidden sm:flex items-center gap-3 ml-auto">
              <div className="flex items-center gap-1">
                <img src="/icon/shares-icon.svg" alt="shares" width={14} height={14} />
                <span className="text-[10px] text-[#A6A6A6] font-medium">{article.shares || 173} shares</span>
              </div>
              <div className="flex items-center gap-1">
                <img src="/icon/views-icon.svg" alt="views" width={14} height={14} />
                <span className="text-[10px] text-[#A6A6A6] font-medium">{article.views || 981} views</span>
              </div>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-sm sm:text-base font-bold leading-tight text-[#090909] line-clamp-2 mt-1.5 transition-colors duration-200 group-hover:text-primary font-adlam">
            {article.title}
          </h3>

          {/* Author + Date */}
          <div className="flex items-center gap-2 text-[10px] sm:text-[11px] text-[#A6A6A6] font-medium mt-1">
            <span>{article.author}</span>
            <span>•</span>
            <span>{formatShortDate(article.publishedAt)}</span>
          </div>

          {/* Excerpt */}
          <p className="hidden sm:line-clamp-2 text-xs text-[#A6A6A6] leading-relaxed mt-1.5">
            {article.excerpt}
          </p>
        </div>
      </motion.article>
    </Link>
  );
}