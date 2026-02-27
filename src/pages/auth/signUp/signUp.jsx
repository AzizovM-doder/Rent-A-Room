import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus, Eye, EyeOff, User, Mail, Phone, Lock, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import { authApi, saveAuth } from "../../../api/listingsAPI";

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

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 animate-fade-up">
      {/* Background decorations */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-emerald-500/10 rounded-full blur-[130px] pointer-events-none" />
      
      <div className="w-full max-w-md relative z-10">
        <Card className="rounded-3xl overflow-hidden shadow-2xl border-0 bg-background/80 backdrop-blur-xl">
          <div className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/3 -translate-x-1/3 blur-xl" />
            
            <div className="relative flex flex-col items-center text-center gap-3">
              <div className="h-14 w-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center ring-2 ring-white/30 shadow-lg">
                <Sparkles className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight">Create account</h1>
                <p className="text-sm text-emerald-100 mt-1">Join thousands of happy renters</p>
              </div>
            </div>
          </div>

          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {[
                { icon: User, name: "fullname", label: "Full name", type: "text", placeholder: "John Doe", autoComplete: "name" },
                { icon: Mail, name: "email", label: "Email address", type: "email", placeholder: "you@example.com", autoComplete: "email" },
                { icon: Phone, name: "phone", label: "Phone number", type: "tel", placeholder: "+992 90 000 0000", autoComplete: "tel" },
              ].map(({ icon: Icon, name, label, type, placeholder, autoComplete }) => (
                <div key={name} className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-foreground/80">{label}</label>
                  <div className="relative group">
                    <Icon className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-emerald-600" />
                    <Input name={name} type={type} placeholder={placeholder} autoComplete={autoComplete} required 
                      className="pl-10 h-11 rounded-xl bg-muted/50 border-transparent focus-visible:bg-transparent focus-visible:border-emerald-600 transition-all" />
                  </div>
                </div>
              ))}

              <div className="flex flex-col gap-1.5 pt-1">
                <label className="text-sm font-semibold text-foreground/80">Choose a password</label>
                <div className="relative group">
                  <Lock className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-emerald-600" />
                  <Input name="password" type={showPass ? "text" : "password"} placeholder="Min. 6 characters" required autoComplete="new-password" minLength={6}
                    className="pl-10 pr-12 h-11 rounded-xl bg-muted/50 border-transparent focus-visible:bg-transparent focus-visible:border-emerald-600 transition-all" />
                  <button type="button" onClick={() => setShowPass(v => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button disabled={loading} className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-base font-semibold shadow-lg shadow-emerald-600/25 transition-all mt-4">
                {loading ? "Creating account..." : "Create account"}
              </Button>
            </form>
            
            <div className="mt-8 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-emerald-600 hover:text-emerald-700 font-bold hover:underline">Sign in</Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
export default SignUp;
