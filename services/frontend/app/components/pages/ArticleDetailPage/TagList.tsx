import Link from "next/link";
import { Badge } from "@/app/components/ui/badge";
import { slugify } from "@/app/lib/utils";

export function TagList({ tags }: { tags: string[] }) {
    if (!tags || tags.length === 0) return null;
    return (
        <div className="flex flex-wrap gap-2 mt-8">
            {tags.map((tag) => (
                <Link key={tag} href={`/tag/${slugify(tag)}`}>
                    <Badge variant="outline" className="px-5 py-2 border-2 hover:bg-primary hover:text-white hover:border-primary transition-all font-bold cursor-pointer">
                        #{tag}
                    </Badge>
                </Link>
            ))}
        </div>
    );
}
