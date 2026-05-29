"use client";
import { TagHeader } from "./TagDetailPage/TagHeader";
import { TagLayoutWrapper } from "./TagDetailPage/TagLayoutWrapper";

import { Tag } from "@/app/typing";

export function TagDetailPage({ tag, articles, events }: { tag: Tag, articles: any[], events: any[] }) {
    return (
        <main className="container mx-auto px-4 py-12 space-y-16">
            <TagHeader
                name={tag.name}
                category={tag.category}
                description={tag.description}
                count={tag.articleCount}
            />

            <section>
                <h2 className="text-2xl font-black italic uppercase mb-8 border-l-8 border-primary pl-4">Koleksi Konten</h2>
                <TagLayoutWrapper layoutType="Articles" data={articles} />
            </section>

            {events.length > 0 && (
                <section>
                    <h2 className="text-2xl font-black italic uppercase mb-8 border-l-8 border-secondary pl-4">Event Terkait</h2>
                    <TagLayoutWrapper layoutType="Event" data={events} />
                </section>
            )}
        </main>
    );
}