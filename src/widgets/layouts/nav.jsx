import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { LogIn, Menu, UserPlus, User, Heart, UserCheckIcon, Sun, Moon, PlusCircle } from "lucide-react";
import logo from "/logo.png";
import { isAuthenticated } from "../../utils/url";
import { useTranslation } from "react-i18next";

const cn = (...c) => c.filter(Boolean).join(" ");

const Nav = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"));
  const { i18n, t } = useTranslation();

  const admin = localStorage.getItem("admin") || "";
  const isAdmin = admin.length > 10;

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  // Load theme on mount
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") { document.documentElement.classList.add("dark"); setDark(true); }
    else if (saved === "light") { document.documentElement.classList.remove("dark"); setDark(false); }
  }, []);

  const navLinkClass = ({ isActive }) =>
    cn(
      "px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
      isActive
        ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/25"
        : "text-muted-foreground hover:text-foreground hover:bg-muted",
    );

  const navItems = [
    { to: "/", label: t("nav.home") },
    { to: "/about", label: t("nav.about") },
    { to: "/contact", label: t("nav.contact") },
  ];

  const authed = isAuthenticated();
  const langValue = (i18n.language || "en").slice(0, 2);

  const changeLang = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("i18nextLng", lng);
  };

  return (
    <header className={cn(
      "w-full fixed top-0 z-50 transition-all duration-300",
      scrolled
        ? "bg-background/80 backdrop-blur-xl border-b shadow-sm"
        : "bg-background/50 backdrop-blur-sm border-b border-transparent"
    )}>
      <div className="mx-auto max-w-7xl px-4">
        <div className="h-16 flex items-center justify-between gap-3">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link to="/" className="inline-flex items-center gap-2 group">
              <img src={logo} alt="logo" className="w-25   transition-transform duration-300 group-hover:scale-105" />
            </Link>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={navLinkClass} end>
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Dark mode toggle */}
            <button onClick={toggleDark} className="h-9 w-9 rounded-lg border bg-background/80 flex items-center justify-center hover:bg-muted transition" aria-label="Toggle theme">
              {dark ? <Sun className="h-4 w-4 text-amber-500" /> : <Moon className="h-4 w-4 text-slate-700" />}
            </button>

            {/* Language */}
            <div className="hidden md:flex">
              <select
                value={langValue}
                onChange={(e) => changeLang(e.target.value)}
                className="h-9 rounded-lg border bg-background/80 px-2 text-sm text-muted-foreground outline-none focus:ring-2 focus:ring-emerald-600 cursor-pointer transition"
                aria-label={t("nav.language")}
              >
                <option value="en">EN</option>
                <option value="ru">RU</option>
                <option value="tj">TJ</option>
              </select>
            </div>

            {/* Desktop actions */}
            <div className="hidden md:flex gap-1.5">
              <NavLink to="/favorites" className={navLinkClass} end>
                <div className="flex gap-1.5 items-center">
                  <Heart className="w-4 h-4" />
                  {t("nav.favorites")}
                </div>
              </NavLink>

              {!authed ? (
                <>
                  <NavLink to="/login" className={navLinkClass} end>
                    <div className="flex gap-1.5 items-center">
                      <LogIn className="w-4 h-4" />
                      {t("nav.login")}
                    </div>
                  </NavLink>
                  <NavLink to="/signUp" className={navLinkClass} end>
                    <div className="flex gap-1.5 items-center">
                      <UserPlus className="w-4 h-4" />
                      {t("nav.register")}
                    </div>
                  </NavLink>
                </>
              ) : (
                <>
                  <NavLink to="/post" className={navLinkClass} end>
                    <div className="flex gap-1.5 items-center">
                      <PlusCircle className="w-4 h-4" />
                      Post
                    </div>
                  </NavLink>
                  <NavLink to="/profile" className={navLinkClass} end>
                    <div className="flex gap-1.5 items-center">
                      <User className="w-4 h-4" />
                      {t("nav.profile")}
                    </div>
                  </NavLink>
                </>
              )}

              {isAdmin && (
                <NavLink to="/admin" className={navLinkClass} end>
                  <div className="flex gap-1.5 items-center">
                    <UserCheckIcon className="w-4 h-4" />
                    Admin
                  </div>
                </NavLink>
              )}
            </div>

            {/* Mobile menu */}
            <div className="md:hidden">
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="shrink-0 h-9 w-9">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>

                <SheetContent side="right" className="w-[320px] p-0">
                  <div className="p-4 border-b">
                    <Link to="/" onClick={() => setOpen(false)} className="inline-flex items-center gap-2 font-semibold">
                      <img src={logo} alt="logo" className="w-25 h-10" />
                    </Link>
                  </div>

                  <div className="p-4 flex flex-col gap-2">
                    {navItems.map((item) => (
                      <NavLink key={item.to} to={item.to} end onClick={() => setOpen(false)}
                        className={({ isActive }) => cn(
                          "w-full px-3 py-3 rounded-lg text-sm font-medium transition-colors",
                          isActive ? "bg-emerald-600 text-white" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        )}
                      >
                        {item.label}
                      </NavLink>
                    ))}

                    <div className="pt-2 flex items-center gap-2">
                      <select value={langValue} onChange={(e) => changeLang(e.target.value)}
                        className="flex-1 h-11 rounded-lg border bg-background px-3 text-sm text-muted-foreground outline-none"
                        aria-label={t("nav.language")}
                      >
                        <option value="en">{t("nav.lang.en")}</option>
                        <option value="ru">{t("nav.lang.ru")}</option>
                        <option value="tj">{t("nav.lang.tj")}</option>
                      </select>
                      <button onClick={toggleDark} className="h-11 w-11 rounded-lg border flex items-center justify-center">
                        {dark ? <Sun className="h-5 w-5 text-amber-500" /> : <Moon className="h-5 w-5" />}
                      </button>
                    </div>

                    <div className="pt-3 flex flex-col gap-2">
                      <NavLink to="/favorites" onClick={() => setOpen(false)} className={navLinkClass} end>
                        <div className="flex w-full justify-between items-center"><span>{t("nav.favorites")}</span><Heart className="w-5 h-5" /></div>
                      </NavLink>

                      {!authed ? (
                        <>
                          <NavLink to="/login" onClick={() => setOpen(false)} className={navLinkClass} end>
                            <div className="flex w-full justify-between items-center"><span>{t("nav.login")}</span><LogIn className="w-5 h-5" /></div>
                          </NavLink>
                          <NavLink to="/signUp" onClick={() => setOpen(false)} className={navLinkClass} end>
                            <div className="flex w-full justify-between items-center"><span>{t("nav.register")}</span><UserPlus className="w-5 h-5" /></div>
                          </NavLink>
                        </>
                      ) : (
                        <>
                          <NavLink to="/post" onClick={() => setOpen(false)} className={navLinkClass} end>
                            <div className="flex w-full justify-between items-center"><span>Post listing</span><PlusCircle className="w-5 h-5" /></div>
                          </NavLink>
                          <NavLink to="/profile" onClick={() => setOpen(false)} className={navLinkClass} end>
                            <div className="flex w-full justify-between items-center"><span>{t("nav.profile")}</span><User className="w-5 h-5" /></div>
                          </NavLink>
                        </>
                      )}

                      {isAdmin && (
                        <NavLink to="/admin" onClick={() => setOpen(false)} className={navLinkClass} end>
                          <div className="flex w-full justify-between items-center"><span>Admin</span><UserCheckIcon className="w-5 h-5" /></div>
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
