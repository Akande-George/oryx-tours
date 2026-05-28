"use client";

import { useMemo, useState } from "react";
import { Check, X } from "lucide-react";
import { Badge, Button } from "@/components/atoms";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RouteGuard } from "@/components/providers/RouteGuard";
import { useAuth } from "@/components/providers/AuthProvider";
import type { AccountStatus } from "@/lib/auth";

const statusFilters: ("All" | AccountStatus)[] = [
  "All",
  "pending",
  "active",
  "rejected",
];

const statusBadge: Record<AccountStatus, string> = {
  active: "bg-emerald-100 text-emerald-800",
  pending: "bg-amber-100 text-amber-800",
  rejected: "bg-rose-100 text-rose-700",
};

export default function AdminPartnersPage() {
  const { accounts, approvePartner, rejectPartner } = useAuth();
  const [filter, setFilter] = useState<"All" | AccountStatus>("pending");

  const partners = useMemo(
    () => accounts.filter((account) => account.role === "partner"),
    [accounts],
  );

  const filtered = useMemo(
    () =>
      filter === "All"
        ? partners
        : partners.filter((account) => account.status === filter),
    [partners, filter],
  );

  const counts = useMemo(
    () => ({
      total: partners.length,
      pending: partners.filter((p) => p.status === "pending").length,
      active: partners.filter((p) => p.status === "active").length,
      rejected: partners.filter((p) => p.status === "rejected").length,
    }),
    [partners],
  );

  return (
    <RouteGuard allow={["admin"]}>
      <div className="space-y-8">
        <SectionHeading
          title="Partner applications"
          subtitle="Review, approve, or reject partner operators."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Total partners" value={counts.total} />
          <Stat label="Pending review" value={counts.pending} highlight />
          <Stat label="Active" value={counts.active} />
          <Stat label="Rejected" value={counts.rejected} />
        </div>

        <div className="space-y-4 rounded-2xl border border-white/60 bg-white/80 p-6 shadow-[0_18px_40px_-30px_rgba(92,70,39,0.35)]">
          <div className="flex flex-wrap items-center gap-2">
            {statusFilters.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setFilter(option)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${filter === option ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
              >
                {option === "All"
                  ? "All"
                  : option.charAt(0).toUpperCase() + option.slice(1)}
              </button>
            ))}
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length ? (
                  filtered.map((partner) => (
                    <TableRow key={partner.id}>
                      <TableCell className="font-medium">
                        {partner.name}
                      </TableCell>
                      <TableCell>
                        {partner.companyName ?? (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>{partner.email}</TableCell>
                      <TableCell>
                        <Badge
                          className={`rounded-full ${statusBadge[partner.status]}`}
                        >
                          {partner.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="inline-flex gap-2">
                          {partner.status !== "active" ? (
                            <Button
                              variant="outline"
                              size="sm"
                              className="rounded-full"
                              onClick={() => approvePartner(partner.id)}
                            >
                              <Check className="h-3.5 w-3.5" /> Approve
                            </Button>
                          ) : null}
                          {partner.status !== "rejected" ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="rounded-full text-destructive hover:bg-destructive/10"
                              onClick={() => rejectPartner(partner.id)}
                            >
                              <X className="h-3.5 w-3.5" /> Reject
                            </Button>
                          ) : null}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center text-sm text-muted-foreground"
                    >
                      No partner accounts match this filter.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </RouteGuard>
  );
}

function Stat({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <Card
      className={`border-white/60 bg-white/80 shadow-[0_18px_40px_-30px_rgba(92,70,39,0.35)] ${highlight ? "ring-2 ring-primary/40" : ""}`}
    >
      <CardContent className="space-y-1 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          {label}
        </p>
        <p className="text-2xl font-semibold">{value}</p>
      </CardContent>
    </Card>
  );
}
