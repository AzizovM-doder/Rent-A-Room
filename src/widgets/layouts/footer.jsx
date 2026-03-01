import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Mail, MapPin, ExternalLink, CheckCircle, ArrowRight } from "lucide-react";
import logo from "/logo.png";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

const Footer = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletter = (ev) => {
    ev.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      toast.error("Please enter a valid email");
      return;
    }
    // Store locally (no backend endpoint for newsletter yet)
    const subs = JSON.parse(localStorage.getItem("newsletter_subs") || "[]");
    if (subs.includes(email.trim().toLowerCase())) {
      toast("You're already subscribed!");
      return;
    }
    subs.push(email.trim().toLowerCase());
    localStorage.setItem("newsletter_subs", JSON.stringify(subs));
    setSubscribed(true);
    setEmail("");
    toast.success("Subscribed!");
  };

  return (
    <footer className="relative bg-background border-t border-border/50 overflow-hidden w-full">
      {/* Background soft glow - safe from clipping due to w-full on footer */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Content wrapper with max-w to keep text readable, but background is full width */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 md:px-6 lg:px-12 py-20 pb-12">
        <div className="grid gap-12 lg:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-12">
          
          {/* Brand Col */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <img src={logo} alt="logo" className="w-[50px] h-auto object-contain" />
              <div className="flex flex-col leading-none">
                <span className="font-black text-xl tracking-tight">Rent.A.Room</span>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-widest mt-1">Premium Living</span>
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed max-w-sm font-medium">
              Discover curated luxury apartments, cozy studios, and sprawling villas worldwide. Renting has never looked this good.
            </p>
            <div className="flex gap-4 items-center">
              <div className="h-10 w-10 rounded-full border border-border/50 bg-card flex items-center justify-center hover:border-emerald-500 hover:text-emerald-500 transition-colors cursor-pointer"><Mail className="h-4 w-4" /></div>
              <div className="h-10 w-10 rounded-full border border-border/50 bg-card flex items-center justify-center hover:border-emerald-500 hover:text-emerald-500 transition-colors cursor-pointer"><MapPin className="h-4 w-4" /></div>
            </div>
          </div>

          {/* Links Col 1 */}
          <div className="lg:col-span-2 lg:col-start-6 flex flex-col gap-5">
            <h4 className="font-bold text-foreground text-lg">Explore</h4>
            <nav className="flex flex-col gap-3 text-sm font-medium">
              {['Home', 'About Us', 'Contact', 'Featured Listings'].map((item) => (
                <Link key={item} to={item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`} className="text-muted-foreground hover:text-emerald-600 transition-colors w-fit">
                  {item}
                </Link>
              ))}
            </nav>
          </div>

          {/* Links Col 2 */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <h4 className="font-bold text-foreground text-lg">Legal & Support</h4>
            <nav className="flex flex-col gap-3 text-sm font-medium">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Help Center'].map((item) => (
                <Link key={item} to="/about" className="text-muted-foreground hover:text-emerald-600 transition-colors w-fit">
                  {item}
                </Link>
              ))}
            </nav>
          </div>

          {/* Newsletter Col */}
          <div className="lg:col-span-4 flex flex-col gap-5">
            <h4 className="font-bold text-foreground text-lg">Stay Updated</h4>
            <p className="text-sm text-muted-foreground font-medium">Subscribe to our newsletter for the latest premium properties and exclusive offers.</p>
            
            {subscribed ? (
              <div className="flex items-center gap-2 text-emerald-600 bg-emerald-500/10 px-4 py-3 rounded-xl border border-emerald-500/20 w-fit">
                <CheckCircle className="h-5 w-5" />
                <span className="font-semibold text-sm">Thanks for subscribing!</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletter} className="relative flex items-center w-full max-w-sm mt-2">
                <Input 
                  placeholder="Enter your email address" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  className="pl-4 pr-14 h-14 rounded-2xl bg-muted/40 border-transparent hover:bg-muted/60 focus-visible:bg-transparent focus-visible:border-emerald-500 transition-colors font-medium text-base"
                  type="email" 
                />
                <Button type="submit" size="icon" className="absolute right-1.5 h-11 w-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 hover:scale-105 transition-all text-white shadow-md">
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </form>
            )}

            <div className="mt-4 flex items-center gap-4 bg-card border border-border/50 rounded-2xl p-4 shadow-sm w-fit hover:shadow-md transition-shadow">
              <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/50">
                <ExternalLink className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-bold leading-tight mb-1">Become a Host</p>
                <Link to="/login" className="text-xs text-muted-foreground hover:text-emerald-600 font-bold uppercase tracking-widest transition-colors">Earn money easily &rarr;</Link>
              </div>
            </div>
          </div>

        </div>

        <Separator className="my-10 bg-border/50" />

        <div className="flex flex-col gap-4 sm:flex-row items-center justify-between text-sm text-muted-foreground font-medium">
          <p>© {new Date().getFullYear()} Rent.A.Room Platform. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Powered by Premium UI</span>
            <div className="w-1.5 h-1.5 rounded-full bg-border" />
            <span>Built with React</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;