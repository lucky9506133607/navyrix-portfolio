"use client";

import { MessageCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/config/site";
import { whatsappLink } from "@/lib/utils/whatsapp";
import SocialLinks from "@/components/SocialLinks";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 py-12 mt-8">
      <div className="container">

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">

          {/* Brand */}
          <div>

            <div className="flex items-center gap-2 text-white font-semibold">

              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500">
                <Sparkles className="h-4 w-4 text-white" />
              </span>

              {siteConfig.agencyName}

            </div>

            <p className="mt-3 text-sm text-white/50 max-w-sm">
              {siteConfig.tagline}
            </p>

            {siteConfig.founders?.length ? (
              <div className="mt-3 space-y-0.5 text-xs text-white/50">

                {siteConfig.founders.map((f) => (
                  <div key={f.name}>

                    <span className="text-white/70">
                      {f.name}
                    </span>

                    <span className="text-white/40">
                      {" "}· {f.role}
                    </span>

                  </div>
                ))}

              </div>
            ) : null}

          </div>

          {/* Social + WhatsApp */}
          <div className="flex flex-col md:items-end gap-4">

            <SocialLinks />

            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="outline"
                size="sm"
                className="border-emerald-500/30 bg-emerald-500/5 text-emerald-300 hover:bg-emerald-500/10 hover:text-emerald-200"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                WhatsApp
              </Button>
            </a>

          </div>

        </div>

        {/* Copyright */}
        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/40">

          <div>
            © {new Date().getFullYear()} {siteConfig.agencyName}. All rights reserved.
          </div>

          <div>
            {siteConfig.contact.hours}
          </div>

        </div>

      </div>
    </footer>
  );
}
