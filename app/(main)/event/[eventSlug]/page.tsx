import { getEventBySlug } from "@/app/lib/api";
import { notFound } from "next/navigation";
import { Calendar, MapPin } from "lucide-react";
import Image from "next/image";
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Badge } from "@/app/components/ui/badge";

type Props = {
  params: { eventSlug: string };
};

export default async function EventDetailPage({ params }: Props) {
  const event = await getEventBySlug(params.eventSlug);

  if (!event) {
    notFound();
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-md overflow-hidden">
        <div className="relative w-full h-64 md:h-96">
          <Image
            src={event.thumbnailUrl}
            alt={event.title}
            fill
            className="object-cover"
            priority
            unoptimized
          />
        </div>
        <div className="p-6 md:p-8">
          <Badge className="mb-4 bg-primary/10 text-primary font-semibold">{event.tags?.[0] || 'Event'}</Badge>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{event.title}</h1>
          <div className="flex flex-col sm:flex-row gap-x-8 gap-y-2 text-gray-600 mb-6">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-primary" />
              <span className="font-medium">{format(new Date(event.startDate), "EEEE, d MMMM yyyy", { locale: id })}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-primary" />
              <span className="font-medium">{event.location}</span>
            </div>
          </div>
          <div className="prose max-w-none">
            <p>{event.description}</p>
          </div>
        </div>
      </div>
    </main>
  );
}
