"use client";

import { useState } from "react";
import { Badge } from "../../ui/badge";

const CATEGORIES = ["Semua", "Anime", "Manga", "Gaming", "Cosplay", "Creators"];

export function CategoryFilter({ onCategoryChange }: { onCategoryChange: (cat: string) => void }) {
  const [active, setActive] = useState("Semua");

  const handleSelect = (cat: string) => {
    setActive(cat);
    onCategoryChange(cat === "Semua" ? "" : cat);
  };

  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar py-4 border-b">
      {CATEGORIES.map((cat) => (
        <Badge
          key={cat}
          variant={active === cat ? "default" : "outline"}
          className="cursor-pointer px-6 py-2 text-sm transition-all"
          onClick={() => handleSelect(cat)}
        >
          {cat}
        </Badge>
      ))}
    </div>
  );
}