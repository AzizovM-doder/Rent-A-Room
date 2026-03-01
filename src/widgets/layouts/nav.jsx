import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LogIn, Menu, UserPlus, User, Heart, UserCheckIcon, Sun, Moon, PlusCircle } from "lucide-react";
import logo from "/logo.png";
import { isAuthenticated } from "../../utils/url";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

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
      "w-full fixed top-0 z-50 transition-all duration-500",
      scrolled
        ? "bg-background/80 backdrop-blur-2xl border-b shadow-sm py-0"
        : "bg-background/0 backdrop-blur-none border-b border-transparent py-2"
    )}>
      <div className="mx-auto max-w-7xl px-4">
        <div className="h-16 flex items-center justify-between gap-3">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link to="/" className="inline-flex items-center gap-2 group">
              <img src={logo} alt="logo" className="w-25 transition-transform duration-500 group-hover:scale-105 group-hover:rotate-1" />
            </Link>
          </div>

          {/* Desktop nav with Framer Motion hover lines */}
          <nav className="hidden md:flex items-center gap-4">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} end
                className={({ isActive }) => cn(
                  "relative px-3 py-2 text-sm font-bold transition-colors duration-300",
                  isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {({ isActive }) => (
                  <>
                    {item.label}
                    {isActive && (
                      <motion.div
                        layoutId="nav-underline"
                        className="absolute left-0 right-0 bottom-0 h-0.5 bg-emerald-600 rounded-full"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Dark mode toggle */}
            <button onClick={toggleDark} className="h-9 w-9 rounded-lg border bg-background/80 flex items-center justify-center hover:bg-muted transition" aria-label="Toggle theme">
              {dark ? <Sun className="h-4 w-4 text-amber-500" /> : <Moon className="h-4 w-4 text-slate-700" />}
            </button>

            {/* Language */}
            <div className="hidden md:flex">
              <Select value={langValue} onValueChange={(val) => changeLang(val)}>
                <SelectTrigger className="h-9 w-[70px] bg-background/80 border text-muted-foreground outline-none focus:ring-2 focus:ring-emerald-600 transition">
                  <SelectValue placeholder={t("nav.language")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">EN</SelectItem>
                  <SelectItem value="ru">RU</SelectItem>
                  <SelectItem value="tj">TJ</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Desktop actions */}
            <div className="hidden md:flex gap-3 items-center ml-2 border-l pl-4">
              <NavLink to="/favorites" end 
                className={({isActive}) => cn("flex items-center gap-1.5 text-sm font-bold transition-colors hover:text-emerald-500", isActive ? "text-emerald-600" : "text-muted-foreground")}>
                <Heart className="w-4 h-4" /> {t("nav.favorites")}
              </NavLink>

              {!authed ? (
                <>
                  <NavLink to="/login" end
                    className={({isActive}) => cn("flex items-center gap-1.5 text-sm font-bold transition-colors hover:text-emerald-500", isActive ? "text-emerald-600" : "text-muted-foreground")}>
                    <LogIn className="w-4 h-4" /> {t("nav.login")}
                  </NavLink>
                  <NavLink to="/signUp" end>
                    <Button size="sm" className="rounded-full bg-foreground text-background hover:bg-emerald-600 hover:text-white transition-all shadow-sm font-bold ml-1">
                      {t("nav.register")}
                    </Button>
                  </NavLink>
                </>
              ) : (
                <>
                  <NavLink to="/post" end>
                    <Button size="sm" className="rounded-full bg-emerald-600 text-white hover:bg-emerald-700 transition-all font-bold gap-1.5 shadow-md shadow-emerald-500/20">
                      <PlusCircle className="w-4 h-4" /> Post
                    </Button>
                  </NavLink>
                  <NavLink to="/profile" end
                    className={({isActive}) => cn("flex items-center gap-1.5 text-sm font-bold transition-colors hover:text-emerald-500", isActive ? "text-emerald-600" : "text-muted-foreground")}>
                    <User className="w-4 h-4" />
                  </NavLink>
                </>
              )}

              {isAdmin && (
                <NavLink to="/admin" end
                   className={({isActive}) => cn("flex items-center text-sm font-bold transition-colors hover:text-amber-500", isActive ? "text-amber-600" : "text-muted-foreground")}>
                  <UserCheckIcon className="w-4 h-4" />
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
                      <div className="flex-1">
                        <Select value={langValue} onValueChange={(val) => changeLang(val)}>
                          <SelectTrigger className="w-full h-11 bg-background text-muted-foreground outline-none">
                            <SelectValue placeholder={t("nav.language")} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">{t("nav.lang.en")}</SelectItem>
                            <SelectItem value="ru">{t("nav.lang.ru")}</SelectItem>
                            <SelectItem value="tj">{t("nav.lang.tj")}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <button onClick={toggleDark} className="h-11 w-11 shrink-0 rounded-lg border flex items-center justify-center">
                        {dark ? <Sun className="h-5 w-5 text-amber-500" /> : <Moon className="h-5 w-5" />}
                      </button>
                    </div>

                    <div className="pt-3 flex flex-col gap-2">
                      <NavLink to="/favorites" onClick={() => setOpen(false)} end className={({ isActive }) => cn("flex w-full justify-between items-center px-3 py-3 rounded-lg text-sm font-medium", isActive ? "bg-emerald-600 text-white" : "hover:bg-muted")}>
                        <span>{t("nav.favorites")}</span><Heart className="w-5 h-5" />
                      </NavLink>

                      {!authed ? (
                        <>
                          <NavLink to="/login" onClick={() => setOpen(false)} end className={({ isActive }) => cn("flex w-full justify-between items-center px-3 py-3 rounded-lg text-sm font-medium", isActive ? "bg-emerald-600 text-white" : "hover:bg-muted")}>
                            <span>{t("nav.login")}</span><LogIn className="w-5 h-5" />
                          </NavLink>
                          <NavLink to="/signUp" onClick={() => setOpen(false)} end className={({ isActive }) => cn("flex w-full justify-between items-center px-3 py-3 rounded-lg text-sm font-medium", isActive ? "bg-emerald-600 text-white" : "hover:bg-muted")}>
                            <span>{t("nav.register")}</span><UserPlus className="w-5 h-5" />
                          </NavLink>
                        </>
                      ) : (
                        <>
                          <NavLink to="/post" onClick={() => setOpen(false)} end className={({ isActive }) => cn("flex w-full justify-between items-center px-3 py-3 rounded-lg text-sm font-medium", isActive ? "bg-emerald-600 text-white" : "hover:bg-muted")}>
                            <span>Post listing</span><PlusCircle className="w-5 h-5" />
                          </NavLink>
                          <NavLink to="/profile" onClick={() => setOpen(false)} end className={({ isActive }) => cn("flex w-full justify-between items-center px-3 py-3 rounded-lg text-sm font-medium", isActive ? "bg-emerald-600 text-white" : "hover:bg-muted")}>
                            <span>{t("nav.profile")}</span><User className="w-5 h-5" />
                          </NavLink>
                        </>
                      )}

                      {isAdmin && (
                        <NavLink to="/admin" onClick={() => setOpen(false)} end className={({ isActive }) => cn("flex w-full justify-between items-center px-3 py-3 rounded-lg text-sm font-medium text-amber-600", isActive ? "bg-amber-600 text-white" : "hover:bg-muted")}>
                          <span>Admin</span><UserCheckIcon className="w-5 h-5" />
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
