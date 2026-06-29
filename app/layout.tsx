import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "GoBeans — Specialty Coffee Roastery, Bhavnagar, Gujarat",
  description:
    "GoBeans is a luxury specialty coffee brand on Ring Road, Bhavnagar, Gujarat. From bean to brew — experience the artistry behind every sip.",
  keywords: "GoBeans, specialty coffee Bhavnagar, coffee shop Gujarat, ring road cafe, artisan coffee India",
  openGraph: {
    title: "GoBeans — Specialty Coffee, Bhavnagar",
    description:
      "Crafted for those who appreciate every detail. Premium specialty coffee on Ring Road, Bhavnagar, Gujarat.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased bg-[#050505] text-white overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
