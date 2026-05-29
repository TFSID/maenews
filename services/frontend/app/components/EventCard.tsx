import Link from "next/link";
import Image from "next/image";
import { Event } from "@/app/typing";
import { Calendar, MapPin } from "lucide-react";
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  return (
    <Link href={`/event/${event.slug}`} className="block group bg-white shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="relative w-full aspect-video">
        <Image
          src={event.thumbnailUrl}
          alt={event.title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          unoptimized
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <span className="text-xs font-semibold text-primary uppercase">{event.tags?.[0] || 'Event'}</span>
        <h3 className="font-bold text-lg text-gray-800 mt-1 mb-2 line-clamp-2 group-hover:text-secondary">
          {event.title}
        </h3>
        <div className="text-sm text-gray-500 space-y-1">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>{format(new Date(event.startDate), "EEEE, d MMMM yyyy", { locale: id })}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>{event.location}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
