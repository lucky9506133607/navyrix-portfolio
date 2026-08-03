"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Mail, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Try again");
      setStatus("success");
      toast.success(data.message || "Subscribed!");
      setEmail("");
    } catch (err) {
      setStatus("idle");
      setError(err.message);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-violet-500/10 via-fuchsia-500/5 to-transparent p-8 md:p-12">
      <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-fuchsia-500/20 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-violet-500/20 blur-3xl" />
      <div className="relative grid md:grid-cols-2 gap-8 items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
            <Mail className="h-3 w-3" /> The NAVYRIX Newsletter
          </div>
          <h3 className="mt-4 text-3xl md:text-4xl font-semibold tracking-tight text-white">
            Design & growth insights, in your inbox.
          </h3>
          <p className="mt-3 text-white/60 max-w-md">
            Curated case studies, industry breakdowns, and one useful tactic per week. No spam, ever.
          </p>
        </div>
        <div>
          {status === "success" ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-emerald-200"
            >
              <CheckCircle2 className="h-6 w-6" />
              <div>
                <div className="font-semibold">You're subscribed</div>
                <div className="text-sm text-emerald-200/70">Watch your inbox for our next drop.</div>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={submit} className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  placeholder="you@company.com"
                  className="h-12 bg-white/5 border-white/10 text-white placeholder:text-white/30"
                />
                <Button
                  type="submit"
                  disabled={status === "loading"}
                  className="h-12 px-6 bg-white text-black hover:bg-white/90 font-semibold"
                >
                  {status === "loading" ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Subscribing…</>
                  ) : (
                    "Subscribe"
                  )}
                </Button>
              </div>
              {error && <p className="text-xs text-red-400">{error}</p>}
              <p className="text-xs text-white/40">One email a week. Unsubscribe anytime.</p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
