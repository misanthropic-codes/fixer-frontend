"use client";

import Link from "next/link";
import Image from "next/image";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { SPARE_PARTS } from "@/app/lib/spareParts";

export default function SparePartsPage() {
  return (
    <>
      <Navbar />
      <main className="pt-14 md:pt-20 pb-14 bg-surface min-h-screen">
        <section className="px-6 pt-4 md:pt-14 pb-8 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="font-headline text-5xl md:text-7xl leading-tight tracking-tight text-on-surface mb-4">
              Genuine <span className="italic text-primary">Spare</span> Parts
            </h1>
            <p className="text-[10px] md:text-xs text-on-surface-variant font-black opacity-70 tracking-[0.25em] uppercase">
              Discover OEM-ready components with verified compatibility
            </p>
          </div>
        </section>

        <section className="container mx-auto px-4 sm:px-6 md:px-10 max-w-screen-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {SPARE_PARTS.map((part) => (
              <article
                key={part.id}
                className="group bg-white rounded-3xl border border-outline overflow-hidden shadow-sm hover:shadow-xl hover:shadow-zinc-200/40 transition-all duration-400"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={part.image}
                    alt={part.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                  <div className="absolute left-4 right-4 bottom-4 flex items-end justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-white/80 font-black">
                        {part.category}
                      </p>
                      <p className="text-white font-headline text-xl md:text-2xl mt-1">
                        {part.name}
                      </p>
                    </div>
                    <p className="text-white font-black text-xl">
                      {part.price}
                    </p>
                  </div>
                </div>

                <div className="p-5 md:p-6">
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    {part.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {part.highlights.slice(0, 2).map((item) => (
                      <span
                        key={item}
                        className="text-[10px] uppercase tracking-wider px-3 py-1 rounded-full bg-primary/10 text-primary font-black"
                      >
                        {item}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <Link
                      href={`/spare-parts/${part.slug}`}
                      className="h-12 rounded-xl border-2 border-outline flex items-center justify-center text-sm font-black uppercase tracking-wider text-on-surface hover:bg-surface-container"
                    >
                      Details
                    </Link>
                    <Link
                      href={`/spare-parts/enquiry?part=${part.id}`}
                      className="h-12 rounded-xl bg-primary text-on-primary flex items-center justify-center text-sm font-black uppercase tracking-wider shadow-lg shadow-primary/20 hover:scale-[0.98] transition-transform"
                    >
                      Quick Buy
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
