import Link from "next/link";
import { TagCategoryBadge } from "../TagDetailPage/TagCategoryBadge";
import { Tag } from "@/app/typing";

export function TagCard({ tag }: { tag: Tag }) {
  return (
    <Link href={`/tag/${tag.slug}`}>
      <div className="bg-white border border-gray-100 p-6 hover:shadow-xl transition-all group">
        <div className="flex justify-between items-start mb-4">
          <TagCategoryBadge category={tag.category} />
          <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{tag.articleCount} Artikel</span>
        </div>
        <h3 className="text-2xl font-black italic uppercase tracking-tighter text-gray-900 group-hover:text-primary transition-colors">
          #{tag.name}
        </h3>
        <p className="mt-2 text-xs text-gray-500 line-clamp-2 leading-relaxed">
          {tag.description}
        </p>
      </div>
    </Link>
  );
}