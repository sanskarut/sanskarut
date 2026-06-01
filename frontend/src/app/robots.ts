import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/docs",
          "/pricing",
          "/privacy",
          "/services",
          "/blog",
          "/contact",
          "/about",
        ],
        disallow: [
          "/dashboard",
          "/dashboard/",
          "/auth",
          "/auth/",
          "/api",
          "/api/",
        ],
      },
    ],
    sitemap: "https://sanskarut.qzz.io/sitemap.xml",
    host: "https://sanskarut.qzz.io",
  };
}