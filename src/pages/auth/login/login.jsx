import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, LogIn, Mail, Lock } from "lucide-react";
import toast from "react-hot-toast";
import { authApi, saveAuth } from "../../../api/listingsAPI";

const Login = () => {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value.trim();
    const password = e.target.password.value;
    if (!email || !password) return toast.error("Fill all fields");
    setLoading(true);
    try {
      const result = await authApi.login({ email, password });
      saveAuth(result);
      toast.success(`Welcome back, ${result.user.name}!`);
      navigate("/");
    } catch (err) {
      toast.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 animate-fade-up">
      {/* Background decorations */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="w-full max-w-md relative z-10">
        <Card className="rounded-3xl overflow-hidden shadow-2xl border-0 bg-background/80 backdrop-blur-xl">
          <div className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/3 -translate-x-1/3 blur-xl" />
            
            <div className="relative flex flex-col items-center text-center gap-3">
              <div className="h-14 w-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center ring-2 ring-white/30 shadow-lg">
                <LogIn className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight">Welcome back</h1>
                <p className="text-sm text-emerald-100 mt-1">Sign in to your Rent-A-Room account</p>
              </div>
            </div>
          </div>

          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-foreground/80">Email address</label>
                <div className="relative group">
                  <Mail className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-emerald-600" />
                  <Input type="email" name="email" placeholder="you@example.com" autoComplete="email" required 
                    className="pl-10 h-12 rounded-xl bg-muted/50 border-transparent focus-visible:bg-transparent focus-visible:border-emerald-600 transition-all" />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-foreground/80">Password</label>
                  <Link to="#" className="text-xs text-emerald-600 hover:underline font-medium">Forgot password?</Link>
                </div>
                <div className="relative group">
                  <Lock className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-emerald-600" />
                  <Input name="password" type={show ? "text" : "password"} placeholder="••••••••" required autoComplete="current-password"
                    className="pl-10 pr-12 h-12 rounded-xl bg-muted/50 border-transparent focus-visible:bg-transparent focus-visible:border-emerald-600 transition-all" />
                  <button type="button" onClick={() => setShow(v => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                    {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button disabled={loading} className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-base font-semibold shadow-lg shadow-emerald-600/25 transition-all mt-2">
                {loading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
            
            <div className="mt-8 text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/signUp" className="text-emerald-600 hover:text-emerald-700 font-bold hover:underline">Create one now</Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
export default Login;
