"use client";

import { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn, generateId } from "@/lib/utils";
import { ImageUploader } from "@/components/atoms/ImageUploader";
import { useSupabaseCollections } from "@/lib/supabase/use-supabase-data";
import { RatingStars } from "@/components/molecules/RatingStars";
import type { ItineraryItem, Review, Tour, TourCategory } from "@/types";

const difficulties: Tour["difficulty"][] = ["Easy", "Moderate", "Challenging"];

const gradientPresets = [
  "from-[#efd9bf] to-[#c79a78]",
  "from-[#f0d8bc] to-[#c79775]",
  "from-[#f1e5d1] via-[#e1c8a8] to-[#caa07c]",
  "from-[#dfe9f3] to-[#9bb6d2]",
  "from-[#f3e2e7] to-[#c98ea2]",
  "from-[#dcefe2] to-[#7fb792]",
];

const slugify = (input: string) =>
  input
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const emptyTour = (): Tour => ({
  id: generateId(),
  slug: "",
  title: "",
  location: "",
  region: "",
  durationDays: 1,
  groupSize: "Up to 8 guests",
  difficulty: "Easy",
  priceFrom: 0,
  rating: 4.8,
  reviewsCount: 0,
  category: "Luxury",
  description: "",
  videoUrl: "",
  highlights: [],
  includes: [],
  itinerary: [],
  reviews: [],
  gradient: gradientPresets[0],
  gallery: [],
  images: [],
  tags: [],
  operatorId: null,
});

type TourFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialTour?: Tour | null;
  onSubmit: (tour: Tour) => void;
};

export function TourFormDialog({
  open,
  onOpenChange,
  initialTour,
  onSubmit,
}: TourFormDialogProps) {
  const mode = initialTour ? "edit" : "add";
  const { categories } = useSupabaseCollections();
  const [form, setForm] = useState<Tour>(() => initialTour ?? emptyTour());
  const [slugLocked, setSlugLocked] = useState<boolean>(Boolean(initialTour));
  const [errors, setErrors] = useState<Partial<Record<keyof Tour, string>>>({});

  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm(initialTour ? { ...initialTour } : emptyTour());
      setSlugLocked(Boolean(initialTour));
      setErrors({});
    }
  }, [open, initialTour]);

  const update = <K extends keyof Tour>(key: K, value: Tour[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleTitleChange = (value: string) => {
    setForm((prev) => ({
      ...prev,
      title: value,
      slug: slugLocked ? prev.slug : slugify(value),
    }));
  };

  const validate = () => {
    const next: Partial<Record<keyof Tour, string>> = {};
    if (!form.title.trim()) next.title = "Title is required";
    if (!form.slug.trim()) next.slug = "Slug is required";
    if (!form.location.trim()) next.location = "Location is required";
    if (!form.region.trim()) next.region = "Region is required";
    if (!form.description.trim()) next.description = "Description is required";
    if (form.durationDays < 1) next.durationDays = "Must be at least 1 day";
    if (form.priceFrom < 0) next.priceFrom = "Price must be ≥ 0";
    if (form.rating < 0 || form.rating > 5) next.rating = "Rating must be 0–5";
    if (form.images.length < 4) next.images = "Add at least 4 image URLs";
    return next;
  };

  const handleSave = () => {
    const validation = validate();
    console.log("[tour-form] save clicked", { form, validation });
    if (Object.keys(validation).length) {
      setErrors(validation);
      return;
    }
    onSubmit(form);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] w-[min(960px,calc(100vw-2rem))] !max-w-[min(960px,calc(100vw-2rem))] overflow-y-auto p-0 sm:!max-w-[min(960px,calc(100vw-2rem))]">
        <DialogHeader className="border-b border-border/60 bg-muted/30 p-5">
          <DialogTitle className="text-lg sm:text-xl">
            {mode === "edit" ? `Edit ${initialTour?.title}` : "Add a new tour"}
          </DialogTitle>
          <DialogDescription>
            {mode === "edit"
              ? "Update every detail of the tour experience — from pricing to gallery."
              : "Set up the full experience travelers will see in the catalog."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8 p-5 sm:p-6">
          <FormSection
            title="Basics"
            description="Identity, classification, and operator assignment."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Title" error={errors.title} required>
                <Input
                  value={form.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Royal Dune Retreat"
                />
              </Field>
              <Field label="URL slug" error={errors.slug} required>
                <div className="flex items-center gap-2">
                  <Input
                    value={form.slug}
                    onChange={(e) => {
                      setSlugLocked(true);
                      update("slug", slugify(e.target.value));
                    }}
                    placeholder="royal-dune-retreat"
                  />
                  {slugLocked ? (
                    <button
                      type="button"
                      onClick={() => {
                        setSlugLocked(false);
                        update("slug", slugify(form.title));
                      }}
                      className="text-xs font-medium text-primary hover:underline"
                    >
                      Sync
                    </button>
                  ) : null}
                </div>
              </Field>
              <Field label="Location" error={errors.location} required>
                <Input
                  value={form.location}
                  onChange={(e) => update("location", e.target.value)}
                  placeholder="Al Khurais Dunes"
                />
              </Field>
              <Field label="Region" error={errors.region} required>
                <Input
                  value={form.region}
                  onChange={(e) => update("region", e.target.value)}
                  placeholder="Western Desert"
                />
              </Field>
              <Field label="Category">
                <Select
                  value={form.category}
                  onValueChange={(v) => update("category", v as TourCategory)}
                  disabled={!categories.length}
                >
                  <SelectTrigger className="h-9 w-full">
                    <SelectValue
                      placeholder={
                        categories.length
                          ? "Pick a category"
                          : "No categories yet — add one in /admin/categories"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.title}>
                        {c.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Difficulty">
                <Select
                  value={form.difficulty}
                  onValueChange={(v) =>
                    update("difficulty", (v ?? "Easy") as Tour["difficulty"])
                  }
                >
                  <SelectTrigger className="h-9 w-full">
                    <SelectValue placeholder="Pick a difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    {difficulties.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>
          </FormSection>

          <FormSection
            title="Logistics & pricing"
            description="What travelers commit to and what it costs."
          >
            <div className="grid gap-4 md:grid-cols-4">
              <Field
                label="Duration (days)"
                error={errors.durationDays}
                required
              >
                <Input
                  type="number"
                  min={1}
                  value={form.durationDays}
                  onChange={(e) =>
                    update(
                      "durationDays",
                      Math.max(1, Number(e.target.value) || 1),
                    )
                  }
                />
              </Field>
              <Field label="Group size" className="md:col-span-2">
                <Input
                  value={form.groupSize}
                  onChange={(e) => update("groupSize", e.target.value)}
                  placeholder="Up to 8 guests"
                />
              </Field>
              <Field label="Price from (USD)" error={errors.priceFrom} required>
                <Input
                  type="number"
                  min={0}
                  step={50}
                  value={form.priceFrom}
                  onChange={(e) =>
                    update(
                      "priceFrom",
                      Math.max(0, Number(e.target.value) || 0),
                    )
                  }
                />
              </Field>
              <Field label="Rating (0–5)" error={errors.rating}>
                <Input
                  type="number"
                  min={0}
                  max={5}
                  step={0.1}
                  value={form.rating}
                  onChange={(e) =>
                    update("rating", Number(e.target.value) || 0)
                  }
                />
              </Field>
              <Field label="Reviews count">
                <Input
                  type="number"
                  min={0}
                  value={form.reviewsCount}
                  onChange={(e) =>
                    update(
                      "reviewsCount",
                      Math.max(0, Number(e.target.value) || 0),
                    )
                  }
                />
              </Field>
              <Field
                label="Video URL"
                error={errors.videoUrl}
                className="md:col-span-2"
                description="Optional. YouTube, Vimeo, or other embeddable video link."
              >
                <Input
                  value={form.videoUrl ?? ""}
                  onChange={(e) => update("videoUrl", e.target.value)}
                  placeholder="Paste a video link (optional)"
                />
              </Field>
            </div>
          </FormSection>

          <FormSection
            title="Story"
            description="The pitch travelers will read on the listing."
          >
            <Field label="Description" error={errors.description} required>
              <Textarea
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                placeholder="Describe the experience — pace, vibe, signature moments..."
                className="min-h-[120px]"
              />
            </Field>
          </FormSection>

          <FormSection
            title="What's included"
            description="Inclusions listed in the sidebar — guide, meals, transfers, and so on. One per line."
          >
            <Field label="What's included">
              <ListEditor
                value={form.includes}
                onChange={(v) => update("includes", v)}
                placeholder="Private guide for 3 days"
              />
            </Field>
          </FormSection>

          <FormSection
            title="Tags"
            description="Used for search, filters, and badges on the card."
          >
            <Field label="Tags">
              <ChipEditor
                value={form.tags}
                onChange={(v) => update("tags", v)}
                placeholder="Type a tag and press Enter"
              />
            </Field>
          </FormSection>

          <FormSection
            title="Itinerary"
            description="Day-by-day breakdown shown under the Itinerary tab on the detail page."
          >
            <ItineraryEditor
              value={form.itinerary ?? []}
              onChange={(v) => update("itinerary", v)}
            />
          </FormSection>

          <FormSection
            title="Reviews"
            description="Traveler reviews shown under the Reviews tab on the detail page."
          >
            <ReviewEditor
              value={form.reviews ?? []}
              onChange={(v) => update("reviews", v)}
            />
          </FormSection>

          <FormSection
            title="Visuals"
            description="Cover, gallery, and the gradient used as a card backdrop."
          >
            <div className="space-y-5">
              <Field
                label="Tour photos"
                error={errors.images}
                required
                description="Add at least 4 photos. First image is the card cover and the rest fill the detail page gallery."
              >
                <ImageUploader
                  value={form.images}
                  onChange={(urls) => update("images", urls)}
                  folder="tours"
                  maxFiles={12}
                  label="Tour photos"
                />
              </Field>
              <Field
                label="Decorative gradients (optional)"
                description="Tailwind gradient classes used as accent panels on the detail page."
              >
                <ListEditor
                  value={form.gallery}
                  onChange={(v) => update("gallery", v)}
                  placeholder="from-[#efd9bf] to-[#c79a78]"
                />
              </Field>
              <Field
                label="Gradient"
                description="Tailwind gradient classes used as a brand wash."
              >
                <div className="space-y-3">
                  <Input
                    value={form.gradient}
                    onChange={(e) => update("gradient", e.target.value)}
                    placeholder="from-[#efd9bf] to-[#c79a78]"
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
              </Field>
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
            {mode === "edit" ? "Save changes" : "Create tour"}
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
      <Input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            add();
          }
        }}
        onBlur={add}
        placeholder={placeholder}
      />
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

function ItineraryEditor({
  value,
  onChange,
}: {
  value: ItineraryItem[];
  onChange: (next: ItineraryItem[]) => void;
}) {
  const updateItem = (index: number, patch: Partial<ItineraryItem>) => {
    onChange(value.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  };

  const addItem = () =>
    onChange([
      ...value,
      { title: "", detail: "", duration: "", admission: "" },
    ]);

  return (
    <div className="space-y-3">
      {value.length ? (
        <ul className="space-y-3">
          {value.map((item, idx) => (
            <li
              key={idx}
              className="space-y-2 rounded-xl border border-border bg-background p-3"
            >
              <div className="flex items-center gap-2">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                  {idx + 1}
                </span>
                <Input
                  value={item.title}
                  onChange={(e) => updateItem(idx, { title: e.target.value })}
                  placeholder="Stop title (e.g. Doha Corniche)"
                  className="flex-1"
                />
                <button
                  type="button"
                  onClick={() => onChange(value.filter((_, i) => i !== idx))}
                  className="shrink-0 text-muted-foreground transition-colors hover:text-destructive"
                  aria-label="Remove stop"
                >
                  <X className="size-4" />
                </button>
              </div>
              <Textarea
                value={item.detail}
                onChange={(e) => updateItem(idx, { detail: e.target.value })}
                placeholder="Describe this stop — what travelers see and do…"
                className="min-h-[80px]"
              />
              <div className="grid gap-2 sm:grid-cols-2">
                <Input
                  value={item.duration ?? ""}
                  onChange={(e) =>
                    updateItem(idx, { duration: e.target.value })
                  }
                  placeholder="Duration (e.g. 1 hour 30 minutes)"
                />
                <Input
                  value={item.admission ?? ""}
                  onChange={(e) =>
                    updateItem(idx, { admission: e.target.value })
                  }
                  placeholder="Admission (e.g. Admission Ticket Free)"
                />
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xs text-muted-foreground">No itinerary stops yet.</p>
      )}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={addItem}
        className="rounded-lg"
      >
        <Plus className="size-3.5" /> Add stop
      </Button>
    </div>
  );
}

function ReviewEditor({
  value,
  onChange,
}: {
  value: Review[];
  onChange: (next: Review[]) => void;
}) {
  const updateItem = (index: number, patch: Partial<Review>) => {
    onChange(value.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  };

  const addItem = () =>
    onChange([
      ...value,
      {
        id: generateId(),
        name: "",
        rating: 5,
        date: new Date().toISOString().slice(0, 10),
        content: "",
      },
    ]);

  return (
    <div className="space-y-3">
      {value.length ? (
        <ul className="space-y-3">
          {value.map((item, idx) => (
            <li
              key={item.id}
              className="space-y-2 rounded-xl border border-border bg-background p-3"
            >
              <div className="flex flex-wrap items-center gap-2">
                <Input
                  value={item.name}
                  onChange={(e) => updateItem(idx, { name: e.target.value })}
                  placeholder="Reviewer name"
                  className="min-w-[160px] flex-1"
                />
                <Input
                  type="date"
                  value={item.date}
                  onChange={(e) => updateItem(idx, { date: e.target.value })}
                  className="w-[150px]"
                />
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min={0}
                    max={5}
                    step={0.5}
                    value={item.rating}
                    onChange={(e) =>
                      updateItem(idx, {
                        rating: Math.min(
                          5,
                          Math.max(0, Number(e.target.value) || 0),
                        ),
                      })
                    }
                    className="w-[80px]"
                  />
                  <RatingStars rating={item.rating} />
                </div>
                <button
                  type="button"
                  onClick={() => onChange(value.filter((_, i) => i !== idx))}
                  className="shrink-0 text-muted-foreground transition-colors hover:text-destructive"
                  aria-label="Remove review"
                >
                  <X className="size-4" />
                </button>
              </div>
              <Textarea
                value={item.content}
                onChange={(e) => updateItem(idx, { content: e.target.value })}
                placeholder="What the traveler said…"
                className="min-h-[70px]"
              />
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xs text-muted-foreground">No reviews yet.</p>
      )}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={addItem}
        className="rounded-lg"
      >
        <Plus className="size-3.5" /> Add review
      </Button>
    </div>
  );
}
