import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "RetailOS",
  description: "Retail Business Dashboard",
};

import ToastProvider from "@/components/providers/ToastProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${inter.variable}`}>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
