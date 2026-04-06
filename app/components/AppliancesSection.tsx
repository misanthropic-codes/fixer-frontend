"use client";

import Image from "next/image";
import Link from "next/link";
import { SERVICES } from "@/app/lib/services";
import { useBooking } from "@/app/context/BookingContext";

export default function AppliancesSection() {
  const { openBooking } = useBooking();

  return (
    <section id="catalog" className="pt-8 pb-10 md:py-32 bg-surface">
      <div className="container mx-auto px-6 md:px-10 max-w-screen-2xl">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-20">
          <p className="font-label text-[10px] md:text-xs uppercase tracking-[0.28em] font-bold text-on-surface-variant mb-4">
            What we fix
          </p>
          <h2 className="font-headline text-3xl md:text-6xl tracking-tight text-on-surface leading-tight">
            Expert Service for{" "}
            <span className="italic text-primary">Every</span> Appliance
          </h2>
          <div className="h-0.5 w-12 md:w-16 bg-primary mx-auto mt-6 md:mt-8 rounded-full" />
        </div>

        {/* Grid: 2 columns on mobile, 4 on large */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {SERVICES.map(({ id, name, startingPrice, image, slug }) => (
            <div key={id} className="group cursor-pointer active:scale-[0.98] transition-transform duration-200">
              {/* Image Container */}
              <div className="relative aspect-[4/5] rounded-xl md:rounded-2xl overflow-hidden mb-3 md:mb-5 shadow-sm">
                <Image
                  src={image}
                  alt={name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Clickable Overlay to Detail Page */}
                <Link href={`/services/${slug}`} className="absolute inset-0 z-10" aria-label={`View ${name} details`} />

                {/* Overlay Background */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/5 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

                {/* Starting Price & Instant Book */}
                <div className="absolute bottom-3 left-3 md:bottom-5 md:left-5 right-3 md:right-5 flex items-end justify-between z-20">
                  <p className="text-white font-label text-[8px] md:text-[10px] uppercase tracking-[0.2em] font-bold">
                    From {startingPrice}
                  </p>
                  <button 
                    onClick={(e) => {
                       e.preventDefault();
                       e.stopPropagation();
                       openBooking(id);
                    }}
                    className="w-7 h-7 md:w-9 md:h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 transition-all duration-300 hover:bg-primary hover:border-primary hover:scale-110 active:scale-95"
                  >
                    <span className="material-symbols-outlined text-white text-xs md:text-base icon-filled">
                      calendar_add_on
                    </span>
                  </button>
                </div>
              </div>

              {/* Label */}
              <Link href={`/services/${slug}`} className="flex justify-between items-center px-1 group-hover:text-primary transition-colors duration-300">
                <h3 className="font-headline text-lg md:text-2xl text-on-surface group-hover:text-primary transition-colors duration-300">
                  {name}
                </h3>
                <span className="hidden sm:inline text-[10px] font-bold uppercase tracking-wider text-on-surface-variant group-hover:text-primary transition-colors duration-300">
                  Details →
                </span>
              </Link>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 md:mt-16 text-center">
          <Link 
            href="/services"
            className="inline-flex items-center gap-2 border-2 border-outline text-on-surface px-6 md:px-8 h-11 md:h-13 rounded-xl font-bold text-xs md:text-sm uppercase tracking-wider hover:border-primary hover:text-primary transition-all duration-200 hover:scale-[0.97] active:scale-95"
          >
            <span className="material-symbols-outlined text-lg md:text-xl">grid_view</span>
            View All Services
          </Link>
        </div>
      </div>
    </section>
  );
}
