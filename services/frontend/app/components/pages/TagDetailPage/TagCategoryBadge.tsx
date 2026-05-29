import { Badge } from "../../ui/badge";
import { cn } from "@/app/lib/utils";

const categoryColors: Record<string, string> = {
  Creators: "bg-purple-500",
  Gaming: "bg-blue-500",
  Cosplay: "bg-pink-500",
  Anime: "bg-orange-500",
  Culture: "bg-emerald-500",
};

export function TagCategoryBadge({ category }: { category: string }) {
  return (
    <Badge className={cn("border-0 text-white font-black italic", categoryColors[category] || "bg-gray-400")}>
      {category}
    </Badge>
  );
}