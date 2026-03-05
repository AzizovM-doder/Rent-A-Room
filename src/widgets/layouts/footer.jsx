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
      toast.error(t("footer.emailError", "Please enter a valid email"));
      return;
    }
    // Store locally (no backend endpoint for newsletter yet)
    const subs = JSON.parse(localStorage.getItem("newsletter_subs") || "[]");
    if (subs.includes(email.trim().toLowerCase())) {
      toast(t("footer.alreadySubscribed", "You're already subscribed!"));
      return;
    }
    subs.push(email.trim().toLowerCase());
    localStorage.setItem("newsletter_subs", JSON.stringify(subs));
    setSubscribed(true);
    setEmail("");
    toast.success(t("footer.subscribed", "Subscribed!"));
  };

  // Navigation items with i18n
  const navItems = [
    { name: t("footer.nav.home", "Home"), path: '/' },
    { name: t("footer.nav.about", "About"), path: '/about' },
    { name: t("footer.nav.contact", "Contact"), path: '/contact' },
    { name: t("footer.nav.properties", "Properties"), path: '/' }
  ];

  return (
    <footer className="relative bg-background border-t border-border/50 overflow-hidden w-full">
      {/* Background soft glow - safe from clipping due to w-full on footer */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-200 h-100 bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Content wrapper with max-w to keep text readable, but background is full width */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 md:px-6 lg:px-12 py-20 pb-12">
        <div className="grid gap-12   grid-cols-1 md:grid-cols-2  lg:justify-between lg:flex">
          
          {/* Brand Col */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <img src={logo} alt="logo" className="w-12.5 h-auto object-contain" />
              <div className="flex flex-col leading-none">
                <span className="font-black text-xl tracking-tight">Rent.A.Room</span>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-widest mt-1">
                  {t("footer.tagline", "Premium Living")}
                </span>
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed max-w-sm font-medium">
              {t("footer.description", "Discover curated luxury apartments, cozy studios, and sprawling villas worldwide. Renting has never looked this good.")}
            </p>
            <div className="flex gap-4 items-center">
              <div className="h-10 w-10 rounded-full border border-border/50 bg-card flex items-center justify-center hover:border-emerald-500 hover:text-emerald-500 transition-colors cursor-pointer">
                <Mail className="h-4 w-4" />
              </div>
              <div className="h-10 w-10 rounded-full border border-border/50 bg-card flex items-center justify-center hover:border-emerald-500 hover:text-emerald-500 transition-colors cursor-pointer">
                <MapPin className="h-4 w-4" />
              </div>
            </div>
          </div>

          {/* Links Col 1 */}
          <div className="lg:col-span-2 lg:col-start-6 flex flex-col gap-5">
            <h4 className="font-bold text-foreground text-lg">
              {t("footer.explore", "Explore")}
            </h4>
            <nav className="flex flex-col gap-3 text-sm font-medium">
              {navItems.map((item) => (
                <Link key={item.name} to={item.path} className="text-muted-foreground hover:text-emerald-600 transition-colors w-fit">
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Newsletter Col */}
          <div className="lg:col-span-4 flex flex-col gap-5 items-end text-end">
            <h4 className="font-bold text-foreground text-lg">
              {t("footer.stayUpdated", "Stay Updated")}
            </h4>
            <p className="text-sm text-muted-foreground font-medium">
              {t("footer.newsletterDesc", "Subscribe to our newsletter for latest premium properties and exclusive offers.")}
            </p>
            
            {subscribed ? (
              <div className="flex items-center gap-2 text-emerald-600 bg-emerald-500/10 px-4 py-3 rounded-xl border border-emerald-500/20 w-fit">
                <CheckCircle className="h-5 w-5" />
                <span className="font-semibold text-sm">
                  {t("footer.thanksSubscribing", "Thanks for subscribing!")}
                </span>
              </div>
            ) : (
              <form onSubmit={handleNewsletter} className="relative flex items-center w-full max-w-sm mt-2">
                <Input 
                  placeholder={t("footer.emailPlaceholder", "Enter your email address")} 
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
                <p className="text-sm font-bold leading-tight mb-1">
                  {t("footer.becomeHost", "Become a Host")}
                </p>
                <Link to="/login" className="text-xs text-muted-foreground hover:text-emerald-600 font-bold uppercase tracking-widest transition-colors">
                  {t("footer.earnMoney", "Earn money easily")} &rarr;
                </Link>
              </div>
            </div>
          </div>

        </div>

        <Separator className="my-10 bg-border/50" />

        <div className="flex flex-col gap-4 sm:flex-row items-center justify-between text-sm text-muted-foreground font-medium">
          <p>
            &copy; {new Date().getFullYear()} {t("footer.platformName", "Rent.A.Room Platform")}. {t("footer.allRights", "All rights reserved.")}
          </p>
          <div className="flex items-center gap-4">
            <span>{t("footer.poweredBy", "Powered by Premium UI")}</span>
            <div className="w-1.5 h-1.5 rounded-full bg-border" />
            <span>{t("footer.builtWith", "Built with React")}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;