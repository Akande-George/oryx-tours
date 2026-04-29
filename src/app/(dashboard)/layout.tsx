import type { ReactNode } from "react";
import { Container } from "@/components/layout/Container";
import { Navbar } from "@/components/organisms/Navbar";
import { DashboardSidebar } from "@/components/organisms/DashboardSidebar";
import { RouteGuard } from "@/components/providers/RouteGuard";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.9),_transparent_70%)]">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#f7ead5] via-[#f9f4eb] to-[#f1d4b0]" />
      <Navbar />
      <RouteGuard>
        <Container className="grid gap-8 py-10 md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr]">
          <DashboardSidebar />
          <div className="space-y-8">{children}</div>
        </Container>
      </RouteGuard>
    </div>
  );
}
