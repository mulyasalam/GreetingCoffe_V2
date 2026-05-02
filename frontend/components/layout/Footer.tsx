"use client";

import { Coffee, MapPin, Clock, Phone } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/cashier")) return null;

  return (
    <footer className="bg-primary text-primary-foreground mt-auto">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 font-bold text-xl mb-3">
              <Coffee className="h-6 w-6" />
              <span>Greeting.co</span>
            </div>
            <p className="text-primary-foreground/75 text-sm leading-relaxed">
              Coffee & Creamy — Tempat nongkrong favorit yang menyajikan kopi
              berkualitas dengan suasana yang cozy dan ramah.
            </p>
          </div>

          {/* Info */}
          <div>
            <h3 className="font-semibold mb-3 text-base">Informasi Toko</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/75">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                <span>Jl. Kopi Nusantara No. 12, Bandung, Jawa Barat</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4 shrink-0" />
                <span>Senin – Minggu, 07.00 – 22.00 WIB</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0" />
                <span>+62 812 3456 7890</span>
              </li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold mb-3 text-base">Tautan Cepat</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/75">
              <li>
                <Link
                  href="/menu"
                  className="hover:text-primary-foreground transition-colors"
                >
                  Lihat Menu
                </Link>
              </li>
              <li>
                <Link
                  href="/reservation"
                  className="hover:text-primary-foreground transition-colors"
                >
                  Reservasi Meja
                </Link>
              </li>
              <li>
                <Link
                  href="/cart"
                  className="hover:text-primary-foreground transition-colors"
                >
                  Keranjang Pesanan
                </Link>
              </li>
              <li>
                <Link
                  href="/cashier/login"
                  className="hover:text-primary-foreground transition-colors"
                >
                  Portal Kasir
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-6 text-center text-xs text-primary-foreground/60">
          © {new Date().getFullYear()} Greeting.co (Coffee & Creamy). Hak cipta
          dilindungi.
        </div>
      </div>
    </footer>
  );
}
