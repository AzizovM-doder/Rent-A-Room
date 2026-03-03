import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, LogIn, Mail, Lock, ArrowLeft, ShieldCheck, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import { authApi, saveAuth } from "../../../api/listingsAPI";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const Login = () => {
  const { t } = useTranslation();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value.trim();
    const password = e.target.password.value;
    if (!email || !password) return toast.error(t("auth.fillAll", "Please fill in all fields"));
    
    setLoading(true);
    try {
      const result = await authApi.login({ email, password });
      saveAuth(result);
      toast.success(t("auth.welcomeBack", { name: result.user.name, defaultValue: `Welcome back, ${result.user.name}!` }));
      navigate("/");
    } catch (err) {
      toast.error(err.message || t("auth.invalidCreds", "Invalid credentials"));
    } finally {
      setLoading(false);
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="min-h-screen w-full flex bg-background selection:bg-emerald-500/30 font-sans">
      
      {/* ── Left Pane: Form ─────────────────────────────────────────────────── */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 md:px-24 xl:px-32 relative z-10 transition-all duration-500">
        
        {/* Back Button */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="absolute top-8 left-6 sm:left-12">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors group">
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-colors">
              <ArrowLeft className="h-4 w-4" />
            </div>
            {t("auth.backHome", "Back to Home")}
          </Link>
        </motion.div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md mx-auto mt-16 lg:mt-0"
        >
          {/* Header */}
          <motion.div variants={fadeUp} className="mb-10 text-center lg:text-left">
            <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-emerald-500/10 mb-6 ring-1 ring-emerald-500/20 shadow-inner">
               <LogIn className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2">{t("auth.loginTitle", "Welcome back_")}</h1>
            <p className="text-muted-foreground text-lg font-medium">{t("auth.loginDesc", "Please enter your details to sign in.")}</p>
          </motion.div>

          {/* Form */}
          <motion.form variants={fadeUp} onSubmit={handleSubmit} className="flex flex-col gap-6">
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-foreground">{t("auth.email", "Email Address")}</label>
              <div className="relative group">
                <Mail className="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-emerald-600 transition-colors" />
                <Input 
                  type="email" 
                  name="email" 
                  placeholder={t("auth.emailPlaceholder", "you@example.com")} 
                  autoComplete="email" 
                  required 
                  className="pl-12 h-14 rounded-2xl bg-muted/40 border-transparent hover:bg-muted/60 focus-visible:bg-transparent focus-visible:border-emerald-600 focus-visible:ring-emerald-600/20 text-base shadow-sm transition-all" 
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-foreground">{t("auth.password", "Password")}</label>
                <Link to="#" className="text-sm text-emerald-600 hover:text-emerald-700 font-bold hover:underline transition-colors">{t("auth.forgot", "Forgot password?")}</Link>
              </div>
              <div className="relative group">
                <Lock className="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-emerald-600 transition-colors" />
                <Input 
                  name="password" 
                  type={show ? "text" : "password"} 
                  placeholder="••••••••" 
                  required 
                  autoComplete="current-password"
                  className="pl-12 pr-12 h-14 rounded-2xl bg-muted/40 border-transparent hover:bg-muted/60 focus-visible:bg-transparent focus-visible:border-emerald-600 focus-visible:ring-emerald-600/20 text-base shadow-sm transition-all" 
                />
                <button type="button" onClick={() => setShow(v => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-muted">
                  {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <Button 
              disabled={loading} 
              className="w-full h-14 mt-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 hover:-translate-y-0.5 text-base font-bold shadow-[0_0_20px_-5px_rgba(5,150,105,0.4)] hover:shadow-[0_0_25px_-5px_rgba(5,150,105,0.6)] transition-all duration-300"
            >
              {loading ? t("auth.authenticating", "Authenticating...") : t("auth.signInBtn", "Sign in to account")}
            </Button>
            
          </motion.form>
          
          <motion.div variants={fadeUp} className="mt-10 text-center text-sm font-medium text-muted-foreground">
            {t("auth.noAccount", "Don't have an account yet?")}{" "}
            <Link to="/signUp" className="text-emerald-600 hover:text-emerald-700 font-bold hover:underline ml-1 transition-colors">{t("auth.createOne", "Create one now")}</Link>
          </motion.div>
        </motion.div>
      </div>

      {/* ── Right Pane: Dynamic Visual ──────────────────────────────────────── */}
      <div className="relative hidden lg:flex w-1/2 flex-col justify-between overflow-hidden bg-slate-950 p-12">
        {/* Background Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
            alt="Luxury Interior" 
            className="w-full h-full object-cover opacity-50 max-h-screen"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          <div className="absolute inset-0 bg-emerald-900/20 mix-blend-overlay" />
        </div>

        {/* Brand Content */}
        <div className="relative z-10 flex items-center gap-3">
           <div className="h-10 w-10 flex flex-col items-center justify-center rounded-xl bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30">
               <span className="font-black text-white text-xl leading-none pt-1">R</span>
           </div>
           <span className="font-extrabold text-white text-xl tracking-wide">Rent.A.Room</span>
        </div>

        <motion.div 
           initial={{ opacity: 0, y: 50 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
           className="relative z-10 max-w-lg mb-10"
        >
          <div className="flex gap-4 mb-8">
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 shadow-2xl">
               <ShieldCheck className="h-8 w-8 text-emerald-400 mb-2" />
               <h3 className="text-white font-bold leading-none mb-1">{t("auth.secure", "Secure")}</h3>
               <p className="text-white/60 text-xs">{t("auth.encryption", "Bank-grade encryption")}</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 shadow-2xl">
               <Sparkles className="h-8 w-8 text-amber-400 mb-2" />
               <h3 className="text-white font-bold leading-none mb-1">{t("auth.premium", "Premium")}</h3>
               <p className="text-white/60 text-xs">{t("auth.curated", "Curated experiences")}</p>
            </div>
          </div>
          
          <h2 className="text-4xl xl:text-5xl text-white font-black leading-tight mb-4 tracking-tight">
            {t("auth.promoTitleStart", "Unlock the door to your")} <span className="text-emerald-400">{t("auth.promoTitleEnd", "new lifestyle.")}</span>
          </h2>
          <p className="text-lg xl:text-xl text-white/70 font-medium">
            {t("auth.promoDesc", "Join thousands of verified renters discovering incredible spaces around the globe.")}
          </p>
        </motion.div>
      </div>

    </div>
  );
};

export default Login;
