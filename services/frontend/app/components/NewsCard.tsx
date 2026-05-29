"use client";

import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { Article } from "@/app/typing";
import { formatRelativeTime } from "../utils/dateUtils";
import Link from "next/link";
import Image from "next/image";

interface NewsCardProps {
  article: Article;
  index: number;
}

export function NewsCard({ article, index }: NewsCardProps) {
  return (
    // PERBAIKAN: Seluruh kartu dibungkus oleh satu Link dengan kelas 'group'
    <Link href={`/article/${article.slug}`} className="block group h-full">
      <motion.div
        className="flex flex-col h-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05, duration: 0.4 }}
      >
        {/* Kontainer Gambar */}
        <div className="relative overflow-hidden aspect-video mb-3">
          <Image
            width={400}
            height={225}
            src={article.thumbnailUrl || article.imageUrl || ""}
            alt={article.title}
            unoptimized
            className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
          />
        </div>

        {/* Konten Teks */}
        <div className="flex flex-col flex-grow">
          <motion.h3
            className="font-bold text-gray-800 leading-tight line-clamp-3 transition-colors group-hover:text-secondary text-base md:text-md mb-2"
            whileHover={{ y: -2 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            {article.title}
          </motion.h3>
          <div className="flex items-center text-gray-500 text-xs mt-auto pt-2">
            <Clock className="w-3.5 h-3.5 mr-1.5" />
            <span>{formatRelativeTime(article.publishedAt)}</span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
