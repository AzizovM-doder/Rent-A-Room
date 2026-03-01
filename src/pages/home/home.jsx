import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Filter from "../../components/extra/filter";
import { listingsApi } from "../../api/listingsAPI";
import { getUserToken } from "../../utils/url";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

// Modulo imports
import Hero from "../../components/home/Hero";
import FeaturedCategories from "../../components/home/FeaturedCategories";
import HowItWorks from "../../components/home/HowItWorks";
import Testimonials from "../../components/home/Testimonials";
import HostCTA from "../../components/home/HostCTA";
import FAQ from "../../components/home/FAQ";

const Home = () => {
  const { t } = useTranslation();
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
    window.scrollTo(0,0);
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
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background selection:bg-emerald-500/30 relative w-full font-sans">
      
      {/* 1. Hero Section (Full width, seamless) */}
      <Hero liveStats={liveStats} user={user} />

      {/* 2. Featured Property Categories */}
      <FeaturedCategories />

      {/* 3. Search & Listings Module */}
      <section id="search-section" className="relative w-full py-24 bg-background">
        {/* Background glow behind filter */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent pointer-events-none" />
        
        <div id="listings" className="scroll-mt-32 w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-12 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center flex flex-col items-center"
          >
            <Badge className="mb-4 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-0 px-4 py-1.5 text-xs font-bold uppercase tracking-widest shadow-sm">
              {t("nav.home", "Explore Catalog")}
            </Badge>
            <h2 className="text-4xl md:text-5xl lg:text-5xl font-black tracking-tight mb-6">Discover your next home</h2>
            <p className="text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto font-medium">
              {liveStats ? `Browse ${liveStats.total} handpicked properties across ${liveStats.cities.length || 1} cities.` : "Filter by city, type, and price to find the perfect fit."}
            </p>
          </motion.div>

          <Filter />
        </div>
      </section>

      {/* 4. How It Works */}
      <HowItWorks t={t} />

      {/* 5. Testimonials */}
      <Testimonials />

      {/* 6. Host Call to Action */}
      {!user && <HostCTA />}

      {/* 7. FAQ */}
      <FAQ />

    </div>
  );
};

export default Home;
