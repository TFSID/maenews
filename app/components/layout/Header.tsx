"use client";

import { useState, useRef, KeyboardEvent } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { navItems } from "@/app/data/Navigation";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  const handleSearchSubmit = () => {
    const q = searchQuery.trim();
    if (q) {
      router.push(`/search/${encodeURIComponent(q)}`);
      setSearchQuery("");
      setIsOpen(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearchSubmit();
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full">

      {/* Main Nav Bar */}
      <nav className="bg-white">
        <div className="container mx-auto px-4 lg:px-8 xl:px-[150px] flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-1.5">
            <img
              src="/logo/logonya.svg"
              alt="Maenews Logo"
              className="h-10 md:h-14 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-0.5">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`relative px-3 py-2 text-[11px] font-bold uppercase tracking-wider transition-colors ${isActive(item.href)
                  ? "text-[#090909]"
                  : "text-[#A6A6A6] hover:text-[#090909]"
                  }`}
              >
                {item.label}
                {isActive(item.href) && (
                  <span className="absolute -bottom-[10px] left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-primary rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* Search Bar + Mobile Menu */}
          <div className="flex items-center gap-3">
            {/* Search Bar — Desktop */}
            <div className="hidden md:flex items-center border border-gray-200 rounded-full overflow-hidden">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search..."
                className="w-36 h-8 bg-white px-4 text-[11px] font-medium text-[#090909] placeholder:text-[#A6A6A6] outline-none"
              />
              <button
                onClick={handleSearchSubmit}
                className="h-8 w-8 flex items-center justify-center bg-primary flex-shrink-0 hover:bg-[#e56200] transition-colors cursor-pointer"
                aria-label="Search"
              >
                <img src="/icon/search-icon.svg" alt="Search" width={14} height={14} />
              </button>
            </div>

            {/* Mobile Hamburger — smooth animated bars → X */}
            <button
              className="md:hidden relative w-[22px] h-[18px] p-0 bg-transparent border-none cursor-pointer"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              <span
                className="absolute left-0 w-full h-[2px] bg-[#090909] rounded-full transition-all duration-300 ease-in-out"
                style={{
                  top: isOpen ? "8px" : "0px",
                  transform: isOpen ? "rotate(45deg)" : "rotate(0)",
                }}
              />
              <span
                className="absolute left-0 top-[8px] w-full h-[2px] bg-[#090909] rounded-full transition-all duration-300 ease-in-out"
                style={{
                  opacity: isOpen ? 0 : 1,
                  transform: isOpen ? "scaleX(0)" : "scaleX(1)",
                }}
              />
              <span
                className="absolute left-0 w-full h-[2px] bg-[#090909] rounded-full transition-all duration-300 ease-in-out"
                style={{
                  top: isOpen ? "8px" : "16px",
                  transform: isOpen ? "rotate(-45deg)" : "rotate(0)",
                }}
              />
            </button>
          </div>
        </div>

        {/* Mobile Dropdown — smooth slide animation */}
        <div
          className="md:hidden overflow-hidden transition-all duration-300 ease-in-out border-t border-transparent"
          style={{
            maxHeight: isOpen ? "400px" : "0px",
            opacity: isOpen ? 1 : 0,
            borderColor: isOpen ? "#f3f4f6" : "transparent",
          }}
        >
          <div className="bg-white px-4 py-4">
            <div className="flex items-center border border-gray-200 rounded-full overflow-hidden mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search..."
                className="flex-1 h-10 bg-white px-4 text-sm text-[#090909] placeholder:text-[#A6A6A6] outline-none"
              />
              <button
                onClick={handleSearchSubmit}
                className="h-10 w-10 flex items-center justify-center bg-primary flex-shrink-0 rounded-r-full"
                aria-label="Search"
              >
                <img src="/icon/search-icon.svg" alt="Search" width={16} height={16} />
              </button>
            </div>
            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`px-3 py-2.5 text-sm font-bold uppercase transition-colors duration-200 ${isActive(item.href)
                    ? "text-primary bg-primary/5"
                    : "text-[#090909] hover:bg-gray-50"
                    }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}