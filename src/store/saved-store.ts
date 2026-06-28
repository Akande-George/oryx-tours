import { create } from "zustand";

type SavedState = {
  savedSlugs: string[];
  setSavedSlugs: (slugs: string[]) => void;
  toggleLocal: (slug: string) => void;
  isSaved: (slug: string) => boolean;
  reset: () => void;
};

// In-memory cache of the signed-in user's saved tour slugs. The source of
// truth is the `saved_tours` table in Supabase - this store is hydrated from
// it on login and kept in sync optimistically by useSavedTours().
export const useSavedStore = create<SavedState>((set, get) => ({
  savedSlugs: [],
  setSavedSlugs: (slugs) => set({ savedSlugs: slugs }),
  toggleLocal: (slug) =>
    set((state) => {
      const exists = state.savedSlugs.includes(slug);
      return {
        savedSlugs: exists
          ? state.savedSlugs.filter((item) => item !== slug)
          : [...state.savedSlugs, slug],
      };
    }),
  isSaved: (slug) => get().savedSlugs.includes(slug),
  reset: () => set({ savedSlugs: [] }),
}));
