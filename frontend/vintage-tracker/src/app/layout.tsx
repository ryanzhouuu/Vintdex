import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex min-h-screen">
          <nav className="w-56 bg-white dark:bg-gray-950 border-r border-purple-200 dark:border-purple-900 p-4 flex flex-col gap-3">
            <Link 
              href="/search"
              className="text-2xl font-bold bg-gradient-to-r from-purple-700 to-pink-700 bg-clip-text text-transparent mb-6 hover:opacity-90 transition-opacity"
            >
              Vintdex
            </Link>
            
            <Link
              href="/search"
              className="px-3 py-2 rounded-md hover:bg-purple-100 dark:hover:bg-purple-950/50 text-gray-800 dark:text-gray-200 transition-colors text-sm"
            >
              Search
            </Link>
            
            <Link
              href="/profile"
              className="px-3 py-2 rounded-md hover:bg-purple-100 dark:hover:bg-purple-950/50 text-gray-800 dark:text-gray-200 transition-colors text-sm"
            >
              Profile
            </Link>

            <div className="mt-auto flex flex-col gap-2">
              <Link
                href="/login"
                className="px-3 py-2 rounded-md hover:bg-purple-100 dark:hover:bg-purple-950/50 text-gray-800 dark:text-gray-200 transition-colors text-sm"
              >
                Login
              </Link>
              
              <Link
                href="/signup"
                className="px-3 py-2 rounded-md bg-purple-700 hover:bg-purple-800 text-white transition-colors text-center text-sm"
              >
                Sign Up
              </Link>
            </div>
          </nav>

          <main className="flex-1">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
