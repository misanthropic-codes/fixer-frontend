"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface BookingContextType {
  isOpen: boolean;
  selectedService: string; // The ID of the service (e.g., 'refrigerator')
  openBooking: (serviceId?: string) => void;
  closeBooking: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("");

  const openBooking = (serviceId?: string) => {
    if (serviceId) {
      setSelectedService(serviceId);
    }
    setIsOpen(true);
  };

  const closeBooking = () => {
    setIsOpen(false);
    // Note: We don't necessarily clear selectedService here to allow for smooth 
    // closing animations where the content might still be visible.
  };

  return (
    <BookingContext.Provider value={{ isOpen, selectedService, openBooking, closeBooking }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
}
