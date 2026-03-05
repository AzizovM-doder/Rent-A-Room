import React, { useState, useEffect } from "react";
import Nav from "../widgets/layouts/nav";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "../widgets/layouts/footer";
import { ArrowUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Layout = () => {
  const [showTop, setShowTop] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { pathname } = useLocation();

  // Scroll to top on route change with better handling
  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setIsTransitioning(false);
    }, 100);
    return () => clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    const handler = () => setShowTop(window.scrollY > 400);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Page transition variants
  const pageVariants = {
    initial: { 
      opacity: 0, 
      y: 15, 
      scale: 0.99,
      filter: "blur(2px)"
    },
    animate: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      filter: "blur(0px)"
    },
    exit: { 
      opacity: 0, 
      y: -15, 
      scale: 0.99,
      filter: "blur(2px)"
    }
  };

  const pageTransition = {
    type: "tween",
    duration: 0.3,
    ease: [0.25, 0.46, 0.45, 0.94]
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <div className="py-4 md:py-5" />
      <main className="flex-1 relative">
        <div className="m-auto pt-8 md:pt-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={pageTransition}
              className={`w-full page-transition-container ${isTransitioning ? 'pointer-events-none' : ''}`}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
      <Footer />

      {/* Enhanced Scroll to top button */}
      <motion.button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Scroll to top"
        className={`fixed bottom-4 md:bottom-6 right-4 md:right-6 z-50 h-12 w-12 md:h-14 md:w-14 rounded-full bg-emerald-600 text-white shadow-xl shadow-emerald-600/40 flex items-center justify-center hover:bg-emerald-700 transition-all duration-300 backdrop-blur-sm border border-white/10 ${
          showTop ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 pointer-events-none scale-95"
        }`}
        whileHover={{ 
          scale: 1.05, 
          boxShadow: "0 10px 25px -5px rgba(16, 185, 129, 0.5)"
        }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: showTop ? 1 : 0, 
          scale: showTop ? 1 : 0.8,
          y: showTop ? 0 : 20
        }}
        transition={{ 
          type: "spring", 
          stiffness: 400, 
          damping: 25 
        }}
      >
        <ArrowUp className="h-5 w-5 md:h-6 md:w-6" />
      </motion.button>
    </div>
  );
};

export default Layout;
