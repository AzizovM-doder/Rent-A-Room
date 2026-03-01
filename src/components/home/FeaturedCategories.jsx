import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Building2, Tent, ArrowRight } from "lucide-react";

const FeaturedCategories = () => {
  const categories = [
    {
      title: "Luxury Flats",
      desc: "City-center apartments with premium amenities.",
      icon: Building2,
      count: "320+ Properties",
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      link: "/search?type=apartment",
      color: "text-emerald-500",
      bg: "bg-emerald-500/10"
    },
    {
      title: "Private Houses",
      desc: "Spacious suburban homes perfect for families.",
      icon: Home,
      count: "150+ Properties",
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      link: "/search?type=house",
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
    {
      title: "Country Dachas",
      desc: "Escape the city for a quiet countryside retreat.",
      icon: Tent,
      count: "80+ Properties",
      image: "https://images.unsplash.com/photo-1587061949409-02df41d5e562?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      link: "/search?type=dacha",
      color: "text-amber-500",
      bg: "bg-amber-500/10"
    }
  ];

  return (
    <section className="relative w-full bg-muted/20 py-24 md:py-32 overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-12 flex flex-col items-center">
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="w-full flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 md:mb-16"
        >
          <div className="flex flex-col max-w-2xl">
            <span className="text-emerald-600 dark:text-emerald-400 font-bold tracking-widest uppercase text-sm mb-3">Curated Collections</span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">Property Types</h2>
          </div>
          <Link to="/#listings">
            <button className="flex items-center gap-2 group text-sm font-bold hover:text-emerald-600 transition-colors bg-white/50 dark:bg-black/20 backdrop-blur-md px-5 py-2.5 rounded-full border shadow-sm">
              View All Types <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-full">
          {categories.map((cat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group cursor-pointer h-[400px] relative rounded-[2rem] overflow-hidden shadow-lg border border-border/50"
            >
              <img src={cat.image} alt={cat.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 transition-opacity duration-500 group-hover:opacity-90" />
              
              <div className="absolute inset-0 p-8 flex flex-col justify-between z-10">
                <div className="flex justify-end">
                  <div className={`h-14 w-14 rounded-2xl flex items-center justify-center backdrop-blur-md bg-white/10 border border-white/20 shadow-inner group-hover:scale-110 transition-transform duration-500`}>
                    <cat.icon className="h-7 w-7 text-white" />
                  </div>
                </div>
                
                <div className="flex flex-col transform group-hover:-translate-y-2 transition-transform duration-500">
                  <span className="text-white/80 font-bold text-xs uppercase tracking-widest mb-2">{cat.count}</span>
                  <h3 className="text-3xl font-black text-white mb-3">{cat.title}</h3>
                  <p className="text-white/70 font-medium text-sm leading-relaxed max-w-[90%] opacity-0 h-0 group-hover:opacity-100 group-hover:h-auto transition-all duration-500 overflow-hidden">
                    {cat.desc}
                  </p>
                  
                  <div className="mt-6 flex items-center gap-2 text-white font-bold opacity-0 -translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100">
                    Explore <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default FeaturedCategories;
