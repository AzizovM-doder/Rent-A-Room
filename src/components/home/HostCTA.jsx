import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Wallet, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const HostCTA = () => {
  return (
    <section className="relative w-full py-24 md:py-32 overflow-hidden bg-background">
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-12">
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative rounded-[3rem] overflow-hidden bg-slate-950 flex flex-col md:flex-row items-center justify-between shadow-2xl p-10 md:p-20 group"
        >
          {/* Background Glows inside the safe bounds */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 via-transparent to-teal-500/10 pointer-events-none" />
          <div className="absolute right-0 bottom-0 w-[400px] h-[400px] bg-emerald-500/30 blur-[100px] rounded-full translate-x-1/3 translate-y-1/3 pointer-events-none transition-transform duration-1000 group-hover:scale-110" />
          
          <div className="flex flex-col gap-6 md:w-1/2 relative z-20 text-center md:text-left mb-10 md:mb-0">
            <span className="text-emerald-400 font-bold tracking-widest uppercase text-sm flex items-center gap-2 justify-center md:justify-start">
              <Wallet className="h-4 w-4" /> Earn With Us
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight">Put your unused space to work.</h2>
            <p className="text-emerald-50/70 text-lg md:text-xl font-medium max-w-md mx-auto md:mx-0 leading-relaxed">
              Join thousands of hosts earning passive income daily. We handle the marketing, payments, and security. You bring the keys.
            </p>
            <div className="mt-6">
              <Link to="/login">
                <Button size="lg" className="h-14 rounded-full px-10 text-lg bg-emerald-500 hover:bg-emerald-600 text-white gap-3 shadow-[0_0_30px_-5px_rgba(16,185,129,0.4)] transition-all duration-300 font-bold group-hover:shadow-[0_0_40px_-5px_rgba(16,185,129,0.6)]">
                  Become a Host <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Right side Image / Graphic entirely inside the contained area */}
          <div className="md:w-5/12 relative z-20 flex justify-center w-full">
             <div className="w-full max-w-[400px] aspect-square rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-xl p-6 relative shadow-2xl overflow-hidden group-hover:-translate-y-4 transition-transform duration-700 ease-out">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                <div className="h-full w-full rounded-2xl bg-muted overflow-hidden relative border border-white/10">
                  <img src="https://images.unsplash.com/photo-1554995207-c18c203602cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Beautiful apartment interior" className="w-full h-full object-cover" />
                  <div className="absolute bottom-4 left-4 right-4 bg-background/80 backdrop-blur-md rounded-xl p-4 border border-border/50 flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Estimated Earnings</span>
                      <span className="font-black text-xl text-foreground">$2,400 / mo</span>
                    </div>
                    <div className="h-10 w-10 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600">
                      <Home className="h-5 w-5" />
                    </div>
                  </div>
                </div>
             </div>
          </div>
          
        </motion.div>
      </div>
    </section>
  );
};

export default HostCTA;
