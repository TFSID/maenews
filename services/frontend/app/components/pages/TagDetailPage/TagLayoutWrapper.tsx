"use client";
import { LayoutInteractive } from "./LayoutInteractive";
import { LayoutGallery } from "./LayoutGallery";
import { ArticleGrid } from "../../layout/ArticleGrid";
import { ArticleCard } from "../Homepage/ArticleListPage/ArticleCard";
import { EventCard } from "../../EventCard";

interface TagLayoutWrapperProps {
  layoutType: "Articles" | "Interactive" | "Gallery" | "Event";
  data: any[];
}

export function TagLayoutWrapper({ layoutType, data }: TagLayoutWrapperProps) {
  switch (layoutType) {
    case "Interactive":
      return <LayoutInteractive articles={data} />;
    case "Gallery":
      return <LayoutGallery items={data} />;
    case "Event":
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.map(e => <EventCard key={e.id} event={e} />)}
        </div>
      );
    default:
      return (
        <ArticleGrid>
          {data.map(a => <ArticleCard key={a.id} article={a} />)}
        </ArticleGrid>
      );
  }
}