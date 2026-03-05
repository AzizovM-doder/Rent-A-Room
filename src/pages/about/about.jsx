import React, { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ShieldCheck, Users, Leaf, Home, Globe, Zap, ArrowRight, MapPin, Building2, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const About = () => {
  const { t } = useTranslation();
  const containerRef = useRef(null);
  
  // Parallax effects for the hero section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const features = [
    {
      icon: Home,
      title: t("about.features.realHomes.title", "Real homes"),
      desc: t("about.features.realHomes.text", "Only real listings from verified property owners.")
    },
    {
      icon: Users,
      title: t("about.features.forPeople.title", "For people"),
      desc: t("about.features.forPeople.text", "Built for renters and owners with zero unnecessary steps.")
    },
    {
      icon: ShieldCheck,
      title: t("about.features.trust.title", "Trust first"),
      desc: t("about.features.trust.text", "Transparency and safety are always our priority.")
    },
    {
      icon: Leaf,
      title: t("about.features.green.title", "Green mindset"),
      desc: t("about.features.green.text", "We support sustainable living and nature-friendly locations.")
    }
  ];

  const stats = [
    { value: "450+", label: t("about.stats.total", "Total Properties") },
    { value: "12", label: t("about.stats.cities", "Active Cities") },
    { value: "98%", label: t("about.stats.satisfaction", "Satisfaction Rate") },
    { value: "24/7", label: t("about.stats.support", "Support Given") }
  ];

  const timeline = [
    {
      icon: Zap,
      title: t("about.timeline.concept.title", "The Concept"),
      desc: t("about.timeline.concept.desc", "Started as a small project to help people find reliable, affordable rooms across Tajikistan.")
    },
    {
      icon: Key,
      title: t("about.timeline.beta.title", "Beta Launch"),
      desc: t("about.timeline.beta.desc", "Rolled out the first functional version featuring live listings, authentication, and secure messaging.")
    },
    {
      icon: Building2,
      title: t("about.timeline.evolution.title", "The Evolution"),
      desc: t("about.timeline.evolution.desc", "Complete platform overhaul: premium UX, strict verifications, and elite property scaling.")
    },
    {
      icon: Globe,
      title: t("about.timeline.global.title", "Global Vision"),
      desc: t("about.timeline.global.desc", "Expanding outside regional borders with multi-language integrations and robust scaling features.")
    }
  ];

  return (
    <div className="w-full bg-background min-h-screen font-sans overflow-hidden" ref={containerRef}>
      
      {/* 1. Hero Section (Parallax) */}
      <section className="relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden bg-slate-950">
        <motion.div style={{ y, opacity }} className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
            alt="Mansion showcase" 
            className="w-full h-full object-cover opacity-40 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-slate-950/60 to-background" />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/80 to-transparent" />
        </motion.div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-12 flex flex-col items-center md:items-start pt-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold tracking-widest uppercase text-xs mb-8 backdrop-blur-md"
          >
            <Globe className="h-4 w-4" />
            {t("about.ourStory", "Our Story")}
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-[1.1] max-w-4xl text-center md:text-left mb-8"
          >
            Redefining how you <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">rent properties.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-slate-300 text-lg md:text-2xl lg:text-3xl max-w-2xl text-center md:text-left font-medium leading-relaxed"
          >
            {t("about.subtitle", "Rent a Room is a platform built to make renting houses, dachas, and apartments across Tajikistan simple, transparent, and reliable.")}
          </motion.p>
        </div>
        
        {/* Scroll indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-slate-400 z-10"
        >
          <span className="text-xs uppercase tracking-widest font-bold">Discover</span>
          <div className="h-12 w-[2px] bg-slate-800 rounded-full overflow-hidden">
            <motion.div 
              animate={{ y: ["-100%", "100%"] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              className="h-full w-full bg-emerald-500"
            />
          </div>
        </motion.div>
      </section>

      {/* 2. Features Grid */}
      <section className="relative w-full py-24 md:py-32 bg-background border-b border-border/50">
        <div className="w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-12">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {features.map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -8 }}
                className="group relative bg-card border border-border/60 rounded-[2rem] p-8 md:p-10 flex flex-col items-start shadow-sm hover:shadow-xl transition-all overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-emerald-500/10 transition-colors" />
                <div className="h-14 w-14 rounded-2xl bg-muted/50 flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-3">{item.title}</h3>
                <p className="text-muted-foreground font-medium text-sm md:text-base leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. The Advantage / Mission (Split Layout) */}
      <section className="relative w-full py-24 md:py-32 bg-muted/30 overflow-hidden">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-12 flex flex-col lg:flex-row gap-16 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="w-full lg:w-1/2 flex flex-col gap-8"
          >
            <div className="inline-flex">
              <span className="px-4 py-1.5 rounded-full bg-card border border-border text-emerald-600 font-bold tracking-widest uppercase text-xs shadow-sm">
                {t("about.mission.label", "Our Mission")}
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              {t("about.advantage.title", "The Rent-A-Room Advantage")}
            </h2>
            <div className="space-y-6">
              <p className="text-xl text-muted-foreground font-medium leading-relaxed">
                {t("about.advantage.desc", "We built this platform from the ground up to solve the most frustrating parts of modern renting. No more deceptive listings or hidden fees.")}
              </p>
              <p className="text-lg text-muted-foreground font-medium leading-relaxed">
                {t("about.mission.text", "To connect people with comfortable places to live and relax, while helping property owners reach the right audience with ease, confidence, and long-term trust.")}
              </p>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="w-full lg:w-1/2"
          >
            <div className="grid grid-cols-2 gap-4 md:gap-6">
              {stats.map((stat, i) => (
                <div key={i} className={`bg-card rounded-[2rem] p-6 md:p-8 flex flex-col justify-center border border-border/50 shadow-sm ${i % 2 !== 0 ? 'translate-y-6 md:translate-y-12' : ''}`}>
                  <span className="text-4xl md:text-5xl font-black text-emerald-500 mb-2">{stat.value}</span>
                  <span className="text-muted-foreground font-bold tracking-wide uppercase text-xs md:text-sm">{stat.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </section>

      {/* 4. The Evolutionary Timeline */}
      <section className="relative w-full py-24 md:py-32 bg-background border-t border-border/50">
        <div className="w-full max-w-5xl mx-auto px-4 md:px-6">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16 md:mb-24 flex flex-col items-center"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6">{t("about.journey.title", "Our evolutionary journey.")}</h2>
            <p className="text-muted-foreground text-lg md:text-xl font-medium max-w-2xl">{t("about.journey.desc", "From a local hackathon concept to a premium ecosystem.")}</p>
          </motion.div>

          <div className="space-y-8 md:space-y-12 pl-4 md:pl-0 border-l-2 border-emerald-500/20 md:border-l-0 relative">
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-emerald-500/20 -translate-x-1/2" />
            
            {timeline.map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`flex flex-col md:flex-row items-start md:items-center relative ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
              >
                
                {/* Center dot */}
                <div className="absolute left-[-1.15rem] md:left-1/2 bg-background border-4 border-emerald-500 h-8 w-8 rounded-full md:-translate-x-1/2 z-10 hidden md:block" />
                <div className="absolute left-[-1.4rem] md:hidden bg-background border-[3px] border-emerald-500 h-5 w-5 rounded-full z-10" />

                <div className={`w-full md:w-1/2 ${i % 2 === 0 ? 'md:pl-16 lg:pl-24' : 'md:pr-16 lg:pr-24'} ml-6 md:ml-0`}>
                  <div className="bg-card border border-border/60 p-6 md:p-8 rounded-[2rem] shadow-sm hover:shadow-lg transition-all">
                    <div className="h-12 w-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-5">
                      <step.icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold mb-3">{step.title}</h3>
                    <p className="text-muted-foreground font-medium text-sm md:text-base leading-relaxed">{step.desc}</p>
                  </div>
                </div>

              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. Final CTA */}
      <section className="relative w-full py-24 bg-emerald-950 overflow-hidden text-center md:text-left">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900 to-teal-900 opacity-50" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80')] mix-blend-overlay opacity-20 object-cover" />
        
        <div className="relative z-10 w-full max-w-5xl mx-auto px-4 md:px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex flex-col gap-4 text-emerald-50">
            <h2 className="text-3xl md:text-5xl font-black leading-tight text-white mb-2">{t("about.cta.title", "Ready to list your space?")}</h2>
            <p className="text-lg md:text-xl font-medium opacity-80 max-w-xl">{t("about.cta.desc", "Join the premium platform making renting a breeze for thousands of users.")}</p>
          </div>
          <div>
            <Link to="/login">
              <Button size="lg" className="h-14 rounded-full px-8 text-lg bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-bold border-0 shadow-[0_0_40px_-10px_rgba(52,211,153,0.5)] hover:shadow-[0_0_60px_-10px_rgba(52,211,153,0.7)] transition-all">
                {t("nav.login", "Get Started")} <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;
