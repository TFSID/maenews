"use client";

import dynamic from "next/dynamic";
import { Article } from "@/app/typing";

const SliderNews = dynamic(
  () => import("./SliderNews").then((mod) => mod.SliderNews),
  {
    loading: () => (
      <div className="h-[300px] w-full bg-primary animate-pulse" />
    ),
    ssr: false,
  }
);

interface SliderNewsClientProps {
  articles: Article[];
  title: string;
}

export function SliderNewsClient({ articles, title }: SliderNewsClientProps) {
  return <SliderNews articles={articles} title={title} />;
}
