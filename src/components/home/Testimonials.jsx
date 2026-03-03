import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, Quote, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

const Testimonials = () => {
  const { t } = useTranslation();
  const reviews = [
    {
      name: "Sabina",
      location: "Dushanbe, TJ",
      text: t("testimonials.review1", "The easiest way I've ever found to rent a place. The interface is stunning and the hosts are verified. Felt completely safe."),
      rating: 5,
      avatar: "https://i.pravatar.cc/150?u=1"
    },
    {
      name: "Marcus",
      location: "London, UK",
      text: t("testimonials.review2", "Booked a luxury flat for my business trip. The photos matched reality perfectly. Communication was seamless."),
      rating: 5,
      avatar: "https://i.pravatar.cc/150?u=2"
    },
    {
      name: "Alisher",
      location: "Khujand, TJ",
      text: t("testimonials.review3", "I was skeptical at first, but the booking process is flawless. Found an amazing dacha for the weekend in minutes."),
      rating: 5,
      avatar: "https://i.pravatar.cc/150?u=3"
    }
  ];

  return (
    <section className="relative w-full bg-background py-24 md:py-32 overflow-hidden border-b border-border/50">
      
      {/* Background Decor */}
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-blue-500/5 blur-[80px] rounded-full -translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-12 flex flex-col items-center">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:mb-24 flex flex-col items-center max-w-2xl"
        >
          <span className="text-blue-500 font-bold tracking-widest uppercase text-sm mb-4">{t("testimonials.badge", "Real Experiences")}</span>
          <h2 className="text-4xl md:text-5xl lg:text-5xl font-black tracking-tight mb-6">{t("testimonials.title", "Don't just take our word for it.")}</h2>
          <p className="text-muted-foreground text-lg sm:text-xl font-medium">{t("testimonials.subtitle", "Thousands of renters trust us to find their next home. Here's what they have to say.")}</p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-full">
          {reviews.map((review, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group bg-card border border-border/50 rounded-[2rem] p-8 md:p-10 flex flex-col gap-6 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden"
            >
              <Quote className="absolute top-8 right-8 h-24 w-24 text-muted/20 -rotate-12 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-500" />
              
              <div className="flex gap-1 text-amber-500 relative z-10">
                {[...Array(review.rating)].map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-current" />
                ))}
              </div>
              
              <p className="text-foreground/90 font-medium text-lg leading-relaxed relative z-10 mb-4 h-full">"{review.text}"</p>
              
              <div className="flex items-center gap-4 mt-auto relative z-10 pt-6 border-t border-border/50">
                <img src={review.avatar} alt={review.name} className="h-12 w-12 rounded-full border border-border shadow-sm" />
                <div className="flex flex-col">
                  <span className="font-bold text-base">{review.name}</span>
                  <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{review.location}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Testimonials;
