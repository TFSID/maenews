import Image from "next/image";
import { Breadcrumb } from "@/app/components/ui/Breadcrumb";
import { EventStatus } from "./EventStatus";
import { Event } from "@/app/typing";

export function EventHeader({ event }: { event: Event }) {
  return (
    <header className="mb-10">
      <Breadcrumb items={[{ label: "Event", href: "/event" }, { label: event.title, href: "#" }]} />
      
      <div className="mt-8 relative aspect-video overflow-hidden shadow-2xl group bg-gray-900">
        <Image 
          src={event.thumbnailUrl} 
          alt={event.title} 
          fill 
          className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-90" 
          priority 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        
        <div className="absolute bottom-0 left-0 p-8 md:p-12">
          <div className="mb-6 scale-110 origin-left">
            <EventStatus startDate={event.startDate} endDate={event.endDate} />
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter leading-[1.1]">
            {event.title}
          </h1>
        </div>
      </div>
    </header>
  );
}
