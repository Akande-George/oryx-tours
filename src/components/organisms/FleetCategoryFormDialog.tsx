"use client";

import { useEffect, useState } from "react";
import { Button, Input } from "@/components/atoms";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { FleetCategoryRecord } from "@/types";

const empty = (): FleetCategoryRecord => ({
  id: crypto.randomUUID(),
  title: "",
  description: "",
  order: 0,
});

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: FleetCategoryRecord | null;
  onSubmit: (record: FleetCategoryRecord) => void;
};

export function FleetCategoryFormDialog({
  open,
  onOpenChange,
  initial,
  onSubmit,
}: Props) {
  const mode = initial ? "edit" : "add";
  const [form, setForm] = useState<FleetCategoryRecord>(
    () => initial ?? empty(),
  );
  const [errors, setErrors] = useState<
    Partial<Record<keyof FleetCategoryRecord, string>>
  >({});

  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm(initial ? { ...initial } : empty());
      setErrors({});
    }
  }, [open, initial]);

  const handleSave = () => {
    const next: typeof errors = {};
    if (!form.title.trim()) next.title = "Title is required";
    if (Object.keys(next).length) {
      setErrors(next);
      return;
    }
    onSubmit({
      ...form,
      title: form.title.trim(),
      description: form.description?.trim(),
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[min(520px,calc(100vw-2rem))] !max-w-[min(520px,calc(100vw-2rem))]">
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? `Edit ${initial?.title}` : "Add fleet category"}
          </DialogTitle>
          <DialogDescription>
            Fleet categories appear as filter pills in /booking and as the
            category dropdown when adding a vehicle.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Title</Label>
            <Input
              value={form.title}
              onChange={(e) =>
                setForm((p) => ({ ...p, title: e.target.value }))
              }
              placeholder="Economy"
            />
            {errors.title ? (
              <p className="text-xs text-destructive">{errors.title}</p>
            ) : null}
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Description (optional)</Label>
            <Textarea
              value={form.description ?? ""}
              onChange={(e) =>
                setForm((p) => ({ ...p, description: e.target.value }))
              }
              placeholder="What riders should expect from this category."
              className="min-h-[70px]"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Display order</Label>
            <Input
              type="number"
              value={form.order ?? 0}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  order: Number(e.target.value) || 0,
                }))
              }
            />
            <p className="text-xs text-muted-foreground">
              Lower numbers appear first.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="rounded-full"
          >
            Cancel
          </Button>
          <Button type="button" onClick={handleSave} className="rounded-full">
            {mode === "edit" ? "Save changes" : "Create category"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
