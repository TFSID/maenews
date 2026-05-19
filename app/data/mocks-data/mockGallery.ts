import { GalleryItem } from "@/app/typing";

const galleryTitles = [
  "Cosplay Showcase: Demon Slayer Tanjiro",
  "Behind the Scenes: Anime Expo 2025",
  "Fan Art: One Piece Gear 5 Luffy",
  "Cosplay Battle: Spy x Family Yor Forger",
  "Community Meetup Jakarta Pop Fest",
  "Fan Art: Attack on Titan Final Season",
  "Gaming Corner: Genshin Impact Cosplay",
  "Cosplay Showcase: Jujutsu Kaisen Gojo",
  "Workshop: Manga Drawing Session",
  "Event Highlight: Comifuro Anniversary",
  "Cosplay Group: Chainsaw Man Cast",
  "Fan Art: My Hero Academia Deku",
  "Gaming Tournament: Valorant Showdown",
  "Cosplay Showcase: Dragon Ball Super Vegeta",
  "Behind the Scenes: Anime Festival Asia",
  "Fan Art: Naruto Shippuden Tribute",
  "Cosplay Duo: Re:Zero Rem & Ram",
  "Event Highlight: Japan Matsuri 2025",
  "Community Art Wall: Bleach TYBW",
  "Gaming Corner: Honkai Star Rail Party",
  "Cosplay Showcase: Evangelion Unit-01",
  "Fan Art: Spy x Family Bond",
  "Workshop: Prop Making Masterclass",
  "Event Highlight: Comiket Indonesia",
  "Cosplay Group: Demon Slayer Hashira",
  "Fan Art: Solo Leveling Sung Jin-Woo",
  "Gaming Corner: Tekken Tournament",
  "Cosplay Showcase: Sailor Moon Crystal",
  "Behind the Scenes: Voice Actor Panel",
  "Community Meetup: Bandung Otaku Fest",
];

const categories = ["Cosplay", "Event", "Fan Art", "Gaming", "Workshop", "Community"];

export const mockGallery: GalleryItem[] = galleryTitles.map((title, i) => ({
  id: `g${i + 1}`,
  title,
  type: i % 7 === 0 ? "video" : "image",
  url: i % 7 === 0
    ? "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    : `https://picsum.photos/seed/gallery${i}/${600 + (i % 3) * 100}/${400 + (i % 4) * 150}`,
  thumbnailUrl: `https://picsum.photos/seed/gallery${i}/${400 + (i % 3) * 50}/${300 + (i % 5) * 100}`,
  category: categories[i % categories.length],
  uploadedAt: new Date(Date.now() - i * 86400000 * 2).toISOString(),
}));