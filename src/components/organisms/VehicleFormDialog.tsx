"use client";

import { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import { Button, Input } from "@/components/atoms";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { ImageUploader } from "@/components/atoms/ImageUploader";
import type { FleetCategory, Vehicle } from "@/types";

const fleetCategories: FleetCategory[] = ["Economy", "Premium", "VIP"];

const gradientPresets = [
  "from-[#cfe8da] to-[#7fb792]",
  "from-[#f3e2e7] to-[#c98ea2]",
  "from-[#dfe9f3] to-[#9bb6d2]",
  "from-[#f6d2a3] to-[#e8b98b]",
  "from-[#efe6d6] via-[#e7d2bb] to-[#d6bfa5]",
  "from-[#2a3140] to-[#5a6172]",
];

const emptyVehicle = (operatorId = ""): Vehicle => ({
  id: crypto.randomUUID(),
  name: "",
  fleetCategory: "Economy",
  capacity: 4,
  luggage: "2 carry-on bags",
  priceFrom: 0,
  halfDayPrice: 0,
  fullDayPrice: 0,
  extraHourPrice: 0,
  transferPrice: 0,
  pointToPointPrice: 0,
  features: [],
  gradient: gradientPresets[0],
  images: [],
  operatorId,
});

type VehicleFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialVehicle?: Vehicle | null;
  onSubmit: (vehicle: Vehicle) => void;
  defaultOperatorId?: string;
};

export function VehicleFormDialog({
  open,
  onOpenChange,
  initialVehicle,
  onSubmit,
  defaultOperatorId = "",
}: VehicleFormDialogProps) {
  const mode = initialVehicle ? "edit" : "add";
  const [form, setForm] = useState<Vehicle>(
    () => initialVehicle ?? emptyVehicle(defaultOperatorId),
  );
  const [errors, setErrors] = useState<Partial<Record<keyof Vehicle, string>>>(
    {},
  );

  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm(
        initialVehicle
          ? { ...initialVehicle }
          : emptyVehicle(defaultOperatorId),
      );
      setErrors({});
    }
  }, [open, initialVehicle, defaultOperatorId]);

  const update = <K extends keyof Vehicle>(key: K, value: Vehicle[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = () => {
    const next: Partial<Record<keyof Vehicle, string>> = {};
    if (!form.name.trim()) next.name = "Name is required";
    if (form.capacity < 1) next.capacity = "Capacity must be ≥ 1";
    if (!form.luggage.trim()) next.luggage = "Luggage spec is required";
    if (form.halfDayPrice < 0) next.halfDayPrice = "Must be ≥ 0";
    if (form.fullDayPrice < 0) next.fullDayPrice = "Must be ≥ 0";
    if (form.extraHourPrice < 0) next.extraHourPrice = "Must be ≥ 0";
    if (form.transferPrice < 0) next.transferPrice = "Must be ≥ 0";
    if (form.pointToPointPrice < 0) next.pointToPointPrice = "Must be ≥ 0";
    if (!form.images.length) next.images = "Add at least one vehicle photo URL";
    return next;
  };

  const handleSave = () => {
    const validation = validate();
    console.log("[vehicle-form] save clicked", { form, validation });
    if (Object.keys(validation).length) {
      setErrors(validation);
      return;
    }
    const lowestRate = Math.min(
      form.halfDayPrice || Infinity,
      form.transferPrice || Infinity,
      form.pointToPointPrice || Infinity,
    );
    const priceFrom =
      lowestRate === Infinity ? form.priceFrom : Math.round(lowestRate);
    onSubmit({ ...form, priceFrom });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] w-[min(820px,calc(100vw-2rem))] !max-w-[min(820px,calc(100vw-2rem))] overflow-y-auto p-0 sm:!max-w-[min(820px,calc(100vw-2rem))]">
        <DialogHeader className="border-b border-border/60 bg-muted/30 p-5">
          <DialogTitle className="text-lg sm:text-xl">
            {mode === "edit"
              ? `Edit ${initialVehicle?.name}`
              : "Add a new vehicle"}
          </DialogTitle>
          <DialogDescription>
            {mode === "edit"
              ? "Update specs, features, and rate card for this vehicle."
              : "Configure a new vehicle for the fleet — including category, capacity, and every rate."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8 p-5 sm:p-6">
          <FormSection
            title="Identity"
            description="The vehicle name and how it's classified in the fleet."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Vehicle name" error={errors.name} required>
                <Input
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="Range Rover Vogue"
                />
              </Field>
              <Field label="Fleet category">
                <Select
                  value={form.fleetCategory}
                  onValueChange={(v) =>
                    update("fleetCategory", (v ?? "Economy") as FleetCategory)
                  }
                >
                  <SelectTrigger className="h-9 w-full">
                    <SelectValue placeholder="Pick a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {fleetCategories.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field
                label="Capacity (passengers)"
                error={errors.capacity}
                required
              >
                <Input
                  type="number"
                  min={1}
                  value={form.capacity}
                  onChange={(e) =>
                    update("capacity", Math.max(1, Number(e.target.value) || 1))
                  }
                />
              </Field>
              <Field label="Luggage" error={errors.luggage} required>
                <Input
                  value={form.luggage}
                  onChange={(e) => update("luggage", e.target.value)}
                  placeholder="3 large suitcases"
                />
              </Field>
            </div>
          </FormSection>

          <FormSection
            title="Rate card"
            description="Customize each pricing mode independently."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <Field
                label="Half-day rate (USD)"
                description="4 hours with a private chauffeur."
                error={errors.halfDayPrice}
              >
                <Input
                  type="number"
                  min={0}
                  step={10}
                  value={form.halfDayPrice}
                  onChange={(e) =>
                    update(
                      "halfDayPrice",
                      Math.max(0, Number(e.target.value) || 0),
                    )
                  }
                />
              </Field>
              <Field
                label="Full-day rate (USD)"
                description="8 hours, anywhere in town."
                error={errors.fullDayPrice}
              >
                <Input
                  type="number"
                  min={0}
                  step={10}
                  value={form.fullDayPrice}
                  onChange={(e) =>
                    update(
                      "fullDayPrice",
                      Math.max(0, Number(e.target.value) || 0),
                    )
                  }
                />
              </Field>
              <Field
                label="Extra-hour rate (USD)"
                description="Add-on past the full-day window."
                error={errors.extraHourPrice}
              >
                <Input
                  type="number"
                  min={0}
                  step={5}
                  value={form.extraHourPrice}
                  onChange={(e) =>
                    update(
                      "extraHourPrice",
                      Math.max(0, Number(e.target.value) || 0),
                    )
                  }
                />
              </Field>
              <Field
                label="Airport transfer (USD)"
                description="One-way pickup or drop-off."
                error={errors.transferPrice}
              >
                <Input
                  type="number"
                  min={0}
                  step={5}
                  value={form.transferPrice}
                  onChange={(e) =>
                    update(
                      "transferPrice",
                      Math.max(0, Number(e.target.value) || 0),
                    )
                  }
                />
              </Field>
              <Field
                label="Point-to-point (USD)"
                description="Single ride between two addresses."
                error={errors.pointToPointPrice}
              >
                <Input
                  type="number"
                  min={0}
                  step={5}
                  value={form.pointToPointPrice}
                  onChange={(e) =>
                    update(
                      "pointToPointPrice",
                      Math.max(0, Number(e.target.value) || 0),
                    )
                  }
                />
              </Field>
            </div>
            <p className="text-xs text-muted-foreground">
              &ldquo;From&rdquo; price on the public card is automatically set
              to the lower of half-day and airport transfer rates.
            </p>
          </FormSection>

          <FormSection
            title="Photos"
            description="Add at least one photo. The first image becomes the card cover."
          >
            <Field label="Vehicle photos" error={errors.images} required>
              <ImageUploader
                value={form.images}
                onChange={(urls) => update("images", urls)}
                folder="vehicles"
                maxFiles={6}
                label="Vehicle photos"
              />
            </Field>
          </FormSection>

          <FormSection
            title="Features"
            description="Shown as chips on the vehicle card."
          >
            <ChipEditor
              value={form.features}
              onChange={(v) => update("features", v)}
              placeholder="WiFi, child seat, sparkling water..."
            />
          </FormSection>

          <FormSection
            title="Card backdrop"
            description="Tailwind gradient used on the vehicle card."
          >
            <div className="space-y-3">
              <Input
                value={form.gradient}
                onChange={(e) => update("gradient", e.target.value)}
                placeholder="from-[#cfe8da] to-[#7fb792]"
              />
              <div className="flex flex-wrap gap-2">
                {gradientPresets.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => update("gradient", preset)}
                    aria-label="Apply gradient preset"
                    className={cn(
                      "size-9 rounded-lg bg-gradient-to-br ring-2 ring-transparent transition-all hover:scale-105",
                      preset,
                      form.gradient === preset && "ring-primary",
                    )}
                  />
                ))}
              </div>
              {form.gradient ? (
                <div
                  className={cn(
                    "h-16 w-full rounded-lg bg-gradient-to-br",
                    form.gradient,
                  )}
                />
              ) : null}
            </div>
          </FormSection>
        </div>

        <DialogFooter className="!mt-0">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="rounded-full"
          >
            Cancel
          </Button>
          <Button type="button" onClick={handleSave} className="rounded-full">
            {mode === "edit" ? "Save changes" : "Add vehicle"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <header className="space-y-0.5">
        <h3 className="font-heading text-sm font-semibold uppercase tracking-[0.2em] text-primary">
          {title}
        </h3>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </header>
      {children}
    </section>
  );
}

function Field({
  label,
  description,
  error,
  required,
  className,
  children,
}: {
  label: string;
  description?: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label className="flex items-center gap-1 text-xs font-medium">
        {label}
        {required ? <span className="text-destructive">*</span> : null}
      </Label>
      {children}
      {description ? (
        <p className="text-xs text-muted-foreground">{description}</p>
      ) : null}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}

function ListEditor({
  value,
  onChange,
  placeholder,
}: {
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState("");

  const add = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    onChange([...value, trimmed]);
    setDraft("");
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder={placeholder}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={add}
          className="shrink-0 rounded-lg"
        >
          <Plus className="size-3.5" />
          Add
        </Button>
      </div>
      {value.length ? (
        <ul className="space-y-1.5">
          {value.map((item, idx) => (
            <li
              key={`${item}-${idx}`}
              className="flex items-start justify-between gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm"
            >
              <span className="min-w-0 break-words">{item}</span>
              <button
                type="button"
                onClick={() => onChange(value.filter((_, i) => i !== idx))}
                className="shrink-0 text-muted-foreground transition-colors hover:text-destructive"
                aria-label="Remove item"
              >
                <X className="size-3.5" />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xs text-muted-foreground">No entries yet.</p>
      )}
    </div>
  );
}

function ChipEditor({
  value,
  onChange,
  placeholder,
}: {
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState("");

  const add = () => {
    const trimmed = draft.trim();
    if (!trimmed || value.includes(trimmed)) return;
    onChange([...value, trimmed]);
    setDraft("");
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              add();
            }
          }}
          placeholder={placeholder}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={add}
          className="shrink-0 rounded-lg"
        >
          <Plus className="size-3.5" />
          Add
        </Button>
      </div>
      {value.length ? (
        <div className="flex flex-wrap gap-1.5">
          {value.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
            >
              {tag}
              <button
                type="button"
                onClick={() => onChange(value.filter((t) => t !== tag))}
                className="text-primary/60 transition-colors hover:text-destructive"
                aria-label={`Remove ${tag}`}
              >
                <X className="size-3" />
              </button>
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
