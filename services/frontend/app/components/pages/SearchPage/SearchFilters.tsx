"use client";

interface SearchFiltersProps {
  type: string;
  category: string;
  onTypeChange: (val: string) => void;
  onCategoryChange: (val: string) => void;
}

export function SearchFilters({ type, category, onTypeChange, onCategoryChange }: SearchFiltersProps) {
  const categories = ["Semua", "Creators", "Gaming", "Cosplay", "Anime", "Culture"];

  return (
    <div className="space-y-8 sticky top-24">
      {/* Radio Type */}
      <div>
        <h3 className="text-sm font-black uppercase text-gray-400 tracking-widest mb-4">Tipe Konten</h3>
        <div className="flex flex-col gap-3">
          {["Semua", "Artikel", "Event"].map((t) => (
            <label key={t} className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="radio" 
                name="contentType"
                checked={type === t}
                onChange={() => onTypeChange(t)}
                className="w-5 h-5 text-primary focus:ring-primary border-gray-300"
              />
              <span className={`text-sm font-bold transition-colors ${type === t ? "text-primary" : "text-gray-600 group-hover:text-primary"}`}>
                {t}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Dropdown Category */}
      <div>
        <h3 className="text-sm font-black uppercase text-gray-400 tracking-widest mb-4">Kategori</h3>
        <select 
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="w-full bg-gray-50 border-0 px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20"
        >
          {categories.map(cat => <option key={cat} value={cat === "Semua" ? "" : cat}>{cat}</option>)}
        </select>
      </div>
    </div>
  );
}