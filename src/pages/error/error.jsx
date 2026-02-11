import React from "react";
import { Link, useRouteError } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, ArrowLeft, Home, RefreshCw } from "lucide-react";

const Error = () => {
  const err = useRouteError();

  const status = err?.status || err?.response?.status || 500;
  const title =
    status === 404 ? "Page not found" : status === 401 ? "Unauthorized" : "Something went wrong";

  const message =
    err?.statusText ||
    err?.message ||
    "We couldn’t load this page. Try again or go back home.";

  return (
    <div className="min-h-[80vh] px-4 py-10 flex items-center justify-center">
      <div className="w-full max-w-2xl">
        <Card className="rounded-2xl overflow-hidden">
          <div className="relative p-8 border-b">
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to right, rgba(5,150,105,0.22), rgba(5,150,105,0.08), transparent)",
              }}
            />
            <div className="relative flex items-start gap-4">
              <div className="h-12 w-12 rounded-2xl bg-emerald-600/10 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-emerald-600" />
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl md:text-3xl font-bold leading-tight">
                    {title}
                  </h1>
                  <Badge className="bg-emerald-600 hover:bg-emerald-600">
                    {status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-2">{message}</p>
              </div>
            </div>
          </div>

          <CardContent className="p-8 flex flex-col gap-6">
            <div className="grid gap-3 sm:grid-cols-3">
              <Button asChild className="bg-emerald-600 hover:bg-emerald-700 gap-2">
                <Link to="/">
                  <Home className="h-4 w-4" />
                  Home
                </Link>
              </Button>

              <Button
                type="button"
                variant="outline"
                className="gap-2"
                onClick={() => window.location.reload()}
              >
                <RefreshCw className="h-4 w-4" />
                Reload
              </Button>

              <Button
                type="button"
                variant="outline"
                className="gap-2"
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="h-4 w-4" />
                Go back
              </Button>
            </div>

            <div className="rounded-2xl border bg-muted/20 p-4">
              <p className="text-xs font-semibold text-muted-foreground">
                Debug info
              </p>
              <p className="text-xs text-muted-foreground break-words mt-1">
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
