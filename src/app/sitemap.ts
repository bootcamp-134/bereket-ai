import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/status", "/sprint-1-demo", "/privacy"].map((path) => ({
    url: `https://bereket.app${path}`,
    changeFrequency: path === "/status" ? "daily" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}
