import Image from "next/image";
import { Globe, Mail } from "lucide-react";

export function EventOrganizer() {
  return (
    <div className="bg-gray-50 p-8 border border-gray-100 mt-12">
      <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
        <div className="relative w-24 h-24 overflow-hidden bg-white p-2 shadow-md border-4 border-white">
          <Image 
            src="https://picsum.photos/seed/organizer/200" 
            alt="Logo Organizer" 
            fill 
            className="object-contain" 
          />
        </div>
        <div className="flex-1">
          <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-2 block">Penyelenggara</span>
          <h3 className="text-2xl font-black text-gray-900 mb-2 italic">Animae Network Indonesia</h3>
          <p className="text-gray-500 font-medium mb-6 leading-relaxed max-w-2xl">
            Komunitas dan penggerak industri kreatif Jepang di Indonesia. Kami berfokus pada penyelenggaraan event berkualitas untuk para penggemar anime dan manga.
          </p>
          <div className="flex justify-center md:justify-start gap-4">
            <a href="#" className="flex items-center gap-2 text-xs font-black uppercase text-primary hover:text-secondary transition-colors">
              <Globe size={14} /> Official Website
            </a>
            <a href="#" className="flex items-center gap-2 text-xs font-black uppercase text-primary hover:text-secondary transition-colors">
              <Mail size={14} /> Hubungi Kami
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}