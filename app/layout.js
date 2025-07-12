"use client";
import React, { useState, useEffect } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionWrapper from "@/components/SessionWrapper";
import Providers from "@/store/provider";
import GoogleMapsProvider from "@/components/GoogleMapsProvider";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import DesignerLoader from "@/components/DesignerLoader";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import 'react-toastify/dist/ReactToastify.css';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const allowedPaths = ["/login", "/signup"];  // 👈 allowed paths

  // Initial Page Load
  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timeout);
  }, []);

  // On Route Change (skip loader on login/signup)
  useEffect(() => {
    if (!allowedPaths.includes(pathname)) {
      setLoading(true);
      const timeout = setTimeout(() => setLoading(false), 500);
      return () => clearTimeout(timeout);
    } else {
      setLoading(false);
    }
  }, [pathname]);

  console.log("🚨 Pathname:", pathname, "Loading:", loading);

  // Show loader (skip loader on login/signup)
  if (loading && !allowedPaths.includes(pathname)) {
    return (
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-white"
          >
            <DesignerLoader />
          </motion.div>
        </body>
      </html>
    );
  }

  // Normal Render
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <GoogleMapsProvider>
          <SessionWrapper>
            <Providers>
              <AnimatePresence mode="wait">
                <motion.div
                  key={pathname}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {!allowedPaths.includes(pathname) && <Navbar />}
                  {children}
                  {!allowedPaths.includes(pathname) && <Footer />}
                </motion.div>
              </AnimatePresence>
            </Providers>
          </SessionWrapper>
        </GoogleMapsProvider>
      </body>
    </html>
  );
}
