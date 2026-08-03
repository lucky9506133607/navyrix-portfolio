import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { siteConfig } from "@/lib/config/site";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  ),
  title: {
    default: siteConfig.seo.metaTitle,
    template: `%s · ${siteConfig.agencyName}`,
  },
  description: siteConfig.seo.metaDescription,
  keywords: siteConfig.seo.keywords,
  authors: [{ name: siteConfig.agencyName }],
  creator: siteConfig.agencyName,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: siteConfig.agencyName,
    title: siteConfig.seo.metaTitle,
    description: siteConfig.seo.metaDescription,
    images: [
      {
        url: siteConfig.seo.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.agencyName,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.seo.metaTitle,
    description: siteConfig.seo.metaDescription,
    images: [siteConfig.seo.ogImage],
    creator: siteConfig.seo.twitterHandle,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },
  alternates: { canonical: "/" },
};

export const viewport = {
  themeColor: "#0b0b0f",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: siteConfig.agencyName,
    image: siteConfig.seo.ogImage,
    description: siteConfig.seo.metaDescription,
    url: process.env.NEXT_PUBLIC_BASE_URL,
    telephone: siteConfig.contact.phone,
    email: siteConfig.contact.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: `${siteConfig.contact.address.line1}, ${siteConfig.contact.address.line2}`,
      addressLocality: siteConfig.contact.address.city,
      addressRegion: siteConfig.contact.address.region,
      postalCode: siteConfig.contact.address.postal,
      addressCountry: siteConfig.contact.address.country,
    },
    sameAs: Object.values(siteConfig.social).filter(Boolean),
    priceRange: "$$$",
  };

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans bg-background text-foreground`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
