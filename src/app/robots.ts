import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/reset-password" },
    sitemap: "https://bereket.app/sitemap.xml",
  };
}
