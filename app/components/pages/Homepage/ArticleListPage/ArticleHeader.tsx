import { Article } from "@/app/typing";
import { Breadcrumb } from "@/app/components/ui/Breadcrumb";
import { Badge } from "@/app/components/ui/badge";
import { Clock, User } from "lucide-react";
import Image from "next/image";

export function ArticleHeader({ article }: { article: Article }) {
    const breadcrumb = [
        { label: article.category, href: `/category/${article.category.toLowerCase()}` },
        { label: "Berita", href: "#" }
    ];

    return (
        <header className="mb-10">
            <Breadcrumb items={breadcrumb} />
            <div className="mt-6 mb-8">
                <Badge className="mb-4 bg-secondary text-white font-bold">{article.category}</Badge>
                <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-[1.1] italic uppercase tracking-tighter">
                    {article.title}
                </h1>
            </div>
            <div className="flex items-center gap-6 mb-10 text-sm font-bold text-gray-400 uppercase tracking-widest">
                <div className="flex items-center gap-2"><User size={16} className="text-primary" /> {article.author}</div>
                <span>•</span>
                <div className="flex items-center gap-2"><Clock size={16} /> {new Date(article.publishedAt).toLocaleDateString()}</div>
            </div>
            <div className="relative aspect-video overflow-hidden shadow-2xl">
                <Image src={article.thumbnailUrl || article.imageUrl || ""} alt={article.title} fill className="object-cover" priority />
            </div>
        </header>
    );
}