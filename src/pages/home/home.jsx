import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight, Building2, MapPin, Heart, Search, Users, ShieldCheck, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Filter from "../../components/extra/filter";
import { listingsApi } from "../../api/listingsAPI";
import { getUserToken } from "../../utils/url";

const Home = () => {
  const { t } = useTranslation();
  const [scrollY, setScrollY] = useState(0);
  const [liveStats, setLiveStats] = useState(null);

  const user = (() => {
    try {
      const u = getUserToken();
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  })();

  useEffect(() => {
    const handleScroll = () => {
      requestAnimationFrame(() => setScrollY(window.scrollY));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    
    listingsApi.getAll().then(data => {
      if(data && data.length > 0) {
        const cities = [...new Set(data.filter(d => d.location?.en).map(d => d.location.en))];
        const prices = data.map(d => d.price).filter(p => !isNaN(p));
        setLiveStats({
          total: data.length,
          cities,
          minPrice: prices.length ? Math.min(...prices) : 0,
        });
      }
    }).catch(() => {});

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const FEATURES = [
    { title: t("main.features.0.title", "Smart Search"), desc: t("main.features.0.desc", "Find your perfect match instantly using smart filters."), icon: Search, color: "text-blue-500", bg: "bg-blue-500/10 border-blue-500/20" },
    { title: t("main.features.1.title", "Secure Booking"), desc: t("main.features.1.desc", "Your data is always encrypted and protected end-to-end."), icon: ShieldCheck, color: "text-emerald-500", bg: "bg-emerald-500/10 border-emerald-500/20" },
    { title: t("main.features.2.title", "Verified Hosts"), desc: t("main.features.2.desc", "Every property owner on our platform is thoroughly vetted."), icon: CheckCircle2, color: "text-amber-500", bg: "bg-amber-500/10 border-amber-500/20" }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background selection:bg-emerald-500/30">
      
      {/* ── 1. The Masterpiece Hero ──────────────────────────────────────────── */}
      {/* Note: Using overflow-hidden *strictly* on the background effect wrapper so the page itself has no x-scroll bugs, while background glows are clipped safely */}
      <section className="relative w-full min-h-[90vh] md:min-h-screen flex items-center justify-center pt-24 pb-12">
        
        {/* Safe Background Art Wrapper */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-background" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-emerald-900/15 via-background to-background" />
          
          <div 
            className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/10 blur-[120px] rounded-full translate-x-1/4 -translate-y-1/4"
            style={{ transform: `translate3d(25%, ${-25 + scrollY * 0.05}%, 0)` }}
          />
          <div 
            className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal-500/10 blur-[120px] rounded-full -translate-x-1/4 translate-y-1/4"
            style={{ transform: `translate3d(-25%, ${25 + scrollY * -0.05}%, 0)` }}
          />
        </div>

        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-12 grid lg:grid-cols-12 gap-16 lg:gap-8 items-center">
          
          {/* Hero Typography Col */}
          <div className="lg:col-span-6 flex flex-col items-start gap-8 z-20 mt-10 lg:mt-0">
            {/* Live Pill */}
            <div className="inline-flex items-center gap-2.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-md px-4 py-1.5 text-sm font-semibold text-emerald-800 dark:text-emerald-300 shadow-sm animate-fade-in-up">
              <Sparkles className="h-4 w-4 text-emerald-500" />
              <span>{liveStats ? `${liveStats.total} Premium Properties Available` : "Welcome to the future of housing"}</span>
            </div>

            {/* Title */}
            <h1 className="text-5xl sm:text-6xl lg:text-[5.5rem] font-black leading-[1.08] tracking-tight text-foreground animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              Find your <br className="hidden sm:block" />
              <span className="relative inline-block mt-2 mb-2 w-fit">
                <span className="relative z-10 bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400 bg-clip-text text-transparent pb-2 pr-2">perfect space.</span>
                <span className="absolute bottom-3 left-0 w-full h-4 bg-emerald-500/20 -z-0 -rotate-1 skew-x-12" />
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg sm:text-xl text-muted-foreground/90 max-w-lg leading-relaxed font-medium animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              Discover curated luxury apartments, cozy studios, and sprawling villas worldwide. Renting has never looked this good.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mt-4 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
              <Link to="/#listings" className="w-full sm:w-auto">
                <Button size="lg" className="h-14 w-full sm:w-auto rounded-full px-8 text-base bg-emerald-600 hover:bg-emerald-700 text-white gap-3 shadow-[0_0_30px_-5px_rgba(5,150,105,0.4)] hover:shadow-[0_0_40px_-5px_rgba(5,150,105,0.6)] hover:-translate-y-0.5 transition-all duration-300 font-bold group">
                  Start Exploring <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              {!user && (
                <Link to="/login" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="h-14 w-full sm:w-auto rounded-full px-8 text-base border-emerald-500/30 hover:bg-emerald-500/10 font-bold transition-all backdrop-blur-md">
                    Become a Host
                  </Button>
                </Link>
              )}
            </div>

            {/* Mini Users Social Proof */}
            <div className="flex items-center gap-4 mt-6 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
              <div className="flex -space-x-4">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-background overflow-hidden bg-muted">
                    <img src={`https://i.pravatar.cc/150?u=${i}`} alt="user" className="w-full h-full object-cover" />
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full border-2 border-background bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-xs font-bold text-emerald-700 dark:text-emerald-400 z-10">
                  +2k
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex gap-1 text-amber-400">
                  {[1,2,3,4,5].map(i => <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}
                </div>
                <span className="text-sm font-semibold text-muted-foreground mt-0.5">Highly trusted community</span>
              </div>
            </div>
          </div>

          {/* Hero Floating Artwork Col */}
          <div className="lg:col-span-6 relative hidden lg:block h-[700px] perspective-[1000px]">
             {/* Main Card */}
             <div 
                className="absolute top-[45%] left-1/2 w-full max-w-[420px] bg-background/60 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-[2.5rem] p-5 shadow-2xl z-20 transition-transform duration-1000 origin-bottom hover:rotate-0"
                style={{ transform: `translate(-50%, -50%) rotateY(-15deg) rotateX(5deg) translateY(${scrollY * 0.05}px)` }}
             >
                <div className="relative w-full aspect-[4/5] rounded-[2rem] overflow-hidden group">
                  <img src="https://images.unsplash.com/photo-1628624747186-a941c476b7ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Premium setup" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Floating Action within card */}
                  <div className="absolute top-4 right-4 h-10 w-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 cursor-pointer hover:bg-white/30 transition-colors">
                    <Heart className="h-5 w-5 text-white fill-white" />
                  </div>

                  <div className="absolute bottom-6 left-6 right-6 flex flex-col gap-2">
                    <Badge className="bg-white text-black hover:bg-white font-bold w-fit mb-1 border-0 shadow-lg">New Listing</Badge>
                    <h3 className="text-white text-2xl font-black leading-none drop-shadow-md">Penthouse Suite</h3>
                    <p className="text-white/80 text-sm flex items-center gap-1.5 font-medium"><MapPin className="h-3.5 w-3.5"/> Downtown Skyscraper</p>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-white/70 text-xs font-bold uppercase tracking-wider">Price</span>
                        <span className="text-white font-black text-2xl">$1,200<span className="text-sm font-medium opacity-70"> /mo</span></span>
                      </div>
                      <div className="h-12 w-12 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform cursor-pointer">
                        <ArrowRight className="h-5 w-5 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
             </div>

             {/* Backdrop Floating Elements positioned strictly inside bounds */}
             <div 
               className="absolute top-[8%] left-[0%] bg-background/80 backdrop-blur-xl border border-border/50 p-4 rounded-3xl shadow-2xl flex items-center gap-4 z-30"
               style={{ transform: `translateY(${scrollY * -0.05}px)` }}
             >
               <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shrink-0 shadow-inner">
                 <Building2 className="h-7 w-7 text-white" />
               </div>
               <div>
                 <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Total Properties</p>
                 <p className="text-2xl font-black">{liveStats?.total || "500+"}</p>
               </div>
             </div>

             <div 
               className="absolute bottom-[20%] right-[0%] bg-background p-4 rounded-3xl shadow-2xl border flex items-center gap-4 z-30"
               style={{ transform: `translateY(${scrollY * 0.1}px)` }}
             >
               <div className="flex -space-x-3">
                 <div className="h-12 w-12 rounded-full border-2 border-background bg-blue-100 flex items-center justify-center"><Users className="h-5 w-5 text-blue-600" /></div>
                 <div className="h-12 w-12 rounded-full border-2 border-background bg-amber-100 flex items-center justify-center"><Heart className="h-5 w-5 text-amber-600" /></div>
               </div>
               <div className="pr-4 pl-2">
                 <p className="text-sm font-bold leading-tight">10k+ Happy<br/>Renters</p>
               </div>
             </div>

          </div>
        </div>
      </section>

      {/* ── 2. Bento Grid Features ───────────────────────────────────────────── */}
      <section className="relative w-full py-24 bg-muted/30 border-y">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1 md:col-span-3 mb-6 text-center">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">Why choose us?</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">We've engineered the perfect platform for seamless property hunting.</p>
          </div>
          
          {FEATURES.map((feature, i) => (
             <div key={i} className={`p-8 md:p-10 rounded-[2rem] bg-card border shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col gap-6 group`}>
                <div className={`h-16 w-16 rounded-2xl border flex items-center justify-center ${feature.bg} group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`h-8 w-8 ${feature.color}`} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed font-medium">{feature.desc}</p>
                </div>
             </div>
          ))}
        </div>
      </section>

      {/* ── 3. Listings Section with Filters ─────────────────────────────────── */}
      <section id="listings" className="scroll-mt-32 w-full max-w-7xl mx-auto px-6 md:px-12 py-24 mb-16">
        <div className="mb-16 text-center flex flex-col items-center">
          <Badge className="mb-4 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-0 px-4 py-1.5 text-sm font-bold uppercase tracking-widest hover:bg-emerald-500/20">
            {t("nav.home", "Explore Catalog")}
          </Badge>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6">Discover your next home</h2>
          <p className="text-muted-foreground text-lg sm:text-xl max-w-2xl font-medium">
            {liveStats ? `Browse ${liveStats.total} handpicked properties across ${liveStats.cities.length || 1} cities.` : "Filter by city, type, and price to find the perfect fit."}
          </p>
        </div>

        {/* The Filter component dynamically maps and renders the listings */}
        <Filter />
      </section>

    </div>
  );
};

export default Home;
