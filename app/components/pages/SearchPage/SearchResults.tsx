import { Article, Event } from "@/app/typing";
import { ArticleCard } from "../Homepage/ArticleListPage/ArticleCard";
import { EventCard } from "../../EventCard";

interface SearchResultsProps {
    articles: Article[];
    events: Event[];
}

export function SearchResults({ articles, events }: SearchResultsProps) {
    return (
        <div className="space-y-16">
            {/* Section Artikel */}
            {articles.length > 0 && (
                <section>
                    <h2 className="text-2xl font-black italic uppercase mb-8 border-b-4 border-primary inline-block">Artikel Ditemukan</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {articles.map(article => <ArticleCard key={article.id} article={article} />)}
                    </div>
                </section>
            )}

            {/* Section Event */}
            {events.length > 0 && (
                <section>
                    <h2 className="text-2xl font-black italic uppercase mb-8 border-b-4 border-secondary inline-block">Event Ditemukan</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {events.map(event => <EventCard key={event.id} event={event} />)}
                    </div>
                </section>
            )}
        </div>
    );
}