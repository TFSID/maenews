import { Avatar } from "@/app/components/ui/Avatar";

export function AuthorCard({ author }: { author: string }) {
    return (
        <div className="bg-gray-50 p-8 flex flex-col md:flex-row items-center gap-8 border border-gray-100 mt-16">
            <Avatar name={author} className="w-24 h-24 text-2xl shadow-xl shadow-primary/20 border-4 border-white" />
            <div className="text-center md:text-left flex-1">
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-2 block">Kontributor MaeNews</span>
                <h3 className="text-2xl font-black text-gray-900 mb-2 italic tracking-tight">{author}</h3>
                <p className="text-gray-500 font-medium leading-relaxed">
                    Pecinta kultur pop Jepang yang berfokus pada ulasan anime musiman dan perkembangan industri kreatif di Asia Tenggara.
                </p>
            </div>
        </div>
    );
}