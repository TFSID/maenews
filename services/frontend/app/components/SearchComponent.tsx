"use client";

import { useState, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";

export function SearchComponent() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    if (query.trim()) {
      // Mengarahkan pengguna ke halaman hasil pencarian dengan query yang di-encode
      router.push(`/search/${encodeURIComponent(query.trim())}`);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="relative w-full">
      <Input
        type="search"
        placeholder="Cari berita..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyPress={handleKeyPress}
        className="w-full bg-white/90 border-none rounded-full pl-4 pr-12 text-sm"
      />
      <Button
        size="sm"
        onClick={handleSearch}
        className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-orange-500 hover:bg-orange-600 rounded-full w-8 h-8 p-0"
      >
        <Search className="w-4 h-4 text-white" />
      </Button>
    </div>
  );
}
