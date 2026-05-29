import { Calendar, Clock, MapPin, ExternalLink } from "lucide-react";
import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";

export function EventInfo({ event }: { event: any }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
      {/* Box Tanggal */}
      <div className="bg-white p-6 border border-gray-100 shadow-sm flex items-center gap-5">
        <div className="bg-primary/10 p-4 text-primary">
          <Calendar size={24} />
        </div>
        <div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Waktu Pelaksanaan</p>
          <p className="font-bold text-gray-900">
            {format(parseISO(event.startDate), "dd MMM", { locale: id })} - {format(parseISO(event.endDate), "dd MMM yyyy", { locale: id })}
          </p>
        </div>
      </div>

      {/* Box Lokasi */}
      <div className="bg-white p-6 border border-gray-100 shadow-sm flex items-center gap-5">
        <div className="bg-primary/10 p-4 text-primary">
          <MapPin size={24} />
        </div>
        <div className="flex-1">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Lokasi Event</p>
          <p className="font-bold text-gray-900 line-clamp-1">{event.location}</p>
        </div>
        <button className="p-2 hover:bg-gray-100 transition-colors text-gray-400">
          <ExternalLink size={18} />
        </button>
      </div>
    </div>
  );
}