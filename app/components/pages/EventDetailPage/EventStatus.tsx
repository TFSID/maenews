"use client";

import { Badge } from "@/app/components/ui/badge";
import { isBefore, isAfter, parseISO } from "date-fns";

interface EventStatusProps {
  startDate: string;
  endDate: string;
}

export function EventStatus({ startDate, endDate }: EventStatusProps) {
  const now = new Date();
  const start = parseISO(startDate);
  const end = parseISO(endDate);

  // Telah Selesai (Abu-abu)
  if (isAfter(now, end)) {
    return (
      <Badge variant="outline" className="bg-gray-100 text-gray-500 border-0 px-4 py-1">
        Telah Selesai
      </Badge>
    );
  }

  // Segera Berlangsung (Biru)
  if (isBefore(now, start)) {
    return (
      <Badge className="bg-blue-500 text-white border-0 px-4 py-1">
        Segera Berlangsung
      </Badge>
    );
  }

  // Sedang Berlangsung (Hijau)
  return (
    <Badge className="bg-green-500 text-white border-0 px-4 py-1">
      Sedang Berlangsung
    </Badge>
  );
}