import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from 'next/script';
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Electron Next App",
  description: "A cross-platform Electron and Next.js application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Required for Capacitor on mobile */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
        
        {/* Capacitor detection script */}
        <Script id="capacitor-detection" strategy="beforeInteractive">
          {`
            window.isCapacitor = !!(
              window.Capacitor && 
              window.Capacitor.isNative
            );
          `}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <div id="app-root">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
