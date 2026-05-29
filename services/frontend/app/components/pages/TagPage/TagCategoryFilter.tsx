"use client";

const CATEGORIES = ["All", "Creators", "Gaming", "Cosplay", "Anime", "Culture"];

export function TagCategoryFilter({ active, onSelect }: { active: string, onSelect: (val: string) => void }) {
    return (
        <div className="flex flex-wrap gap-3 overflow-x-auto py-4">
            {CATEGORIES.map((cat) => (
                <button
                    key={cat}
                    onClick={() => onSelect(cat)}
                    className={`px-6 py-2 font-bold uppercase text-sm border-2 transition-all ${active === cat
                            ? "bg-primary border-primary text-white"
                            : "bg-white border-gray-200 text-gray-500 hover:border-primary"
                        }`}
                >
                    {cat}
                </button>
            ))}
        </div>
    );
}
