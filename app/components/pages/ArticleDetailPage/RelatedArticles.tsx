import Link from "next/link";
import Image from "next/image";
import { Article } from "@/app/typing";
import { formatShortDate } from "@/app/utils/dateUtils";

export function RelatedArticles({ articles }: { articles: Article[] }) {
    if (!articles || articles.length === 0) return null;

    return (
        <div>
            <div className="flex items-center gap-2 mb-4">
                <h3 className="text-lg font-black uppercase text-primary font-adlam tracking-wide">
                    Artikel Terkait
                </h3>
            </div>
            <div className="space-y-4">
                {articles.slice(0, 4).map((article) => {
                    const displayImg =
                        article.thumbnailUrl || article.imageUrl || `https://placehold.co/100x100/ffedd5/fb923c?text=${article.category.charAt(0)}`;
                    return (
                        <Link
                            href={`/article/${article.slug}`}
                            key={article.id}
                            className="block group"
                        >
                            <div className="flex gap-3">
                                {/* Thumbnail */}
                                <div className="w-[80px] h-[60px] flex-shrink-0 overflow-hidden bg-[#090909] relative">
                                    <Image
                                        src={displayImg}
                                        alt={article.title}
                                        fill
                                        unoptimized
                                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                </div>
                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-[#090909] text-xs leading-tight mb-1 group-hover:text-primary transition-colors line-clamp-2">
                                        {article.title}
                                    </h4>
                                    <p className="text-[10px] text-[#A6A6A6] font-medium">
                                        {formatShortDate(article.publishedAt)}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
