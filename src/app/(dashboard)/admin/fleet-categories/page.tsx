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
import { FleetCategoryFormDialog } from "@/components/organisms/FleetCategoryFormDialog";
import { RouteGuard } from "@/components/providers/RouteGuard";
import { useSupabaseCollections } from "@/lib/supabase/use-supabase-data";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  deleteFleetCategory,
  upsertFleetCategory,
} from "@/lib/supabase/data";
import type { FleetCategoryRecord } from "@/types";

export default function AdminFleetCategoriesPage() {
  const { fleetCategories: live } = useSupabaseCollections();
  const [items, setItems] = useState<FleetCategoryRecord[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<FleetCategoryRecord | null>(null);

  useEffect(() => {
    setItems(live);
  }, [live]);

  const sorted = useMemo(
    () =>
      [...items].sort((a, b) => {
        const ao = a.order ?? 0;
        const bo = b.order ?? 0;
        if (ao !== bo) return ao - bo;
        return a.title.localeCompare(b.title);
      }),
    [items],
  );

  const openAdd = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const openEdit = (record: FleetCategoryRecord) => {
    setEditing(record);
    setDialogOpen(true);
  };

  const handleSubmit = async (record: FleetCategoryRecord) => {
    try {
      const saved = await upsertFleetCategory(
        createSupabaseBrowserClient(),
        record,
      );
      setItems((prev) => {
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
      await deleteFleetCategory(createSupabaseBrowserClient(), id);
      setItems((prev) => prev.filter((c) => c.id !== id));
    } catch (e) {
      window.alert((e as Error).message);
    }
  };

  return (
    <RouteGuard allow={["admin"]}>
      <div className="space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <SectionHeading
            title="Fleet categories"
            subtitle="Define the categories used to group vehicles across booking and fleet pages."
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
                  sorted.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">
                        {record.title}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {record.description || "—"}
                      </TableCell>
                      <TableCell>{record.order ?? 0}</TableCell>
                      <TableCell className="text-right">
                        <div className="inline-flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="rounded-full"
                            onClick={() => openEdit(record)}
                          >
                            <Pencil className="h-3.5 w-3.5" /> Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="rounded-full text-destructive hover:bg-destructive/10"
                            onClick={() => handleDelete(record.id)}
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
                      No fleet categories yet. Click &ldquo;Add category&rdquo;
                      to create one.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <FleetCategoryFormDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          initial={editing}
          onSubmit={handleSubmit}
        />
      </div>
    </RouteGuard>
  );
}
