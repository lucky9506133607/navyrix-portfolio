"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { siteConfig } from "@/lib/config/site";

const EMPTY = {
  fullName: "",
  email: "",
  phone: "",
  businessName: "",
  website: "",
  service: "",
  budget: "",
  message: "",
};

export default function ContactForm() {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | loading | success | error

  const set = (k) => (e) => {
    const v = e?.target ? e.target.value : e;
    setValues((s) => ({ ...s, [k]: v }));
    setErrors((s) => ({ ...s, [k]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!values.fullName.trim()) e.fullName = "Full name is required";
    if (!values.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
      e.email = "Enter a valid email";
    if (!values.phone.trim()) e.phone = "Phone is required";
    if (!values.businessName.trim()) e.businessName = "Business name is required";
    if (!values.service) e.service = "Please choose a service";
    if (!values.budget) e.budget = "Please choose a budget";
    if (!values.message.trim()) e.message = "Tell us a bit about the project";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setStatus("success");
      toast.success(data.message || "Message sent!");
      setValues(EMPTY);
    } catch (err) {
      setStatus("error");
      toast.error(err.message);
    }
  };

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-10 text-center"
      >
        <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-400" />
        <h3 className="mt-4 text-2xl font-semibold text-white">Message sent</h3>
        <p className="mt-2 text-white/70">
          Thanks for reaching out. We'll get back to you within one business day.
        </p>
        <Button
          variant="secondary"
          className="mt-6"
          onClick={() => setStatus("idle")}
        >
          Send another message
        </Button>
      </motion.div>
    );
  }

  const errCls = "text-xs text-red-400 mt-1 flex items-center gap-1";

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <Label htmlFor="fullName" className="text-white/80">Full Name *</Label>
          <Input id="fullName" value={values.fullName} onChange={set("fullName")} placeholder="Jane Doe" className="mt-2 bg-white/5 border-white/10 text-white placeholder:text-white/30" />
          {errors.fullName && <p className={errCls}><AlertCircle className="h-3 w-3" />{errors.fullName}</p>}
        </div>
        <div>
          <Label htmlFor="email" className="text-white/80">Email *</Label>
          <Input id="email" type="email" value={values.email} onChange={set("email")} placeholder="jane@company.com" className="mt-2 bg-white/5 border-white/10 text-white placeholder:text-white/30" />
          {errors.email && <p className={errCls}><AlertCircle className="h-3 w-3" />{errors.email}</p>}
        </div>
        <div>
          <Label htmlFor="phone" className="text-white/80">Phone *</Label>
          <Input id="phone" value={values.phone} onChange={set("phone")} placeholder="+1 415 555 0123" className="mt-2 bg-white/5 border-white/10 text-white placeholder:text-white/30" />
          {errors.phone && <p className={errCls}><AlertCircle className="h-3 w-3" />{errors.phone}</p>}
        </div>
        <div>
          <Label htmlFor="businessName" className="text-white/80">Business Name *</Label>
          <Input id="businessName" value={values.businessName} onChange={set("businessName")} placeholder="Acme Inc." className="mt-2 bg-white/5 border-white/10 text-white placeholder:text-white/30" />
          {errors.businessName && <p className={errCls}><AlertCircle className="h-3 w-3" />{errors.businessName}</p>}
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="website" className="text-white/80">Website <span className="text-white/40">(optional)</span></Label>
          <Input id="website" value={values.website} onChange={set("website")} placeholder="https://" className="mt-2 bg-white/5 border-white/10 text-white placeholder:text-white/30" />
        </div>
        <div>
          <Label className="text-white/80">Service Required *</Label>
          <Select value={values.service} onValueChange={set("service")}>
            <SelectTrigger className="mt-2 bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="Select a service" />
            </SelectTrigger>
            <SelectContent>
              {siteConfig.services.map((s) => (
                <SelectItem key={s.id} value={s.title}>{s.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.service && <p className={errCls}><AlertCircle className="h-3 w-3" />{errors.service}</p>}
        </div>
        <div>
          <Label className="text-white/80">Project Budget *</Label>
          <Select value={values.budget} onValueChange={set("budget")}>
            <SelectTrigger className="mt-2 bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="Select a budget" />
            </SelectTrigger>
            <SelectContent>
              {siteConfig.budgets.map((b) => (
                <SelectItem key={b} value={b}>{b}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.budget && <p className={errCls}><AlertCircle className="h-3 w-3" />{errors.budget}</p>}
        </div>
      </div>
      <div>
        <Label htmlFor="message" className="text-white/80">Message *</Label>
        <Textarea id="message" value={values.message} onChange={set("message")} placeholder="Tell us about the project, goals, and timeline..." rows={5} className="mt-2 bg-white/5 border-white/10 text-white placeholder:text-white/30" />
        {errors.message && <p className={errCls}><AlertCircle className="h-3 w-3" />{errors.message}</p>}
      </div>
      <Button
        type="submit"
        disabled={status === "loading"}
        className="group w-full sm:w-auto bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-400 hover:to-fuchsia-400 text-white font-semibold px-8 h-12"
      >
        {status === "loading" ? (
          <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending…</>
        ) : (
          <>Send message <Send className="ml-2 h-4 w-4 transition group-hover:translate-x-1" /></>
        )}
      </Button>
    </form>
  );
}
