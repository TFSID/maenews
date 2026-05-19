"use client";
import Image from "next/image";
import Link from "next/link";
import { Clock, BookOpen } from "lucide-react";
import { Badge } from "@/app/components/ui/badge";
import { Article } from "@/app/typing";
import { formatRelativeTime } from "@/app/utils/dateUtils";

export function ArticleCard({ article }: { article: Article }) {
  const displayImage = article.thumbnailUrl || article.imageUrl || "https://placehold.co/600/400?text=Maenews";
  
  return (
    <div className="group bg-white border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col h-full">
      <Link href={`/article/${article.slug}`} className="flex-1 flex flex-col">
        <div className="relative aspect-video overflow-hidden">
          <Image 
            src={displayImage} 
            alt={article.title} 
            fill 
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            unoptimized
          />
          <Badge className="absolute top-5 left-5 font-black italic shadow-lg">{article.category}</Badge>
        </div>
        <div className="p-7 flex-1 flex flex-col">
          <h2 className="text-xl font-black text-gray-900 leading-tight mb-3 italic uppercase tracking-tight group-hover:text-primary transition-colors">
            {article.title}
          </h2>
          <p className="text-sm text-gray-500 line-clamp-2 mb-6 font-medium leading-relaxed">
            {article.excerpt}
          </p>
          
          <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest">
            <div className="flex items-center gap-2 text-gray-700">
               <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-[8px] font-bold">
                 {article.author?.charAt(0) || 'A'}
               </div>
               <span>{article.author}</span>
            </div>
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-1"><Clock size={12} /> {formatRelativeTime(article.publishedAt)}</div>
               <div className="flex items-center gap-1"><BookOpen size={12} /> {article.readTimeMinutes || 5} Min</div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}