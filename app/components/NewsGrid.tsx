
import { motion } from "framer-motion";
import { Article } from "@/app/typing";
import { NewsCard } from "./NewsCard";

interface NewsGridProps {
  articles: Article[];
}

export function NewsGrid({ articles }: NewsGridProps) {
  return (
    <section className="py-6 sm:py-8 md:py-12">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Berita Terbaru
        </motion.h2>
          
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {articles.map((article, index) => (
            <NewsCard key={article.id} article={article} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
