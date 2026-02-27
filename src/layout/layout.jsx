import React, { useState, useEffect } from "react";
import Nav from "../widgets/layouts/nav";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "../widgets/layouts/footer";
import { ArrowUp } from "lucide-react";

const Layout = () => {
  const [showTop, setShowTop] = useState(false);
  const { pathname } = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  useEffect(() => {
    const handler = () => setShowTop(window.scrollY > 400);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <div className="py-5" />
      <main className="flex-1">
        <div className="m-auto max-w-7xl px-4 py-10 lg:py-20 pb-16">
          <Outlet />
        </div>
      </main>
      <Footer />

      {/* Scroll to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Scroll to top"
        className={`fixed bottom-6 right-6 z-50 h-11 w-11 rounded-full bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 flex items-center justify-center hover:bg-emerald-700 hover:scale-110 transition-all duration-300 ${
          showTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <ArrowUp className="h-5 w-5" />
      </button>
    </div>
  );
};

export default Layout;
