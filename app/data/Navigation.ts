import { NavItem } from "@/app/typing";

// href menunjuk ke path kategori yang dinamis
export const navItems: NavItem[] = [
    { label: "Beranda", href: "/" },
    { label: "Anime", href: "/category/anime" },
    { label: "Creator", href: "/category/creator" },
    { label: "Event", href: "/event" },
    { label: "Gaming", href: "/category/gaming" },
    { label: "Cosplay", href: "/category/cosplay" },
    { label: "Gallery", href: "/gallery" },
];
