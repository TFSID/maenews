"use client";

import { Search, X } from "lucide-react";
import { useState, useEffect } from "react";

export function SearchBar({ count, onSearch }: { count: number, onSearch: (query: string) => void }) {
  const [inputValue, setInputValue] = useState("");

  // Logic Debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(inputValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [inputValue, onSearch]);

  return (
    <div className="max-w-3xl mx-auto mb-20">
      <div className="relative group">
        <input 
          type="text"
          value={inputValue} 
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Cari anime, event, atau berita kultur pop..."
          className="w-full bg-gray-50 border-0 py-7 px-16 text-xl font-bold outline-none focus:ring-8 focus:ring-primary/10 transition-all placeholder:text-gray-300"
        />
        
        {/* Search Icon */}
        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-primary">
          <Search size={28} className="group-focus-within:scale-110 transition-transform" />
        </div>

        {/* Clear Button */}
        {inputValue && (
          <button 
            onClick={() => setInputValue("")} 
            className="absolute right-6 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-primary transition-colors"
          >
            <X size={24} />
          </button>
        )}
      </div>

      {/* Result Count Indicator */}
      <div className="mt-6 flex items-center justify-center gap-3">
        <div className="h-1px flex-1 bg-gray-100"></div>
        <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.4em] whitespace-nowrap">
          Ditemukan <span className="text-primary">{count}</span> Hasil Pencarian
        </p>
        <div className="h-1px flex-1 bg-gray-100"></div>
      </div>
    </div>
  );
}