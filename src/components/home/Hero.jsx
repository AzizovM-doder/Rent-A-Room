import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Building, Star, Sparkles, ChevronRight, Play } from "lucide-react";
import { useTranslation } from "react-i18next";

const Hero = ({ liveStats, user }) => {
  const { t } = useTranslation();

  const scrollToSearch = () => {
    document.getElementById("search-section")?.scrollIntoView({ behavior: "smooth" });
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  const stagger = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  return (
    <section className="relative w-full min-h-[800px] flex items-center justify-center overflow-hidden bg-slate-950 pt-20 pb-16">
      {/* Background Visuals - Edge to Edge */}
      <div className="absolute inset-0 w-full h-full z-0">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 opacity-70 mix-blend-screen pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4 opacity-60 mix-blend-screen pointer-events-none" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2675&auto=format&fit=crop')] bg-cover bg-center bg-no-repeat opacity-20 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
        <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px]" />
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Text Content */}
          <motion.div variants={stagger} initial="hidden" animate="visible" className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left pt-10">
            
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-bold uppercase tracking-wider mb-8 backdrop-blur-md shadow-lg shadow-emerald-500/10">
              <Sparkles className="h-4 w-4" />
              <span>{t("hero.badge", "Premium Living Spaces")}</span>
            </motion.div>

            <motion.div variants={fadeUp} className="flex flex-col gap-4">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.1]">
                {t("hero.titlePart1", "Rent your")} <br className="hidden md:block"/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                  {t("hero.titlePart2", "perfect space.")}
                </span>
              </h1>
              <p className="text-lg md:text-xl text-white/70 font-medium max-w-xl leading-relaxed mt-4">
                {t("hero.subtitle", "Discover luxury apartments, cozy studios, and sprawling villas worldwide. Elevate your living standards with curated, top-tier properties.")}
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center gap-4 mt-10 w-full sm:w-auto">
              <Button onClick={scrollToSearch} className="h-14 px-8 rounded-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 hover:text-white font-black text-lg transition-all shadow-xl shadow-emerald-500/20 hover:scale-105 hover:-translate-y-1 w-full sm:w-auto">
                <Search className="mr-2 h-5 w-5" />
                {t("hero.btnExplore", "Explore Catalog")}
              </Button>
              <Button variant="outline" asChild className="h-14 px-8 rounded-full border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold text-lg backdrop-blur-md transition-all w-full sm:w-auto hover:scale-105 hover:-translate-y-1">
                <Link to={user ? "/post" : "/login"}>
                  <Play className="mr-2 h-5 w-5 fill-current" />
                  {t("hero.btnHost", "Become a Host")}
                </Link>
              </Button>
            </motion.div>

            {liveStats && (
              <motion.div variants={fadeUp} className="flex items-center gap-8 mt-12 pt-8 border-t border-white/10">
                <div className="flex flex-col">
                  <span className="text-3xl font-black text-white">{liveStats.total}+</span>
                  <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold mt-1">{t("hero.stats.properties", "Properties")}</span>
                </div>
                <div className="w-px h-10 bg-white/10" />
                <div className="flex flex-col">
                  <span className="text-3xl font-black text-white">{liveStats.cities.length || 50}</span>
                  <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold mt-1">{t("hero.stats.cities", "Cities Covered")}</span>
                </div>
                <div className="w-px h-10 bg-white/10" />
                <div className="flex flex-col">
                  <span className="text-3xl font-black text-white">${liveStats.minPrice}+</span>
                  <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold mt-1">{t("hero.stats.starting", "Starting from")}</span>
                </div>
              </motion.div>
            )}

          </motion.div>

          {/* Floating Image Section */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            className="lg:col-span-5 relative hidden lg:block"
          >
            <div className="relative z-10 rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl shadow-emerald-900/40 transform rotate-2 hover:rotate-0 transition-transform duration-500 ease-out group">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60 z-10" />
              <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1470&auto=format&fit=crop" alt="Premium Mansion" className="w-full h-auto object-cover transform scale-105 transition-transform duration-700 group-hover:scale-110" />
              
              <div className="absolute bottom-6 left-6 right-6 z-20 flex justify-between items-end">
                 <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-2xl flex flex-col gap-1 shadow-xl">
                   <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-sm">
                     <Star className="h-4 w-4 fill-emerald-400" />
                     <span>4.98</span>
                   </div>
                   <span className="text-white font-medium text-sm">{t("hero.card.rating", "Exceptional Rating")}</span>
                 </div>
                 
                 <div className="h-12 w-12 rounded-full bg-emerald-500 flex items-center justify-center text-slate-950 shadow-xl hover:-translate-y-1 transition-transform cursor-pointer">
                   <ChevronRight className="h-6 w-6" />
                 </div>
              </div>
            </div>

            {/* Small floating badge */}
            <motion.div 
              animate={{ y: [0, -10, 0] }} 
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -top-6 -right-6 z-20 bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-2xl shadow-2xl flex items-center gap-4"
            >
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center">
                <Building className="h-6 w-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-white/70 font-bold uppercase tracking-widest">{t("hero.card.status", "Status")}</span>
                <span className="text-white font-black text-lg">{t("hero.card.verified", "Verified Homes")}</span>
              </div>
            </motion.div>

          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
