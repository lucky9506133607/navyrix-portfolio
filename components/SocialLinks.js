"use client";

import {
  Instagram,
  Linkedin,
  Facebook,
  Twitter,
  Github,
} from "lucide-react";
import { siteConfig } from "@/lib/config/site";

// Behance & Dribbble aren't in lucide, use inline SVGs
const BehanceIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M7.799 5.698c.589 0 1.12.051 1.606.156.484.107.9.283 1.25.526.343.243.612.573.804.988.187.415.28.936.28 1.55 0 .663-.15 1.216-.454 1.657-.302.441-.752.802-1.35 1.081.816.234 1.424.646 1.824 1.234.399.589.6 1.298.6 2.126 0 .674-.13 1.257-.394 1.75a3.505 3.505 0 0 1-1.05 1.213c-.44.309-.949.541-1.516.694-.564.155-1.147.229-1.755.229H2V5.698h5.799zm4.985 3.65h5.916v1.55h-5.916v-1.55zm7.916 8.086c.526-.257.94-.61 1.24-1.06.302-.443.454-.945.454-1.506h-2.5c-.089.363-.298.678-.622.943-.322.264-.796.399-1.42.399-.844 0-1.469-.234-1.876-.699-.406-.467-.626-1.06-.66-1.771h6.995c.061-.798.001-1.567-.176-2.288-.176-.727-.469-1.366-.87-1.914-.4-.549-.925-.988-1.564-1.309-.641-.32-1.398-.484-2.267-.484-.778 0-1.481.129-2.109.393-.63.264-1.166.629-1.611 1.099a4.836 4.836 0 0 0-1.023 1.674c-.245.641-.365 1.324-.365 2.055 0 .756.11 1.443.34 2.075.229.633.559 1.185.99 1.65.43.462.949.827 1.559 1.079.606.256 1.298.383 2.079.383.766 0 1.492-.157 2.183-.464l-.077-.006zM4.518 8.145h2.94c.42 0 .809.038 1.166.117.36.077.681.211.964.393.283.181.51.42.679.712.166.291.25.663.25 1.113 0 .494-.111.9-.336 1.222a2.35 2.35 0 0 1-.877.75c-.35.176-.755.303-1.212.386-.457.086-.921.128-1.393.128H4.518V8.145zm0 8.28h3.222c.502 0 .977-.052 1.421-.156a3.63 3.63 0 0 0 1.187-.484c.339-.222.606-.522.804-.9.196-.377.294-.85.294-1.417 0-.567-.117-1.041-.35-1.42-.234-.378-.55-.678-.949-.9-.4-.223-.85-.383-1.35-.484-.5-.099-1.02-.15-1.556-.15H4.518v5.911z" />
  </svg>
);

const DribbbleIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="10" />
    <path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32" />
  </svg>
);

const SOCIAL_MAP = [
  { key: "instagram", Icon: Instagram, label: "Instagram" },
  { key: "linkedin", Icon: Linkedin, label: "LinkedIn" },
  { key: "facebook", Icon: Facebook, label: "Facebook" },
  { key: "twitter", Icon: Twitter, label: "X (Twitter)" },
  { key: "github", Icon: Github, label: "GitHub" },
  { key: "behance", Icon: BehanceIcon, label: "Behance" },
  { key: "dribbble", Icon: DribbbleIcon, label: "Dribbble" },
];

export default function SocialLinks({ className = "", iconClass = "h-5 w-5" }) {
  const items = SOCIAL_MAP.filter(({ key }) => Boolean(siteConfig.social[key]));
  if (!items.length) return null;
  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {items.map(({ key, Icon, label }) => (
        <a
          key={key}
          href={siteConfig.social[key]}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-all hover:border-primary/50 hover:bg-primary/10 hover:text-white"
        >
          <Icon className={iconClass} />
        </a>
      ))}
    </div>
  );
}
