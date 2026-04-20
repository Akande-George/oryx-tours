import { create } from "zustand";

type SavedState = {
  savedSlugs: string[];
  toggleSaved: (slug: string) => void;
  isSaved: (slug: string) => boolean;
};

export const useSavedStore = create<SavedState>((set, get) => ({
  savedSlugs: [],
  toggleSaved: (slug) =>
    set((state) => {
      const exists = state.savedSlugs.includes(slug);
      return {
        savedSlugs: exists
          ? state.savedSlugs.filter((item) => item !== slug)
          : [...state.savedSlugs, slug],
      };
    }),
  isSaved: (slug) => get().savedSlugs.includes(slug),
}));
