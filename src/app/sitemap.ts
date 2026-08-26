import { INTELLECTX_PUBLIC_SITE_URL } from "@/lib/site-config";
import type { MetadataRoute } from "next";

const publicRoutes = [
  "/",
  "/pricing",
  "/privacy-policy",
  "/terms-and-conditions",
  "/refund-policy",
  "/login",
  "/signup",
  "/forgot-password",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return publicRoutes.map((route) => ({
    url: `${INTELLECTX_PUBLIC_SITE_URL}${route}`,
    lastModified: new Date(),
  }));
}
