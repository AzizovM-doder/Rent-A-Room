import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus, Eye, EyeOff, User, Mail, Phone, Lock, Sparkles, ArrowLeft, Home as HomeIcon } from "lucide-react";
import toast from "react-hot-toast";
import { authApi, saveAuth } from "../../../api/listingsAPI";
import { motion } from "framer-motion";

const SignUp = () => {
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      name: e.target.fullname.value.trim(),
      email: e.target.email.value.trim(),
      phone: e.target.phone.value.trim(),
      password: e.target.password.value,
    };
    if (data.password.length < 6) return toast.error("Password must be at least 6 characters");
    setLoading(true);
    try {
      const result = await authApi.register(data);
      saveAuth(result);
      toast.success(`Welcome to Rent-A-Room, ${result.user.name}! 🎉`);
      navigate("/");
    } catch (err) {
      toast.error(err.message || "Registration failed");
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
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="min-h-screen w-full flex bg-background selection:bg-emerald-500/30 font-sans">
      
      {/* ── Left Pane: Dynamic Visual ───────────────────────────────────────── */}
      <div className="relative hidden w-1/2 lg:flex flex-col justify-between overflow-hidden bg-slate-950 p-12">
        {/* Background Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
            alt="Beautiful Apartment" 
            className="w-full h-full object-cover opacity-50 max-h-screen"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          <div className="absolute inset-0 bg-emerald-900/20 mix-blend-overlay" />
        </div>

        {/* Brand Content */}
        <div className="relative z-10 flex items-center gap-3">
           <div className="h-10 w-10 flex flex-col pt-1 items-center justify-center rounded-xl bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30">
               <span className="font-black text-white text-xl leading-none pt-1">R</span>
           </div>
           <span className="font-extrabold text-white text-xl tracking-wide">Rent.A.Room</span>
        </div>

        <motion.div 
           initial={{ opacity: 0, y: 50 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
           className="relative z-10 max-w-lg mb-10"
        >
          <div className="flex gap-4 mb-8">
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 shadow-2xl">
               <UserPlus className="h-8 w-8 text-emerald-400 mb-2" />
               <h3 className="text-white font-bold leading-none mb-1">Join Fast</h3>
               <p className="text-white/60 text-xs">Less than 2 minutes</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 shadow-2xl">
               <Sparkles className="h-8 w-8 text-amber-400 mb-2" />
               <h3 className="text-white font-bold leading-none mb-1">Endless</h3>
               <p className="text-white/60 text-xs">Vast property catalog</p>
            </div>
          </div>
          
          <h2 className="text-4xl xl:text-5xl text-white font-black leading-tight mb-4 tracking-tight">
            Start your journey with <span className="text-emerald-400">confidence.</span>
          </h2>
          <p className="text-lg xl:text-xl text-white/70 font-medium">
            Create an account to save your favorite listings and contact hosts instantly.
          </p>
        </motion.div>
      </div>

      {/* ── Right Pane: Form ────────────────────────────────────────────────── */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 md:px-24 xl:px-32 relative z-10 py-12 lg:py-0 overflow-y-auto custom-scrollbar">
        
        {/* Back Button */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="absolute top-8 right-6 sm:right-12">
          <Link to="/" className="inline-flex flex-row-reverse items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors group">
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-colors">
              <ArrowLeft className="h-4 w-4 rotate-180" />
            </div>
            Back to Home
          </Link>
        </motion.div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md mx-auto mt-12 lg:mt-0"
        >
          {/* Header */}
          <motion.div variants={fadeUp} className="mb-8 text-center lg:text-left">
            <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-emerald-500/10 mb-6 ring-1 ring-emerald-500/20 shadow-inner">
               <Sparkles className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2">Create Account_</h1>
            <p className="text-muted-foreground text-lg font-medium">Join us and find your dream space.</p>
          </motion.div>

          {/* Form */}
          <motion.form variants={fadeUp} onSubmit={handleSubmit} className="flex flex-col gap-5">
            
            {[
              { icon: User, name: "fullname", label: "Full Name", type: "text", placeholder: "John Doe", autoComplete: "name" },
              { icon: Mail, name: "email", label: "Email Address", type: "email", placeholder: "you@example.com", autoComplete: "email" },
              { icon: Phone, name: "phone", label: "Phone Number", type: "tel", placeholder: "+992 90 000 0000", autoComplete: "tel" },
            ].map(({ icon: Icon, name, label, type, placeholder, autoComplete }) => (
              <div key={name} className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-foreground">{label}</label>
                <div className="relative group">
                  <Icon className="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-emerald-600 transition-colors" />
                  <Input 
                    name={name} 
                    type={type} 
                    placeholder={placeholder} 
                    autoComplete={autoComplete} 
                    required 
                    className="pl-12 h-14 rounded-2xl bg-muted/40 border-transparent hover:bg-muted/60 focus-visible:bg-transparent focus-visible:border-emerald-600 focus-visible:ring-emerald-600/20 text-base shadow-sm transition-all" 
                  />
                </div>
              </div>
            ))}

            <div className="flex flex-col gap-1.5 pt-1">
              <label className="text-sm font-bold text-foreground">Choose a Password</label>
              <div className="relative group">
                <Lock className="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-emerald-600 transition-colors" />
                <Input 
                  name="password" 
                  type={showPass ? "text" : "password"} 
                  placeholder="Min. 6 characters" 
                  required 
                  autoComplete="new-password" 
                  minLength={6}
                  className="pl-12 pr-12 h-14 rounded-2xl bg-muted/40 border-transparent hover:bg-muted/60 focus-visible:bg-transparent focus-visible:border-emerald-600 focus-visible:ring-emerald-600/20 text-base shadow-sm transition-all" 
                />
                <button type="button" onClick={() => setShowPass(v => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-muted">
                  {showPass ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <Button 
              disabled={loading} 
              className="w-full h-14 mt-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 hover:-translate-y-0.5 text-base font-bold shadow-[0_0_20px_-5px_rgba(5,150,105,0.4)] hover:shadow-[0_0_25px_-5px_rgba(5,150,105,0.6)] transition-all duration-300"
            >
              {loading ? "Creating..." : "Create account"}
            </Button>
            
          </motion.form>
          
          <motion.div variants={fadeUp} className="mt-8 text-center text-sm font-medium text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-emerald-600 hover:text-emerald-700 font-bold hover:underline ml-1 transition-colors">Sign in here</Link>
          </motion.div>
        </motion.div>
      </div>

    </div>
  );
};

export default SignUp;
