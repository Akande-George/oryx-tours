import { create } from "zustand";
import type { AirportDirection, DurationMode, ServiceType } from "@/types";

type BookingState = {
  serviceType: ServiceType;
  step: number;
  travelDate: string;
  guests: number;
  pickup: string;
  dropoff: string;
  vehicleId: string | null;
  durationMode: DurationMode;
  extraHours: number;
  notes: string;
  promoCode: string;
  airportDirection: AirportDirection;
  stops: [string, string, string];
  setServiceType: (serviceType: ServiceType) => void;
  setStep: (step: number) => void;
  nextStep: () => void;
  previousStep: () => void;
  setTravelDate: (date: string) => void;
  setGuests: (guests: number) => void;
  setPickup: (pickup: string) => void;
  setDropoff: (dropoff: string) => void;
  setVehicleId: (id: string | null) => void;
  setDurationMode: (mode: DurationMode) => void;
  setExtraHours: (hours: number) => void;
  setNotes: (notes: string) => void;
  setPromoCode: (code: string) => void;
  setAirportDirection: (direction: AirportDirection) => void;
  setStop: (index: 0 | 1 | 2, value: string) => void;
  reset: () => void;
};

const initialState = {
  serviceType: "airport" as ServiceType,
  step: 1,
  travelDate: "",
  guests: 2,
  pickup: "",
  dropoff: "",
  vehicleId: null,
  durationMode: "full-day" as DurationMode,
  extraHours: 1,
  notes: "",
  promoCode: "",
  airportDirection: "pickup" as AirportDirection,
  stops: ["", "", ""] as [string, string, string],
};

export const useBookingStore = create<BookingState>((set) => ({
  ...initialState,
  setServiceType: (serviceType) => set({ serviceType }),
  setStep: (step) => set({ step }),
  nextStep: () => set((state) => ({ step: Math.min(state.step + 1, 3) })),
  previousStep: () => set((state) => ({ step: Math.max(state.step - 1, 1) })),
  setTravelDate: (travelDate) => set({ travelDate }),
  setGuests: (guests) => set({ guests }),
  setPickup: (pickup) => set({ pickup }),
  setDropoff: (dropoff) => set({ dropoff }),
  setVehicleId: (vehicleId) => set({ vehicleId }),
  setDurationMode: (durationMode) => set({ durationMode }),
  setExtraHours: (extraHours) => set({ extraHours }),
  setNotes: (notes) => set({ notes }),
  setPromoCode: (promoCode) => set({ promoCode }),
  setAirportDirection: (airportDirection) => set({ airportDirection }),
  setStop: (index, value) =>
    set((state) => {
      const next = [...state.stops] as [string, string, string];
      next[index] = value;
      return { stops: next };
    }),
  reset: () => set(initialState),
}));
