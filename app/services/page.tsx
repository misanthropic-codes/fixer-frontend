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
      <main className="pt-24 pb-20 bg-surface">
        {/* Page Hero */}
        <section className="relative px-6 py-16 md:py-24 text-center overflow-hidden">
          <div className="absolute inset-0 z-0">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full bg-primary/5 blur-[120px] rounded-full" />
          </div>
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <span className="font-label text-xs uppercase tracking-[0.3em] font-black text-primary mb-6 inline-block">
              Full Catalog
            </span>
            <h1 className="font-headline text-5xl md:text-7xl leading-tight tracking-tight text-on-surface mb-8">
              Certified repairs for <span className="italic">every</span> modern appliance.
            </h1>
            <p className="text-xl text-on-surface-variant leading-relaxed max-w-2xl mx-auto opacity-90">
              Licensed technicians factory-trained to restore your home&apos;s comfort within hours, not days. Fully insured and background checked.
            </p>
          </div>
        </section>

        {/* Detailed Grid */}
        <section className="container mx-auto px-6 md:px-10 max-w-screen-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {SERVICES.map((s, i) => (
              <div 
                key={s.id} 
                className="group relative flex flex-col sm:flex-row bg-white rounded-[2rem] overflow-hidden border border-outline shadow-sm hover:shadow-xl hover:shadow-black/5 transition-all duration-500 hover:-translate-y-1"
              >
                {/* Image Side */}
                <div className="relative w-full sm:w-2/5 aspect-[4/3] sm:aspect-auto">
                  <Image 
                    src={s.image} 
                    alt={s.name} 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-black/50 via-transparent to-transparent opacity-40" />
                </div>
                
                {/* Content Side */}
                <div className="w-full sm:w-3/5 p-8 lg:p-10 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-primary font-bold">
                        <span className="material-symbols-outlined icon-filled">{s.icon}</span>
                        <span className="font-label text-[10px] uppercase tracking-wider">{s.name}</span>
                      </div>
                      <span className="text-sm font-black text-on-surface/60">From {s.startingPrice}</span>
                    </div>
                    
                    <h2 className="font-headline text-3xl mb-4 text-on-surface leading-tight hover:text-primary transition-colors cursor-pointer">
                       <Link href={`/services/${s.slug}`}>{s.title}</Link>
                    </h2>
                    
                    <ul className="space-y-2 mb-8">
                      {s.features.slice(0, 3).map((f) => (
                        <li key={f} className="flex items-center gap-2 text-sm text-on-surface-variant font-medium">
                          <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => openBooking(s.id)}
                      className="flex-1 bg-primary text-on-primary py-3.5 rounded-xl font-bold uppercase tracking-wide text-xs shadow-md shadow-primary/20 hover:shadow-lg transition-all transform active:scale-95"
                    >
                      Book Now
                    </button>
                    <Link 
                      href={`/services/${s.slug}`}
                      className="flex-1 border-2 border-outline text-on-surface py-3.5 rounded-xl font-bold uppercase tracking-wide text-xs text-center hover:bg-surface-container transition-all transform active:scale-95"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Global Trust Banner */}
        <section className="container mx-auto px-6 md:px-10 max-w-screen-xl mt-32 text-center">
           <div className="bg-primary/5 border border-primary/10 rounded-[3rem] p-12 md:p-20 relative overflow-hidden">
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-primary/10 blur-[80px] rounded-full pointer-events-none" />
               <h2 className="font-headline text-4xl mb-6 text-on-surface">Can&apos;t find your appliance?</h2>
               <p className="text-lg text-on-surface-variant mb-10 max-w-xl mx-auto opacity-80">
                  We specialize in almost all luxury and standard household brands. Chat with an expert to see if we coverage your specific model.
               </p>
               <button 
                onClick={() => openBooking()}
                className="inline-flex items-center gap-2 border-2 border-primary text-primary px-10 h-14 rounded-xl font-extra-bold uppercase tracking-widest hover:bg-primary hover:text-on-primary transition-all duration-300"
               >
                  <span className="material-symbols-outlined">support_agent</span>
                  Request Special Assistance
               </button>
           </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
