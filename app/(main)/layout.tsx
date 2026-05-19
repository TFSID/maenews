import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

import { ClientLayout } from "@/app/components/layout/ClientLayout";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://animae.id"),

  title: "Maenews - Portal Berita Anime, Manga, & Kultur Pop Jepang",
  description:
    "Temukan berita terbaru, ulasan mendalam, jadwal rilis, dan sorotan dari dunia anime, manga, dan kultur pop Jepang. Sumber terpercaya untuk komunitas Animae.",

  manifest: "/favicon/site.webmanifest",

  keywords: [
    "anime",
    "manga",
    "berita anime",
    "ulasan anime",
    "kultur pop jepang",
    "komunitas animae",
    "light novel",
    "figur",
    "cosplay",
    "event jepang",
  ],

  authors: [{ name: "Tim Animae", url: "https://animae.id" }],
  creator: "Tim Animae",

  openGraph: {
    title: "Animae - Berita Anime Terkini dan Ulasan Mendalam",
    description:
      "Sumber terpercaya untuk semua hal tentang anime, manga, dan kultur pop Jepang.",
    url: "https://animae.id",
    siteName: "Animae",
    images: [
      {
        url: "/images/banner-animae.png",
        width: 1200,
        height: 630,
        alt: "Banner Situs Animae",
      },
    ],
    locale: "id_ID",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Animae - Portal Berita Anime & Kultur Pop Jepang",
    description:
      "Jelajahi berita terbaru, ulasan, dan artikel menarik dari dunia anime bersama komunitas Animae.",
    images: ["/images/banner-animae.png"],
  },

  icons: {
    icon: [
      { url: "/favicon/favicon.ico" },
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/favicon/apple-touch-icon.png",
    other: [
      {
        rel: "android-chrome-192x192",
        url: "/favicon/android-chrome-192x192.png",
      },
      {
        rel: "android-chrome-512x512",
        url: "/favicon/android-chrome-512x512.png",
      },
    ],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=ADLaM+Display&display=swap" rel="stylesheet" />
      </head>
      <body className={`${poppins.variable} antialiased`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
