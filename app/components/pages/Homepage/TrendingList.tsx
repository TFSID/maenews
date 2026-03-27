import { TrendingItem } from "@/app/typing";
import Link from "next/link";

export function TrendingList({ items }: { items: TrendingItem[] }) {
  return (
    <div className="bg-white p-6 border shadow-sm">
      <h3 className="text-xl font-black mb-6 italic uppercase border-b-4 border-primary inline-block tracking-tight text-gray-900">Trending Sekarang</h3>
      <div className="flex flex-col gap-6">
        {items.slice(0, 5).map((item, i) => (
          <Link key={item.id} href={`/article/${item.slug}`} className="flex gap-4 group items-start">
            <span className="text-4xl font-black text-gray-100 group-hover:text-primary transition-colors italic leading-none">{(i + 1).toString().padStart(2, '0')}</span>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-gray-900 group-hover:text-primary leading-snug line-clamp-2 transition-colors">{item.title}</h4>
              <p className="text-[10px] font-black text-gray-400 uppercase mt-1 tracking-[0.2em]">{item.category}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}