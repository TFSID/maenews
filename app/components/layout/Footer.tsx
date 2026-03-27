import Link from "next/link";
import { Instagram, Facebook, Youtube, Twitter, Phone, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-white border-t border-gray-100">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 lg:px-8 xl:px-[150px] py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: Logo & About */}
          <div>
            <img
              src="/logo/logonya.svg"
              alt="Maenews Logo"
              className="h-10 md:h-14 w-auto mb-4"
            />
            <h3 className="text-sm font-bold text-[#090909] mb-2">Tentang Kami</h3>
            <p className="text-xs text-[#A6A6A6] leading-relaxed">
              Portal berita anime, manga, dan kultur pop Jepang terpercaya untuk komunitas Indonesia. Menyajikan berita terbaru, ulasan mendalam, dan konten menarik setiap hari.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-sm font-bold text-[#090909] mb-4">Navigasi</h3>
            <div className="flex flex-col gap-2.5">
              <Link href="#" className="text-xs text-[#A6A6A6] hover:text-primary transition-colors">
                Tentang Kami
              </Link>
              <Link href="#" className="text-xs text-[#A6A6A6] hover:text-primary transition-colors">
                Kontak
              </Link>
              <Link href="#" className="text-xs text-[#A6A6A6] hover:text-primary transition-colors">
                Privasi
              </Link>
              <Link href="#" className="text-xs text-[#A6A6A6] hover:text-primary transition-colors">
                Syarat & Ketentuan
              </Link>
            </div>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h3 className="text-sm font-bold text-[#090909] mb-4">Hubungi Kami</h3>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-[#A6A6A6]" />
                <div>
                  <p className="text-xs text-[#A6A6A6]">Telepon :</p>
                  <p className="text-xs text-[#090909]">+6281234567890</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-[#A6A6A6]" />
                <div>
                  <p className="text-xs text-[#A6A6A6]">Email :</p>
                  <p className="text-xs text-[#090909]">maenews@gmail.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Column 4: Social Media */}
          <div>
            <h3 className="text-sm font-bold text-[#090909] mb-4">Ikuti Kami</h3>
            <div className="flex gap-3">
              {[
                { Icon: Instagram, label: "Instagram" },
                { Icon: Facebook, label: "Facebook" },
                { Icon: Youtube, label: "YouTube" },
                { Icon: Twitter, label: "Twitter" },
              ].map(({ Icon, label }) => (
                <Link
                  key={label}
                  href="#"
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 text-[#A6A6A6] hover:bg-primary hover:border-primary hover:text-white transition-all"
                  aria-label={label}
                >
                  <Icon size={16} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar — Orange Copyright */}
      <div className="bg-primary">
        <div className="container mx-auto px-4 lg:px-8 xl:px-[150px] py-3">
          <div className="flex flex-col md:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-4 text-[10px] text-white/80">
              <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-white transition-colors">Cookie Policy</Link>
            </div>
            <p className="text-[10px] font-bold text-white tracking-wider">
              © 2026 MAENEWS NETWORK. ALL RIGHT RESERVED
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}