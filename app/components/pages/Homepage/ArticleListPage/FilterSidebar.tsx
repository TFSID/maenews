"use client";

interface FilterSidebarProps {
  categories: string[];
  tags: string[];
  onFilterChange: (type: "category" | "tag", value: string, checked: boolean) => void;
}

export function FilterSidebar({ categories, tags, onFilterChange }: FilterSidebarProps) {
  return (
    <aside className="space-y-10">
      <div>
        <h3 className="text-lg font-black italic uppercase tracking-tighter mb-6 border-b-2 border-primary w-fit">Kategori</h3>
        <div className="flex flex-col gap-3">
          {categories.map((cat) => (
            <label key={cat} className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="checkbox" 
                className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                onChange={(e) => onFilterChange("category", cat, e.target.checked)}
              />
              <span className="text-sm font-bold text-gray-600 group-hover:text-primary transition-colors">{cat}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-black italic uppercase tracking-tighter mb-6 border-b-2 border-primary w-fit">Tag Populer</h3>
        <div className="flex flex-col gap-3">
          {tags.map((tag) => (
            <label key={tag} className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="checkbox" 
                className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                onChange={(e) => onFilterChange("tag", tag, e.target.checked)}
              />
              <span className="text-sm font-bold text-gray-600 group-hover:text-primary transition-colors">#{tag}</span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
}