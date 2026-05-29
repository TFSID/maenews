"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/app/lib/utils";

interface AvatarProps {
  src?: string;
  name: string;
  className?: string;
}

export function Avatar({ src, name, className }: AvatarProps) {
  const [hasError, setHasError] = useState(false);
  
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);

  return (
    <div className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gray-100", className)}>
      {src && !hasError ? (
        <Image
          src={src}
          alt={name}
          fill
          className="aspect-square h-full w-full object-cover"
          onError={() => setHasError(true)}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
          {initials}
        </div>
      )}
    </div>
  );
}