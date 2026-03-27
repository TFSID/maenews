"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { GalleryItem } from "@/app/typing";
import { useEffect, useCallback } from "react";

interface LightboxProps {
  item: GalleryItem | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export function Lightbox({ item, onClose, onPrev, onNext }: LightboxProps) {
  // Keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
    if (e.key === "ArrowLeft") onPrev();
    if (e.key === "ArrowRight") onNext();
  }, [onClose, onPrev, onNext]);

  useEffect(() => {
    if (item) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [item, handleKeyDown]);

  if (!item) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 backdrop-blur-xl"
        onClick={onClose}
      >
        {/* Close Button */}
        <button
          className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors z-[110] p-2"
          onClick={onClose}
        >
          <X size={32} />
        </button>

        {/* Navigation Buttons */}
        <button
          className="absolute left-4 md:left-8 text-white/40 hover:text-white transition-colors p-3 z-[110]"
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
        >
          <ChevronLeft size={48} />
        </button>

        <button
          className="absolute right-4 md:right-8 text-white/40 hover:text-white transition-colors p-3 z-[110]"
          onClick={(e) => { e.stopPropagation(); onNext(); }}
        >
          <ChevronRight size={48} />
        </button>

        {/* Media Container */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-5xl aspect-video flex items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          {item.type === "image" ? (
            <Image
              src={item.url}
              alt={item.title}
              fill
              unoptimized
              className="object-contain"
            />
          ) : (
            <iframe
              src={item.url.replace("watch?v=", "embed/")}
              className="w-full h-full shadow-2xl border-0"
              allowFullScreen
            />
          )}

          {/* Caption */}
          <div className="absolute -bottom-16 left-0 right-0 text-center">
            <span className="text-primary text-[10px] font-black uppercase tracking-widest">
              #{item.category}
            </span>
            <h4 className="text-white font-bold text-lg mt-1">
              {item.title}
            </h4>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}