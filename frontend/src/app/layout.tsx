import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import Script from "next/script";
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
  metadataBase: new URL("https://sanskarut.qzz.io"),
  title: "Sanskarut Tech Team | Web Applications & SaaS Development",
  description: "Sanskarut Tech Team is a premier digital engineering team specializing in custom web applications, SaaS platforms, high-performance websites, and advanced tech solutions.",
  keywords: ["Sanskarut", "tech team", "web application development", "SaaS platforms", "custom websites", "software engineering", "Next.js team", "Tailwind CSS"],
  authors: [{ name: "Sanskarut Tech Team" }],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Sanskarut Tech Team | Custom Web & SaaS Solutions",
    description: "Architecting high-performance web applications and scalable digital ecosystems for start-ups and enterprises.",
    type: "website",
    url: "https://sanskarut.qzz.io",
    siteName: "Sanskarut Tech Team",
    images: [
      {
        url: "/images/sanskar.png",
        width: 800,
        height: 600,
        alt: "Sanskarut Tech Team Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sanskarut Tech Team | Custom Web & SaaS Solutions",
    description: "Architecting high-performance web applications and scalable digital ecosystems.",
    images: ["/images/sanskar.png"],
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Sanskarut Tech Team",
  "url": "https://sanskarut.qzz.io",
  "logo": "https://sanskarut.qzz.io/favicon.ico",
  "sameAs": [
    "https://github.com/sanskarut",
    "https://linkedin.com/company/sanskarut",
    "https://twitter.com/sanskarut"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "email": "mr.sanskar@sanskarut.qzz.io",
    "availableLanguage": ["en"]
  },
  "founder": {
    "@type": "Person",
    "name": "Sanskar Bandgar"
  }
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
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        {children}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID || "G-EEQCD3HK0Q"}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID || "G-EEQCD3HK0Q"}');
          `}
        </Script>
      </body>
    </html>
  );
}
