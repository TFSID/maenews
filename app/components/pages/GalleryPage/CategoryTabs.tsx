"use client";

const GALLERY_CATEGORIES = ["All", "Creators", "Gaming", "Cosplay", "Anime", "Culture"];

export function CategoryTabs({ active, onSelect }: { active: string, onSelect: (val: string) => void }) {
  return (
    <div className="flex gap-3 overflow-x-auto no-scrollbar py-8 mb-8 border-b border-gray-100">
      {GALLERY_CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`px-8 py-3 font-black uppercase italic tracking-tighter transition-all border-2
            ${active === cat 
              ? "bg-primary border-primary text-white shadow-lg shadow-primary/30 scale-105" 
              : "bg-white border-gray-100 text-gray-400 hover:border-primary hover:text-primary"}`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}