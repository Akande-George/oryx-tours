import type { ReactNode } from "react";
import { Navbar } from "@/components/organisms/Navbar";
import { Sidebar } from "@/components/ui/modern-side-bar";
import { RouteGuard } from "@/components/providers/RouteGuard";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#f7ead5] via-[#f9f4eb] to-[#f1d4b0]" />
      <Navbar />
      <RouteGuard>
        <div className="flex">
          <Sidebar />
          <main className="min-w-0 flex-1 space-y-8 px-4 py-10 sm:px-6 lg:px-10">
            {children}
          </main>
        </div>
      </RouteGuard>
    </div>
  );
}
