import { siteConfig } from "@/lib/config/site";

/**
 * Build a WhatsApp deep link from the configured number + an optional message.
 * Number should be digits only, e.g. "14155550198" (country code first, no +).
 */
export function whatsappLink(message = "") {
  const number = (siteConfig.contact.whatsapp || "").replace(/\D/g, "");
  if (!number) return "#";
  const text = encodeURIComponent(
    message ||
      `Hi ${siteConfig.agencyName}! I'd love to talk about a project.`
  );
  return `https://wa.me/${number}?text=${text}`;
}

export function formatPhone(raw) {
  return raw || "";
}
