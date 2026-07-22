import type { Metadata } from "next";
import { Cinzel, Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";
import UtsavSaathi from "@/components/chat/UtsavSaathi";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

const cinzel = Cinzel({
  variable: "--font-display",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "BookMyHalwai | India’s Event Services Marketplace",
    template: "%s | BookMyHalwai",
  },
  description: "Discover verified event vendors, venues and celebration services across India.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${jakarta.variable} ${cinzel.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="page-shell min-h-full flex flex-col text-slate-900">
        <AuthProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <UtsavSaathi />
        </AuthProvider>
      </body>
    </html>
  );
}
