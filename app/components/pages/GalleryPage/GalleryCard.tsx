"use client";

import Image from "next/image";
import { Play, ZoomIn } from "lucide-react";
import { GalleryItem } from "@/app/typing";
import { motion } from "framer-motion";

export function GalleryCard({ item, onClick, index }: { item: GalleryItem; onClick: () => void; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.5, ease: "easeOut" }}
      className="relative overflow-hidden cursor-zoom-in group bg-gray-100"
      onClick={onClick}
    >
      <Image
        src={item.thumbnailUrl}
        alt={item.title}
        width={400}
        height={600}
        unoptimized
        className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
      />

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end">
        {/* Icon indicator */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          {item.type === "video" ? (
            <div className="bg-primary p-4 text-white shadow-xl scale-75 group-hover:scale-100 transition-transform duration-300">
              <Play fill="currentColor" size={24} />
            </div>
          ) : (
            <div className="bg-white/20 p-4 text-white backdrop-blur-md scale-75 group-hover:scale-100 transition-transform duration-300">
              <ZoomIn size={24} />
            </div>
          )}
        </div>

        {/* Bottom info */}
        <div className="p-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
          <span className="inline-block text-[10px] font-black uppercase tracking-widest text-primary mb-1.5">
            #{item.category}
          </span>
          <p className="text-white font-bold text-sm leading-tight line-clamp-2">
            {item.title}
          </p>
        </div>
      </div>

      {/* Video badge */}
      {item.type === "video" && (
        <div className="absolute top-3 right-3 bg-primary text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5">
          Video
        </div>
      )}

      {/* Foto badge */}
      {item.type !== "video" && (
        <div className="absolute top-3 left-3 bg-white/90 text-gray-800 text-[9px] font-black uppercase tracking-wider px-2 py-0.5">
          Foto
        </div>
      )}
    </motion.div>
  );
}