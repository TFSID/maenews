import Image from "next/image";
import { TagCategoryBadge } from "./TagCategoryBadge";

interface TagHeaderProps {
  name: string;
  category: string;
  description: string;
  count: number;
}

export function TagHeader({ name, category, description, count }: TagHeaderProps) {
  return (
    <header className="relative w-full overflow-hidden bg-gray-900 mb-12 shadow-2xl">
      <div className="absolute inset-0 opacity-30">
        <Image src={`https://picsum.photos/seed/${name}/1200/400`} alt="Banner" fill className="object-cover" />
      </div>
      <div className="relative z-10 p-10 md:p-16 text-center">
        <div className="flex justify-center mb-6">
          <TagCategoryBadge category={category} />
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-white italic uppercase tracking-tighter mb-4">
          #{name}
        </h1>
        <p className="text-gray-300 max-w-2xl mx-auto font-medium mb-6">{description}</p>
        <div className="inline-block px-6 py-2 bg-white/10 backdrop-blur-md text-xs font-black text-white uppercase tracking-widest">
          Total {count} Konten Terkait
        </div>
      </div>
    </header>
  );
}