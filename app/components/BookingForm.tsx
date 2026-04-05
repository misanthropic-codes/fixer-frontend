"use client";

import React, { useState, useEffect } from "react";
import { SERVICES } from "@/app/lib/services";

interface BookingFormProps {
  initialService?: string;
  onSuccess?: () => void;
  className?: string;
}

export default function BookingForm({ initialService, onSuccess, className = "" }: BookingFormProps) {
  const [formData, setFormData] = useState({
    serviceId: "",
    name: "",
    phone: "",
    zip: "",
    description: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (initialService) {
      setFormData((prev) => ({ ...prev, serviceId: initialService }));
    }
  }, [initialService]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSuccess(true);
    if (onSuccess) {
      setTimeout(onSuccess, 2000);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-primary text-4xl icon-filled">check_circle</span>
        </div>
        <h3 className="font-headline text-2xl text-on-surface mb-2">Request Received!</h3>
        <p className="text-on-surface-variant max-w-xs mx-auto">
          A master technician will call you within <span className="font-bold text-on-surface">30 minutes</span> to confirm your slot.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-5 ${className}`}>
      {/* Service Selection */}
      <div className="space-y-2">
        <label htmlFor="service" className="block font-label text-[10px] uppercase tracking-widest font-black text-on-surface-variant">
          Appliance Category
        </label>
        <div className="relative group">
          <select
            id="service"
            required
            value={formData.serviceId}
            onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
            className="w-full h-13 bg-surface-container-low border-2 border-outline rounded-xl px-4 appearance-none outline-none focus:border-primary transition-all duration-200 text-on-surface font-medium"
          >
            <option value="" disabled>Select a service...</option>
            {SERVICES.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
          <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">
            expand_more
          </span>
        </div>
      </div>

      {/* Grid for Name & Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <label htmlFor="name" className="block font-label text-[10px] uppercase tracking-widest font-black text-on-surface-variant">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            required
            placeholder="John Doe"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full h-13 bg-surface-container-low border-2 border-outline rounded-xl px-4 outline-none focus:border-primary transition-all duration-200 text-on-surface"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="phone" className="block font-label text-[10px] uppercase tracking-widest font-black text-on-surface-variant">
            Phone Number
          </label>
          <input
            id="phone"
            type="tel"
            required
            placeholder="(555) 000-0000"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full h-13 bg-surface-container-low border-2 border-outline rounded-xl px-4 outline-none focus:border-primary transition-all duration-200 text-on-surface"
          />
        </div>
      </div>

      {/* ZIP Code */}
      <div className="space-y-2">
        <label htmlFor="zip" className="block font-label text-[10px] uppercase tracking-widest font-black text-on-surface-variant">
          ZIP Code
        </label>
        <input
          id="zip"
          type="text"
          required
          placeholder="10001"
          value={formData.zip}
          onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
          className="w-full h-13 bg-surface-container-low border-2 border-outline rounded-xl px-4 outline-none focus:border-primary transition-all duration-200 text-on-surface lg:max-w-[200px]"
        />
      </div>

      {/* Issue Description */}
      <div className="space-y-2">
        <label htmlFor="desc" className="block font-label text-[10px] uppercase tracking-widest font-black text-on-surface-variant">
          Problem Description
        </label>
        <textarea
          id="desc"
          rows={3}
          placeholder="E.g. Refrigerator is not cooling properly..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full bg-surface-container-low border-2 border-outline rounded-xl p-4 outline-none focus:border-primary transition-all duration-200 text-on-surface resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-14 bg-primary text-on-primary rounded-xl font-bold uppercase tracking-wider shadow-lg shadow-primary/20 hover:shadow-xl hover:scale-[0.98] active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:scale-100"
      >
        {isSubmitting ? (
          <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <>
            <span className="material-symbols-outlined icon-filled">bolt</span>
            Book Premium Service
          </>
        )}
      </button>
      
      <p className="text-[10px] text-center text-on-surface-variant opacity-60">
        By booking, you agree to our terms of service and private policy. 
        A diagnostic fee applies if repair is not performed.
      </p>
    </form>
  );
}
