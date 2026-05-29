import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sanskarut Tech Agency | Web Applications & SaaS Development",
  description: "Sanskarut Tech Agency is a premier digital engineering agency specializing in custom web applications, SaaS platforms, high-performance websites, and advanced tech solutions.",
  keywords: ["Sanskarut", "tech agency", "web application development", "SaaS platforms", "custom websites", "software engineering", "Next.js agency", "Tailwind CSS"],
  authors: [{ name: "Sanskarut Tech Agency" }],
  openGraph: {
    title: "Sanskarut Tech Agency | Custom Web & SaaS Solutions",
    description: "Architecting high-performance web applications and scalable digital ecosystems for start-ups and enterprises.",
    type: "website",
    url: "https://sanskarut.com",
    siteName: "Sanskarut Tech Agency",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sanskarut Tech Agency | Custom Web & SaaS Solutions",
    description: "Architecting high-performance web applications and scalable digital ecosystems.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${inter.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">{children}</body>
    </html>
  );
}
