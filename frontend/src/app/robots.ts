import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://sanskarut.com";

  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/docs"],
      disallow: ["/dashboard/", "/auth/", "/api/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
