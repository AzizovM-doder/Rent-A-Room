import React from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { Sparkles, MapPin, Heart, Users, Building2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";

const Hero = ({ liveStats, user }) => {
  const { scrollY } = useScroll();
  const { t } = useTranslation();
  const y1 = useTransform(scrollY, [0, 1000], [0, 150]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -100]);
  const yArtwork = useTransform(scrollY, [0, 1000], [0, 100]);
  const yFloat1 = useTransform(scrollY, [0, 1000], [0, -80]);
  const yFloat2 = useTransform(scrollY, [0, 1000], [0, 120]);

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  return (
    <section className="relative w-full min-h-[90vh] md:min-h-screen flex items-center justify-center pt-24 pb-12 z-0 overflow-hidden bg-background">
      {/* ── Background Elements (Full Width, Safe from clipping) ── */}
      <div className="absolute inset-0 pointer-events-none -z-10 bg-background">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-emerald-900/15 via-transparent to-transparent opacity-60" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{ y: y1 }}
          className="absolute top-0 right-0 w-[50vw] h-[50vw] max-w-[800px] min-w-[300px] bg-emerald-500/10 blur-[120px] rounded-full translate-x-1/4 -translate-y-1/4"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
          style={{ y: y2 }}
          className="absolute bottom-0 left-0 w-[40vw] h-[40vw] max-w-[600px] min-w-[250px] bg-teal-500/10 blur-[120px] rounded-full -translate-x-1/4 translate-y-1/4"
        />
      </div>

      {/* ── Content Container (Proper padding, centered) ── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-12 grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        
        {/* Hero Typography */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="lg:col-span-6 flex flex-col items-start gap-8 z-20 mt-10 lg:mt-0"
        >
          {/* Live Pill */}
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-md px-5 py-2 text-sm font-semibold text-emerald-800 dark:text-emerald-300 shadow-sm">
            <Sparkles className="h-4 w-4 text-emerald-500" />
            <span>{liveStats ? `${liveStats.total} ${t("hero.premiumLive", "Premium Properties Available")}` : t("hero.welcome", "Welcome to the future of housing")}</span>
          </motion.div>

          {/* Title */}
          <motion.h1 variants={fadeInUp} className="text-5xl sm:text-6xl lg:text-[5.5rem] xl:text-[6.5rem] font-black leading-[1.08] tracking-tight text-foreground">
            {t("hero.findYour", "Find your")} <br className="hidden sm:block" />
            <span className="relative inline-block mt-2 mb-2 w-fit">
              <span className="relative z-10 bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400 bg-clip-text text-transparent pb-3 pr-2">{t("hero.perfectSpace", "perfect space.")}</span>
              <span className="absolute bottom-4 left-0 w-full h-5 bg-emerald-500/20 -z-0 -rotate-1 skew-x-12" />
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p variants={fadeInUp} className="text-lg sm:text-xl lg:text-2xl text-muted-foreground/90 max-w-xl leading-relaxed font-medium">
            {t("hero.desc", "Discover curated luxury apartments, cozy studios, and sprawling villas worldwide. Renting has never looked this good.")}
          </motion.p>

          {/* CTAs */}
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mt-4">
            <Button size="lg" className="h-14 w-full sm:w-auto rounded-full px-10 text-lg bg-emerald-600 hover:bg-emerald-700 text-white gap-3 shadow-[0_0_30px_-5px_rgba(5,150,105,0.4)] hover:shadow-[0_0_40px_-5px_rgba(5,150,105,0.6)] hover:-translate-y-0.5 transition-all duration-300 font-bold group" onClick={() => {
              document.getElementById('search-section')?.scrollIntoView({ behavior: 'smooth' });
            }}>
              {t("hero.startExploring", "Start Exploring")} <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            {!user && (
              <Link to="/login" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="h-14 w-full sm:w-auto rounded-full px-10 text-lg border-emerald-500/30 hover:bg-emerald-500/10 font-bold transition-all backdrop-blur-md">
                  {t("hero.becomeHost", "Become a Host")}
                </Button>
              </Link>
            )}
          </motion.div>

          {/* Mini Users Social Proof */}
          <motion.div variants={fadeInUp} className="flex items-center gap-4 mt-6">
            <div className="flex -space-x-4">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-12 h-12 rounded-full border-2 border-background overflow-hidden bg-muted">
                  <img src={`https://i.pravatar.cc/150?u=${i}`} alt="user" className="w-full h-full object-cover" />
                </div>
              ))}
              <div className="w-12 h-12 rounded-full border-2 border-background bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-sm font-bold text-emerald-700 dark:text-emerald-400 z-10 shadow-sm">
                +2k
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex gap-1 text-amber-400">
                {[1,2,3,4,5].map(i => <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}
              </div>
              <span className="text-base font-semibold text-muted-foreground mt-0.5">{t("hero.trusted", "Highly trusted community")}</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Hero Floating Artwork - Right Col */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-6 relative hidden lg:block h-[600px] xl:h-[700px] perspective-[1000px]"
        >
            <motion.div style={{ y: yArtwork }} className="absolute inset-0 w-full h-full">
              {/* Main Focus Card */}
              <motion.div 
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-1/2 left-1/2 w-full max-w-[420px] xl:max-w-[480px] bg-background/60 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-[2.5rem] p-5 shadow-2xl z-20"
                  style={{ transform: `translate(-50%, -50%) rotateY(-15deg) rotateX(5deg)` }}
              >
                  <div className="relative w-full aspect-[4/5] rounded-[2rem] overflow-hidden group">
                    <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Premium setup" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    {/* Floating Action within card */}
                    <div className="absolute top-4 right-4 h-12 w-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 cursor-pointer hover:bg-white/30 transition-colors">
                      <Heart className="h-6 w-6 text-white fill-white" />
                    </div>

                    <div className="absolute bottom-6 left-6 right-6 flex flex-col gap-2">
                      <Badge className="bg-white text-black hover:bg-white font-bold w-fit mb-1 border-0 shadow-lg px-3 py-1">{t("hero.cardBadge", "Featured Villa")}</Badge>
                      <h3 className="text-white text-3xl font-black leading-none drop-shadow-md">{t("hero.cardTitle", "Emerald Estate")}</h3>
                      <p className="text-white/80 text-base flex items-center gap-1.5 font-medium"><MapPin className="h-4 w-4"/> {t("hero.cardLocation", "Beverly Hills, CA")}</p>
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-white/70 text-xs font-bold uppercase tracking-wider">{t("hero.price", "Price")}</span>
                          <span className="text-white font-black text-3xl">$4,500<span className="text-sm font-medium opacity-70"> /{t("hero.mo", "mo")}</span></span>
                        </div>
                        <div className="h-14 w-14 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform cursor-pointer">
                          <ArrowRight className="h-6 w-6 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
              </motion.div>

              {/* Backdrop Floating Element 1 */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                style={{ y: yFloat1 }}
                className="absolute top-[10%] left-[0%] bg-background/80 backdrop-blur-xl border border-border/50 p-5 rounded-3xl shadow-2xl flex items-center gap-5 z-30"
              >
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shrink-0 shadow-inner">
                  <Building2 className="h-8 w-8 text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{t("hero.totalProperties", "Total Properties")}</p>
                  <p className="text-3xl font-black">{liveStats?.total || "500+"}</p>
                </div>
              </motion.div>

              {/* Backdrop Floating Element 2 */}
              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                style={{ y: yFloat2 }}
                className="absolute bottom-[20%] right-[-5%] bg-background p-5 rounded-3xl shadow-2xl border flex items-center gap-4 z-30"
              >
                <div className="flex -space-x-4">
                  <div className="h-14 w-14 rounded-full border-4 border-background bg-blue-100 flex items-center justify-center"><Users className="h-6 w-6 text-blue-600" /></div>
                  <div className="h-14 w-14 rounded-full border-4 border-background bg-amber-100 flex items-center justify-center"><Heart className="h-6 w-6 text-amber-600" /></div>
                </div>
                <div className="pr-4 pl-2">
                  <p className="text-base font-bold leading-tight">{t("hero.happyRenters", "10k+ Happy Renters").split("Happy").map((t,i) => i===0 ? <span key={i}>{t}Happy<br/></span> : t)}</p>
                </div>
              </motion.div>
            </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
