"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const NAV_LINKS = ["Services", "Catalog", "Support"] as const;

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "glass shadow-sm border-b border-outline-variant"
          : "bg-transparent"
      }`}
    >
      <nav className="flex justify-between items-center px-6 md:px-10 py-4 max-w-screen-2xl mx-auto">
        {/* ── Logo + Links ── */}
        <div className="flex items-center gap-10">
          <Link
            href="/"
            className="text-2xl font-black tracking-tighter text-zinc-900 select-none"
          >
            Fixx<span className="text-primary">er</span>
          </Link>

          <ul className="hidden md:flex gap-8 items-center">
            {NAV_LINKS.map((item) => (
              <li key={item}>
                <Link
                  href={`#${item.toLowerCase()}`}
                  className="relative text-zinc-500 hover:text-zinc-900 transition-colors font-label text-sm uppercase tracking-wider font-medium group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full rounded-full" />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Actions ── */}
        <div className="flex items-center gap-3">
          {/* Search bar */}
          <div className="hidden lg:flex items-center bg-surface-container rounded-full px-4 py-2.5 border border-outline gap-2 transition-all duration-200 focus-within:border-primary/30 focus-within:shadow-sm focus-within:shadow-primary/5">
            <span className="material-symbols-outlined text-on-surface-variant text-xl">
              search
            </span>
            <input
              type="text"
              placeholder="Search parts…"
              className="bg-transparent border-none outline-none text-sm w-44 text-on-surface placeholder:text-on-surface-variant"
            />
          </div>

          {/* CTA */}
          <button className="group relative bg-primary text-on-primary px-6 h-11 rounded-xl font-bold text-sm overflow-hidden uppercase tracking-wide shadow-lg shadow-primary/15 transition-all duration-200 hover:shadow-xl hover:shadow-primary/25 hover:scale-[0.97] active:scale-95">
            <span className="relative z-10">Book Repair</span>
            <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </button>

          {/* Mobile toggle */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="md:hidden p-2 rounded-lg text-zinc-700 hover:bg-surface-container transition-colors"
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined">
              {menuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </nav>

      {/* ── Mobile Menu ── */}
      <div
        className={`md:hidden glass border-t border-outline-variant overflow-hidden transition-all duration-300 ${
          menuOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 py-4 flex flex-col gap-1">
          {NAV_LINKS.map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase()}`}
              onClick={() => setMenuOpen(false)}
              className="py-3 text-zinc-700 font-medium uppercase tracking-wider text-sm border-b border-outline-variant last:border-0 hover:text-primary transition-colors"
            >
              {item}
            </Link>
          ))}
          <button className="mt-3 w-full bg-primary text-white py-3 rounded-xl font-bold uppercase tracking-wide text-sm">
            Book Repair
          </button>
        </div>
      </div>
    </header>
  );
}
