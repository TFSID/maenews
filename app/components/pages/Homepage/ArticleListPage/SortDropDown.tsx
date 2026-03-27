"use client";

interface SortDropdownProps {
  onSortChange: (value: string) => void;
}

export function SortDropdown({ onSortChange }: SortDropdownProps) {
  return (
    <div className="flex items-center gap-2">
      <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Urutkan:</label>
      <select 
        onChange={(e) => onSortChange(e.target.value)}
        className="bg-white border px-4 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
      >
        <option value="newest">Terbaru</option>
        <option value="popular">Terpopuler</option>
        <option value="az">A-Z</option>
      </select>
    </div>
  );
}