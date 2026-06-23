"use client";

import { useEffect } from "react";
import { create } from "zustand";
import { CheckCircle2, Info, X, XCircle } from "lucide-react";
import { cn, generateId } from "@/lib/utils";

export type ToastKind = "success" | "error" | "info";

type ToastItem = {
  id: string;
  kind: ToastKind;
  title: string;
  description?: string;
};

type ToastState = {
  toasts: ToastItem[];
  push: (toast: Omit<ToastItem, "id">) => string;
  dismiss: (id: string) => void;
};

const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  push: (toast) => {
    const id = generateId();
    set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }));
    return id;
  },
  dismiss: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

const DURATION_MS = 4000;

export const toast = {
  success: (title: string, description?: string) =>
    useToastStore.getState().push({ kind: "success", title, description }),
  error: (title: string, description?: string) =>
    useToastStore.getState().push({ kind: "error", title, description }),
  info: (title: string, description?: string) =>
    useToastStore.getState().push({ kind: "info", title, description }),
  dismiss: (id: string) => useToastStore.getState().dismiss(id),
};

const kindStyles: Record<ToastKind, string> = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-900",
  error: "border-rose-200 bg-rose-50 text-rose-900",
  info: "border-slate-200 bg-white text-slate-900",
};

const KindIcon = ({ kind }: { kind: ToastKind }) => {
  const cls = "h-4 w-4 shrink-0 mt-0.5";
  if (kind === "success") return <CheckCircle2 className={cn(cls, "text-emerald-600")} />;
  if (kind === "error") return <XCircle className={cn(cls, "text-rose-600")} />;
  return <Info className={cn(cls, "text-slate-500")} />;
};

function ToastCard({ toast }: { toast: ToastItem }) {
  const dismiss = useToastStore((s) => s.dismiss);

  useEffect(() => {
    const t = window.setTimeout(() => dismiss(toast.id), DURATION_MS);
    return () => window.clearTimeout(t);
  }, [toast.id, dismiss]);

  return (
    <div
      role="status"
      className={cn(
        "pointer-events-auto flex w-[320px] items-start gap-3 rounded-xl border bg-white p-3 text-sm shadow-[0_18px_40px_-25px_rgba(60,40,20,0.45)] backdrop-blur",
        kindStyles[toast.kind],
        "animate-in fade-in slide-in-from-right-2",
      )}
    >
      <KindIcon kind={toast.kind} />
      <div className="min-w-0 flex-1 space-y-0.5">
        <p className="font-semibold leading-tight">{toast.title}</p>
        {toast.description ? (
          <p className="text-xs leading-snug opacity-80">
            {toast.description}
          </p>
        ) : null}
      </div>
      <button
        type="button"
        onClick={() => dismiss(toast.id)}
        className="shrink-0 rounded-full p-0.5 opacity-60 hover:opacity-100"
        aria-label="Dismiss"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export function Toaster() {
  const toasts = useToastStore((s) => s.toasts);
  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[100] flex flex-col gap-2">
      {toasts.map((t) => (
        <ToastCard key={t.id} toast={t} />
      ))}
    </div>
  );
}
