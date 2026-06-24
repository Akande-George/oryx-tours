import type { Metadata } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { SavedToursLoader } from "@/components/providers/SavedToursLoader";
import { RecoveryHashHandler } from "@/components/providers/RecoveryHashHandler";
import { Toaster } from "@/components/molecules/Toaster";
import { ConfirmDialog } from "@/components/molecules/ConfirmDialog";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
});

export const metadata: Metadata = {
  title: "Oryx Tours",
  description: "Luxury travel experiences, curated for you.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${interTight.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-screen bg-background text-foreground">
        <AuthProvider>
          <SavedToursLoader />
          <Suspense fallback={null}>
            <RecoveryHashHandler />
          </Suspense>
          {children}
        </AuthProvider>
        <Toaster />
        <ConfirmDialog />
      </body>
    </html>
  );
}
