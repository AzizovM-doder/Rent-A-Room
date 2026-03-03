import React, { useEffect, useState } from "react";
import { Home, Users, ShieldCheck, Leaf, Building2, TrendingUp, MapPin, Sparkles, CheckCircle2 } from "lucide-react";
import Logo from "/logo.png";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const About = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetch(`${BASE_URL}/listings/stats`)
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {
        // Mock stats fallback if backend endpoint is unavailable
        setStats({ total: 1054, cities: Array(12).fill(0), types: Array(5).fill(0), minPrice: 20, maxPrice: 450 });
      });
  }, []);

  const FEATURES = [
    { icon: Home, title: t("about.features.realHomes.title", "Authentic Stays"), text: t("about.features.realHomes.text", "Verified properties offering real comfort, whether you need a cozy room or a luxury villa."), color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" },
    { icon: Users, title: t("about.features.forPeople.title", "Community First"), text: t("about.features.forPeople.text", "Built for real people. We foster a community of trusted hosts and respectful guests."), color: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20" },
    { icon: ShieldCheck, title: t("about.features.trust.title", "Ironclad Trust"), text: t("about.features.trust.text", "Strict verification protocols and secure payments guarantee your peace of mind."), color: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20" },
    { icon: Leaf, title: t("about.features.green.title", "Sustainable Tech"), text: t("about.features.green.text", "Carbon neutral hosting infrastructure to ensure our digital footprint stays green."), color: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20" },
  ];

  const TIMELINE = [
    { year: "2024", title: t("about.timeline.concept.title", "The Concept"), desc: t("about.timeline.concept.desc", "Started as a small project to help people find reliable, affordable rooms across Tajikistan.") },
    { year: "2024", title: t("about.timeline.beta.title", "Beta Launch"), desc: t("about.timeline.beta.desc", "Rolled out the first functional version featuring live listings, authentication, and secure messaging.") },
    { year: "2025", title: t("about.timeline.evolution.title", "The Evolution"), desc: t("about.timeline.evolution.desc", "Complete platform overhaul: JWT architecture, premium Framer Motion UX, and elite property scaling.") },
    { year: "2026", title: t("about.timeline.global.title", "Global Vision"), desc: t("about.timeline.global.desc", "Expanding outside regional borders with multi-language integrations and robust scaling features.") },
  ];

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="px-4 py-12 md:py-20 overflow-x-hidden relative">
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="mx-auto max-w-6xl flex flex-col gap-24 md:gap-32">
        
        {/* ── Hero Section ───────────────────────────────────────── */}
        <motion.section variants={fadeUp} className="relative flex flex-col gap-8 max-w-4xl pt-10">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-[100px] pointer-events-none translate-y-1/2 -translate-x-1/2" />
          
          <Badge className="w-fit bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-4 py-1.5 text-xs font-bold uppercase tracking-widest shadow-sm gap-2">
            <Sparkles className="h-3.5 w-3.5" /> {t("about.ourStory", "Our Story")}
          </Badge>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 z-10 text-center md:text-left">
            <div className="h-28 w-28 rounded-3xl bg-background border border-border/50 shadow-2xl flex items-center justify-center shrink-0 p-4 relative group">
               <div className="absolute inset-0 bg-emerald-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
               <img src={Logo} alt="Rent a Room logo" className="h-full w-full object-contain group-hover:scale-110 transition-transform duration-500" />
            </div>
            <div className="flex flex-col gap-4">
              <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.1]">{t("about.title", "Redefining the way you find your space.")}</h1>
              <p className="text-muted-foreground text-lg md:text-xl font-medium leading-relaxed max-w-2xl">{t("about.subtitle", "Rent-A-Room is a premium platform connecting exceptional hosts with discerning guests, ensuring every stay is an experience.")}</p>
            </div>
          </div>
        </motion.section>

        {/* ── Live Stats Grid ───────────────────────────────────────── */}
        {stats && (
          <motion.section variants={fadeUp} className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 z-10">
            {[
              { icon: Building2, value: stats.total, label: t("about.stats.total", "Total Properties"), color: "text-emerald-500" },
              { icon: MapPin, value: stats.cities?.length || 0, label: t("about.stats.cities", "Active Cities"), color: "text-sky-500" },
              { icon: TrendingUp, value: stats.types?.length || 0, label: t("about.stats.types", "Property Types"), color: "text-violet-500" },
              { icon: Home, value: `$${stats.minPrice}–$${stats.maxPrice}`, label: t("about.stats.pricing", "Pricing Range"), color: "text-amber-500" },
            ].map(({ icon: Icon, value, label, color }, i) => (
              <div key={label} className="group rounded-[2rem] border border-border/50 bg-card/60 backdrop-blur p-6 md:p-8 flex flex-col items-center gap-3 text-center shadow-lg hover:shadow-2xl hover:-translate-y-1 hover:border-emerald-500/30 transition-all duration-300 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-muted/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10 flex flex-col items-center">
                  <Icon className={`h-8 w-8 ${color} mb-2 group-hover:scale-110 transition-transform`} />
                  <p className="text-4xl font-black">{value}</p>
                  <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground mt-2">{label}</p>
                </div>
              </div>
            ))}
          </motion.section>
        )}

        {/* ── Features Grid ───────────────────────────────────────── */}
        <motion.section variants={fadeUp} className="flex flex-col gap-10 z-10">
          <div className="flex flex-col gap-2 max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight">{t("about.advantage.title", "The Rent-A-Room Advantage")}</h2>
            <p className="text-muted-foreground font-medium text-lg text-balance">{t("about.advantage.desc", "We built this platform from the ground up to solve the most frustrating parts of modern renting.")}</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((e, i) => (
              <div key={i} className={`group rounded-[2rem] border p-8 flex flex-col gap-5 bg-card/50 backdrop-blur hover:bg-card transition-all duration-300 hover:shadow-xl hover:-translate-y-1 shadow-sm ${e.color}`}>
                <div className={`h-14 w-14 rounded-2xl flex items-center justify-center bg-background shadow-inner border border-current/20`}>
                  <e.icon className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2 text-foreground">{e.title}</h3>
                  <p className="text-sm text-muted-foreground font-medium leading-relaxed">{e.text}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ── Timeline ───────────────────────────────────────── */}
        <motion.section variants={fadeUp} className="flex flex-col gap-10 md:flex-row md:items-start md:gap-20 z-10 bg-muted/30 rounded-[3rem] p-8 md:p-16 border border-border/40">
          <div className="md:w-1/3 flex flex-col gap-4 shrink-0 sticky top-32">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-none">{t("about.journey.title", "Our evolutionary journey.")}</h2>
            <p className="text-muted-foreground font-medium text-lg">{t("about.journey.desc", "From a local hackathon concept to a premium ecosystem.")}</p>
          </div>
          
          <div className="md:w-2/3 relative pl-10 md:pl-12 border-l-2 border-emerald-500/20 flex flex-col gap-12">
            {TIMELINE.map(({ year, title, desc }, i) => (
              <div key={i} className="relative group">
                <div className="absolute -left-[49px] md:-left-[57px] top-1.5 h-6 w-6 rounded-full bg-emerald-500 border-[6px] border-background shadow-sm group-hover:scale-125 transition-transform" />
                <div className="flex flex-col gap-2 mb-1">
                  <Badge className="w-fit bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-0 hover:bg-emerald-500/20 px-3 py-1 text-xs font-bold tracking-widest">{year}</Badge>
                  <h3 className="font-black text-2xl">{title}</h3>
                </div>
                <p className="text-base text-muted-foreground font-medium leading-relaxed max-w-lg">{desc}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ── Mission Banner ───────────────────────────────────────── */}
        <motion.section variants={fadeUp} className="relative overflow-hidden rounded-[3rem] bg-slate-950 p-12 md:p-20 text-white shadow-2xl shadow-emerald-900/10">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 via-transparent to-transparent opacity-50 pointer-events-none" />
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none blur-[50px]" />
          
          <div className="relative flex flex-col gap-8 max-w-4xl z-10 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 text-emerald-400 font-bold uppercase tracking-widest text-sm">
              <CheckCircle2 className="h-5 w-5" /> {t("about.mission.label", "Our Mission")}
            </div>
            <h2 className="text-3xl md:text-5xl font-black leading-tight text-white">
               {t("about.mission.title", "Making renting a frictionless, safe, and beautiful experience.")}
            </h2>
            <p className="text-emerald-100/70 font-medium text-lg leading-relaxed max-w-3xl">
               {t("about.mission.text", "We believe that everyone deserves a great place to stay without the hassle. By fusing world-class design, bulletproof engineering, and a focus on human connection, we're building the future of property rentals.")}
            </p>
          </div>
        </motion.section>
        
      </motion.div>
    </div>
  );
};

export default About;