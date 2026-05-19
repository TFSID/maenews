import { Tag, Category } from "@/app/typing";

const tagData: { name: string; category: string }[] = [
  // Anime
  { name: "Shonen", category: "Anime" },
  { name: "Isekai", category: "Anime" },
  { name: "Romance", category: "Anime" },
  { name: "Action", category: "Anime" },
  { name: "Slice-of-Life", category: "Anime" },
  { name: "Mecha", category: "Anime" },
  // Gaming
  { name: "RPG", category: "Gaming" },
  { name: "FPS", category: "Gaming" },
  { name: "Gacha", category: "Gaming" },
  { name: "Mobile Legends", category: "Gaming" },
  { name: "E-Sport", category: "Gaming" },
  { name: "Indie Game", category: "Gaming" },
  // Cosplay
  { name: "Tutorial", category: "Cosplay" },
  { name: "Crafting", category: "Cosplay" },
  { name: "Wig", category: "Cosplay" },
  { name: "Armor", category: "Cosplay" },
  { name: "Event Cosplay", category: "Cosplay" },
  { name: "Makeup", category: "Cosplay" },
  // Creators
  { name: "VTuber", category: "Creators" },
  { name: "Streamer", category: "Creators" },
  { name: "Artist", category: "Creators" },
  { name: "Utaite", category: "Creators" },
  { name: "Illustrator", category: "Creators" },
  { name: "Animator", category: "Creators" },
  // Culture
  { name: "Culinary", category: "Culture" },
  { name: "Language", category: "Culture" },
  { name: "Festival", category: "Culture" },
  { name: "History", category: "Culture" },
  { name: "Pop-Culture", category: "Culture" },
  { name: "Travel", category: "Culture" },
];

export const mockTags: Tag[] = tagData.map((t, i) => ({
  id: `t${i + 1}`,
  name: t.name,
  slug: t.name.toLowerCase().replace(/\s+/g, "-"),
  category: t.category,
  description: `Tag untuk topik ${t.name}`,
  articleCount: Math.floor(Math.random() * 20) + 1,
}));
