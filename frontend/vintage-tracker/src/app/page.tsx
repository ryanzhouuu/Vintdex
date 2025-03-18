'use client'

import Image from "next/image";
import { useAuth } from "@/context/AuthProvider";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center text-center max-w-2xl">
        <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Vintdex
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
            Your personal index for all things vintage.
        </p>

        <div className="flex gap-4 items-center flex-col sm:flex-row mt-8">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white gap-2 text-sm sm:text-base h-10 sm:h-12 px-6 sm:px-8"
            href="/search"
          >
            Start Searching
          </a>
          {!user && <a
            className="rounded-full border border-solid border-purple-200 dark:border-purple-800 transition-colors flex items-center justify-center hover:bg-purple-50 dark:hover:bg-purple-900/20 text-sm sm:text-base h-10 sm:h-12 px-6 sm:px-8"
            href="/login"
          >
            Login
          </a>
          }
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center text-sm text-gray-600 dark:text-gray-400">
        <a
          className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
          href="/privacy"
        >
          Privacy Policy
        </a>
        <a
          className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
          href="/terms"
        >
          Terms of Service
        </a>
        <a
          className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
          href="/contact"
        >
          Contact Us
        </a>
      </footer>
    </div>
  );
}
