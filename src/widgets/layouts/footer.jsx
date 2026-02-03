import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin, Instagram, Facebook, Linkedin } from "lucide-react";
import logo from "/logo.png";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="border-t bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-10 md:justify-between md:grid-cols-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <img src={logo} alt="logo" className="w-15" />
              <div className="flex flex-col leading-tight">
                <p className="font-semibold">Rent.A.Room.tj</p>
                <p className="text-xs text-muted-foreground">
                  {t("footer.brand.subtitle")}
                </p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              {t("footer.brand.desc")}
            </p>

            <div className="flex items-center gap-2">
              <Badge className="bg-emerald-600 hover:bg-emerald-600">
                {t("footer.badges.verified")}
              </Badge>
              <Badge variant="secondary">{t("footer.badges.support")}</Badge>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <p className="font-semibold">{t("footer.quickLinks.title")}</p>
            <nav className="flex flex-col gap-2 text-sm">
              <Link
                to="/"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {t("footer.quickLinks.home")}
              </Link>
              <Link
                to="/about"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {t("footer.quickLinks.about")}
              </Link>
              <Link
                to="/contact"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {t("footer.quickLinks.contact")}
              </Link>
              <Link
                to="/login"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {t("footer.quickLinks.login")}
              </Link>
            </nav>
          </div>

          <div className="flex flex-col gap-3">
            <p className="font-semibold">{t("footer.contact.title")}</p>

            <div className="flex flex-col gap-3 text-sm">
              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-lg bg-emerald-600/10 flex items-center justify-center">
                  <Mail className="h-5 w-5 text-emerald-600" />
                </div>
                <div className="flex flex-col">
                  <p className="font-medium">{t("footer.contact.emailLabel")}</p>
                  <p className="text-muted-foreground">support@rentaroom.tj</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-lg bg-emerald-600/10 flex items-center justify-center">
                  <Phone className="h-5 w-5 text-emerald-600" />
                </div>
                <div className="flex flex-col">
                  <p className="font-medium">{t("footer.contact.phoneLabel")}</p>
                  <p className="text-muted-foreground">+992 00 000 0000</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-lg bg-emerald-600/10 flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-emerald-600" />
                </div>
                <div className="flex flex-col">
                  <p className="font-medium">{t("footer.contact.locationLabel")}</p>
                  <p className="text-muted-foreground">
                    {t("footer.contact.locationValue")}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <Button variant="outline" size="icon" className="h-9 w-9">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-9 w-9">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-9 w-9">
                <Linkedin className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <p className="font-semibold">{t("footer.newsletter.title")}</p>
            <p className="text-sm text-muted-foreground">
              {t("footer.newsletter.desc")}
            </p>

            <div className="flex gap-2">
              <Input placeholder={t("footer.newsletter.placeholder")} />
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                {t("footer.newsletter.join")}
              </Button>
            </div>

            <div className="rounded-xl border p-4 mt-3">
              <p className="text-sm font-medium">{t("footer.cta.title")}</p>
              <p className="text-xs text-muted-foreground">
                {t("footer.cta.desc")}
              </p>
              <Button
                asChild
                className="mt-3 w-full bg-emerald-600 hover:bg-emerald-700"
              >
                <Link to="/login">{t("footer.cta.button")}</Link>
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
            <Link
              to="/privacy"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("footer.bottom.privacy")}
            </Link>
            <Link
              to="/terms"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("footer.bottom.terms")}
            </Link>
            <Link
              to="/support"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("footer.bottom.support")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;