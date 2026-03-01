import React, { useEffect, useRef, useState } from "react";
import { ArrowRight, Building2, Users, TrendingUp, MapPin, Heart } from "lucide-react";
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
    <div className="flex flex-col gap-24 lg:gap-32 overflow-x-hidden">
      {/* ── High-End Hero ──────────────────────────────── */}
      <section ref={heroRef} className="relative w-full min-h-[85vh] flex items-center justify-center pt-24 pb-12">
        {/* Subtle, contained background effects (no overflow) */}
        <div className="absolute inset-0 z-0 bg-background" />
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/10 via-background to-background dark:from-emerald-900/20" />
        
        {/* Decorative Grid */}
        <div className="absolute inset-0 z-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAzNHYtbGgyNHYybC0yNCAuLjEiIGZpbGw9IiM5Q0EwQUEiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjxwYXRoIGQ9Ik0zNCAzNnYyNGgtMnYtMjRsLjEuLi4iIGZpbGw9IiM5Q0EwQUEiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvZz48L3N2Zz4=')] opacity-50 dark:opacity-30 mask-image:linear-gradient(to_bottom,white,transparent)]" />
        
        {/* Contained Glows - Using max-w-full to prevent x-overflow */}
        <div 
          className="absolute top-0 right-0 w-[800px] h-[600px] max-w-full bg-emerald-500/10 dark:bg-emerald-500/20 blur-[120px] rounded-full pointer-events-none translate-x-1/3 -translate-y-1/4"
          style={{ transform: `translate3d(30%, ${-20 + scrollY * 0.05}%, 0)` }}
        />
        <div 
          className="absolute bottom-10 left-0 w-[600px] h-[600px] max-w-full bg-teal-500/10 dark:bg-teal-500/15 blur-[120px] rounded-full pointer-events-none -translate-x-1/3"
          style={{ transform: `translate3d(-30%, ${scrollY * 0.02}%, 0)` }}
        />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 flex flex-col items-start gap-8 animate-fade-up">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-emerald-200/40 bg-white/40 dark:border-emerald-800/50 dark:bg-emerald-950/40 backdrop-blur-xl px-4 py-1.5 text-sm font-semibold text-emerald-800 dark:text-emerald-300 shadow-sm transition-transform hover:scale-105">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </span>
              <span className="tracking-wide">
                {liveStats ? `${liveStats.total} properties active today` : "Live listings worldwide"}
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-[5.5rem] font-black leading-[1.05] tracking-tight text-foreground">
              {t("main.hero.titleBefore")}{" "}
              <div className="relative inline-block mt-2 mb-2">
                <span className="relative z-10 bg-gradient-to-br from-emerald-600 to-teal-400 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent pb-2">{t("main.hero.titleHighlight")}</span>
              </div>
              <br />{t("main.hero.titleAfter")}
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-xl leading-relaxed font-medium">
              {t("main.hero.desc")}
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mt-4">
              <Link to="/#listings" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto h-14 rounded-full px-8 text-base bg-emerald-600 hover:bg-emerald-700 text-white gap-2 shadow-[0_0_40px_-10px_rgba(5,150,105,0.4)] hover:shadow-[0_0_60px_-15px_rgba(5,150,105,0.6)] transition-all duration-300 font-bold group">
                  {t("main.hero.browseBtn")} <ArrowRight className="h-5 w-5 group-hover:translate-x-1.5 transition-transform" />
                </Button>
              </Link>
              <Link to={user ? "/post" : "/login"} className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 rounded-full px-8 text-base gap-2 border-emerald-200 dark:border-emerald-800 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 font-bold transition-all bg-background/50 backdrop-blur-md">
                  {t("main.hero.listBtn")}
                </Button>
              </Link>
            </div>

            {/* Seamless Stat Row */}
            <div className="grid grid-cols-3 gap-8 pt-8 mt-4 border-t border-border/50 w-full max-w-lg">
              {statCards.map(({ icon: Icon, value, label }, idx) => (
                <div key={label} className="flex flex-col gap-2">
                  <div className="text-3xl sm:text-4xl font-black text-foreground">{value}</div>
                  <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-muted-foreground">
                    <Icon className="h-4 w-4 text-emerald-500" />
                    <span className="uppercase tracking-wider">{label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Visual Column (Absolute Masterpiece) */}
          <div className="lg:col-span-5 relative hidden lg:block h-[700px] animate-fade-in" style={{ transform: `translateY(${scrollY * 0.08}px)` }}>
            {/* The Main floating glass device */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[400px] aspect-[9/16] rounded-[2.5rem] bg-background/40 backdrop-blur-2xl border border-white/20 dark:border-white/10 p-4 shadow-2xl flex flex-col gap-4 overflow-hidden z-20">
              {/* Inner screen glare */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-white/20 dark:from-white/0 dark:to-white/5 pointer-events-none" />
              
              {/* Top Image Area */}
              <div className="relative w-full h-[55%] rounded-[1.75rem] overflow-hidden bg-muted group">
                <img 
                  src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Mansion" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end text-white">
                  <div>
                    <Badge className="bg-emerald-500 hover:bg-emerald-600 border-none mb-2">Featured</Badge>
                    <h3 className="font-bold text-lg leading-tight">Modern Villa</h3>
                    <p className="text-white/80 text-sm flex items-center gap-1"><MapPin className="h-3 w-3"/> Beverly Hills</p>
                  </div>
                  <div className="font-bold text-xl">$450<span className="text-sm font-normal text-white/70">/mo</span></div>
                </div>
              </div>

              {/* Bottom UI Mockup */}
              <div className="flex-1 rounded-[1.75rem] bg-card p-5 border shadow-sm flex flex-col gap-4 relative">
                <div className="flex items-center justify-between">
                  <div className="h-2 w-24 bg-muted rounded-full skeleton" />
                  <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center"><Heart className="h-4 w-4 text-emerald-600" /></div>
                </div>
                <div className="h-2 w-full bg-muted rounded-full skeleton" />
                <div className="h-2 w-2/3 bg-muted rounded-full skeleton" />
                
                <div className="mt-auto flex gap-3">
                  <div className="h-12 w-full bg-emerald-600 rounded-xl" />
                  <div className="h-12 w-12 bg-muted rounded-xl shrink-0" />
                </div>
              </div>
            </div>

            {/* Floating UI Elements matching the theme */}
            <div className="absolute top-[15%] -left-12 bg-background/80 backdrop-blur-xl border p-4 rounded-2xl shadow-xl flex items-center gap-4 animate-float z-30" style={{ animationDelay: '0s' }}>
              <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center font-bold text-emerald-600 text-lg">4.9</div>
              <div>
                <p className="text-sm font-bold">Excellent Rating</p>
                <div className="flex gap-1 mt-1">
                  {[1,2,3,4,5].map(i => <div key={i} className="h-3 w-3 rounded-sm bg-amber-400" />)}
                </div>
              </div>
            </div>

            <div className="absolute bottom-[25%] -right-8 bg-background/80 backdrop-blur-xl border p-4 rounded-2xl shadow-xl flex items-center gap-3 animate-float z-30" style={{ animationDelay: '1.5s' }}>
              <Users className="h-8 w-8 text-emerald-600" />
              <div>
                <p className="text-xs text-muted-foreground font-semibold uppercase">Active Renters</p>
                <p className="text-lg font-black leading-none mt-0.5">10,000+</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ───────────────────────────── */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 md:px-8 w-full -mt-10 mb-10">
        <div className="grid gap-6 md:grid-cols-3">
          {FEATURES.map((f, i) => (
            <div key={i} className="group relative overflow-hidden flex flex-col p-8 bg-card/50 backdrop-blur-sm rounded-3xl border shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="text-4xl mb-6 h-16 w-16 bg-background rounded-2xl flex items-center justify-center shadow-sm border group-hover:scale-110 transition-transform duration-300">{f.emoji}</div>
              <h3 className="text-xl font-bold mb-3">{f.title}</h3>
              <p className="text-muted-foreground leading-relaxed font-medium">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Listings ─────────────────────────── */}
      <section id="listings" className="scroll-mt-32 max-w-7xl mx-auto px-4 md:px-8 w-full mb-32">
        <div className="mb-12 text-center flex flex-col items-center">
          <Badge className="mb-4 bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300 border-0 px-4 py-1.5 text-sm font-bold uppercase tracking-widest">
            {t("nav.home", "Explore")}
          </Badge>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Discover your next home</h2>
          <p className="text-muted-foreground text-lg sm:text-xl max-w-2xl font-medium">
            {liveStats ? `Browse ${liveStats.total} handpicked properties across ${liveStats.cities.length} cities.` : "Filter by city, type, rooms and price to find the perfect fit."}
          </p>
        </div>

        {/* Filter component contains its own grid of Cards */}
        <Filter />
      </section>
    </div>
  );
};

export default Home;
