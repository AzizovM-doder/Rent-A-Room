import React from "react";
import { Link, useRouteError } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertOctagon, ArrowLeft, Home, RefreshCw, Bug } from "lucide-react";

const Error = () => {
  const err = useRouteError();

  const status = err?.status || err?.response?.status || 500;
  const title =
    status === 404 ? "Page not found" : status === 401 ? "Unauthorized access" : "Something went wrong";

  const message =
    err?.statusText ||
    err?.message ||
    "We couldn't load this page. Try again or go back home.";

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 animate-fade-in relative overflow-hidden">
      
      {/* Massive Error Decorational Blurs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-amber-500/10 rounded-full translate-x-1/3 -translate-y-1/4 blur-[100px] pointer-events-none" />

      <div className="w-full max-w-2xl relative z-10">
        <Card className="rounded-3xl shadow-2xl overflow-hidden border-0 bg-background/80 backdrop-blur-xl">
          <div className="bg-gradient-to-br from-rose-500 via-rose-600 to-red-800 p-8 md:p-10 text-white relative overflow-hidden text-center flex flex-col items-center">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/3 -translate-x-1/3 blur-xl" />
            
            <div className="h-20 w-20 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center ring-4 ring-white/30 shadow-xl mb-6 relative z-10">
              <AlertOctagon className="h-10 w-10 text-white" />
            </div>

            <div className="relative z-10 flex flex-col items-center gap-3">
              <Badge className="bg-white/20 hover:bg-white/30 text-white border-white/20 text-sm px-4 py-1.5 shadow-sm">
                Error Code: {status}
              </Badge>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                {title}
              </h1>
              <p className="text-rose-100 text-lg md:text-xl font-medium max-w-md">
                {message}
              </p>
            </div>
          </div>

          <CardContent className="p-8 md:p-10 flex flex-col gap-8">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="h-14 rounded-2xl px-6 bg-rose-600 hover:bg-rose-700 text-base font-bold shadow-lg shadow-rose-600/25 transition-all text-white flex-1 sm:max-w-xs">
                <Link to="/">
                  <Home className="h-5 w-5 mr-2" /> Return to Home
                </Link>
              </Button>

              <div className="flex gap-4 flex-1 sm:max-w-xs">
                <Button variant="outline" className="h-14 rounded-2xl flex-1 border-border/60 hover:bg-muted font-bold transition-colors" onClick={() => window.location.reload()}>
                  <RefreshCw className="h-5 w-5 mr-2" /> Reload
                </Button>

                <Button variant="outline" className="h-14 rounded-2xl flex-1 border-border/60 hover:bg-muted font-bold transition-colors" onClick={() => window.history.back()}>
                  <ArrowLeft className="h-5 w-5 mr-2" /> Go back
                </Button>
              </div>
            </div>

            {/* Tech details hidden behind a clean box */}
            <div className="rounded-2xl border bg-muted/30 p-5 mt-2 transition-all hover:bg-muted/50">
              <div className="flex items-center gap-2 mb-2">
                <Bug className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Technical Details</p>
              </div>
              <p className="text-xs text-muted-foreground font-mono bg-background p-3 rounded-xl border overflow-auto max-h-32">
                {typeof err === "string" ? err : JSON.stringify(err, null, 2)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Error;
