"use client";

import { useEffect } from "react";
import { useSavedStore } from "@/store/saved-store";
import { useAuth } from "@/components/providers/AuthProvider";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  addSavedTour,
  getSavedTourSlugs,
  removeSavedTour,
} from "@/lib/supabase/data";
import { toast } from "@/components/molecules/Toaster";

const supabase = createSupabaseBrowserClient();

/**
 * DB-backed saved tours. The signed-in user's saves live in the
 * `saved_tours` table; this hook hydrates the in-memory cache on login and
 * persists every toggle. Saves follow the user across devices.
 */
export function useSavedTours() {
  const { user } = useAuth();
  const savedSlugs = useSavedStore((s) => s.savedSlugs);
  const setSavedSlugs = useSavedStore((s) => s.setSavedSlugs);

  // Hydrate from the database whenever the signed-in user changes.
  useEffect(() => {
    let active = true;
    if (!user) {
      setSavedSlugs([]);
      return;
    }
    void getSavedTourSlugs(supabase, user.id).then((slugs) => {
      if (active) setSavedSlugs(slugs);
    });
    return () => {
      active = false;
    };
  }, [user, setSavedSlugs]);

  const isSaved = (slug: string) => savedSlugs.includes(slug);

  const toggleSaved = async (slug: string) => {
    if (!user) {
      toast.error("Sign in to save tours", "Create a free account to build your itinerary.");
      return;
    }

    const exists = savedSlugs.includes(slug);
    // Optimistic update.
    setSavedSlugs(
      exists ? savedSlugs.filter((s) => s !== slug) : [...savedSlugs, slug],
    );

    try {
      if (exists) {
        await removeSavedTour(supabase, user.id, slug);
      } else {
        await addSavedTour(supabase, user.id, slug);
        toast.success("Saved to your itinerary");
      }
    } catch (e) {
      // Revert on failure.
      setSavedSlugs(
        exists ? [...savedSlugs, slug] : savedSlugs.filter((s) => s !== slug),
      );
      toast.error("Couldn't update saved tours", (e as Error).message);
    }
  };

  return { savedSlugs, isSaved, toggleSaved };
}
