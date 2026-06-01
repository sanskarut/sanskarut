import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://sanskarut.qzz.io";

  const routes = [
    "",
    "/about",
    "/services",
    "/pricing",
    "/contact",
    "/privacy",
    "/terms",
    "/blog",
    "/docs",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.8,
  }));
}