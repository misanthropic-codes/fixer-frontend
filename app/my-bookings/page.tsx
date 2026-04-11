"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { useAuth } from "@/app/context/AuthContext";

export default function MyBookingsPage() {
  const { user, token, loading: authLoading } = useAuth();
  const searchParams = useSearchParams();
  const showSuccess = searchParams.get("success") === "true";
  
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (token) {
      fetchOrders();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [token, authLoading]);

  const fetchOrders = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/v1/user/part-orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      } else {
        setError("Failed to fetch your orders.");
      }
    } catch (err) {
      setError("Network error. Could not load bookings.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="pt-14 md:pt-20 pb-14 bg-surface min-h-screen">
        <section className="container mx-auto px-6 md:px-10 max-w-7xl pt-8 md:pt-14">
          {showSuccess && (
            <div className="mb-8 p-6 rounded-3xl bg-primary/10 border border-primary/20 flex items-center gap-4 text-primary animate-in fade-in slide-in-from-top-4 duration-500">
              <span className="material-symbols-outlined text-3xl">check_circle</span>
              <div>
                <h3 className="font-bold text-lg">Order Received!</h3>
                <p className="text-sm opacity-90">Your spare part enquiry has been submitted successfully. Our team will contact you shortly.</p>
              </div>
            </div>
          )}

          <h1 className="font-headline text-4xl md:text-6xl text-on-surface">
            My Bookings
          </h1>
          <p className="mt-3 text-sm md:text-base text-on-surface-variant">
            Track your spare part enquiries and service requests here.
          </p>

          {!token && !authLoading ? (
            <div className="mt-8 rounded-3xl border border-outline bg-white p-12 text-center">
              <span className="material-symbols-outlined text-5xl text-on-surface-variant/40">lock</span>
              <p className="mt-4 text-on-surface text-lg font-bold">Authentication Required</p>
              <p className="mt-2 text-sm text-on-surface-variant max-w-md mx-auto">Please login to view your order history and tracking details.</p>
              <a href="/login" className="mt-8 inline-flex h-12 px-8 bg-primary text-on-primary rounded-xl items-center font-bold uppercase tracking-wider shadow-lg shadow-primary/20 hover:scale-95 transition-transform">
                Login Now
              </a>
            </div>
          ) : loading ? (
            <div className="mt-12 flex flex-col items-center justify-center py-20">
               <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
               <p className="mt-4 text-on-surface-variant font-medium">Fetching your records...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="mt-8 rounded-3xl border border-outline bg-white p-10 text-center">
              <span className="material-symbols-outlined text-5xl text-on-surface-variant/40">
                event_busy
              </span>
              <p className="mt-4 text-on-surface text-lg font-bold">
                No orders yet
              </p>
              <p className="mt-2 text-sm text-on-surface-variant">
                Your submitted spare part requests will appear here once you place them.
              </p>
            </div>
          ) : (
            <div className="mt-8 space-y-6">
              {orders.map((order) => (
                <article
                  key={order._id}
                  className="rounded-3xl border border-outline bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="bg-surface-container-low px-6 py-4 flex flex-col md:flex-row md:items-center justify-between border-b border-outline gap-3">
                     <div className="flex items-center gap-4">
                        <div className="px-3 py-1 rounded-lg bg-white border border-outline text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
                           ID: {order._id.slice(-8).toUpperCase()}
                        </div>
                        <p className="text-xs text-on-surface-variant font-medium">
                           Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                     </div>
                     <div className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${order.status === 'PENDING' ? 'bg-amber-500' : 'bg-green-500'}`}></span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-on-surface">
                           {order.status}
                        </span>
                     </div>
                  </div>

                  <div className="p-6 md:p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div>
                          <p className="text-[10px] uppercase tracking-[0.2em] font-black text-on-surface-variant mb-4 flex items-center gap-2">
                             <span className="material-symbols-outlined text-lg">local_shipping</span>
                             Shipping To
                          </p>
                          <h3 className="font-bold text-on-surface">{order.contactData.name}</h3>
                          <p className="text-sm text-on-surface-variant mt-1 leading-relaxed">
                             {order.contactData.address}<br />
                             Phone: {order.contactData.phone}
                          </p>
                       </div>

                       <div>
                          <p className="text-[10px] uppercase tracking-[0.2em] font-black text-on-surface-variant mb-4 flex items-center gap-2">
                             <span className="material-symbols-outlined text-lg">inventory_2</span>
                             Items Summary
                          </p>
                          <div className="space-y-3">
                             {order.items.map((item: any, idx: number) => (
                                <div key={idx} className="flex justify-between items-center text-sm">
                                   <div className="flex items-center gap-3">
                                      <span className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center font-bold text-xs">
                                         {item.quantity}x
                                      </span>
                                      <span className="text-on-surface font-medium">
                                         {item.partId?.name || "Genuine Component"}
                                      </span>
                                   </div>
                                   <span className="font-bold text-primary">{item.partId?.price || "TBD"}</span>
                                </div>
                             ))}
                          </div>
                          
                          {order.courierTracking && (
                            <div className="mt-6 p-4 rounded-2xl bg-primary/5 border border-primary/10">
                               <p className="text-[10px] font-black uppercase tracking-widest text-primary">Live Tracking</p>
                               <p className="text-sm mt-1 font-bold">{order.courierTracking.courierName}: {order.courierTracking.trackingNumber}</p>
                            </div>
                          )}
                       </div>
                    </div>
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
