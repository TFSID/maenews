import { Article } from "@/app/typing";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../../ui/button";

export function HeroSection({ article }: { article: Article }) {
  if (!article) return null;
  const heroImg = article.thumbnailUrl || article.imageUrl || "";

  return (
    <section className="relative w-full h-[500px] md:h-[700px] overflow-hidden group shadow-2xl bg-gray-900">
      {/* FIX: Tambahkan properti 'priority' untuk SEO/LCP */}
      <Image
        src={heroImg}
        alt={article.title}
        fill
        priority
        sizes="100vw"
        className="object-cover transition-transform duration-1000 group-hover:scale-105 opacity-80"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 p-8 md:p-20 max-w-5xl">
        <div className="bg-primary text-white px-4 py-1.5 font-black italic uppercase text-xs mb-6 inline-block tracking-widest shadow-lg animate-bounce">
          Breaking News
        </div>
        <h1 className="text-4xl md:text-7xl font-black text-white leading-[1.05] mb-6 italic uppercase tracking-tighter drop-shadow-2xl">
          {article.title}
        </h1>
        <p className="text-gray-200 text-lg md:text-xl mb-10 line-clamp-2 max-w-3xl font-medium opacity-90 leading-relaxed">
          {article.excerpt}
        </p>
        <Link href={`/article/${article.slug}`}>
          <Button size="lg" className="bg-white text-gray-900 hover:bg-primary hover:text-white font-black px-12 py-8 text-xl uppercase transition-all duration-300 transform hover:translate-x-2">
            Mulai Membaca →
          </Button>
        </Link>
      </div>
    </section>
  );
}