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
  stops: string[];
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
  setStop: (index: number, value: string) => void;
  addStop: () => void;
  removeStop: (index: number) => void;
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
  stops: [""] as string[],
};

const MAX_STOPS = 6;

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
      if (index < 0 || index >= state.stops.length) return state;
      const next = [...state.stops];
      next[index] = value;
      return { stops: next };
    }),
  addStop: () =>
    set((state) =>
      state.stops.length >= MAX_STOPS
        ? state
        : { stops: [...state.stops, ""] },
    ),
  removeStop: (index) =>
    set((state) => {
      if (state.stops.length <= 1) return state;
      if (index < 0 || index >= state.stops.length) return state;
      return { stops: state.stops.filter((_, i) => i !== index) };
    }),
  reset: () => set(initialState),
}));
