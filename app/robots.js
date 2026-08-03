import { siteConfig } from "@/lib/config/site";

export default function robots() {
  const base = process.env.NEXT_PUBLIC_BASE_URL || "";
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
