"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { motion, PanInfo } from "framer-motion";
import { HeroCard } from "@/app/components/HeroCard";
import { Article } from "@/app/typing";

type HeroProps = {
  featuredArticle?: Article;
  articles: Article[];
};

export const Hero: React.FC<HeroProps> = ({ featuredArticle, articles }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const autoSlideTimer = useRef<NodeJS.Timeout | null>(null);

  const heroDisplayArticles: Article[] = useMemo(() => {
    const slicedArticles = articles.slice(0, 3);
    return [featuredArticle, ...slicedArticles].filter(
      (article): article is Article => article !== undefined
    );
  }, [featuredArticle, articles]);

  // Auto-slide every 4 seconds on mobile
  const resetAutoSlide = useCallback(() => {
    if (autoSlideTimer.current) clearInterval(autoSlideTimer.current);
    autoSlideTimer.current = setInterval(() => {
      setActiveIndex((prev) =>
        prev >= heroDisplayArticles.length - 1 ? 0 : prev + 1
      );
    }, 4000);
  }, [heroDisplayArticles.length]);

  useEffect(() => {
    resetAutoSlide();
    return () => {
      if (autoSlideTimer.current) clearInterval(autoSlideTimer.current);
    };
  }, [resetAutoSlide]);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const swipeThreshold = 50;
    if (info.offset.x < -swipeThreshold) {
      setActiveIndex((prev) =>
        Math.min(prev + 1, heroDisplayArticles.length - 1)
      );
    } else if (info.offset.x > swipeThreshold) {
      setActiveIndex((prev) => Math.max(prev - 1, 0));
    }
    // Reset auto-slide timer after user swipe
    resetAutoSlide();
  };

  return (
    <section className="container mx-auto px-4 lg:px-8 xl:px-[150px] py-2">
      {/* Mobile Slider */}
      <div className="md:hidden">
        <div className="relative overflow-hidden">
          <motion.div
            className="flex"
            animate={{ x: `-${activeIndex * 100}%` }}
            transition={{ type: "tween", ease: "easeInOut", duration: 0.5 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.1}
            onDragEnd={handleDragEnd}
          >
            {heroDisplayArticles.map((article) => (
              <div key={article.id} className="flex-shrink-0 w-full h-72 overflow-hidden">
                <HeroCard article={article} className="h-full" isLarge />
              </div>
            ))}
          </motion.div>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-4">
          {heroDisplayArticles.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`h-2 rounded-full transition-all duration-300 ${i === activeIndex
                ? "w-6 bg-primary"
                : "w-2 bg-[#A6A6A6]/40"
                }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Desktop Bento Grid — gambar 2 reference:
          Layout (no radius, sharp corners):
          +------------------+-------------------+
          |                  |   Wide card       |
          |   Large card     +--------+----------+
          |   (left half)    | Small  | Small    |
          |                  | card   | card     |
          +------------------+--------+----------+
      */}
      <div className="hidden md:grid h-[320px] lg:h-[400px] xl:h-[480px] overflow-hidden gap-[3px]"
        style={{
          gridTemplateColumns: "1fr 1fr",
          gridTemplateRows: "1fr 1fr",
        }}>

        {/* Card 0 — Large left: spans both rows */}
        {heroDisplayArticles[0] && (
          <div className="row-span-2 overflow-hidden">
            <HeroCard
              article={heroDisplayArticles[0]}
              className="h-full w-full"
              isLarge
            />
          </div>
        )}

        {/* Card 1 — Wide top right: 1 row, full right width */}
        {heroDisplayArticles[1] && (
          <div className="row-span-1 overflow-hidden">
            <HeroCard
              article={heroDisplayArticles[1]}
              className="h-full w-full"
              isLarge={false}
            />
          </div>
        )}

        {/* Card 2 + Card 3 — Bottom right: side by side */}
        <div className="row-span-1 grid grid-cols-2 gap-[3px] overflow-hidden">
          {heroDisplayArticles[2] && (
            <div className="overflow-hidden">
              <HeroCard
                article={heroDisplayArticles[2]}
                className="h-full w-full"
                isLarge={false}
              />
            </div>
          )}
          {heroDisplayArticles[3] && (
            <div className="overflow-hidden">
              <HeroCard
                article={heroDisplayArticles[3]}
                className="h-full w-full"
                isLarge={false}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
