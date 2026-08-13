"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Check,
  ArrowRight,
  Sparkles,
  Globe,
  Zap,
  Crown,
} from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "₹7,999",
    description:
      "Perfect for small businesses that need a professional online presence.",
    icon: Globe,
    features: [
      "Professional responsive website",
      "Up to 5 pages",
      "Mobile & tablet optimized",
      "Contact form",
      "WhatsApp integration",
      "Basic SEO setup",
      "Social media links",
      "Fast deployment",
    ],
    popular: false,
  },

  {
    name: "Business",
    price: "₹12,999",
    description:
      "A complete website solution for growing businesses and local brands.",
    icon: Sparkles,
    features: [
      "Everything in Starter",
      "Up to 8 pages",
      "Premium modern UI/UX",
      "Advanced animations",
      "Google Maps integration",
      "Lead/contact management",
      "Advanced SEO setup",
      "Google Analytics setup",
      "Performance optimization",
      "Custom business sections",
    ],
    popular: true,
  },

  {
    name: "Premium",
    price: "₹19,999",
    description:
      "A premium digital experience built for businesses that want to stand out.",
    icon: Crown,
    features: [
      "Everything in Business",
      "Unlimited sections",
      "Premium animations",
      "Advanced interactive UI",
      "Custom functionality",
      "Advanced lead generation",
      "Conversion-focused design",
      "Advanced SEO",
      "Priority support",
      "Custom integrations",
    ],
    popular: false,
  },
];

const addOns = [
  {
    title: "Additional Page",
    price: "₹1,000+",
  },
  {
    title: "Advanced SEO",
    price: "₹2,500+",
  },
  {
    title: "WhatsApp Integration",
    price: "₹500",
  },
  {
    title: "Google Business Setup",
    price: "₹1,000+",
  },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white overflow-hidden">

      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-violet-600/10 blur-[140px] rounded-full" />

        <div className="absolute top-[700px] left-[-200px] w-[500px] h-[500px] bg-fuchsia-600/5 blur-[140px] rounded-full" />

        <div className="absolute top-[1200px] right-[-200px] w-[500px] h-[500px] bg-violet-600/5 blur-[140px] rounded-full" />
      </div>

      {/* Navigation */}
      <nav className="relative z-20 border-b border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <Link
            href="/"
            className="text-xl font-bold tracking-wide"
          >
            NAVY<span className="text-violet-400">RIX</span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">

            <Link
              href="/"
              className="text-sm text-white/60 transition hover:text-white"
            >
              Home
            </Link>

            <Link
              href="/#services"
              className="text-sm text-white/60 transition hover:text-white"
            >
              Services
            </Link>

            <Link
              href="/#projects"
              className="text-sm text-white/60 transition hover:text-white"
            >
              Projects
            </Link>

            <Link
              href="/pricing"
              className="text-sm text-white transition"
            >
              Pricing
            </Link>

            <Link
              href="/#contact"
              className="rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-5 py-2.5 text-sm font-semibold transition hover:scale-105"
            >
              Let's Talk
            </Link>

          </div>

          <Link
            href="/#contact"
            className="rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-4 py-2 text-sm font-semibold md:hidden"
          >
            Let's Talk
          </Link>

        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 px-6 pb-16 pt-24 md:pb-20 md:pt-32">

        <div className="mx-auto max-w-4xl text-center">

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/60"
          >
            <Sparkles className="h-4 w-4 text-violet-400" />
            Simple & Transparent Pricing
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold leading-tight md:text-6xl"
          >
            Choose the right plan
            <br />

            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-violet-400 bg-clip-text text-transparent">
              for your business
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/50 md:text-lg"
          >
            Professional websites designed to help your business
            build trust, generate leads and grow online.
          </motion.p>

        </div>

      </section>

      {/* Pricing Cards */}
      <section className="relative z-10 px-6 pb-24">

        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-3">

          {plans.map((plan, index) => {

            const Icon = plan.icon;

            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                }}
                className={`relative flex flex-col rounded-3xl border p-7 backdrop-blur-xl transition duration-300 hover:-translate-y-2 ${
                  plan.popular
                    ? "border-violet-500/50 bg-violet-500/[0.07] shadow-2xl shadow-violet-500/10"
                    : "border-white/10 bg-white/[0.03] hover:border-white/20"
                }`}
              >

                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-5 py-2 text-xs font-bold shadow-lg shadow-violet-500/20">
                      MOST POPULAR
                    </div>
                  </div>
                )}

                {/* Icon */}
                <div
                  className={`mb-6 flex h-12 w-12 items-center justify-center rounded-2xl ${
                    plan.popular
                      ? "bg-violet-500/20 text-violet-300"
                      : "bg-white/5 text-white/70"
                  }`}
                >
                  <Icon className="h-6 w-6" />
                </div>

                {/* Plan */}
                <h2 className="text-2xl font-semibold">
                  {plan.name}
                </h2>

                <p className="mt-3 min-h-[72px] text-sm leading-relaxed text-white/45">
                  {plan.description}
                </p>

                {/* Price */}
                <div className="mt-6 flex items-end gap-2">
                  <span className="text-4xl font-bold">
                    {plan.price}
                  </span>

                  <span className="mb-1 text-sm text-white/40">
                    / project
                  </span>
                </div>

                {/* CTA */}
                <Link
                  href="/#contact"
                  className={`mt-7 flex h-12 items-center justify-center gap-2 rounded-xl font-semibold transition ${
                    plan.popular
                      ? "bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-400 hover:to-fuchsia-400"
                      : "border border-white/10 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Link>

                {/* Divider */}
                <div className="my-7 h-px bg-white/10" />

                {/* Features */}
                <div className="flex-1">

                  <p className="mb-5 text-sm font-semibold text-white/80">
                    What's included
                  </p>

                  <ul className="space-y-3">

                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-3 text-sm text-white/55"
                      >
                        <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-violet-500/10">
                          <Check className="h-3 w-3 text-violet-400" />
                        </span>

                        <span>{feature}</span>
                      </li>
                    ))}

                  </ul>

                </div>

              </motion.div>
            );
          })}

        </div>

      </section>

      {/* Add-ons */}
      <section className="relative z-10 border-t border-white/10 px-6 py-24">

        <div className="mx-auto max-w-5xl">

          <div className="mb-12 text-center">

            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/50">
              <Zap className="h-4 w-4 text-violet-400" />
              Optional Add-ons
            </div>

            <h2 className="text-3xl font-bold md:text-4xl">
              Need something extra?
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-white/45">
              Add additional services to your website whenever
              your business needs them.
            </p>

          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            {addOns.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-violet-500/30 hover:bg-white/[0.05]"
              >

                <p className="text-sm text-white/60">
                  {item.title}
                </p>

                <p className="mt-2 text-xl font-semibold">
                  {item.price}
                </p>

              </div>
            ))}

          </div>

        </div>

      </section>

      {/* Custom Quote */}
      <section className="relative z-10 px-6 pb-28">

        <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-violet-500/20 bg-gradient-to-br from-violet-500/10 via-white/[0.03] to-fuchsia-500/10 p-8 text-center md:p-14">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10">
            <Sparkles className="h-7 w-7 text-violet-400" />
          </div>

          <h2 className="mt-6 text-3xl font-bold md:text-4xl">
            Have a custom requirement?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-white/50">
            Every business is different. Tell us what you need
            and we'll create a custom solution around your goals.
          </p>

          <Link
            href="/#contact"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-7 py-3.5 font-semibold transition hover:scale-105"
          >
            Get a Custom Quote
            <ArrowRight className="h-4 w-4" />
          </Link>

        </div>

      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 px-6 py-8">

        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">

          <Link
            href="/"
            className="text-lg font-bold"
          >
            NAVY<span className="text-violet-400">RIX</span>
          </Link>

          <p className="text-sm text-white/30">
            © {new Date().getFullYear()} NAVYRIX. All rights reserved.
          </p>

          <Link
            href="/#contact"
            className="text-sm text-white/50 transition hover:text-white"
          >
            Contact Us →
          </Link>

        </div>

      </footer>

    </main>
  );
}
