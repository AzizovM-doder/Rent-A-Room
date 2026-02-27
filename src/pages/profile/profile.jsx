import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Phone, ShieldCheck, LogOut, Heart, Home as HomeIcon, PenLine, Star, Save, X, CalendarDays, KeyRound } from "lucide-react";
import { getUserFavLength, getUserToken } from "../../utils/url";
import { clearAuth, authApi } from "../../api/listingsAPI";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => { try { return JSON.parse(getUserToken()); } catch { return null; } });
  const [favCount] = useState(getUserFavLength());
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || "");
  const [editPhone, setEditPhone] = useState(user?.phone || "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    authApi.getMe().then(u => {
      setUser(u);
      localStorage.setItem("userToken", JSON.stringify(u));
      setEditName(u.name || ""); setEditPhone(u.phone || "");
    }).catch(() => {});
  }, []);

  const logout = () => { clearAuth(); navigate("/login"); };

  const saveProfile = async () => {
    setSaving(true);
    try {
      const updated = await authApi.updateMe({ name: editName, phone: editPhone });
      setUser(updated);
      localStorage.setItem("userToken", JSON.stringify(updated));
      if (updated.isAdmin) localStorage.setItem("admin", JSON.stringify(updated));
      toast.success("Profile updated seamlessly");
      setEditing(false);
    } catch (err) { toast.error(err.message || "Failed to update"); }
    finally { setSaving(false); }
  };

  if (!user) return null;

  return (
    <div className="pb-10 pt-4 animate-fade-up">
      <div className="mx-auto max-w-5xl flex flex-col gap-6">

        {/* Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 p-8 md:p-10 text-white shadow-2xl">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4 blur-2xl pointer-events-none" />
          
          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="h-24 w-24 rounded-3xl bg-white/10 backdrop-blur-md flex items-center justify-center ring-4 ring-white/20 shadow-xl overflow-hidden">
                <User className="h-12 w-12 text-white/90" />
              </div>
              <div className="flex flex-col gap-1.5">
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-none">{user.name}</h1>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  {user.isAdmin && (
                    <Badge className="bg-amber-400/20 hover:bg-amber-400/30 text-amber-200 border-amber-400/50 gap-1.5 px-3 py-1">
                      <KeyRound className="h-3 w-3" /> Admin
                    </Badge>
                  )}
                  <Badge className="bg-white/10 hover:bg-white/20 text-white border-white/20 gap-1.5 px-3 py-1 shadow-sm">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-300" /> Verified Member
                  </Badge>
                  <span className="text-white/60 text-sm flex items-center gap-1.5 ml-2">
                    <CalendarDays className="h-4 w-4" /> Joined {user.createdAt ? new Date(user.createdAt).getFullYear() : "recently"}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 md:self-start">
              {!editing && (
                <Button onClick={() => setEditing(true)} variant="outline" className="gap-2 bg-white/10 hover:bg-white/20 text-white border-white/20 rounded-xl">
                  <PenLine className="h-4 w-4" /> Edit Profile
                </Button>
              )}
              <Button variant="ghost" onClick={logout} className="gap-2 hover:bg-rose-500/20 text-white hover:text-rose-100 rounded-xl">
                <LogOut className="h-4 w-4" /> Logout
              </Button>
            </div>
          </div>
          
          <div className="relative mt-8 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Mail, label: "Email", value: user.email }, 
              { icon: Phone, label: "Phone", value: user.phone || "Add your phone number" }
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex flex-col gap-1 rounded-2xl bg-black/10 backdrop-blur border border-white/10 p-4 transition-colors hover:bg-black/20">
                <div className="flex items-center gap-2 text-emerald-200/80 mb-1">
                  <Icon className="h-4 w-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">{label}</span>
                </div>
                <span className="text-white font-medium truncate">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid gap-5 grid-cols-2 md:grid-cols-4">
          {[
            { icon: Heart, label: "Saved Listings", value: favCount, bg: "bg-rose-500/10", color: "text-rose-500" },
            { icon: HomeIcon, label: "My Posts", value: "0", bg: "bg-emerald-500/10", color: "text-emerald-600" },
            { icon: Star, label: "Reviews", value: "0", bg: "bg-amber-500/10", color: "text-amber-500" },
            { icon: ShieldCheck, label: "Trust Score", value: "100", bg: "bg-blue-500/10", color: "text-blue-500" },
          ].map(({ icon: Icon, label, value, bg, color }) => (
            <Card key={label} className="rounded-3xl border-0 shadow-md bg-card/50 backdrop-blur flex flex-col items-center justify-center p-6 gap-3 hover:-translate-y-1 transition-all duration-300">
              <div className={`h-14 w-14 rounded-2xl ${bg} flex items-center justify-center`}>
                <Icon className={`h-7 w-7 ${color}`} />
              </div>
              <div className="text-center">
                <p className="text-3xl font-extrabold">{value}</p>
                <p className="text-xs text-muted-foreground font-medium mt-1">{label}</p>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-5 items-start">
          {/* Main Content - Left side */}
          <div className="md:col-span-3">
            <Card className="rounded-3xl shadow-lg overflow-hidden border-0 bg-card/80 backdrop-blur">
              <div className="p-6 md:p-8 flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold">Personal Information</h2>
                    <p className="text-sm text-muted-foreground mt-1">Manage your details and contact preferences</p>
                  </div>
                  {editing && (
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setEditing(false)} className="rounded-xl h-10 px-4">Cancel</Button>
                      <Button onClick={saveProfile} disabled={saving} className="rounded-xl h-10 px-5 bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/20">
                        {saving ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  )}
                </div>
                
                <Separator className="opacity-50" />
                
                <div className="flex flex-col gap-5">
                  {editing ? (
                    <div className="grid gap-5 sm:grid-cols-2 animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-foreground/80">Full Name</label>
                        <Input value={editName} onChange={e => setEditName(e.target.value)} className="h-12 rounded-xl bg-muted/50" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-foreground/80">Phone Number</label>
                        <Input value={editPhone} onChange={e => setEditPhone(e.target.value)} className="h-12 rounded-xl bg-muted/50" />
                      </div>
                      <div className="flex flex-col gap-2 sm:col-span-2">
                        <label className="text-sm font-semibold text-foreground/80">Email Address (Cannot be changed)</label>
                        <Input value={user.email} disabled className="h-12 rounded-xl bg-muted text-muted-foreground opacity-70" />
                      </div>
                    </div>
                  ) : (
                    <div className="grid gap-y-6 gap-x-4 sm:grid-cols-2">
                      {[
                        ["Full Name", user.name], 
                        ["Email Address", user.email], 
                        ["Phone Number", user.phone || "Not provided"],
                        ["Account Role", user.isAdmin ? "Administrator" : "Standard User"],
                      ].map(([label, value]) => (
                        <div key={label} className="flex flex-col gap-1">
                          <span className="text-sm text-muted-foreground font-medium">{label}</span>
                          <span className="text-base font-semibold">{value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar - Right side */}
          <div className="md:col-span-2 flex flex-col gap-5">
            <Card className="rounded-3xl shadow-lg border-0 bg-card/80 backdrop-blur">
              <div className="p-6 flex flex-col gap-5">
                <h2 className="text-lg font-bold">Quick Actions</h2>
                <div className="flex flex-col gap-3">
                  {[
                    { to: "/favorites", icon: Heart, label: "View Favorites", desc: "Access your saved properties", color: "text-rose-500", bg: "bg-rose-500/10" },
                    { to: "/post", icon: PenLine, label: "Post Listing", desc: "Rent out your room or apartment", color: "text-emerald-600", bg: "bg-emerald-600/10" },
                  ].map(({ to, icon: Icon, label, desc, color, bg }) => (
                    <Link key={to} to={to} className="flex items-center gap-4 rounded-2xl border p-4 hover:border-emerald-500 hover:shadow-md transition-all group bg-card">
                      <div className={`h-12 w-12 rounded-xl ${bg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                        <Icon className={`h-6 w-6 ${color}`} />
                      </div>
                      <div className="flex flex-col">
                        <p className="font-semibold">{label}</p>
                        <p className="text-xs text-muted-foreground">{desc}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </Card>

            {user.isAdmin && (
              <Card className="rounded-3xl shadow-lg border-2 border-amber-400/20 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20">
                <div className="p-6 flex flex-col gap-4">
                  <div className="flex items-center gap-3 text-amber-600 dark:text-amber-500 mb-2">
                    <KeyRound className="h-6 w-6" />
                    <h2 className="text-lg font-bold">Admin Zone</h2>
                  </div>
                  <p className="text-sm text-foreground/80 mb-2">You have special privileges to manage all listings and user accounts on the platform.</p>
                  <Button asChild className="w-full h-12 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold shadow-lg shadow-amber-500/20">
                    <Link to="/admin">Open Admin Dashboard</Link>
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Profile;
