"use client";

export function EventFilter() {
  return (
    <div className="bg-white p-6 border shadow-sm flex flex-col md:flex-row gap-4 items-end mb-10">
      <div className="flex-1 w-full">
        <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block">Status Event</label>
        <select className="w-full bg-gray-50 border-0 px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all">
          <option>Semua Status</option>
          <option>Upcoming</option>
          <option>Ongoing</option>
          <option>Ended</option>
        </select>
      </div>
      <div className="flex-1 w-full">
        <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block">Cari Lokasi</label>
        <input type="text" placeholder="Contoh: Jakarta" className="w-full bg-gray-50 border-0 px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
      </div>
      <div className="flex-[1.5] w-full flex gap-2">
        <div className="w-full">
          <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block">Dari</label>
          <input type="date" className="w-full bg-gray-50 border-0 px-4 py-3 text-sm font-bold outline-none" />
        </div>
        <div className="w-full">
          <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block">Sampai</label>
          <input type="date" className="w-full bg-gray-50 border-0 px-4 py-3 text-sm font-bold outline-none" />
        </div>
      </div>
    </div>
  );
}