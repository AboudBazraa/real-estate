import { Geist, Geist_Mono, Fredericka_the_Great , Abril_Fatface, Abhaya_Libre } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/shared/components/ui/toaster";
import { ThemeProvider } from "@/shared/components/ThemeProvider";
import { SessionProvider } from "next-auth/react";

const barriecito = Abhaya_Libre({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-barriecito",
});

const fredericka = Fredericka_the_Great({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-fredericka",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Real Estate Application",
  description:
    "A modern web platform for listing and exploring properties such as land plots, rentals, villas, and apartments.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={` ${barriecito.variable} antialiased font-barriecito`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
