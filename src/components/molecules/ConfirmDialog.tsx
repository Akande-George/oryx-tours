"use client";

import { useState } from "react";
import { create } from "zustand";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/atoms";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type ConfirmTone = "default" | "destructive";

type ConfirmRequest = {
  id: string;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: ConfirmTone;
  resolve: (ok: boolean) => void;
};

type ConfirmState = {
  pending: ConfirmRequest | null;
  open: (req: Omit<ConfirmRequest, "id" | "resolve">) => Promise<boolean>;
  resolve: (ok: boolean) => void;
};

const useConfirmStore = create<ConfirmState>((set, get) => ({
  pending: null,
  open: (req) =>
    new Promise<boolean>((resolve) => {
      const id = crypto.randomUUID();
      set({ pending: { ...req, id, resolve } });
    }),
  resolve: (ok) => {
    const current = get().pending;
    if (current) {
      current.resolve(ok);
      set({ pending: null });
    }
  },
}));

export const confirmAction = (
  args: Omit<ConfirmRequest, "id" | "resolve">,
): Promise<boolean> => useConfirmStore.getState().open(args);

export function ConfirmDialog() {
  const pending = useConfirmStore((s) => s.pending);
  const resolve = useConfirmStore((s) => s.resolve);
  const [submitting, setSubmitting] = useState(false);

  const handleConfirm = async () => {
    setSubmitting(true);
    resolve(true);
    setSubmitting(false);
  };

  const tone = pending?.tone ?? "default";

  return (
    <Dialog
      open={!!pending}
      onOpenChange={(open) => {
        if (!open && pending) resolve(false);
      }}
    >
      <DialogContent className="w-[min(440px,calc(100vw-2rem))] !max-w-[min(440px,calc(100vw-2rem))]">
        <DialogHeader>
          <div className="flex items-start gap-3">
            {tone === "destructive" ? (
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                <AlertTriangle className="h-4 w-4" />
              </span>
            ) : null}
            <div className="space-y-1">
              <DialogTitle>{pending?.title ?? "Are you sure?"}</DialogTitle>
              {pending?.description ? (
                <DialogDescription>{pending.description}</DialogDescription>
              ) : null}
            </div>
          </div>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="ghost"
            onClick={() => resolve(false)}
            className="rounded-full"
          >
            {pending?.cancelLabel ?? "Cancel"}
          </Button>
          <Button
            type="button"
            variant={tone === "destructive" ? "destructive" : "default"}
            onClick={handleConfirm}
            disabled={submitting}
            className="rounded-full"
          >
            {pending?.confirmLabel ?? "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
