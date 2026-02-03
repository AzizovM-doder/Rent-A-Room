import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { LogIn, Menu, UserPlus, User, Heart } from "lucide-react";
import logo from "/logo.png";
import { isAuthenticated } from "../../utils/url";
import { useTranslation } from "react-i18next";

const cn = (...c) => c.filter(Boolean).join(" ");

const Nav = () => {
  const [open, setOpen] = useState(false);
  const { i18n, t } = useTranslation();

  const navLinkClass = ({ isActive }) =>
    cn(
      "px-3 py-2 rounded-md text-sm font-medium transition-colors",
      isActive
        ? "bg-emerald-600 text-white"
        : "text-muted-foreground hover:text-foreground hover:bg-muted"
    );

  const navItems = [
    { to: "/", label: t("nav.home") },
    { to: "/about", label: t("nav.about") },
    { to: "/contact", label: t("nav.contact") }
  ];

  const authed = isAuthenticated();

  const langValue = (i18n.language || "en").slice(0, 2);

  const changeLang = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("i18nextLng", lng);
  };

  return (
    <header className="w-full border-b bg-background/80 backdrop-blur fixed top-0 z-50">
      <div className="mx-auto max-w-7xl px-4">
        <div className="h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-25 h-10 flex items-center justify-start">
              <Link to="/" className="inline-flex">
                <img src={logo} alt="logo" />
              </Link>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={navLinkClass} end>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {/* language select (desktop) */}
            <div className="hidden md:flex">
              <select
                value={langValue}
                onChange={(e) => changeLang(e.target.value)}
                className="h-10 rounded-md border bg-background px-2 text-sm text-muted-foreground outline-none focus:ring-2 focus:ring-emerald-600"
                aria-label={t("nav.language")}
              >
                <option value="en">EN</option>
                <option value="ru">RU</option>
                <option value="tj">TJ</option>
              </select>
            </div>

            <div className="hidden md:flex gap-3">
              {!authed ? (
                <>
                  <NavLink to="/favorites" className={navLinkClass} end>
                    <div className="flex gap-1 items-center">
                      {t("nav.favorites")}
                      <Heart className="w-5 h-5" />
                    </div>
                  </NavLink>

                  <NavLink to="/login" className={navLinkClass} end>
                    <div className="flex gap-1 items-center">
                      {t("nav.login")}
                      <LogIn className="w-5 h-5" />
                    </div>
                  </NavLink>

                  <NavLink to="/signUp" className={navLinkClass} end>
                    <div className="flex gap-1 items-center">
                      {t("nav.register")}
                      <UserPlus className="w-5 h-5" />
                    </div>
                  </NavLink>
                </>
              ) : (
                <>
                  <NavLink to="/favorites" className={navLinkClass} end>
                    <div className="flex gap-1 items-center">
                      {t("nav.favorites")}
                      <Heart className="w-5 h-5" />
                    </div>
                  </NavLink>

                  <NavLink to="/profile" className={navLinkClass} end>
                    <div className="flex gap-1 items-center">
                      {t("nav.profile")}
                      <User className="w-5 h-5" />
                    </div>
                  </NavLink>
                </>
              )}
            </div>

            <div className="md:hidden">
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="shrink-0">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>

                <SheetContent side="right" className="w-[320px] p-0">
                  <div className="p-4 border-b">
                    <div className="w-25 h-10 flex items-center">
                      <Link
                        to="/"
                        onClick={() => setOpen(false)}
                        className="inline-flex items-center gap-2 font-semibold"
                      >
                        <img src={logo} alt="logo" />
                      </Link>
                    </div>
                  </div>

                  <div className="p-4 flex flex-col gap-2">
                    {navItems.map((item) => (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        end
                        onClick={() => setOpen(false)}
                        className={({ isActive }) =>
                          cn(
                            "w-full px-3 py-3 rounded-md text-sm font-medium transition-colors",
                            isActive
                              ? "bg-emerald-600 text-white"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted"
                          )
                        }
                      >
                        {item.label}
                      </NavLink>
                    ))}

                    {/* language select (mobile) */}
                    <div className="pt-2">
                      <select
                        value={langValue}
                        onChange={(e) => changeLang(e.target.value)}
                        className="w-full h-11 rounded-md border bg-background px-3 text-sm text-muted-foreground outline-none focus:ring-2 focus:ring-emerald-600"
                        aria-label={t("nav.language")}
                      >
                        <option value="en">{t("nav.lang.en")}</option>
                        <option value="ru">{t("nav.lang.ru")}</option>
                        <option value="tj">{t("nav.lang.tj")}</option>
                      </select>
                    </div>

                    <div className="pt-2 flex flex-col gap-5">
                      {!authed ? (
                        <>
                          <NavLink
                            to="/login"
                            onClick={() => setOpen(false)}
                            className={navLinkClass}
                            end
                          >
                            <div className="flex w-full justify-between gap-1 items-center">
                              {t("nav.login")}
                              <LogIn className="w-5 h-5" />
                            </div>
                          </NavLink>

                          <NavLink
                            to="/signUp"
                            onClick={() => setOpen(false)}
                            className={navLinkClass}
                            end
                          >
                            <div className="flex w-full justify-between items-center">
                              {t("nav.register")}
                              <UserPlus className="w-5 h-5" />
                            </div>
                          </NavLink>
                        </>
                      ) : (
                        <NavLink
                          to="/profile"
                          onClick={() => setOpen(false)}
                          className={navLinkClass}
                          end
                        >
                          <div className="flex w-full justify-between items-center">
                            {t("nav.profile")}
                            <User className="w-5 h-5" />
                          </div>
                        </NavLink>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Nav;
