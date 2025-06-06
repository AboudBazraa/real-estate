import {
  Outfit,
  Sigmar,
  Playwrite_IT_Moderna,
  Tajawal,
} from "next/font/google";
import "./globals.css";
import "@/styles/keyframes.css";
import "@/styles/rtl.css";
import { Toaster } from "@/shared/components/ui/toaster";
import { ThemeProvider } from "@/shared/components/ThemeProvider";
import { Suspense } from "react";
import { ErrorBoundary } from "@/shared/components/ErrorBoundary";
import Providers from "./providers";
import { ToastProvider } from "@/shared/components/ui/toast";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { cookies } from "next/headers";

// Main font for the entire application
const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  variable: "--font-outfit",
});

// Arabic font
const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["400", "500", "700"],
  variable: "--font-arabic",
  display: "swap",
  preload: true,
});

// Special fonts just for homepage sections
const sigmar = Sigmar({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-sigmar",
  display: "swap",
  preload: true,
});

const playwrite = Playwrite_IT_Moderna({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-playwrite",
  display: "swap",
  preload: true,
});

// Enhanced viewport
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

// Enhanced metadata
export const metadata = {
  title: "Real Estate Application",
  description:
    "A modern web platform for listing and exploring properties such as land plots, rentals, villas, and apartments.",
  openGraph: {
    title: "Real Estate Application",
    description: "Explore properties and real estate listings",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({ children }) {
  // Default to English initially, let client-side handle actual language
  const locale = "en";
  const dir = "ltr";

  return (
    <html
      suppressHydrationWarning
      className={`${outfit.variable} ${sigmar.variable} ${playwrite.variable} ${tajawal.variable}`}
    >
      {/* <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        
        <link 
          rel="preload" 
          href="/critical.css" 
          as="style"
        />
      </head> */}
      <body className="antialiased flex flex-col min-h-screen">
        <ToastProvider>
          <ErrorBoundary fallback={<div>Something went wrong</div>}>
            <Providers>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
                storageKey="real-estate-theme"
              >
                <main className="">{children}</main>

                {/* Toaster is rendered outside main content flow */}
                <Suspense fallback={null}>
                  <Toaster />
                </Suspense>
              </ThemeProvider>
            </Providers>
          </ErrorBoundary>
        </ToastProvider>

        <SpeedInsights />

        {/* Add performance monitoring in development */}
        {process.env.NODE_ENV === "development" && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.addEventListener('load', () => {
                  console.log('Page Load Time:', performance.now());
                });
              `,
            }}
          />
        )}
      </body>
    </html>
  );
}

// Add performance monitoring utility
export function reportWebVitals(metric) {
  if (process.env.NODE_ENV === "development") {
    console.log(metric);
  }

  // In production, you might want to send this to your analytics service
  if (process.env.NODE_ENV === "production") {
    // Example: Send to analytics
    // analytics.send(metric);
  }
}
