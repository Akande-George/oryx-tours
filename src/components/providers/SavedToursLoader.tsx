"use client";

import { useSavedTours } from "@/store/use-saved-tours";

// Mounts once at the app root so the signed-in user's saved tours are loaded
// from Supabase and kept in the shared store - making them available to the
// dashboard and tour pages without each page fetching them itself.
export function SavedToursLoader() {
  useSavedTours();
  return null;
}
