"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/config/site";

export default function Header() {
  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-40 w-[min(1200px,calc(100%-2rem))]">
      <div className="glass rounded-full flex items-center justify-between px-5 py-3">

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-white font-semibold"
        >
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500">
            <Sparkles className="h-4 w-4 text-white" />
          </span>

          {siteConfig.logoText}
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm text-white/70">

          <Link
            href="/#services"
            className="hover:text-white transition"
          >
            Services
          </Link>

          <Link
            href="/#work"
            className="hover:text-white transition"
          >
            Work
          </Link>

          <Link
            href="/#faq"
            className="hover:text-white transition"
          >
            FAQ
          </Link>

          <Link
            href="/pricing"
            className="hover:text-white transition"
          >
            Pricing
          </Link>

          <Link
            href="/#contact"
            className="hover:text-white transition"
          >
            Contact
          </Link>

        </nav>

        {/* CTA */}
        <Link href="/#contact">
          <Button
            size="sm"
            className="bg-white text-black hover:bg-white/90 font-medium rounded-full"
          >
            Get in touch
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>

      </div>
    </header>
  );
}
