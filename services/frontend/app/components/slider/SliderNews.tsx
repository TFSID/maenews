"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Article } from "@/app/typing";
import Link from "next/link";
import Image from "next/image";

interface SliderNewsProps {
  articles: Article[];
  title: string;
}

export function SliderNews({ articles, title }: SliderNewsProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    if (!sliderRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 4);
  }, []);

  useEffect(() => {
    checkScroll();
  }, [checkScroll]);

  const scroll = (direction: "left" | "right") => {
    if (!sliderRef.current) return;
    const amount = sliderRef.current.clientWidth * 0.52;
    sliderRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <section className="bg-white py-8 sm:py-10">
      <div className="container mx-auto px-4 lg:px-8 xl:px-[150px]">
        <div className="flex items-center gap-2 mb-5">
          <img src="/icon/recomendation-icon.svg" alt="" width={22} height={22} />
          <h2 className="text-lg font-black uppercase text-primary tracking-wide font-adlam">
            {title}
          </h2>
        </div>
      </div>

      {/* Slider wrapper — relative for floating arrows */}
      <div className="relative">
        {/* LEFT arrow */}
        <button
          onClick={() => scroll("left")}
          style={{ left: 20 }}
          className="absolute top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-black/60 backdrop-blur-sm text-white cursor-pointer hover:bg-black/80 hover:scale-110 transition-all duration-200"
          aria-label="Previous"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15,18 9,12 15,6" />
          </svg>
        </button>

        {/* RIGHT arrow */}
        <button
          onClick={() => scroll("right")}
          style={{ right: 20 }}
          className="absolute top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-black/60 backdrop-blur-sm text-white cursor-pointer hover:bg-black/80 hover:scale-110 transition-all duration-200"
          aria-label="Next"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9,18 15,12 9,6" />
          </svg>
        </button>

        {/* Scrollable track */}
        <div
          ref={sliderRef}
          onScroll={checkScroll}
          className="flex gap-[2px] overflow-x-auto scrollbar-hide scroll-smooth"
          style={{
            scrollSnapType: "x mandatory",
            paddingLeft: "max(16px, calc((100vw - 1400px) / 2 + 150px))",
          }}
        >
          {articles.map((article) => {
            const displayImg = article.thumbnailUrl || article.imageUrl || "";
            return (
              <Link
                key={article.id}
                href={`/article/${article.slug}`}
                className="flex-shrink-0 snap-start group"
                style={{
                  width: "calc(50vw - 76px)",
                  minWidth: "280px",
                  maxWidth: "550px",
                }}
              >
                {/* Full-bleed card — NO border radius */}
                <div className="relative h-[200px] sm:h-[260px] overflow-hidden bg-[#090909]">
                  <Image
                    src={displayImg}
                    alt={article.title}
                    fill
                    unoptimized
                    className="object-cover opacity-90 transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                  {/* Dark text container at bottom */}
                  <div className="absolute bottom-0 left-0 w-full z-10 bg-black/35 px-4 py-3 sm:px-5 sm:py-4">
                    <span className="inline-block font-adlam font-black uppercase text-[10px] sm:text-xs px-2 py-0.5 bg-primary text-white rounded-none mb-2 tracking-wider">
                      {article.category}
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-white leading-tight line-clamp-2 font-adlam">
                      {article.title}
                    </h3>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
