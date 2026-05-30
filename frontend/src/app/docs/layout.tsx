import React from "react"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "API Documentation | Sanskarut Tech Team Email Gateway",
  description: "Integrate transactional email gateway services with modern SHA-256 API authorization, responsive table layout templates, and custom data variables.",
  keywords: [
    "email gateway",
    "smtp API",
    "transactional mail",
    "developer dashboard",
    "SHA-256 API key",
    "email templates",
    "Sanskarut Tech Team",
  ],
  authors: [{ name: "Sanskarut Tech Team" }],
  openGraph: {
    title: "API Documentation | Sanskarut Tech Team Email Gateway",
    description: "Integrate transactional email gateway services with modern SHA-256 API authorization, responsive table layout templates, and custom data variables.",
    type: "website",
  },
}

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
