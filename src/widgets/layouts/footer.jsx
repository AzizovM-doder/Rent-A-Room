import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Mail, MapPin, ExternalLink, CheckCircle } from "lucide-react";
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
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <img src={logo} alt="logo" className="w-12 h-12 object-contain" />
              <div className="flex flex-col leading-tight">
                <p className="font-bold text-lg">Rent.A.Room</p>
                <p className="text-xs text-muted-foreground">{t("footer.brand.subtitle")}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{t("footer.brand.desc")}</p>
            <div className="flex items-center gap-2">
              <Badge className="bg-emerald-600 hover:bg-emerald-600 shadow-sm shadow-emerald-600/20">{t("footer.badges.verified")}</Badge>
              <Badge variant="secondary">{t("footer.badges.support")}</Badge>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-3">
            <p className="font-bold">{t("footer.quickLinks.title")}</p>
            <nav className="flex flex-col gap-2.5 text-sm">
              {[
                { to: "/", label: t("footer.quickLinks.home") },
                { to: "/about", label: t("footer.quickLinks.about") },
                { to: "/contact", label: t("footer.quickLinks.contact") },
                { to: "/login", label: t("footer.quickLinks.login") },
                { to: "/favorites", label: "Favorites" },
              ].map(({ to, label }) => (
                <Link key={to} to={to} className="text-muted-foreground hover:text-emerald-600 transition-colors flex items-center gap-1.5">
                  <span className="h-1 w-1 rounded-full bg-emerald-600/50" />
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-3">
            <p className="font-bold">{t("footer.contact.title")}</p>
            <div className="flex flex-col gap-3.5 text-sm">
              <a href="mailto:support@xona.tj" className="flex items-start gap-3 group">
                <div className="h-9 w-9 rounded-xl bg-emerald-600/10 flex items-center justify-center shrink-0">
                  <Mail className="h-4 w-4 text-emerald-600" />
                </div>
                <div className="flex flex-col">
                  <p className="font-medium">{t("footer.contact.emailLabel")}</p>
                  <p className="text-emerald-600 group-hover:underline">support@xona.tj</p>
                </div>
              </a>
              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-xl bg-emerald-600/10 flex items-center justify-center shrink-0">
                  <MapPin className="h-4 w-4 text-emerald-600" />
                </div>
                <div className="flex flex-col">
                  <p className="font-medium">{t("footer.contact.locationLabel")}</p>
                  <p className="text-muted-foreground">{t("footer.contact.locationValue")}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="flex flex-col gap-3">
            <p className="font-bold">{t("footer.newsletter.title")}</p>
            <p className="text-sm text-muted-foreground">{t("footer.newsletter.desc")}</p>

            {subscribed ? (
              <div className="flex items-center gap-2 text-emerald-600 text-sm font-medium">
                <CheckCircle className="h-4 w-4" />
                You're subscribed!
              </div>
            ) : (
              <form onSubmit={handleNewsletter} className="flex gap-2">
                <Input placeholder={t("footer.newsletter.placeholder")} value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 shrink-0">
                  {t("footer.newsletter.join")}
                </Button>
              </form>
            )}

            <div className="rounded-xl border bg-background p-4 mt-1">
              <p className="text-sm font-medium">{t("footer.cta.title")}</p>
              <p className="text-xs text-muted-foreground mt-1">{t("footer.cta.desc")}</p>
              <Button asChild className="mt-3 w-full bg-emerald-600 hover:bg-emerald-700 gap-2">
                <Link to="/login"><ExternalLink className="h-3.5 w-3.5" />{t("footer.cta.button")}</Link>
              </Button>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Rent.A.Room.tj {t("footer.bottom.rights")}
          </p>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <Link to="/about" className="text-muted-foreground hover:text-emerald-600 transition-colors">{t("footer.bottom.privacy")}</Link>
            <Link to="/about" className="text-muted-foreground hover:text-emerald-600 transition-colors">{t("footer.bottom.terms")}</Link>
            <Link to="/contact" className="text-muted-foreground hover:text-emerald-600 transition-colors">{t("footer.bottom.support")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;