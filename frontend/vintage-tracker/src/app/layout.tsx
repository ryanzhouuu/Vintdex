import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { AuthProvider, useAuth } from "@/context/AuthProvider";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vintdex",
  description: "Track and discover vintage items with ease. Your personal index for all things vintage.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  
  return (
    <AuthProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <SidebarProvider>
          <AppSidebar />
              <main className="flex-1">
                <SidebarTrigger />
                {children}
              </main>
          </SidebarProvider>
        </body>
      </html>
    </AuthProvider>
  );
}
