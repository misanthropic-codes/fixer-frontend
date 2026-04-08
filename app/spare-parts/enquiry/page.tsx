"use client";

import { useSearchParams } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import SparePartsEnquiryForm from "@/app/components/SparePartsEnquiryForm";
import { getSparePartById } from "@/app/lib/spareParts";

export default function SparePartsEnquiryPage() {
  const searchParams = useSearchParams();
  const selectedPartId = searchParams.get("part") ?? "";
  const selectedPart = getSparePartById(selectedPartId);

  return (
    <>
      <Navbar />
      <main className="pt-14 md:pt-20 pb-20 bg-surface min-h-screen">
        <section className="container mx-auto px-6 md:px-10 max-w-screen-xl pt-8 md:pt-14">
          <div className="max-w-3xl mx-auto bg-white border border-outline rounded-3xl p-6 md:p-10 shadow-xl shadow-black/5">
            <p className="text-[10px] uppercase tracking-[0.24em] font-black text-primary">
              Quick Buy / Enquiry
            </p>
            <h1 className="mt-3 font-headline text-3xl md:text-5xl text-on-surface tracking-tight">
              Request Spare Parts
            </h1>
            <p className="mt-3 text-sm md:text-base text-on-surface-variant">
              {selectedPart
                ? `Auto-selected: ${selectedPart.name}. You can add more parts in the same enquiry before submitting.`
                : "Select one or more parts and submit your enquiry. Our team will confirm availability and schedule delivery/service."}
            </p>

            <div className="mt-8">
              <SparePartsEnquiryForm
                initialPartId={selectedPartId || undefined}
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
