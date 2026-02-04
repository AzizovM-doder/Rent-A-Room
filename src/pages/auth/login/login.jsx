import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff, LogIn } from "lucide-react";
import toast from "react-hot-toast";
import { saveUserToken } from "../../../utils/url";

const Login = () => {
  const [show, setShow] = useState(false);
  const loginRequest = (e) =>{
    e.preventDefault()
    const admin = {
      name : e.target.name.value,
      password : e.target.password.value
    }
    if(admin.name.toLowerCase() == 'admin' && admin.password == 'admin1111'){
      localStorage.setItem("admin", JSON.stringify(admin))
      saveUserToken(JSON.stringify({...admin, email : 'admin@mail.com', phone : "12345678"}))
      window.location = '/'
      toast.success("Loged as Admin!")
    }
    else{
      toast.error("Password or username is wrong!")
    }
  }
  return (
    <div className="min-h-[65vh] flex items-center justify-center">
      <div className="w-full max-w-md lg:py-20">
        <Card className="overflow-hidden">
          <CardHeader className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl bg-emerald-600/10 flex items-center justify-center">
                <LogIn className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <CardTitle className="text-xl">Login</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Welcome back. Enter your details.
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-5">
            <form onSubmit={loginRequest} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">User Name</label>
                <Input type="text" name='name' placeholder="you@gmail.com" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Password</label>
                  <Link
                    to="/forgot-password"
                    className="text-xs text-emerald-600 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="relative">
                  <Input
                  name="password"
                    type={show ? "text" : "password"}
                    placeholder="••••••••"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShow((v) => !v)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-foreground"
                  >
                    {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                Sign in
              </Button>
            </form>

            <div className="flex items-center gap-3">
              <Separator className="flex-1" />
              <span className="text-xs text-muted-foreground">or</span>
              <Separator className="flex-1" />
            </div>

            <div className="grid gap-2">
              <Button variant="outline" className="w-full">
                Continue with Google
              </Button>
              <Button variant="outline" className="w-full">
                Continue with Facebook
              </Button>
            </div>

            <p className="text-sm text-muted-foreground text-center">
              Don’t have an account?{" "}
              <Link to="/signup" className="text-emerald-600 hover:underline">
                Sign up
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
