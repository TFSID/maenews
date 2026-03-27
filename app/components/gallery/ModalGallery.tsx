// app/components/gallery/ModalGallery.tsx (Task #64)
"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";

export function ModalGallery({ image, onClose }: { image: string | null, onClose: () => void }) {
  if (!image) return null;
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm" onClick={onClose}>
        <button className="absolute top-6 right-6 text-white hover:text-primary"><X className="w-8 h-8" /></button>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative w-full max-w-5xl aspect-video">
          <Image src={image} alt="Gallery Preview" fill className="object-contain" />
        </motion.div>
      </div>
    </AnimatePresence>
  );
}