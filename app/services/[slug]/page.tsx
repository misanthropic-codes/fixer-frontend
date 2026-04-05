"use client";

import React, { use } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import BookingForm from "@/app/components/BookingForm";
import { getServiceBySlug } from "@/app/lib/services";
import { useBooking } from "@/app/context/BookingContext";
import { notFound } from "next/navigation";

export default function ServiceDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const service = getServiceBySlug(slug);
  const { openBooking } = useBooking();

  if (!service) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main className="bg-white min-h-screen">
        {/* ── Hero Section ── */}
        <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-32 overflow-hidden">
          {/* Ambient background decoration */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] translate-x-1/4 -translate-y-1/4" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[80px] -translate-x-1/4 translate-y-1/4" />

          <div className="container mx-auto px-6 md:px-10 max-w-screen-2xl flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            {/* Context & Headline */}
            <div className="w-full lg:w-1/2">
              <div className="flex items-center gap-3 mb-6">
                <Link href="/services" className="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1">
                   <span className="material-symbols-outlined text-sm">arrow_back</span>
                   <span className="font-label text-[10px] uppercase tracking-widest font-bold">Back to Catalog</span>
                </Link>
                <span className="w-1 h-1 rounded-full bg-outline-variant" />
                <span className="font-label text-[10px] uppercase tracking-widest font-black text-primary">{service.name}</span>
              </div>
              
              <h1 className="font-headline text-5xl md:text-7xl lg:text-8xl tracking-tighter leading-[0.9] text-on-surface mb-8">
                {service.title.split(' ').map((word, i) => (
                  <span key={i} className={i === service.title.split(' ').length - 1 ? 'italic text-primary' : ''}>
                    {word}{' '}
                  </span>
                ))}
              </h1>
              
              <p className="text-xl text-on-surface-variant max-w-xl leading-relaxed mb-10">
                {service.description}
              </p>

              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => openBooking(service.id)}
                  className="bg-primary text-on-primary px-10 h-14 rounded-xl font-extra-bold uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[0.98] transition-all transform active:scale-95 flex items-center justify-center gap-2"
                >
                   <span className="material-symbols-outlined icon-filled">calendar_month</span>
                   Instant Booking
                </button>
                <div className="flex items-center gap-3 px-6 bg-surface-container rounded-xl border border-outline h-14">
                   <span className="font-label text-xs uppercase tracking-widest opacity-60">Starting at</span>
                   <span className="font-headline text-2xl text-on-surface font-bold">{service.startingPrice}</span>
                </div>
              </div>
            </div>

            {/* Feature Mosaic / Image */}
            <div className="w-full lg:w-1/2 relative">
               <div className="relative rounded-[3rem] overflow-hidden aspect-[4/5] shadow-2xl shadow-black/10">
                  <Image 
                    src={service.image} 
                    alt={service.title} 
                    fill 
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Trust overlay */}
                  <div className="absolute bottom-10 left-10 right-10">
                    <div className="glass p-8 rounded-3xl border border-white/20 shadow-2xl flex items-center gap-5 translate-y-0 hover:-translate-y-2 transition-transform duration-500">
                        <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center flex-shrink-0 text-white shadow-lg">
                           <span className="material-symbols-outlined text-3xl icon-filled">verified</span>
                        </div>
                        <div>
                           <p className="font-bold text-lg text-white mb-1">Master Tech Guaranteed</p>
                           <p className="text-sm text-white/70 uppercase tracking-widest font-label font-bold">120-Point Inspection</p>
                        </div>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </section>

        {/* ── Detailed Benefits ── */}
        <section className="py-24 md:py-32 bg-surface-container-lowest">
           <div className="container mx-auto px-6 md:px-10 max-w-screen-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                 {service.features.map((feature, i) => (
                    <div key={feature} className="space-y-4 group">
                       <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center group-hover:bg-primary transition-colors duration-300">
                          <span className="material-symbols-outlined text-primary group-hover:text-white transition-colors duration-300 icon-filled">stars</span>
                       </div>
                       <h3 className="font-headline text-xl text-on-surface">{feature}</h3>
                       <p className="text-sm text-on-surface-variant leading-relaxed opacity-70">
                          Comprehensive maintenance from industrial-grade components to smart home integration.
                       </p>
                    </div>
                 ))}
              </div>
           </div>
        </section>

        {/* ── Bottom Section: Form ── */}
        <section className="py-24 md:py-32 bg-white relative overflow-hidden">
           <div className="container mx-auto px-6 md:px-10 max-w-screen-xl relative z-10">
              <div className="max-w-5xl mx-auto flex flex-col lg:flex-row items-start gap-20">
                 <div className="lg:w-1/2">
                    <h2 className="font-headline text-4xl md:text-5xl lg:text-7xl tracking-tighter leading-tight text-on-surface mb-8">
                       Book your <br /> {service.name} Repair <br /> in <span className="italic text-primary">seconds.</span>
                    </h2>
                    <p className="text-lg text-on-surface-variant mb-10 max-w-md opacity-80">
                        Fill in your neighborhood details below to get instant dispatch to your location. No hidden fees, no wait times.
                    </p>
                    
                    <div className="space-y-6 pt-10 border-t border-outline">
                       <div className="flex items-center gap-4">
                          <span className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-secondary">
                             <span className="material-symbols-outlined icon-filled">done_all</span>
                          </span>
                          <span className="font-label text-sm uppercase tracking-widest font-black opacity-80">Factory Trained Technicians</span>
                       </div>
                       <div className="flex items-center gap-4">
                          <span className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-secondary">
                             <span className="material-symbols-outlined icon-filled">done_all</span>
                          </span>
                          <span className="font-label text-sm uppercase tracking-widest font-black opacity-80">Genuine OEM Part Library</span>
                       </div>
                    </div>
                 </div>
                 
                 <div className="lg:w-1/2 w-full">
                    <div className="bg-surface-container-low p-10 rounded-[3rem] border border-outline shadow-2xl">
                       <h3 className="font-headline text-2xl text-on-surface mb-8 text-center">Fast Track Dispatch</h3>
                       <BookingForm initialService={service.id} />
                    </div>
                 </div>
              </div>
           </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
