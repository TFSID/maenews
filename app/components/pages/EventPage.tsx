"use client";

import { Event } from "@/app/typing";
import { EventFilter } from "./EventPage/EventFilter";
import { EventCard } from "../EventCard";
import { PaginationControls } from "../ui/PaginationControls";

export function EventPage({ events }: { events: Event[] }) {
  return (
    <main className="container mx-auto px-4 py-10">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-gray-900 mb-10">
        Kalender <span className="text-primary">Event</span>
      </h1>
      <EventFilter />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
      <PaginationControls currentPage={1} totalPages={3} onPageChange={() => {}} />
    </main>
  );
}