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
    { name: "Lucky Srivastava", role: "Co-founder" },
    { name: "Abhishek Srivastava", role: "Co-founder" },
  ],

  // ---------- CONTACT ----------
  contact: {
    phone: "+1 (415) 555-0198",
    whatsapp: "14155550198", // digits only, country code first (no + or spaces)
    email: "hello@navyrix.com",
    address: {
      line1: "228 Park Avenue",
      line2: "Suite 4B",
      city: "San Francisco",
      region: "CA",
      postal: "94103",
      country: "United States",
    },
    hours: "Mon–Fri · 9:00 AM – 7:00 PM PST",
  },

  // ---------- SOCIAL LINKS ----------
  // Leave any URL empty ("") to auto-hide that social icon.
  social: {
    instagram: "https://instagram.com/navyrix",
    linkedin: "https://linkedin.com/company/navyrix",
    facebook: "https://facebook.com/navyrix",
    twitter: "https://x.com/navyrix",
    github: "https://github.com/navyrix",
    behance: "https://behance.net/navyrix",
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
    "Under $5,000",
    "$5,000 – $10,000",
    "$10,000 – $25,000",
    "$25,000 – $50,000",
    "$50,000 – $100,000",
    "$100,000+",
  ],

  // ---------- PORTFOLIO ----------
  portfolio: [
    {
      id: "lumen-ecommerce",
      title: "Lumen Commerce",
      category: "E-commerce · Web",
      description:
        "A full brand + Shopify rebuild that lifted checkout conversion by 41%.",
      image:
        "https://images.unsplash.com/photo-1587440871875-191322ee64b0?auto=format&fit=crop&w=1200&q=80",
      link: "#",
      tags: ["Web", "E-commerce", "Branding"],
    },
    {
      id: "orbit-identity",
      title: "Orbit — Brand System",
      category: "Branding · Identity",
      description:
        "A complete visual identity, tone of voice, and brand guidelines for a Series-A fintech.",
      image:
        "https://images.pexels.com/photos/7598007/pexels-photo-7598007.jpeg?auto=compress&cs=tinysrgb&w=1200",
      link: "#",
      tags: ["Branding", "Identity", "Guidelines"],
    },
    {
      id: "pulse-app",
      title: "Pulse — Wellness App",
      category: "Mobile · UI/UX",
      description:
        "Native iOS + Android app design and dev. Featured by Apple in Best of 2024.",
      image:
        "https://images.unsplash.com/photo-1581287053822-fd7bf4f4bfec?auto=format&fit=crop&w=1200&q=80",
      link: "#",
      tags: ["Mobile", "iOS", "UI/UX"],
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
      q: "How long does a typical project take?",
      a: "Most branding + web builds run 6–10 weeks end to end. Product design engagements are usually retainer-based (monthly).",
    },
    {
      q: "How much do you charge?",
      a: "Fixed-scope projects start at $10K. Larger builds and retainers scale from there — share your budget and we'll tailor a plan.",
    },
    {
      q: "Do you work with startups or only large companies?",
      a: "Both. About 60% of our clients are Seed–Series B startups, the rest are established brands scaling to their next phase.",
    },
    {
      q: "Where are you based, and do you work remotely?",
      a: "HQ in San Francisco. Team across 4 timezones. We work with clients globally — 100% remote-friendly.",
    },
    {
      q: "Can I hire you for just design (or just development)?",
      a: "Yes — pick and choose. Some clients bring us in only for strategy, only design, or only engineering. We plug into your team.",
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
