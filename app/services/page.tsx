"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { SERVICES } from "@/app/lib/services";
import { useBooking } from "@/app/context/BookingContext";

export default function ServicesPage() {
  const { openBooking } = useBooking();

  return (
    <>
      <Navbar />
      <main className="pt-14 md:pt-20 pb-12 bg-surface">
        {/* Simple Catalog Header */}
        <section className="px-6 pt-2 md:pt-16 pb-6 md:pb-12 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="font-headline text-5xl md:text-7xl leading-tight tracking-tight text-on-surface mb-4">
              Our <span className="italic text-primary">Master</span> Catalog
            </h1>
            <p className="text-[10px] md:text-xs text-on-surface-variant font-black opacity-70 tracking-[0.25em] uppercase">
              Professional Service for every household appliance
            </p>
          </div>
        </section>

        {/* Detailed Grid */}
        <section className="container mx-auto px-4 sm:px-6 md:px-10 max-w-screen-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SERVICES.map((s, i) => (
              <div
                key={s.id}
                className="group relative flex flex-col sm:flex-row bg-white rounded-2xl md:rounded-[2.5rem] overflow-hidden border border-outline shadow-sm hover:shadow-xl hover:shadow-zinc-200/50 transition-all duration-500"
              >
                {/* Image Side */}
                <div className="relative w-full sm:w-[280px] lg:w-[340px] aspect-square sm:aspect-auto overflow-hidden">
                  <Image
                    src={s.image}
                    alt={s.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent sm:hidden" />

                  {/* Category Chip */}
                  <div className="absolute top-4 left-4">
                    <div className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full shadow-sm border border-white/20">
                      <span className="text-[9px] font-black uppercase tracking-widest text-primary">{s.name}</span>
                    </div>
                  </div>
                </div>

                {/* Content Side */}
                <div className="flex-1 p-6 lg:p-10 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-on-surface-variant font-bold">
                        <span className="material-symbols-outlined text-[20px] text-primary icon-filled">{s.icon}</span>
                        <span className="text-xl font-headline text-on-surface">{s.name} Repair</span>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-60">Starts at</p>
                        <p className="text-lg font-black text-primary">{s.startingPrice}</p>
                      </div>
                    </div>

                    <p className="text-sm text-on-surface-variant mb-6 leading-relaxed opacity-80">
                      {s.description}
                    </p>

                    <ul className="space-y-2 mb-8">
                      {s.features.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-xs text-on-surface-variant font-bold">
                          <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => openBooking(s.id)}
                      className="flex-1 bg-zinc-900 text-white h-12 rounded-xl font-black uppercase tracking-wider text-[10px] shadow-lg shadow-black/10 transition-all hover:bg-primary active:scale-95"
                    >
                      Book Now
                    </button>
                    <Link
                      href={`/services/${s.slug}`}
                      className="w-12 h-12 flex items-center justify-center border-2 border-outline rounded-xl text-on-surface hover:bg-surface-container transition-all active:scale-95"
                    >
                      <span className="material-symbols-outlined">arrow_forward</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Global Trust Banner */}
        <section className="container mx-auto px-6 md:px-10 max-w-screen-xl mt-16 md:mt-24 text-center">
          <div className="bg-primary-container border border-primary/10 rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-14 relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-primary/10 blur-[80px] rounded-full pointer-events-none" />
            <h2 className="font-headline text-4xl mb-6 text-on-primary-container">Can&apos;t find your appliance?</h2>
            <p className="text-lg text-on-primary-container/70 mb-10 max-w-xl mx-auto">
              We specialize in almost all luxury and standard household brands across India. Chat with an expert to see if we cover your specific model.
            </p>
            <button
              onClick={() => openBooking()}
              className="inline-flex items-center gap-3 bg-on-primary-container text-white px-10 h-14 rounded-xl font-extra-bold uppercase tracking-widest hover:scale-[0.98] transition-all"
            >
              <span className="material-symbols-outlined icon-filled">support_agent</span>
              Request Assistance
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
