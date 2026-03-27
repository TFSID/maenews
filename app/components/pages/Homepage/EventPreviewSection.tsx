import { Event } from "@/app/typing";
import { EventCard } from "../../EventCard";

export function EventPreviewSection({ events }: { events: Event[] }) {
  return (
    <section className="py-10">
      <h2 className="text-2xl font-black italic mb-6 uppercase tracking-tighter text-gray-900">Event Mendatang</h2>
      <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 no-scrollbar">
        {events.slice(0, 3).map((event) => (
          <div key={event.id} className="min-w-[300px] md:min-w-[400px] snap-center">
            <EventCard event={event} />
          </div>
        ))}
      </div>
    </section>
  );
}