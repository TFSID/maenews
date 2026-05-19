"use client";

import { Event } from "@/app/typing";
import { EventHeader } from "./EventDetailPage/EventHeader";
import { EventInfo } from "./EventDetailPage/EventInfo";
import { EventOrganizer } from "./EventDetailPage/EventOrganizer";
import { ArticleContent } from "./ArticleDetailPage/ArticleContent";
import { TagList } from "./ArticleDetailPage/TagList";
import { ShareButtons } from "../ui/ShareButtons";

export function EventDetailPage({ event }: { event: Event }) {
  return (
    <main className="container mx-auto px-4 max-w-5xl py-12">
      {/* 1. Header (Thumbnail + Title + Status) */}
      <EventHeader event={event} />

      {/* 2. Info Boxes (Waktu + Lokasi) */}
      <EventInfo event={event} />

      {/* 3. Content (Deskripsi menggunakan styling artikel) */}
      <ArticleContent htmlContent={event.description} />

      {/* 4. Organizer Information */}
      <EventOrganizer />

      {/* 5. Tags */}
      <TagList tags={event.tags} />

      {/* 6. Social Interaction */}
      <div className="mt-12 pt-10 border-t border-gray-100">
        <ShareButtons
          url={`https://maenews.id/event/${event.slug}`}
          title={event.title}
        />
      </div>
    </main>
  );
}