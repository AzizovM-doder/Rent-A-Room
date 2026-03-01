import React from "react";
import { motion } from "framer-motion";
import { Home, Key, Map, Star, Shield, Smartphone } from "lucide-react";

const HowItWorks = ({ t }) => {
  const steps = [
    {
      icon: SearchIcon,
      title: "Discover",
      desc: "Use our smart filters to find listings that perfectly match your preferences and budget in seconds.",
      color: "text-blue-500",
      bg: "bg-blue-500/10 border-blue-500/20"
    },
    {
      icon: Shield,
      title: "Book Securely",
      desc: "Connect directly with verified hosts through our secure messaging and payment systems.",
      color: "text-emerald-500",
      bg: "bg-emerald-500/10 border-emerald-500/20"
    },
    {
      icon: Key,
      title: "Move In",
      desc: "Get your keys and enjoy your new premium space with 24/7 dedicated support.",
      color: "text-amber-500",
      bg: "bg-amber-500/10 border-amber-500/20"
    }
  ];

  return (
    <section className="relative w-full bg-background border-y border-border/50 overflow-hidden py-24 md:py-32">
      {/* Full width background styling elements */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent absolute top-1/2 -translate-y-1/2 opacity-50" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-12 flex flex-col items-center">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:mb-24 flex flex-col items-center max-w-2xl"
        >
          <span className="px-4 py-1.5 rounded-full bg-muted text-muted-foreground text-sm font-bold uppercase tracking-widest mb-4 inline-block">Simple Process</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6">How it works</h2>
          <p className="text-muted-foreground text-lg sm:text-xl font-medium">We've engineered the perfect platform for seamless property hunting without the traditional headaches.</p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 w-full relative">
          
          {/* Connector Line for Desktop */}
          <div className="hidden md:block absolute top-[4.5rem] left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-transparent via-border to-transparent -z-10" />

          {steps.map((step, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              className={`flex flex-col items-center text-center gap-6 relative group`}
            >
              <div className={`h-36 w-36 rounded-[2.5rem] bg-card border shadow-xl flex items-center justify-center relative overflow-hidden group-hover:-translate-y-2 transition-transform duration-500`}>
                <div className={`absolute inset-0 ${step.bg} opacity-50 group-hover:opacity-100 transition-opacity`} />
                <step.icon className={`h-14 w-14 ${step.color} relative z-10`} />
                
                {/* Step Number Badge */}
                <div className="absolute top-3 left-3 h-8 w-8 rounded-xl bg-background border flex items-center justify-center font-black text-sm z-10 shadow-sm">
                  {i + 1}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <h3 className="text-2xl font-black text-foreground">{step.title}</h3>
                <p className="text-muted-foreground text-base font-medium leading-relaxed max-w-sm mx-auto">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

// Extracted search icon for simplicity
function SearchIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}

export default HowItWorks;
