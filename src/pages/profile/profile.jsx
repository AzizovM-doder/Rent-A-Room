import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Phone, ShieldCheck, LogOut, Heart, Home as HomeIcon, PenLine, Star, X, CalendarDays, KeyRound, Settings, Bell, ChevronRight } from "lucide-react";
import { getUserFavLength, getUserToken } from "../../utils/url";
import { clearAuth, authApi } from "../../api/listingsAPI";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

const Profile = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [user, setUser] = useState(() => { try { return JSON.parse(getUserToken()); } catch { return null; } });
  const [favCount] = useState(getUserFavLength());
  
  // Tabs: overview, settings
  const [activeTab, setActiveTab] = useState("overview");

  // Edit states
  const [editName, setEditName] = useState(user?.name || "");
  const [editPhone, setEditPhone] = useState(user?.phone || "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    window.scrollTo(0, 0);
    authApi.getMe().then(u => {
      setUser(u);
      localStorage.setItem("userToken", JSON.stringify(u));
      setEditName(u.name || ""); setEditPhone(u.phone || "");
    }).catch(() => {});
  }, [navigate]);

  const logout = () => { clearAuth(); navigate("/login"); };

  const saveProfile = async (e) => {
    e?.preventDefault();
    setSaving(true);
    try {
      const updated = await authApi.updateMe({ name: editName, phone: editPhone });
      setUser(updated);
      localStorage.setItem("userToken", JSON.stringify(updated));
      if (updated.isAdmin) localStorage.setItem("admin", JSON.stringify(updated));
      toast.success(t("profile.updateSuccess", "Profile updated seamlessly"));
    } catch (err) { 
      toast.error(err.message || t("profile.updateFail", "Failed to update")); 
    } finally { 
      setSaving(false); 
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen px-4 py-8">
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="mx-auto max-w-6xl flex flex-col gap-8">

        {/* ── Hero Banner ───────────────────────────────────────── */}
        <motion.div variants={fadeUp} className="relative overflow-hidden rounded-[2.5rem] bg-slate-950 p-8 md:p-12 text-white shadow-2xl shadow-emerald-900/10">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full -translate-y-1/3 translate-x-1/3 blur-[80px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-500/10 rounded-full translate-y-1/2 -translate-x-1/4 blur-[80px] pointer-events-none" />
          
          <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-8 z-10">
            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6 md:gap-8">
              <div className="h-28 w-28 rounded-3xl bg-white/10 backdrop-blur-xl flex items-center justify-center ring-4 ring-white/10 shadow-2xl overflow-hidden shrink-0 relative group">
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <User className="h-12 w-12 text-white/80 group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="flex flex-col gap-2 pt-2">
                <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-none">{user.name}</h1>
                <div className="flex items-center justify-center sm:justify-start gap-2 mt-2 flex-wrap">
                  {user.isAdmin && (
                    <Badge className="bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/30 gap-1.5 px-3 py-1 shadow-sm font-bold">
                      <KeyRound className="h-3.5 w-3.5" /> {t("profile.badges.admin", "Administrator")}
                    </Badge>
                  )}
                  <Badge className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 gap-1.5 px-3 py-1 shadow-sm font-bold">
                    <ShieldCheck className="h-3.5 w-3.5" /> {t("profile.badges.verified", "Verified Profile")}
                  </Badge>
                  <span className="text-white/60 text-sm font-medium flex items-center gap-1.5 ml-1">
                    <CalendarDays className="h-4 w-4" /> {t("profile.joined", "Joined")} {user.createdAt ? new Date(user.createdAt).getFullYear() : t("profile.recently", "recently")}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center sm:justify-start gap-3 lg:self-start mt-2 lg:mt-0">
              <Button variant="outline" onClick={logout} className="gap-2 bg-white/5 hover:bg-rose-500/20 text-white hover:text-rose-200 border-white/10 hover:border-rose-500/30 rounded-xl transition-all shadow-sm">
                <LogOut className="h-4 w-4" /> {t("profile.signOut", "Sign Out")}
              </Button>
            </div>
          </div>
          
          <div className="relative mt-10 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 z-10 border-t border-white/10 pt-8">
            {[
              { icon: Mail, label: t("profile.registeredEmail", "Registered Email"), value: user.email }, 
              { icon: Phone, label: t("profile.contactPhone", "Contact Phone"), value: user.phone || t("profile.addPhone", "Please add a phone number") }
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex flex-col gap-1.5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/5 p-4 transition-all hover:bg-white/10 hover:-translate-y-0.5 shadow-sm">
                <div className="flex items-center gap-2 text-emerald-400 mb-1">
                  <Icon className="h-4 w-4" />
                  <span className="text-xs font-black uppercase tracking-widest">{label}</span>
                </div>
                <span className="text-white font-medium truncate">{value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Fancy Tab Navigation ───────────────────────────────────────── */}
        <motion.div variants={fadeUp} className="flex items-center gap-2 p-1.5 bg-muted/50 backdrop-blur-md rounded-2xl w-fit border border-border/50">
          {["overview", "settings"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative px-6 py-2.5 text-sm font-bold rounded-xl transition-colors outline-none z-10 ${
                activeTab === tab ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {activeTab === tab && (
                <motion.div
                  layoutId="activeProfileTab"
                  className="absolute inset-0 bg-background shadow-sm rounded-xl border border-border/50 z-[-1]"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="capitalize relative z-10">{tab === "overview" ? t("profile.tabs.dashboard", "Dashboard") : t("profile.tabs.settings", "Account Settings")}</span>
            </button>
          ))}
        </motion.div>

        {/* ── Tab Content Area ───────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          
          {/* TAB: OVERVIEW */}
          {activeTab === "overview" && (
            <motion.div 
              key="overview"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}
              className="flex flex-col gap-8"
            >
              {/* Quick Stats Grid */}
              <div className="grid gap-6 grid-cols-2 lg:grid-cols-4">
                {[
                  { icon: Heart, label: t("profile.stats.saved", "Saved Listings"), value: favCount, bg: "bg-rose-500/10 dark:bg-rose-500/20", color: "text-rose-500", border: "border-rose-500/20" },
                  { icon: HomeIcon, label: t("profile.stats.active", "Active Posts"), value: "0", bg: "bg-emerald-500/10 dark:bg-emerald-500/20", color: "text-emerald-600 dark:text-emerald-400", border: "border-emerald-500/20" },
                  { icon: Star, label: t("profile.stats.reviews", "Total Reviews"), value: "0", bg: "bg-amber-500/10 dark:bg-amber-500/20", color: "text-amber-500", border: "border-amber-500/20" },
                  { icon: ShieldCheck, label: t("profile.stats.trust", "Trust Score"), value: "100%", bg: "bg-blue-500/10 dark:bg-blue-500/20", color: "text-blue-500 dark:text-blue-400", border: "border-blue-500/20" },
                ].map(({ icon: Icon, label, value, bg, color, border }) => (
                  <Card key={label} className={`rounded-3xl shadow-sm border ${border} bg-card/60 backdrop-blur-xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}>
                    <CardContent className="p-6 md:p-8 flex flex-col items-center justify-center gap-4 text-center">
                      <div className={`h-16 w-16 rounded-[1.5rem] ${bg} flex items-center justify-center shadow-inner`}>
                        <Icon className={`h-8 w-8 ${color}`} />
                      </div>
                      <div>
                        <p className="text-4xl font-black leading-none">{value}</p>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mt-2">{label}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="grid gap-8 md:grid-cols-12 items-start">
                
                {/* Quick Actions (Left on Desktop, Top on Mobile) */}
                <div className="md:col-span-5 lg:col-span-4 flex flex-col gap-6">
                  <h2 className="text-xl font-black px-2 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-emerald-500" /> {t("profile.actions.title", "Actions")}
                  </h2>
                  <div className="flex flex-col gap-4">
                    {[
                      { to: "/favorites", icon: Heart, label: t("profile.actions.manageFavs", "Manage Favorites"), desc: t("profile.actions.manageFavsDesc", "View and edit your saved properties"), color: "text-rose-500" },
                      { to: "/post", icon: PenLine, label: t("profile.actions.createListing", "Create Listing"), desc: t("profile.actions.createListingDesc", "Start earning from your space"), color: "text-emerald-600 dark:text-emerald-400" },
                    ].map(({ to, icon: Icon, label, desc, color }) => (
                      <Link key={to} to={to} className="group overflow-hidden rounded-[2rem]">
                        <Card className="rounded-[2rem] border-border/50 bg-card/60 backdrop-blur-md hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300">
                          <div className="p-6 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-5">
                              <div className="h-14 w-14 rounded-2xl bg-muted group-hover:bg-emerald-500/10 flex items-center justify-center shrink-0 transition-colors">
                                <Icon className={`h-7 w-7 transition-colors text-muted-foreground group-hover:${color}`} />
                              </div>
                              <div className="flex flex-col gap-1">
                                <p className="font-bold text-[17px] leading-tight group-hover:text-emerald-600 transition-colors">{label}</p>
                                <p className="text-sm text-muted-foreground font-medium">{desc}</p>
                              </div>
                            </div>
                            <ChevronRight className="h-5 w-5 text-muted-foreground opacity-50 group-hover:opacity-100 group-hover:text-emerald-500 transition-all group-hover:translate-x-1" />
                          </div>
                        </Card>
                      </Link>
                    ))}

                    {user.isAdmin && (
                      <Link to="/admin" className="group overflow-hidden rounded-[2rem] mt-2">
                        <Card className="rounded-[2rem] border-amber-400/30 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 hover:border-amber-500/50 hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300 relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
                          <div className="p-6 flex items-center justify-between gap-4 relative z-10">
                            <div className="flex items-center gap-5">
                              <div className="h-14 w-14 rounded-2xl bg-amber-500/20 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform">
                                <KeyRound className="h-7 w-7 text-amber-600 dark:text-amber-400" />
                              </div>
                              <div className="flex flex-col gap-1">
                                <p className="font-bold text-[17px] leading-tight text-amber-800 dark:text-amber-200">{t("profile.actions.adminDash", "Admin Dashboard")}</p>
                                <p className="text-sm font-medium text-amber-700/70 dark:text-amber-400/70">{t("profile.actions.adminDashDesc", "Manage platform resources")}</p>
                              </div>
                            </div>
                            <ChevronRight className="h-5 w-5 text-amber-600 dark:text-amber-400 opacity-50 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                          </div>
                        </Card>
                      </Link>
                    )}
                  </div>
                </div>
                
                {/* Recent Activity Mock */}
                <div className="md:col-span-7 lg:col-span-8 flex flex-col gap-6">
                  <h2 className="text-xl font-black px-2 flex items-center gap-2">
                    <Bell className="h-5 w-5 text-emerald-500" /> {t("profile.notifications.title", "Notifications")}
                  </h2>
                  <Card className="rounded-[2rem] border-border/50 bg-card/60 backdrop-blur shadow-lg">
                    <CardContent className="p-0">
                      <div className="flex flex-col divide-y divide-border/50">
                        <div className="p-6 flex items-start gap-4 hover:bg-muted/30 transition-colors">
                          <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-500/20">
                             <ShieldCheck className="h-5 w-5 text-emerald-600" />
                          </div>
                          <div>
                            <p className="font-bold text-[15px]">{t("profile.notifications.notif1Title", "Profile verified successfully")}</p>
                            <p className="text-sm text-muted-foreground font-medium mt-1 leading-snug">{t("profile.notifications.notif1Desc", "Thanks for verifying your account. You can now rent and host properties on Rent-A-Room.")}</p>
                            <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mt-3">{t("profile.notifications.notif1Time", "2 Days ago")}</p>
                          </div>
                        </div>
                        <div className="p-6 flex items-start gap-4 hover:bg-muted/30 transition-colors">
                          <div className="h-12 w-12 rounded-full bg-sky-500/10 flex items-center justify-center shrink-0 mt-0.5 border border-sky-500/20">
                             <User className="h-5 w-5 text-sky-600" />
                          </div>
                          <div>
                            <p className="font-bold text-[15px]">{t("profile.notifications.notif2Title", "Welcome to the community!")}</p>
                            <p className="text-sm text-muted-foreground font-medium mt-1 leading-snug">{t("profile.notifications.notif2Desc", "We are glad to have you here. Complete your profile to get the most out of the platform.")}</p>
                            <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mt-3">{t("profile.notifications.notif2Time", "1 Week ago")}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
              </div>
            </motion.div>
          )}

          {/* TAB: SETTINGS */}
          {activeTab === "settings" && (
            <motion.div 
              key="settings"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}
            >
              <Card className="rounded-[2.5rem] shadow-xl overflow-hidden border-border/50 bg-card/80 backdrop-blur-xl max-w-3xl">
                <div className="p-8 md:p-10 flex flex-col gap-8">
                  <div>
                    <h2 className="text-2xl font-black flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600"><Settings className="h-6 w-6" /></div>
                      {t("profile.settings.title", "Profile Settings")}
                    </h2>
                    <p className="text-base text-muted-foreground mt-3 font-medium">{t("profile.settings.desc", "Update your personal information and how we can reach you.")}</p>
                  </div>
                  
                  <Separator className="opacity-50" />
                  
                  <form onSubmit={saveProfile} className="flex flex-col gap-8">
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="flex flex-col gap-2 relative">
                        <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground pl-1">{t("profile.settings.fullName", "Full Name")}</label>
                        <User className="h-5 w-5 absolute left-4 top-[35px] text-muted-foreground z-10" />
                        <Input 
                          value={editName} 
                          onChange={e => setEditName(e.target.value)} 
                          className="pl-12 h-14 rounded-2xl bg-muted/40 border-transparent hover:bg-muted/60 focus-visible:bg-transparent focus-visible:border-emerald-500 shadow-sm transition-all font-semibold" 
                        />
                      </div>
                      <div className="flex flex-col gap-2 relative">
                        <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground pl-1">{t("profile.settings.phone", "Phone Number")}</label>
                        <Phone className="h-5 w-5 absolute left-4 top-[35px] text-muted-foreground z-10" />
                        <Input 
                          value={editPhone} 
                          onChange={e => setEditPhone(e.target.value)} 
                          className="pl-12 h-14 rounded-2xl bg-muted/40 border-transparent hover:bg-muted/60 focus-visible:bg-transparent focus-visible:border-emerald-500 shadow-sm transition-all font-semibold" 
                        />
                      </div>
                      <div className="flex flex-col gap-2 sm:col-span-2 relative opacity-60">
                        <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground pl-1">{t("profile.settings.emailLocked", "Email Address (Locked)")}</label>
                        <Mail className="h-5 w-5 absolute left-4 top-[35px] text-muted-foreground z-10" />
                        <Input 
                          value={user.email} 
                          disabled 
                          className="pl-12 h-14 rounded-2xl bg-muted/50 border-input font-semibold" 
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t border-border/50">
                      <Button type="button" variant="ghost" onClick={() => setActiveTab("overview")} className="rounded-xl h-12 px-6 font-bold hover:bg-muted">
                        {t("profile.settings.cancel", "Cancel")}
                      </Button>
                      <Button type="submit" disabled={saving} className="rounded-xl h-12 px-8 bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 font-bold transition-all hover:-translate-y-0.5">
                        {saving ? t("profile.settings.saving", "Saving Changes...") : t("profile.settings.save", "Save Changes")}
                      </Button>
                    </div>
                  </form>
                </div>
              </Card>
            </motion.div>
          )}

        </AnimatePresence>
      </motion.div>
    </div>
  );
};
export default Profile;
