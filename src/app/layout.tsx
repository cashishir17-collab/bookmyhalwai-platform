import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";
import DemoSeedLoader from "@/components/DemoSeedLoader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BookMyHalwai",
  description: "Verified halwai and caterer booking marketplace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.16),_transparent_35%),linear-gradient(135deg,_#fffaf5_0%,_#fff7ed_100%)] text-slate-900">
        <AuthProvider>
          <DemoSeedLoader />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
