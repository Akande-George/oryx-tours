import { create } from "zustand";

export type SearchFilters = {
  query: string;
  category: string;
  priceRange: [number, number];
  duration: string;
  rating: number;
  sort: "recommended" | "price-asc" | "price-desc" | "rating";
};

type SearchState = {
  filters: SearchFilters;
  setQuery: (query: string) => void;
  setCategory: (category: string) => void;
  setPriceRange: (range: [number, number]) => void;
  setDuration: (duration: string | null) => void;
  setRating: (rating: number) => void;
  setSort: (sort: SearchFilters["sort"]) => void;
  reset: () => void;
};

const initialFilters: SearchFilters = {
  query: "",
  category: "All",
  priceRange: [500, 3000],
  duration: "Any",
  rating: 4,
  sort: "recommended",
};

export const useSearchStore = create<SearchState>((set) => ({
  filters: initialFilters,
  setQuery: (query) =>
    set((state) => ({ filters: { ...state.filters, query } })),
  setCategory: (category) =>
    set((state) => ({ filters: { ...state.filters, category } })),
  setPriceRange: (priceRange) =>
    set((state) => ({ filters: { ...state.filters, priceRange } })),
  setDuration: (duration) =>
    set((state) => ({
      filters: { ...state.filters, duration: duration ?? "Any" },
    })),
  setRating: (rating) =>
    set((state) => ({ filters: { ...state.filters, rating } })),
  setSort: (sort) => set((state) => ({ filters: { ...state.filters, sort } })),
  reset: () => set({ filters: initialFilters }),
}));
