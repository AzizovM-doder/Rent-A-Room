import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Home, 
  Info, 
  Phone, 
  Heart, 
  User, 
  LogIn, 
  PlusCircle, 
  LogOut, 
  Menu, 
  X, 
  Globe, 
  Building 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getUserToken, removeUserToken } from "../../utils/url";
import { toast } from "react-hot-toast";

const Nav = () => {
  const { t, i18n } = useTranslation();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const user = (() => {
    try {
      const u = getUserToken();
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  })();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    removeUserToken();
    toast.success(t("common.logoutSuccess", "Logged out successfully"));
    navigate("/");
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const navLinks = [
    { name: t("nav.home", "Home"), path: "/", icon: Home },
    { name: t("nav.about", "About"), path: "/about", icon: Info },
    { name: t("nav.contact", "Contact"), path: "/contact", icon: Phone },
  ];

  if (user) {
    navLinks.push({ name: t("nav.favorites", "Favorites"), path: "/favorites", icon: Heart });
  }

  const languages = [
    { code: "en", label: "English" },
    { code: "ru", label: "Русский" },
    { code: "tj", label: "Тоҷикӣ" },
  ];

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 border-b ${
        scrolled 
          ? "bg-background/80 backdrop-blur-md border-border/50 shadow-sm" 
          : "bg-background/0 border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <img src="/logo.png" alt="Rent.A.Room Logo" className="w-16 md:w-20 object-contain group-hover:scale-105 transition-transform" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex flex-1 items-center justify-center space-x-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                    isActive 
                      ? "text-emerald-600" 
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute inset-0 rounded-full bg-emerald-500/10 -z-10"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Right Side Actions */}
          <div className="hidden md:flex items-center gap-4">
            
            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full w-9 h-9">
                  <Globe className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40 rounded-2xl">
                {languages.map((l) => (
                  <DropdownMenuItem
                    key={l.code}
                    className={`cursor-pointer rounded-xl font-medium ${i18n.language.startsWith(l.code) ? "bg-emerald-500/10 text-emerald-600" : ""}`}
                    onClick={() => changeLanguage(l.code)}
                  >
                    {l.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="h-6 w-px bg-border/50 mx-1" />

            {user ? (
              <div className="flex items-center gap-3">
                <Button variant="outline" className="hidden lg:flex rounded-full border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 font-semibold gap-2 transition-all" asChild>
                  <Link to="/post">
                    <PlusCircle className="h-4 w-4" />
                    {t("nav.post", "Post")}
                  </Link>
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="rounded-full h-10 px-4 gap-2 border-border/50 shadow-sm hover:shadow-md transition-all">
                      <Menu className="h-4 w-4 text-muted-foreground" />
                      <div className="bg-emerald-600/10 h-6 w-6 rounded-full flex items-center justify-center">
                        <User className="h-3 w-3 text-emerald-600" />
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2">
                    <div className="px-2 py-2 mb-2">
                      <p className="font-semibold text-sm truncate">{user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                    <div className="h-px bg-border mb-2" />
                    <DropdownMenuItem className="cursor-pointer rounded-xl font-medium" asChild>
                      <Link to="/profile" className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        {t("nav.profile", "Profile")}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer rounded-xl font-medium lg:hidden" asChild>
                      <Link to="/post" className="flex items-center gap-2">
                        <PlusCircle className="h-4 w-4 text-muted-foreground" />
                        {t("nav.post", "Post Property")}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer rounded-xl font-medium text-red-500 focus:text-red-600 focus:bg-red-500/10 mt-1" onClick={handleLogout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      {t("common.logout", "Logout")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Button variant="ghost" className="rounded-full font-semibold px-4 hover:bg-muted" asChild>
                  <Link to="/login">{t("nav.login", "Log in")}</Link>
                </Button>
                <Button className="rounded-full font-semibold px-6 bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20 text-white" asChild>
                  <Link to="/signUp">{t("nav.register", "Sign Up")}</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full w-9 h-9">
                  <Globe className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40 rounded-2xl">
                {languages.map((l) => (
                  <DropdownMenuItem
                    key={l.code}
                    className={`cursor-pointer rounded-xl font-medium ${i18n.language.startsWith(l.code) ? "bg-emerald-500/10 text-emerald-600" : ""}`}
                    onClick={() => changeLanguage(l.code)}
                  >
                    {l.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full overflow-hidden w-10 h-10 border-border/50 shadow-sm bg-background/50 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.15 }}
                  >
                    <X className="h-5 w-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ opacity: 0, rotate: 90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: -90 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Menu className="h-5 w-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, scale: 0.95 }}
            animate={{ opacity: 1, height: "auto", scale: 1 }}
            exit={{ opacity: 0, height: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="md:hidden overflow-hidden bg-background/95 backdrop-blur-md border-b shadow-xl"
          >
            <div className="px-4 pt-2 pb-6 space-y-1 flex flex-col gap-1">
              {navLinks.map((link, index) => {
                const isActive = pathname === link.path;
                return (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      to={link.path}
                      className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold transition-all duration-200 ${
                        isActive 
                          ? "bg-emerald-500/10 text-emerald-600 shadow-sm" 
                          : "text-foreground hover:bg-muted active:scale-95"
                      }`}
                    >
                      <link.icon className={`h-5 w-5 ${isActive ? 'text-emerald-600' : 'text-muted-foreground'}`} />
                      {link.name}
                    </Link>
                  </motion.div>
                );
              })}

              <div className="h-px bg-border/50 my-2 mx-4" />
              
              {user ? (
                <>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: navLinks.length * 0.05 }}
                  >
                    <Link
                      to="/post"
                      className="flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold text-foreground hover:bg-muted active:scale-95 transition-all duration-200"
                    >
                      <PlusCircle className="h-5 w-5 text-muted-foreground" />
                      {t("nav.post", "Post Property")}
                    </Link>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (navLinks.length + 1) * 0.05 }}
                  >
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold text-foreground hover:bg-muted active:scale-95 transition-all duration-200"
                    >
                      <User className="h-5 w-5 text-muted-foreground" />
                      {t("nav.profile", "Profile")}
                    </Link>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (navLinks.length + 2) * 0.05 }}
                  >
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold text-red-500 hover:bg-red-500/10 active:scale-95 transition-all duration-200 w-full text-left"
                    >
                      <LogOut className="h-5 w-5" />
                      {t("common.logout", "Logout")}
                    </button>
                  </motion.div>
                </>
              ) : (
                <motion.div 
                  className="flex flex-col gap-2 mt-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: navLinks.length * 0.05 }}
                >
                  <Button variant="outline" className="w-full justify-center rounded-xl h-12 active:scale-95 transition-transform" asChild>
                    <Link to="/login">{t("nav.login", "Log in")}</Link>
                  </Button>
                  <Button className="w-full justify-center rounded-xl h-12 bg-emerald-600 hover:bg-emerald-700 text-white active:scale-95 transition-transform" asChild>
                    <Link to="/signUp">{t("nav.register", "Sign Up")}</Link>
                  </Button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Nav;
