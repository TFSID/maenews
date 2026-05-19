"use client";

import { TrendingItem, Event } from "@/app/typing";
import { formatShortDate } from "@/app/utils/dateUtils";
import Link from "next/link";
import Image from "next/image";

interface SidebarProps {
  trendingItems: TrendingItem[];
  upcomingEvents: Event[];
}

export function Sidebar({ trendingItems, upcomingEvents }: SidebarProps) {
  return (
    <aside className="space-y-8">
      {/* Trending Sekarang */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-lg font-black uppercase text-primary font-adlam tracking-wide">Trending Sekarang</h3>
        </div>
        <div className="space-y-4">
          {trendingItems.slice(0, 4).map((item) => (
            <Link
              href={`/article/${item.slug}`}
              key={item.id}
              className="block group"
            >
              <div className="flex gap-3">
                {/* Thumbnail */}
                <div className="w-[80px] h-[60px] flex-shrink-0 overflow-hidden bg-[#090909] relative">
                  <Image
                    src={item.imageUrl || `https://placehold.co/100x100/ffedd5/fb923c?text=${item.category.charAt(0)}`}
                    alt={item.title}
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-[#090909] text-xs leading-tight mb-1 group-hover:text-primary transition-colors line-clamp-2">
                    {item.title}
                  </h4>
                  <p className="text-[10px] text-[#A6A6A6] font-medium">
                    {formatShortDate(item.publishedAt)}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Event Mendatang */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-lg font-black uppercase text-primary font-adlam tracking-wide">Event Mendatang</h3>
        </div>
        <div className="space-y-4">
          {upcomingEvents.slice(0, 4).map((event) => (
            <Link
              href={`/event/${event.slug}`}
              key={event.id}
              className="block group"
            >
              <div className="flex gap-3">
                {/* Thumbnail */}
                <div className="w-[80px] h-[60px] flex-shrink-0 overflow-hidden bg-[#090909] relative">
                  <Image
                    src={event.thumbnailUrl || `https://placehold.co/100x100/f3e8ff/c084fc?text=Event`}
                    alt={event.title}
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-[#090909] text-xs leading-tight mb-1 group-hover:text-primary transition-colors line-clamp-2">
                    {event.title}
                  </h4>
                  <div className="flex items-center gap-1 text-[#A6A6A6]">
                    <img src="/icon/location-icon.svg" alt="location" width={12} height={12} />
                    <span className="text-[10px] font-medium truncate">{event.location}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
