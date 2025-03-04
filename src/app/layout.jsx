import {
  Geist,
  Geist_Mono,
  Fredericka_the_Great,
  Abhaya_Libre,
} from "next/font/google";
import "./globals.css";
import { Toaster } from "@/shared/components/ui/toaster";
import { ThemeProvider } from "@/shared/components/ThemeProvider";
import { Suspense } from "react";
import { ErrorBoundary } from '@/shared/components/ErrorBoundary';

// Optimize font loading
const barriecito = Abhaya_Libre({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-barriecito",
  display: 'swap',
  preload: true,
  adjustFontFallback: true
});

const fredericka = Fredericka_the_Great({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-fredericka",
  display: 'swap',
  preload: true,
  adjustFontFallback: true
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
  preload: true
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
  preload: true
});

// Enhanced metadata
export const metadata = {
  title: "Real Estate Application",
  description: "A modern web platform for listing and exploring properties such as land plots, rentals, villas, and apartments.",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" }
  ],
  openGraph: {
    title: 'Real Estate Application',
    description: 'Explore properties and real estate listings',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: '/manifest.json'
};

export default function RootLayout({ children }) {
  return (
    <html 
      lang="en" 
      suppressHydrationWarning
      className={`${barriecito.variable} ${fredericka.variable} ${geistSans.variable} ${geistMono.variable}`}
    >
      <head>
        {/* Preconnect to external domains */}
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
        
        {/* Preload critical assets */}
        <link 
          rel="preload" 
          href="/critical.css" 
          as="style"
        />
      </head>
      <body className="antialiased font-barriecito">
        <ErrorBoundary fallback={<div>Something went wrong</div>}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            storageKey="real-estate-theme"
          >
              <main className="min-h-screen">
                {children}
              </main>
            
            {/* Toaster is rendered outside main content flow */}
            <Suspense fallback={null}>
              <Toaster />
            </Suspense>
          </ThemeProvider>
        </ErrorBoundary>

        {/* Add performance monitoring in development */}
        {process.env.NODE_ENV === 'development' && (
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
  if (process.env.NODE_ENV === 'development') {
    console.log(metric);
  }
  
  // In production, you might want to send this to your analytics service
  if (process.env.NODE_ENV === 'production') {
    // Example: Send to analytics
    // analytics.send(metric);
  }
}
