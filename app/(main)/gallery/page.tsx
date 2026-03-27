"use client";

import { useState, useMemo, useCallback } from "react";
import { mockGallery } from "@/app/data/mocks-data";
import { motion, AnimatePresence } from "framer-motion";
import { Grid3X3, LayoutGrid, Images } from "lucide-react";
import { GalleryCard } from "@/app/components/pages/GalleryPage/GalleryCard";
import { Lightbox } from "@/app/components/pages/GalleryPage/Lightbox";
import { Breadcrumb } from "@/app/components/ui/Breadcrumb";
import { GalleryItem } from "@/app/typing";

/** Distribute items into n columns evenly (round-robin) */
function distributeColumns(items: GalleryItem[], n: number): GalleryItem[][] {
  const cols: GalleryItem[][] = Array.from({ length: n }, () => []);
  items.forEach((item, i) => cols[i % n].push(item));
  return cols;
}

const GALLERY_CATEGORIES = ["Semua", "Cosplay", "Event", "Fan Art", "Gaming", "Workshop", "Community"];

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [columns, setColumns] = useState<3 | 4>(3);

  const filteredItems = useMemo(() => {
    if (activeCategory === "Semua") return mockGallery;
    return mockGallery.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  const lightboxItem = lightboxIndex !== null ? filteredItems[lightboxIndex] : null;

  const handlePrev = useCallback(() => {
    setLightboxIndex((prev) =>
      prev !== null ? (prev - 1 + filteredItems.length) % filteredItems.length : null
    );
  }, [filteredItems.length]);

  const handleNext = useCallback(() => {
    setLightboxIndex((prev) =>
      prev !== null ? (prev + 1) % filteredItems.length : null
    );
  }, [filteredItems.length]);

  return (
    <main className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 lg:px-[150px] pt-4 pb-2">
        <Breadcrumb items={[{ label: "Gallery", href: "#" }]} />
      </div>

      {/* Header */}
      <div className="container mx-auto px-4 lg:px-[150px] pt-2 pb-6">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-2xl sm:text-3xl font-black uppercase text-primary tracking-wider font-adlam">
            Gallery
          </h1>
          <div className="w-32 h-[3px] bg-primary mt-1 mb-2" />
          <p className="text-sm text-gray-400 font-medium max-w-lg">
            Koleksi foto &amp; video terbaik dari event, cosplay, fan art, dan komunitas anime Indonesia
          </p>
        </div>
      </div>

      {/* Category Filter + Layout Toggle */}
      <div className="container mx-auto px-4 lg:px-[150px] pb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide w-full sm:w-auto">
            {GALLERY_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setLightboxIndex(null); }}
                className={`px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap border
                  ${activeCategory === cat
                    ? "bg-primary border-primary text-white"
                    : "bg-white border-gray-200 text-gray-400 hover:border-primary hover:text-primary"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Layout Toggle */}
          <div className="hidden lg:flex items-center gap-1 border border-gray-200">
            <button
              onClick={() => setColumns(3)}
              className={`p-2 transition-colors ${columns === 3 ? "bg-primary text-white" : "text-gray-400 hover:text-primary"}`}
              aria-label="3 columns"
            >
              <Grid3X3 size={16} />
            </button>
            <button
              onClick={() => setColumns(4)}
              className={`p-2 transition-colors ${columns === 4 ? "bg-primary text-white" : "text-gray-400 hover:text-primary"}`}
              aria-label="4 columns"
            >
              <LayoutGrid size={16} />
            </button>
          </div>
        </div>

        {/* Result count */}
        <div className="flex items-center gap-2 pt-3 pb-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">
            {filteredItems.length} item{filteredItems.length !== 1 && "s"}
          </span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>
      </div>

      {/* Masonry Grid */}
      <div className="container mx-auto px-4 lg:px-[150px] pb-16">
        <AnimatePresence mode="wait">
          {filteredItems.length > 0 && (
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex items-start gap-4"
            >
              {distributeColumns(filteredItems, columns).map((col, colIdx) => {
                const visibility =
                  colIdx === 0 ? "" :
                  colIdx === 1 ? "hidden sm:flex" :
                  "hidden lg:flex";

                return (
                  <div key={colIdx} className={`flex flex-col gap-4 flex-1 ${visibility}`}>
                    {col.map((item) => {
                      const origIdx = filteredItems.indexOf(item);
                      return (
                        <GalleryCard
                          key={item.id}
                          item={item}
                          index={origIdx}
                          onClick={() => setLightboxIndex(origIdx)}
                        />
                      );
                    })}
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="text-center py-20">
            <Images className="mx-auto text-gray-200 mb-4" size={48} />
            <p className="text-gray-400 font-bold">Belum ada konten di kategori ini</p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <Lightbox
        item={lightboxItem}
        onClose={() => setLightboxIndex(null)}
        onPrev={handlePrev}
        onNext={handleNext}
      />
    </main>
  );
}