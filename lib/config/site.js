// ============================================================
// SITE CONFIGURATION - Single source of truth
// Update anything here and it updates everywhere on the site.
// ============================================================

export const siteConfig = {
  // ---------- AGENCY IDENTITY ----------
  agencyName: "NAVYRIX",
  tagline: "Crafting Websites That Grow Businesses",
  shortDescription:
    "NAVYRIX is a premium web design and development agency that creates modern, high-converting websites with beautiful UI, responsive development, performance optimization, and SEO.",
  logoText: "NAVYRIX",
  founders: [
    { name: "Lucky Srivastava", role: "Founder" },
    { name: "Abhishek Srivastava", role: "Co-Founder" },
  ],

  // ---------- HERO ----------
  hero: {
    heading: "Build Websites That Grow Your Business",
    // We highlight the tail of the heading in gradient to match the existing UI treatment.
    headingHighlight: "Grow Your Business",
    subheading:
      "NAVYRIX is a premium web design and development agency creating modern, responsive, SEO-optimized websites that help businesses attract more customers, build trust, and increase conversions.",
    supportingText:
      "We design high-performance websites for gyms, restaurants, healthcare, real estate, startups, local businesses, and growing brands using modern technologies and user-focused design.",
  },

  // ---------- CONTACT ----------
  contact: {
    phone: "+91 95064 82575",
    whatsapp: "919219227239", // digits only, country code first (no + or spaces)
    email: "ls2170184@gmail.com",
    address: {
      line1: "Chakganjagiri Mubarakpur",
      line2: "Chhatameel",
      city: "",
      region: "",
      postal: "226201",
      country: "India",
    },
    hours: "Mon–Sat · 10:00 AM – 7:00 PM IST",
  },

  // ---------- SOCIAL LINKS ----------
  // Leave any URL empty ("") to auto-hide that social icon.
  social: {
    instagram: "#",
    linkedin: "#",
    facebook: "#",
    twitter: "#",
    github: "#",
    behance: "#",
    dribbble: "", // hidden if empty
  },

  // ---------- SERVICES (dropdown + services grid) ----------
  services: [
    {
      id: "web-design",
      title: "Web Design & Development",
      description:
        "High-converting websites engineered on Next.js. Blazing fast, SEO-ready.",
      icon: "Globe",
    },
    {
      id: "branding",
      title: "Brand Identity",
      description:
        "Logos, guidelines, and visual systems that command attention.",
      icon: "Sparkles",
    },
    {
      id: "ui-ux",
      title: "UI/UX Design",
      description:
        "Product design that delights users and drives measurable outcomes.",
      icon: "Layout",
    },
    {
      id: "seo",
      title: "SEO & Growth",
      description:
        "Technical SEO, content strategy, and paid acquisition that scales.",
      icon: "TrendingUp",
    },
    {
      id: "mobile-apps",
      title: "Mobile App Development",
      description:
        "Native-quality iOS & Android apps with elegant, thoughtful UX.",
      icon: "Smartphone",
    },
    {
      id: "content",
      title: "Content & Motion",
      description:
        "Videos, animations, and campaigns that make brands unforgettable.",
      icon: "Film",
    },
  ],

  // ---------- BUDGET RANGES (dropdown) ----------
  budgets: [
    "₹5,000 – ₹10,000",
    "₹10,000 – ₹20,000",
    "₹20,000 – ₹35,000",
    "₹35,000 – ₹50,000",
    "₹50,000+",
    "Not Sure (Let's Discuss)",
  ],

  // ---------- PORTFOLIO ----------
  portfolio: [
    {
      id: "elite-fitness",
      title: "Elite Fitness",
      category: "Web · Fitness",
      description:
        "Modern, high-converting website built for a premium fitness studio — mobile-first, fast, and SEO-ready.",
      image:
        "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80",
      link: "https://elit-fitness-beryl.vercel.app/",
      tags: ["Web", "Fitness", "Responsive"],
    },
    {
      id: "apex-fitness-lab",
      title: "Apex Fitness Lab",
      category: "Web · Fitness",
      description:
        "Bold identity + full website build for a CrossFit-style training lab — designed to convert leads into members.",
      image:
        "https://images.unsplash.com/photo-1669322779651-5ca89652492e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1OTN8MHwxfHNlYXJjaHwzfHxneW0lMjBjcm9zc2ZpdCUyMGludGVuc2UlMjB0cmFpbmluZ3xlbnwwfHx8fDE3ODUzNDU0ODN8MA&ixlib=rb-4.1.0&q=85",
      link: "https://apex-fitness-lab-1.preview.emergentagent.com/",
      tags: ["Web", "Fitness", "Branding"],
    },
  ],

  // ---------- TESTIMONIALS ----------
  testimonials: [
    {
      name: "Daniel Reyes",
      role: "CEO, Lumen Commerce",
      quote:
        "NAVYRIX rebuilt our brand and site in six weeks. Revenue is up 3.2x. They think like founders, execute like a top studio.",
      avatar:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80",
    },
    {
      name: "Priya Shah",
      role: "Head of Product, Orbit",
      quote:
        "Best creative partner we've ever worked with — full stop. Strategic, sharp, and obsessed with the details.",
      avatar:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    },
    {
      name: "Marcus Chen",
      role: "Founder, Pulse Health",
      quote:
        "They shipped what our in-house team couldn't in a year. Apple featured our app in Best of 2024.",
      avatar:
        "https://images.pexels.com/photos/37148308/pexels-photo-37148308.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
  ],

  // ---------- FAQ ----------
  faq: [
    {
      q: "What services do you offer?",
      a: "We design and develop modern, responsive websites for businesses of all sizes. Our services include business websites, landing pages, e-commerce websites, portfolio websites, SEO optimization, website maintenance, and performance optimization.",
    },
    {
      q: "How long does it take to build a website?",
      a: "The timeline depends on the project scope. A standard business website typically takes 1–3 weeks, while larger or custom projects may require additional time.",
    },
    {
      q: "Will my website work on mobile devices?",
      a: "Absolutely. Every website we build is fully responsive and optimized for desktops, tablets, and smartphones to ensure a seamless user experience.",
    },
    {
      q: "Do you offer website maintenance and support?",
      a: "Yes. We provide ongoing maintenance, security updates, bug fixes, performance monitoring, and technical support to keep your website running smoothly.",
    },
    {
      q: "How do I get started?",
      a: "Simply contact us through the website or WhatsApp. We'll schedule a free consultation, understand your requirements, and guide you through the entire process from planning to launch.",
    },
  ],

  // ---------- SEO ----------
  seo: {
    metaTitle:
      "NAVYRIX — Crafting Websites That Grow Businesses",
    metaDescription:
      "NAVYRIX is a premium web design and development agency that creates modern, high-converting websites with beautiful UI, responsive development, performance optimization, and SEO.",
    keywords: [
      "navyrix",
      "web design agency",
      "web development",
      "high converting websites",
      "seo agency",
      "nextjs development",
      "ui ux",
    ],
    ogImage:
      "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=1200&q=80",
    twitterHandle: "@navyrix",
  },

  // ---------- HERO IMAGE ----------
  heroImage:
    "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=1600&q=80",

  // ---------- STATS ----------
  stats: [
    { value: "120+", label: "Projects delivered" },
    { value: "9", label: "Years in business" },
    { value: "42", label: "Awards & features" },
    { value: "98%", label: "Client retention" },
  ],
};

export default siteConfig;
