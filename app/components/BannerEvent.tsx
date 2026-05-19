"use client";

import { useState, useEffect } from "react";
import { Event } from "@/app/typing";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface EventBannerProps {
  events?: Event[];
}

export function EventBanner({ events }: EventBannerProps) {
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [isClient, setIsClient] = useState(false);

  const activeEvent = events?.[currentEventIndex];

  useEffect(() => {
    setIsClient(true);

    if (!activeEvent?.startDate) return;

    const calculateTimeLeft = (): TimeLeft | null => {
      const eventDate = new Date(activeEvent.startDate);
      const difference = +eventDate - +new Date();
      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }
      return null;
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      if (newTimeLeft === null) {
        if (events && currentEventIndex < events.length - 1) {
          setCurrentEventIndex((prevIndex) => prevIndex + 1);
        }
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [activeEvent, events, currentEventIndex]);

  if (!activeEvent) return null;

  return (
    <section className="bg-white shadow-sm border border-gray-100 px-6 py-6 sm:py-8">
      {/* Event Title & Location */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
        <h3 className="text-sm sm:text-base font-bold text-[#090909]">
          {activeEvent.title}, {activeEvent.location}
        </h3>
      </div>

      {/* Countdown */}
      {isClient && timeLeft ? (
        <div className="flex flex-col items-center gap-5">
          <div className="flex items-center justify-center gap-3 sm:gap-6">
            {[
              { value: timeLeft.days, label: "Hari" },
              { value: timeLeft.hours, label: "Jam" },
              { value: timeLeft.minutes, label: "Menit" },
              { value: timeLeft.seconds, label: "Detik" },
            ].map((unit, i) => (
              <div key={unit.label} className="flex items-center gap-3 sm:gap-6">
                <div className="flex flex-col items-center">
                  <span className="text-3xl sm:text-5xl font-black text-primary tabular-nums">
                    {String(unit.value).padStart(2, "0")}
                  </span>
                  <span className="text-[10px] sm:text-xs font-bold text-primary uppercase mt-1">
                    {unit.label}
                  </span>
                </div>
                {i < 3 && (
                  <span className="text-3xl sm:text-5xl font-black text-primary -mt-5 sm:-mt-6">:</span>
                )}
              </div>
            ))}
          </div>
          <a
            href={`/event/${activeEvent.slug}`}
            className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-primary border-2 border-primary hover:bg-primary hover:text-white transition-all duration-200 uppercase tracking-wider"
          >
            Lihat Detail Event
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9,18 15,12 9,6" />
            </svg>
          </a>
        </div>
      ) : (
        <p className="text-center text-lg font-bold text-[#090909]">
          {isClient ? "Acara Telah Berlangsung!" : "Menghitung waktu..."}
        </p>
      )}
    </section>
  );
}
