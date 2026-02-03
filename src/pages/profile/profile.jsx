import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  LogOut,
  Settings,
  Heart,
  Home as HomeIcon,
} from "lucide-react";
import { getUserFavLength, getUserToken, removeUserToken } from "../../utils/url";

const Profile = () => {
  const logout = () => {
    removeUserToken();
    window.location.href = "/login";
  };
  const user = JSON.parse(getUserToken())
  return (
    <div className="px-4 pb-10">
      <div className="mx-auto max-w-7xl flex flex-col gap-8">
        <div className="relative overflow-hidden rounded-2xl border bg-background">
          <div className="absolute inset-0 from-emerald-600/15 via-transparent to-emerald-600/10" />
          <div className="relative p-6 md:p-8 flex flex-col gap-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-2xl bg-emerald-600/15 flex items-center justify-center ring-1 ring-emerald-600/20">
                  <User className="h-8 w-8 text-emerald-600" />
                </div>

                <div className="flex flex-col">
                  <h1 className="text-2xl md:text-3xl font-bold leading-tight">
                    {user?.name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {/* <Badge className="bg-emerald-600 hover:bg-emerald-600">
                      Active
                    </Badge> */}
                    <Badge variant="secondary" className="gap-1 bg-red-500 text-white">
                      <ShieldCheck className="h-3.5  w-3.5" />
                      Not Verified
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button variant="outline" className="gap-2" asChild>
                  <Link to="/profile/settings">
                    <Settings className="h-4 w-4" />
                    Settings
                  </Link>
                </Button>
                <Button
                  onClick={logout}
                  className="bg-emerald-600 hover:bg-emerald-700 gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-xl border bg-background/70 p-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-600/10 flex items-center justify-center">
                  <Mail className="h-5 w-5 text-emerald-600" />
                </div>
                <div className="flex flex-col leading-tight">
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-medium">
                    {user?.email}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border bg-background/70 p-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-600/10 flex items-center justify-center">
                  <Phone className="h-5 w-5 text-emerald-600" />
                </div>
                <div className="flex flex-col leading-tight">
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="text-sm font-medium">
                    {user?.phone}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="rounded-2xl lg:col-span-2">
            <CardContent className="p-6 md:p-7 flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Overview</h2>
                <Badge variant="secondary">Member</Badge>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border p-4">
                  <p className="text-xs text-muted-foreground">My requests</p>
                  <p className="text-2xl font-bold mt-1">0</p>
                </div>
                <div className="rounded-xl border p-4">
                  <p className="text-xs text-muted-foreground">Saved homes</p>
                  <p className="text-2xl font-bold mt-1">{getUserFavLength()}</p>
                </div>
                <div className="rounded-xl border p-4">
                  <p className="text-xs text-muted-foreground">Messages</p>
                  <p className="text-2xl font-bold mt-1">0</p>
                </div>
              </div>

              <Separator />

              <div  className="flex flex-col gap-3">
                <p className="text-sm text-muted-foreground">
                  Quick actions
                </p>

                <div className="grid gap-3 sm:grid-cols-2">
                  <Button
                  disabled  
                    variant="outline"
                    className="justify-between"
                    asChild
                  >
                    <Link to="/favorites">
                      <span className="flex items-center gap-2">
                        <Heart className="h-4 w-4" />
                        Favorites
                      </span>
                      <span className="text-muted-foreground">→</span>
                    </Link>
                  </Button>

                  <Button
                    variant="outline"
                    className="justify-between"
                    asChild
                  >
                    <Link to="/my-listings">
                      <span className="flex items-center gap-2">
                        <HomeIcon className="h-4 w-4" />
                        My listings
                      </span>
                      <span className="text-muted-foreground">→</span>
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardContent className="p-6 md:p-7 flex flex-col gap-4">
              <h2 className="text-lg font-semibold">Profile</h2>
              <p className="text-sm text-muted-foreground">
                Update your account details to keep everything clean.
              </p>

              <div className="grid gap-3">
                <Button variant="outline" className="justify-between" asChild>
                  <Link to="/profile/edit">
                    Edit profile
                    <span className="text-muted-foreground">→</span>
                  </Link>
                </Button>

                <Button variant="outline" className="justify-between" asChild>
                  <Link to="/profile/security">
                    Security
                    <span className="text-muted-foreground">→</span>
                  </Link>
                </Button>

                <Button variant="outline" className="justify-between" asChild>
                  <Link to="/profile/support">
                    Support
                    <span className="text-muted-foreground">→</span>
                  </Link>
                </Button>
              </div>

              <div className="pt-2">
                <Button
                  onClick={logout}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
