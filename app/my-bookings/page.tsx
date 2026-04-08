"use client";

import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { useBooking } from "@/app/context/BookingContext";
import { getSparePartById } from "@/app/lib/spareParts";

export default function MyBookingsPage() {
  const { partInquiries } = useBooking();

  return (
    <>
      <Navbar />
      <main className="pt-14 md:pt-20 pb-14 bg-surface min-h-screen">
        <section className="container mx-auto px-6 md:px-10 max-w-7xl pt-8 md:pt-14">
          <h1 className="font-headline text-4xl md:text-6xl text-on-surface">
            My Bookings
          </h1>
          <p className="mt-3 text-sm md:text-base text-on-surface-variant">
            Spare part enquiries submitted by you will appear here.
          </p>

          {partInquiries.length === 0 ? (
            <div className="mt-8 rounded-3xl border border-outline bg-white p-10 text-center">
              <span className="material-symbols-outlined text-5xl text-on-surface-variant/40">
                event_busy
              </span>
              <p className="mt-4 text-on-surface text-lg font-bold">
                No enquiries yet
              </p>
              <p className="mt-2 text-sm text-on-surface-variant">
                Submit a spare part request from Quick Buy and track it here.
              </p>
            </div>
          ) : (
            <div className="mt-8 space-y-4">
              {partInquiries.map((inquiry) => (
                <article
                  key={inquiry.id}
                  className="rounded-3xl border border-outline bg-white p-6 md:p-7 shadow-sm"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] font-black text-primary">
                        Request #{inquiry.id}
                      </p>
                      <h2 className="mt-2 text-xl font-headline text-on-surface">
                        {inquiry.customerName}
                      </h2>
                      <p className="text-sm text-on-surface-variant mt-1">
                        {inquiry.phone} • {inquiry.email}
                      </p>
                    </div>
                    <span className="inline-flex items-center justify-center h-10 px-4 rounded-full bg-amber-100 text-amber-800 text-xs font-black uppercase tracking-wider">
                      {inquiry.status}
                    </span>
                  </div>

                  <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="rounded-xl bg-surface-container-low p-4 border border-outline">
                      <p className="text-[10px] uppercase tracking-[0.2em] font-black text-on-surface-variant">
                        Preferred Slot
                      </p>
                      <p className="mt-2 text-on-surface font-medium">
                        {inquiry.preferredDate} at {inquiry.preferredTime}
                      </p>
                    </div>
                    <div className="rounded-xl bg-surface-container-low p-4 border border-outline">
                      <p className="text-[10px] uppercase tracking-[0.2em] font-black text-on-surface-variant">
                        Address
                      </p>
                      <p className="mt-2 text-on-surface font-medium">
                        {inquiry.address}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 rounded-xl bg-surface-container-low p-4 border border-outline">
                    <p className="text-[10px] uppercase tracking-[0.2em] font-black text-on-surface-variant">
                      Requested Parts
                    </p>
                    <ul className="mt-3 space-y-2">
                      {inquiry.items.map((item, index) => {
                        const matched = getSparePartById(item.partId);
                        return (
                          <li
                            key={`${item.partId}-${index}`}
                            className="text-sm text-on-surface-variant"
                          >
                            {matched?.name ?? "Unknown part"} x {item.quantity}
                          </li>
                        );
                      })}
                    </ul>
                    {inquiry.notes ? (
                      <p className="mt-4 text-xs text-on-surface-variant border-t border-outline pt-3">
                        Notes: {inquiry.notes}
                      </p>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
