import { siteConfig } from "@/lib/config/site";

export default function sitemap() {
  const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const now = new Date();

  const staticRoutes = ["", "#services", "#work", "#about", "#contact"].map(
    (r) => ({
      url: `${base}/${r}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: r === "" ? 1 : 0.7,
    })
  );

  const projects = siteConfig.portfolio.map((p) => ({
    url: `${base}/#work-${p.id}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...projects];
}
