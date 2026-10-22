import type { MetadataRoute } from "next";
import { allPages } from "./route-map";
export default function sitemap(): MetadataRoute.Sitemap {
  const origin = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3010";
  return allPages
    .filter(
      (p) =>
        p.kind !== "status" &&
        !p.path.startsWith("/workspace") &&
        !p.path.startsWith("/auth"),
    )
    .map((p) => ({
      url: `${origin}${p.path}`,
      changeFrequency: "monthly",
      priority: p.path === "/" ? 1 : 0.6,
    }));
}
