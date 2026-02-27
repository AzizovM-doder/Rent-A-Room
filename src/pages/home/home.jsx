import React, { useEffect, useRef, useState } from "react";
import { ArrowRight, Building2, Users, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Filter from "../../components/extra/filter";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { getUserToken } from "../../utils/url";
import { useSelector } from "react-redux";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const Home = () => {
  const { t } = useTranslation();
  const { items = [] } = useSelector((s) => s.listings || {});
  const heroRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);
  const [liveStats, setLiveStats] = useState(null);
  const user = (() => { try { return JSON.parse(getUserToken()); } catch { return null; } })();

  useEffect(() => {
    const handler = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    fetch(`${BASE_URL}/listings/stats`)
      .then((r) => r.json())
      .then(setLiveStats)
      .catch(() => {});
  }, []);

  const statCards = [
    { icon: Building2, value: liveStats?.total != null ? `${liveStats.total}` : "—", label: "Live listings" },
    { icon: Users, value: liveStats?.cities ? `${liveStats.cities.length}` : "—", label: "Cities covered" },
    { icon: TrendingUp, value: liveStats?.types ? `${liveStats.types.length}` : "—", label: "Property types" },
  ];

  const FEATURES = [
    { emoji: "🛡️", title: "Verified listings", desc: "Every property is reviewed before going live." },
    { emoji: "🌿", title: "Nature & city", desc: "Cosy places surrounded by nature or in the city centre." },
    { emoji: "⭐", title: "Top listings", desc: "Only the best rooms, selected by real renters." },
  ];

  return (
    <div className="flex flex-col gap-24 lg:gap-32">

      {/* ── Hero ──────────────────────────────── */}
      <section ref={heroRef} className="relative grid gap-10 lg:grid-cols-2 items-center min-h-[75vh] pt-4">
        {/* Enormous ambient blurs for the premium look */}
        <div className="pointer-events-none absolute top-0 -left-1/4 h-[600px] w-[600px] rounded-full bg-emerald-500/20 blur-[150px]" style={{ transform: `translateY(${scrollY * 0.1}px)` }} />
        <div className="pointer-events-none absolute -bottom-32 -right-1/4 h-[500px] w-[500px] rounded-full bg-teal-400/20 blur-[130px]" style={{ transform: `translateY(${-scrollY * 0.08}px)` }} />

        <div className="relative flex flex-col gap-8 animate-fade-up z-10">
          <div className="inline-flex items-center gap-2.5 rounded-full border border-emerald-200/50 bg-emerald-50/50 dark:border-emerald-800/50 dark:bg-emerald-900/20 backdrop-blur-md px-4 py-2 text-sm font-semibold text-emerald-700 dark:text-emerald-300 w-fit shadow-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>
            {liveStats ? `${liveStats.total} properties available today` : "Live listings — updated daily"}
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-[5rem] font-extrabold leading-[1.05] tracking-tight text-foreground">
            {t("main.hero.titleBefore")}{" "}
            <span className="relative inline-block whitespace-nowrap">
              <span className="relative z-10 bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">{t("main.hero.titleHighlight")}</span>
              <span className="absolute bottom-2 left-0 h-4 w-full rounded-full bg-emerald-200/60 dark:bg-emerald-800/40 -z-0 skew-x-[-12deg]" />
            </span>
            <br />{t("main.hero.titleAfter")}
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed font-medium">{t("main.hero.desc")}</p>

          <div className="flex flex-wrap items-center gap-4">
            <Link to="/#listings">
              <Button size="lg" className="h-14 rounded-2xl px-8 text-base bg-emerald-600 hover:bg-emerald-700 gap-2 shadow-xl shadow-emerald-600/20 hover:shadow-emerald-600/30 transition-all font-bold group">
                {t("main.hero.browseBtn")} <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to={user ? "/post" : "/login"}>
              <Button size="lg" variant="outline" className="h-14 rounded-2xl px-8 text-base gap-2 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 hover:text-emerald-600 font-bold transition-all bg-background/50 backdrop-blur">
                {t("main.hero.listBtn")}
              </Button>
            </Link>
          </div>

          {/* REAL stats row */}
          <div className="flex items-center divide-x border rounded-2xl bg-card/60 backdrop-blur shadow-sm w-fit mt-2">
            {statCards.map(({ icon: Icon, value, label }, idx) => (
              <div key={label} className={`flex items-center gap-4 px-6 py-4 ${idx === 0 ? "pl-5" : ""} ${idx === statCards.length - 1 ? "pr-6" : ""}`}>
                <div className="h-10 w-10 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center shrink-0">
                  <Icon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-xl font-extrabold leading-none">{value}</p>
                  <p className="text-xs font-semibold text-muted-foreground mt-1 uppercase tracking-wider">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hero visual */}
        <div className="relative hidden lg:flex items-center justify-center h-[600px] animate-fade-in z-10 w-full pl-10" style={{ transform: `translateY(${scrollY * 0.05}px)` }}>
          {/* Main big central card */}
          <div className="relative z-10 w-full max-w-[340px] aspect-[4/5] rounded-[36px] bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 p-8 flex flex-col justify-between shadow-2xl shadow-emerald-600/40 overflow-hidden ring-4 ring-background">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
            
            <div className="relative flex justify-between items-start">
              <div className="h-14 w-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20">
                <Building2 className="h-7 w-7 text-white" />
              </div>
              <div className="h-8 rounded-full bg-white/20 backdrop-blur-md px-4 flex items-center border border-white/20 text-white text-sm font-bold">
                {liveStats?.total || 0} listings
              </div>
            </div>

            <div className="relative text-white">
              <h3 className="text-3xl font-extrabold tracking-tight mb-2">Find your perfect stay.</h3>
              <p className="text-emerald-100/90 font-medium">Browse thousands of rooms and apartments in any city.</p>
              
              <div className="mt-8 h-12 w-full rounded-xl bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center group cursor-pointer hover:bg-white/30 transition-colors">
                <span className="font-bold">Explore properties</span>
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {[
            { top: "5%", left: "-5%", label: "Dushanbe Centre", price: liveStats?.minPrice ? `from $${liveStats.minPrice}/night` : "Available now", delay: "0ms", i: Building2 },
            { top: "50%", right: "-10%", label: liveStats?.cities?.[1] || "Mountain view", price: "Highly rated", delay: "200ms", i: TrendingUp },
            { bottom: "10%", left: "5%", label: liveStats?.types?.join(" · ") || "All types", price: `${liveStats?.total || "—"} listings`, delay: "100ms", i: Users },
          ].map(({ label, price, delay, i: Icon, ...pos }) => (
            <div key={label} className="absolute flex items-center gap-3.5 rounded-2xl bg-card border shadow-xl p-4 animate-float hover:scale-105 transition-transform cursor-default z-20" style={{ animationDelay: delay, ...pos }}>
              <div className="h-10 w-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                <Icon className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-bold leading-none">{label}</p>
                <p className="text-xs text-emerald-600 font-bold mt-1.5 bg-emerald-50 dark:bg-emerald-900/40 w-fit px-1.5 py-0.5 rounded-md">{price}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ───────────────────────────── */}
      <section className="animate-fade-up border-y bg-muted/30 -mx-4 px-4 py-16">
        <div className="mx-auto max-w-7xl grid gap-8 md:grid-cols-3">
          {FEATURES.map((f, i) => (
            <div key={i} className="flex flex-col items-center text-center p-6 bg-card rounded-3xl shadow-sm border hover:shadow-md transition-all hover:-translate-y-1">
              <div className="text-4xl mb-4 bg-muted h-16 w-16 rounded-2xl flex items-center justify-center">{f.emoji}</div>
              <h3 className="text-xl font-bold mb-2">{f.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Listings ─────────────────────────── */}
      <section id="listings" className="scroll-mt-24">
        <div className="mb-10 text-center flex flex-col items-center">
          <Badge className="mb-3 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-400 border-0 px-3 py-1">Explore</Badge>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">Browse rooms</h2>
          <p className="text-muted-foreground mt-3 text-lg max-w-2xl">
            {liveStats ? `Browse ${liveStats.total} properties across ${liveStats.cities.length} cities. Use the filters below to find exactly what you're looking for.` : "Filter by city, type, rooms and price"}
          </p>
        </div>

        {/* Filter component contains its own grid of Cards */}
        <Filter />
      </section>
    </div>
  );
};

export default Home;
