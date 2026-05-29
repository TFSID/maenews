"use client";

import { useEffect } from "react";
import { incrementArticleView } from "@/app/lib/api";

interface ArticleViewTrackerProps {
  slug: string;
}

// Komponen ini tidak merender apa-apa, tugasnya hanya memanggil API
export function ArticleViewTracker({ slug }: ArticleViewTrackerProps) {
  useEffect(() => {
    // Panggil API untuk menambah view saat komponen ini dimuat
    incrementArticleView(slug);
  }, [slug]); // Jalankan hanya sekali saat slug berubah

  return null; // Tidak perlu merender elemen visual
}
