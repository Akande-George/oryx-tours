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
import type { Category } from "@/types";

const emptyCategory = (): Category => ({
  id: crypto.randomUUID(),
  title: "",
  description: "",
  order: 0,
});

type CategoryFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialCategory?: Category | null;
  onSubmit: (category: Category) => void;
};

export function CategoryFormDialog({
  open,
  onOpenChange,
  initialCategory,
  onSubmit,
}: CategoryFormDialogProps) {
  const mode = initialCategory ? "edit" : "add";
  const [form, setForm] = useState<Category>(
    () => initialCategory ?? emptyCategory(),
  );
  const [errors, setErrors] = useState<Partial<Record<keyof Category, string>>>(
    {},
  );

  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm(initialCategory ? { ...initialCategory } : emptyCategory());
      setErrors({});
    }
  }, [open, initialCategory]);

  const validate = () => {
    const next: Partial<Record<keyof Category, string>> = {};
    if (!form.title.trim()) next.title = "Title is required";
    if (!form.description.trim()) next.description = "Description is required";
    return next;
  };

  const handleSave = () => {
    const validation = validate();
    if (Object.keys(validation).length) {
      setErrors(validation);
      return;
    }
    onSubmit({
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[min(540px,calc(100vw-2rem))] !max-w-[min(540px,calc(100vw-2rem))]">
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? `Edit ${initialCategory?.title}` : "Add category"}
          </DialogTitle>
          <DialogDescription>
            Categories appear on the homepage and as filter options on the tours
            page.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Title</Label>
            <Input
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              placeholder="Luxury"
            />
            {errors.title ? (
              <p className="text-xs text-destructive">{errors.title}</p>
            ) : null}
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Description</Label>
            <Textarea
              value={form.description}
              onChange={(e) =>
                setForm((p) => ({ ...p, description: e.target.value }))
              }
              placeholder="Private villas, refined dining, and exclusive access."
              className="min-h-[80px]"
            />
            {errors.description ? (
              <p className="text-xs text-destructive">{errors.description}</p>
            ) : null}
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
