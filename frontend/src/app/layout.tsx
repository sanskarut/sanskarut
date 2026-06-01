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

  title: {
    default: "Sanskarut Tech Team",
    template: "%s | Sanskarut Tech Team",
  },

  description:
    "Sanskarut Tech Team builds modern websites, SaaS products, custom web applications, AI solutions, and digital platforms for startups, businesses, and students.",

  applicationName: "Sanskarut Tech Team",

  keywords: [
    "Sanskarut Tech Team",
    "Website Development",
    "Next.js Development",
    "Web Applications",
    "SaaS Development",
    "Software Development India",
    "Digital Solutions",
    "Baramati Web Developer",
    "Pune Website Developer",
  ],

  creator: "Sanskarut Tech Team",
  publisher: "Sanskarut Tech Team",

  alternates: {
    canonical: "https://sanskarut.qzz.io",
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },

  robots: {
    index: true,
    follow: true,
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
    type: "website",
    locale: "en_US",
    url: "https://sanskarut.qzz.io",
    siteName: "Sanskarut Tech Team",

    title:
      "Sanskarut Tech Team | Websites, SaaS & Custom Software Development",

    description:
      "Custom websites, SaaS platforms, AI integrations and scalable digital solutions.",

    images: [
      {
        url: "/images/logo.png",
        width: 1200,
        height: 630,
        alt: "Sanskarut Tech Team",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title:
      "Sanskarut Tech Team | Websites, SaaS & Software Development",

    description:
      "Building modern websites, SaaS products and digital experiences.",

    images: ["/images/logo.png"],
  },
};
const organizationSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://sanskarut.qzz.io/#organization",

      name: "Sanskarut Tech Team",

      url: "https://sanskarut.qzz.io",

      logo: {
        "@type": "ImageObject",
        url: "https://sanskarut.qzz.io/images/logo.png",
      },

      email: "support@sanskarut.qzz.io",

      sameAs: [
        "https://github.com/sanskarut",
        "https://instagram.com/sanskarut.tech",
        "https://facebook.com/sanskarut",
        "https://x.com/sanskarut",
      ],
    },

    {
      "@type": "WebSite",

      "@id": "https://sanskarut.qzz.io/#website",

      url: "https://sanskarut.qzz.io",

      name: "Sanskarut Tech Team",

      publisher: {
        "@id": "https://sanskarut.qzz.io/#organization",
      },
    },
  ],
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
        <Script
          id="organization-schema"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
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
