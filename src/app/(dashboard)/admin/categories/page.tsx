"use client";

import { useEffect, useMemo, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/atoms";
import { SectionHeading } from "@/components/layout/SectionHeading";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CategoryFormDialog } from "@/components/organisms/CategoryFormDialog";
import { RouteGuard } from "@/components/providers/RouteGuard";
import { useSupabaseCollections } from "@/lib/supabase/use-supabase-data";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { deleteCategory, upsertCategory } from "@/lib/supabase/data";
import type { Category } from "@/types";

export default function AdminCategoriesPage() {
  const { categories: live } = useSupabaseCollections();
  const [categories, setCategories] = useState<Category[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);

  useEffect(() => {
    setCategories(live);
  }, [live]);

  const sorted = useMemo(
    () =>
      [...categories].sort((a, b) => {
        const ao = a.order ?? 0;
        const bo = b.order ?? 0;
        if (ao !== bo) return ao - bo;
        return a.title.localeCompare(b.title);
      }),
    [categories],
  );

  const openAdd = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const openEdit = (category: Category) => {
    setEditing(category);
    setDialogOpen(true);
  };

  const handleSubmit = async (category: Category) => {
    try {
      const saved = await upsertCategory(
        createSupabaseBrowserClient(),
        category,
      );
      setCategories((prev) => {
        const exists = prev.some((c) => c.id === saved.id);
        return exists
          ? prev.map((c) => (c.id === saved.id ? saved : c))
          : [...prev, saved];
      });
    } catch (e) {
      window.alert((e as Error).message);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCategory(createSupabaseBrowserClient(), id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (e) {
      window.alert((e as Error).message);
    }
  };

  return (
    <RouteGuard allow={["admin"]}>
      <div className="space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <SectionHeading
            title="Categories"
            subtitle="Edit the categories shown on the homepage and used as tour filters."
          />
          <Button type="button" onClick={openAdd} className="rounded-full">
            <Plus className="size-4" /> Add category
          </Button>
        </div>

        <div className="space-y-4 rounded-2xl border border-white/60 bg-white/80 p-6 shadow-[0_18px_40px_-30px_rgba(92,70,39,0.35)]">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sorted.length ? (
                  sorted.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">
                        {category.title}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {category.description}
                      </TableCell>
                      <TableCell>{category.order ?? 0}</TableCell>
                      <TableCell className="text-right">
                        <div className="inline-flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="rounded-full"
                            onClick={() => openEdit(category)}
                          >
                            <Pencil className="h-3.5 w-3.5" /> Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="rounded-full text-destructive hover:bg-destructive/10"
                            onClick={() => handleDelete(category.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" /> Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center text-sm text-muted-foreground"
                    >
                      No categories yet. Click &ldquo;Add category&rdquo; to
                      create your first one.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <CategoryFormDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          initialCategory={editing}
          onSubmit={handleSubmit}
        />
      </div>
    </RouteGuard>
  );
}
