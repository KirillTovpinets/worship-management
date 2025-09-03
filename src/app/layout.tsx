import { TopBar } from "@/app/components/top-bar";
import Providers from "@/components/Providers";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Worship Management",
  description: "Worship team management application",
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
        suppressHydrationWarning={true}
      >
        <Providers>
          <div className="min-h-screen bg-gray-50">
            <TopBar />
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
              <div className="px-4 py-6 sm:px-0">
                <div className="flex items-center">
                  <Breadcrumbs />
                </div>
                {children}
              </div>
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
