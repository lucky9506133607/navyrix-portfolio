"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  Globe,
  Layout,
  TrendingUp,
  Smartphone,
  Film,
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Star,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

import { siteConfig } from "@/lib/config/site";
import { whatsappLink } from "@/lib/utils/whatsapp";
import ContactForm from "@/components/ContactForm";
import Newsletter from "@/components/Newsletter";
import SocialLinks from "@/components/SocialLinks";
import WhatsAppFloat from "@/components/WhatsAppFloat";

const ICONS = { Globe, Sparkles, Layout, TrendingUp, Smartphone, Film };

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: "easeOut" },
};

function Nav() {
  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-40 w-[min(1200px,calc(100%-2rem))]">
      <div className="glass rounded-full flex items-center justify-between px-5 py-3">
        <Link href="/" className="flex items-center gap-2 text-white font-semibold">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500">
            <Sparkles className="h-4 w-4 text-white" />
          </span>
          {siteConfig.logoText}
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm text-white/70">
          <a href="#services" className="hover:text-white transition">Services</a>
          <a href="#work" className="hover:text-white transition">Work</a>
          <a href="#faq" className="hover:text-white transition">FAQ</a>
          <a href="#contact" className="hover:text-white transition">Contact</a>
        </nav>
        <a href="#contact">
          <Button size="sm" className="bg-white text-black hover:bg-white/90 font-medium rounded-full">
            Get in touch <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden pt-40 pb-24 md:pt-48 md:pb-32">
      <div className="absolute inset-0 grid-bg opacity-40 [mask-image:radial-gradient(circle_at_top,white,transparent_70%)]" />
      <div className="absolute top-20 -left-32 h-96 w-96 rounded-full bg-violet-500/20 blur-[120px]" />
      <div className="absolute top-40 -right-32 h-96 w-96 rounded-full bg-fuchsia-500/20 blur-[120px]" />

      <div className="container relative">
        <motion.div {...fadeUp} className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Taking on 2 new projects this quarter
          </div>
          <h1 className="mt-6 text-5xl sm:text-6xl md:text-7xl font-semibold tracking-tight text-white leading-[1.05]">
            Build Websites That{" "}
            <span className="gradient-text">Grow Your Business</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-white/60 max-w-2xl mx-auto">
            {siteConfig.hero.subheading}
          </p>
          <p className="mt-4 text-sm md:text-base text-white/45 max-w-2xl mx-auto">
            {siteConfig.hero.supportingText}
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <a href="#contact">
              <Button size="lg" className="h-12 px-6 bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-400 hover:to-fuchsia-400 text-white font-semibold">
                Start a project <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </a>
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="h-12 px-6 border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white">
                <MessageCircle className="mr-2 h-4 w-4 text-emerald-400" />
                Chat on WhatsApp
              </Button>
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="mx-auto mt-20 max-w-5xl"
        >
          <div className="relative rounded-3xl overflow-hidden border border-white/10 glow">
            <div className="aspect-[16/9] relative">
              <Image
                src={siteConfig.heroImage}
                alt="Creative studio workspace"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 1000px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
            </div>
          </div>
        </motion.div>

        <div className="mt-20 max-w-4xl mx-auto" />
      </div>
    </section>
  );
}

function Services() {
  return (
    <section id="services" className="py-24 md:py-32 relative">
      <div className="container">
        <motion.div {...fadeUp} className="max-w-2xl">
          <Badge variant="outline" className="border-white/15 bg-white/5 text-white/70">Services</Badge>
          <h2 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight text-white">
            Everything you need to <span className="gradient-text">win online</span>.
          </h2>
          <p className="mt-4 text-white/60">
            One team, end-to-end. From strategy to launch, we handle every piece of your digital presence.
          </p>
        </motion.div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {siteConfig.services.map((s, i) => {
            const Icon = ICONS[s.icon] || Sparkles;
            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 hover:border-white/20 hover:bg-white/[0.06] transition"
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-white/10">
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-white">{s.title}</h3>
                <p className="mt-2 text-sm text-white/60 leading-relaxed">{s.description}</p>
                <ArrowUpRight className="absolute top-6 right-6 h-5 w-5 text-white/20 group-hover:text-white group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Portfolio() {
  return (
    <section id="work" className="py-24 md:py-32 relative">
      <div className="container">
        <motion.div {...fadeUp} className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <Badge variant="outline" className="border-white/15 bg-white/5 text-white/70">Selected Work</Badge>
            <h2 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight text-white">
              Recent <span className="gradient-text">launches</span>.
            </h2>
          </div>
          <p className="text-white/60 max-w-sm">
            A snapshot of the brands, products, and platforms we've shipped in the last twelve months.
          </p>
        </motion.div>

        <div className="mt-14 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {siteConfig.portfolio.map((p, i) => (
            <motion.a
              id={`work-${p.id}`}
              key={p.id}
              href={p.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="group block overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] hover:border-white/20 transition"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={p.image}
                  alt={p.title}
                  fill
                  loading="lazy"
                  sizes="(max-width: 1024px) 100vw, 400px"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs text-white/50">{p.category}</div>
                    <h3 className="mt-1 text-lg font-semibold text-white">{p.title}</h3>
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-white/30 group-hover:text-white transition" />
                </div>
                <p className="mt-3 text-sm text-white/60 leading-relaxed">{p.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <span key={t} className="text-[11px] uppercase tracking-wider text-white/50 border border-white/10 rounded-full px-2 py-0.5">{t}</span>
                  ))}
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section id="about" className="py-24 md:py-32 relative">
      <div className="container">
        <motion.div {...fadeUp} className="max-w-2xl">
          <Badge variant="outline" className="border-white/15 bg-white/5 text-white/70">Testimonials</Badge>
          <h2 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight text-white">
            Loved by <span className="gradient-text">founders & CMOs</span>.
          </h2>
        </motion.div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
          {siteConfig.testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
            >
              <div className="flex gap-1 text-yellow-400">
                {[...Array(5)].map((_, i) => (<Star key={i} className="h-4 w-4 fill-yellow-400" />))}
              </div>
              <p className="mt-4 text-white/80 leading-relaxed">"{t.quote}"</p>
              <div className="mt-6 flex items-center gap-3">
                <div className="relative h-10 w-10 rounded-full overflow-hidden border border-white/10">
                  <Image src={t.avatar} alt={t.name} fill loading="lazy" sizes="40px" className="object-cover" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{t.name}</div>
                  <div className="text-xs text-white/50">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  return (
    <section id="faq" className="py-24 md:py-32 relative">
      <div className="container">
        <div className="grid md:grid-cols-[1fr,1.5fr] gap-12">
          <motion.div {...fadeUp}>
            <Badge variant="outline" className="border-white/15 bg-white/5 text-white/70">FAQ</Badge>
            <h2 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight text-white">
              Common <span className="gradient-text">questions</span>.
            </h2>
            <p className="mt-4 text-white/60">
              Something else? Ping us on WhatsApp — we usually reply within an hour.
            </p>
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="inline-flex mt-6">
              <Button variant="outline" className="border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white">
                <MessageCircle className="mr-2 h-4 w-4 text-emerald-400" /> Ask on WhatsApp
              </Button>
            </a>
          </motion.div>
          <motion.div {...fadeUp}>
            <Accordion type="single" collapsible className="space-y-3">
              {siteConfig.faq.map((f, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="rounded-xl border border-white/10 bg-white/[0.03] px-5">
                  <AccordionTrigger className="text-left text-white hover:no-underline">{f.q}</AccordionTrigger>
                  <AccordionContent className="text-white/60">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="py-24 md:py-32 relative">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="container">
        <div className="grid lg:grid-cols-[1fr,1.4fr] gap-12">
          <motion.div {...fadeUp}>
            <Badge variant="outline" className="border-white/15 bg-white/5 text-white/70">Contact</Badge>
            <h2 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight text-white">
              Let's build something <span className="gradient-text">people love</span>.
            </h2>
            <p className="mt-4 text-white/60">
              Fill out the form and we'll get back within one business day. Prefer to chat? Reach out on WhatsApp.
            </p>

            <div className="mt-8 space-y-4">
              <a href={`tel:${siteConfig.contact.phone}`} className="flex items-center gap-3 text-white/80 hover:text-white transition">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 border border-white/10">
                  <Phone className="h-4 w-4" />
                </span>
                {siteConfig.contact.phone}
              </a>
              <a href={`mailto:${siteConfig.contact.email}`} className="flex items-center gap-3 text-white/80 hover:text-white transition">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 border border-white/10">
                  <Mail className="h-4 w-4" />
                </span>
                {siteConfig.contact.email}
              </a>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-white/80 hover:text-white transition">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <MessageCircle className="h-4 w-4 text-emerald-400" />
                </span>
                WhatsApp us instantly
              </a>
              <div className="flex items-start gap-3 text-white/80">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 border border-white/10">
                  <MapPin className="h-4 w-4" />
                </span>
                <div>
                  <div>{[siteConfig.contact.address.line1, siteConfig.contact.address.line2].filter(Boolean).join(", ")}</div>
                  <div className="text-white/50 text-sm">
                    {[siteConfig.contact.address.city, siteConfig.contact.address.region, siteConfig.contact.address.postal, siteConfig.contact.address.country].filter(Boolean).join(" ")}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <SocialLinks />
            </div>
          </motion.div>

          <motion.div {...fadeUp} className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 md:p-10 backdrop-blur">
            <ContactForm />
          </motion.div>
        </div>

        <div className="mt-24">
          <Newsletter />
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/10 py-12 mt-8">
      <div className="container">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-white font-semibold">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500">
                <Sparkles className="h-4 w-4 text-white" />
              </span>
              {siteConfig.agencyName}
            </div>
            <p className="mt-3 text-sm text-white/50 max-w-sm">{siteConfig.tagline}</p>
            {siteConfig.founders?.length ? (
              <div className="mt-3 space-y-0.5 text-xs text-white/50">
                {siteConfig.founders.map((f) => (
                  <div key={f.name}>
                    <span className="text-white/70">{f.name}</span>
                    <span className="text-white/40"> · {f.role}</span>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
          <div className="flex flex-col md:items-end gap-4">
            <SocialLinks />
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="border-emerald-500/30 bg-emerald-500/5 text-emerald-300 hover:bg-emerald-500/10 hover:text-emerald-200">
                <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp
              </Button>
            </a>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <div>© {new Date().getFullYear()} {siteConfig.agencyName}. All rights reserved.</div>
          <div>{siteConfig.contact.hours}</div>
        </div>
      </div>
    </footer>
  );
}

function App() {
  return (
    <main className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
      <Nav />
      <Hero />
      <Services />
      <Portfolio />
      <FAQ />
      <Contact />
      <Footer />
      <WhatsAppFloat />
    </main>
  );
}

export default App;
