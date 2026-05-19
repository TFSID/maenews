"use client";
import { useState } from "react";
import { GalleryItem } from "@/app/typing";
import { GalleryCard } from "../GalleryPage/GalleryCard";
import { Lightbox } from "../GalleryPage/Lightbox";

export function LayoutGallery({ items }: { items: GalleryItem[] }) {
  const [index, setIndex] = useState<number | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, i) => (
          <GalleryCard key={item.id} item={item} index={i} onClick={() => setIndex(i)} />
        ))}
      </div>
      {index !== null && (
        <Lightbox 
          item={items[index]} 
          onClose={() => setIndex(null)}
          onPrev={() => setIndex((index + items.length - 1) % items.length)}
          onNext={() => setIndex((index + 1) % items.length)}
        />
      )}
    </>
  );
}