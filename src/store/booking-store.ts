import { create } from "zustand";

type BookingState = {
  step: number;
  travelDate: string;
  guests: number;
  notes: string;
  promoCode: string;
  setStep: (step: number) => void;
  nextStep: () => void;
  previousStep: () => void;
  setTravelDate: (date: string) => void;
  setGuests: (guests: number) => void;
  setNotes: (notes: string) => void;
  setPromoCode: (code: string) => void;
};

export const useBookingStore = create<BookingState>((set) => ({
  step: 1,
  travelDate: "",
  guests: 2,
  notes: "",
  promoCode: "",
  setStep: (step) => set({ step }),
  nextStep: () => set((state) => ({ step: Math.min(state.step + 1, 3) })),
  previousStep: () => set((state) => ({ step: Math.max(state.step - 1, 1) })),
  setTravelDate: (travelDate) => set({ travelDate }),
  setGuests: (guests) => set({ guests }),
  setNotes: (notes) => set({ notes }),
  setPromoCode: (promoCode) => set({ promoCode }),
}));
