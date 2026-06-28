"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Badge, Input, Spinner } from "@/components/atoms";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RouteGuard } from "@/components/providers/RouteGuard";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  getPersonalizedRequests,
  updatePersonalizedRequestStatus,
} from "@/lib/supabase/data";
import { toast } from "@/components/molecules/Toaster";
import { formatDate } from "@/lib/format";
import type {
  PersonalizedRequest,
  PersonalizedRequestStatus,
} from "@/types";

const statusOptions: PersonalizedRequestStatus[] = [
  "new",
  "contacted",
  "closed",
];

const statusBadge: Record<PersonalizedRequestStatus, string> = {
  new: "bg-amber-100 text-amber-800",
  contacted: "bg-sky-100 text-sky-800",
  closed: "bg-slate-100 text-slate-700",
};

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<PersonalizedRequest[]>([]);
  const [ready, setReady] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const rows = await getPersonalizedRequests(createSupabaseBrowserClient());
      if (!mounted) return;
      setRequests(rows);
      setReady(true);
    };
    void load();
    return () => {
      mounted = false;
    };
  }, []);

  const handleStatus = async (
    id: string,
    status: PersonalizedRequestStatus,
  ) => {
    const ok = await updatePersonalizedRequestStatus(
      createSupabaseBrowserClient(),
      id,
      status,
    );
    if (ok) {
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status } : r)),
      );
      toast.success("Status updated");
    } else {
      toast.error("Couldn't update status");
    }
  };

  const filtered = useMemo(
    () =>
      requests.filter((r) => {
        if (!query) return true;
        const lc = query.toLowerCase();
        return (
          r.name.toLowerCase().includes(lc) ||
          r.email.toLowerCase().includes(lc) ||
          r.destination.toLowerCase().includes(lc)
        );
      }),
    [requests, query],
  );

  const counts = useMemo(
    () => ({
      total: requests.length,
      new: requests.filter((r) => r.status === "new").length,
      contacted: requests.filter((r) => r.status === "contacted").length,
    }),
    [requests],
  );

  return (
    <RouteGuard allow={["admin"]}>
      <div className="space-y-8">
        <SectionHeading
          title="Trip requests"
          subtitle="Personalized itinerary requests from the concierge form."
        />

        <div className="grid gap-6 sm:grid-cols-3">
          <Stat label="Total requests" value={counts.total} />
          <Stat label="New" value={counts.new} highlight />
          <Stat label="Contacted" value={counts.contacted} />
        </div>

        <div className="space-y-4 rounded-2xl border border-white/60 bg-white/80 p-6 shadow-[0_18px_40px_-30px_rgba(92,70,39,0.35)]">
          <div className="relative max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search name, email, or destination"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Traveler</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Guests</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length ? (
                  filtered.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{r.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {r.email}
                            {r.phone ? ` · ${r.phone}` : ""}
                          </p>
                          {r.notes ? (
                            <p className="mt-1 max-w-xs text-xs text-muted-foreground">
                              “{r.notes}”
                            </p>
                          ) : null}
                        </div>
                      </TableCell>
                      <TableCell>
                        {r.destination}
                        {r.experiences?.length ? (
                          <p className="text-xs text-muted-foreground">
                            {r.experiences.join(", ")}
                          </p>
                        ) : null}
                      </TableCell>
                      <TableCell className="text-sm">
                        {r.startDate}
                        {r.endDate ? ` → ${r.endDate}` : ""}
                      </TableCell>
                      <TableCell>{r.partySize}</TableCell>
                      <TableCell className="text-sm">
                        {r.budget}
                        {r.budgetAmount ? ` · ${r.budgetAmount}` : ""}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {r.createdAt ? formatDate(r.createdAt) : "-"}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={r.status}
                          onValueChange={(v) =>
                            handleStatus(
                              r.id,
                              (v ?? "new") as PersonalizedRequestStatus,
                            )
                          }
                        >
                          <SelectTrigger className="h-8 w-[130px]">
                            <SelectValue>
                              <Badge
                                className={`rounded-full ${statusBadge[r.status]}`}
                              >
                                {r.status}
                              </Badge>
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {statusOptions.map((s) => (
                              <SelectItem key={s} value={s}>
                                {s}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center text-sm text-muted-foreground"
                    >
                      {!ready ? (
                        <span className="inline-flex items-center gap-2">
                          <Spinner className="size-4" /> Loading requests…
                        </span>
                      ) : (
                        "No trip requests yet."
                      )}
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
