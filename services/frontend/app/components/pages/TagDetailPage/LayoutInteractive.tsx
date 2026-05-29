"use client";
import { motion } from "framer-motion";
import { Article } from "@/app/typing";
import { BookOpen, BarChart } from "lucide-react";
import { Badge } from "../../ui/badge";

import Image from "next/image";

export function LayoutInteractive({ articles }: { articles: Article[] }) {
    return (
        <div className="grid grid-cols-1 gap-8">
            {articles.map((item) => (
                <motion.div
                    key={item.id}
                    whileHover={{ x: 10 }}
                    className="bg-white p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row gap-8 items-center"
                >
                    <div className="w-full md:w-1/3 aspect-video relative overflow-hidden bg-gray-100">
                        <Image src={item.thumbnailUrl || ""} alt={item.title} fill className="object-cover" />
                    </div>
                    <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-3">
                            <Badge variant="info">Intermediate</Badge>
                            <span className="text-xs font-black text-gray-300 uppercase tracking-[0.2em]">Panduan Interaktif</span>
                        </div>
                        <h2 className="text-3xl font-black italic uppercase tracking-tighter text-gray-900">{item.title}</h2>

                        {/* Progress Indicator */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-400">
                                <span>Progress Belajar</span>
                                <span className="text-primary">65%</span>
                            </div>
                            <div className="w-full h-3 bg-gray-100 overflow-hidden">
                                <motion.div initial={{ width: 0 }} animate={{ width: "65%" }} className="h-full bg-primary" />
                            </div>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}