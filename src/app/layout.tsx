import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/providers/QueryProvider";
import { ToastProvider } from "@/components/common/Toast/ToastProvider";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sportswear Admin Dashboard",
  description: "Premium sports e-commerce admin dashboard.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} h-full antialiased`}>
      <body
        className="h-full overflow-hidden flex flex-col font-sans bg-slate-50 text-slate-800"
        suppressHydrationWarning
      >
        <ErrorBoundary>
          <ToastProvider>
            <QueryProvider>{children}</QueryProvider>
          </ToastProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}

