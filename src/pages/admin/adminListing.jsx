import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearError, createListing, deleteListing, fetchListings, updateListing } from "../../reducers/listingSlice";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, RefreshCw, MessageSquare, Home as HomeIcon, Users, CheckCircle, XCircle, Clock, ShieldCheck, ShieldOff, Lock, TrendingUp, KeyRound, ImagePlus, Mail, Search, Check } from "lucide-react";
import { listingsApi, messagesApi, usersApi } from "../../api/listingsAPI";
import { getUserToken } from "../../utils/url";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

const STATUS_CONFIG = {
  PENDING:  { label: "Pending",  icon: Clock,       cls: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 border-amber-200 dark:border-amber-900" },
  ACCEPTED: { label: "Accepted", icon: CheckCircle, cls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900" },
  REJECTED: { label: "Rejected", icon: XCircle,     cls: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400 border-rose-200 dark:border-rose-900" },
};

const empty = { id: "", nameEn: "", nameRu: "", nameTj: "", locationEn: "", locationRu: "", locationTj: "", typeEn: "", typeRu: "", typeTj: "", rooms: "", price: "", about: "" };

const AdminListings = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { items = [], loading, saving, deletingId, error } = useSelector((s) => s.listings || {});

  const user = (() => { try { return JSON.parse(getUserToken()); } catch { return null; } })();
  const isAdmin = user?.isAdmin || !!localStorage.getItem("admin");

  const [tab, setTab] = useState("listings");
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("create");
  const [form, setForm] = useState(empty);
  const [imageFile, setImageFile] = useState(null);
  const [messageToDelete, setMessageToDelete] = useState(null);
  
  // Data
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [msgsLoading, setMsgsLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => { dispatch(fetchListings()); window.scrollTo(0, 0); }, [dispatch]);

  const loadMessages = async () => { setMsgsLoading(true); try { setMessages(await messagesApi.getAll()); } catch {} finally { setMsgsLoading(false); } };
  const loadUsers = async () => { setUsersLoading(true); try { setUsers(await usersApi.getAll()); } catch {} finally { setUsersLoading(false); } };

  useEffect(() => { if (tab === "messages") loadMessages(); }, [tab]);
  useEffect(() => { if (tab === "users") loadUsers(); }, [tab]);

  const changeMessageStatus = async (id, status) => {
    try {
      await messagesApi.updateStatus(id, status);
      setMessages(ms => ms.map(m => m.id === id ? { ...m, status } : m));
    } catch {}
  };

  const changeListingStatus = async (id, status) => {
    try {
      await listingsApi.updateStatus(id, status);
      dispatch(fetchListings());
    } catch {}
  };

  const requestDeleteMessage = (id) => {
    setMessageToDelete(id);
  };

  const confirmDeleteMessage = async () => {
    if (!messageToDelete) return;
    try {
      await messagesApi.remove(messageToDelete);
      setMessages(ms => ms.filter(m => m.id !== messageToDelete));
    } catch {} finally {
      setMessageToDelete(null);
    }
  };

  const toggleAdmin = async (u) => {
    try {
      const updated = await usersApi.update(u.id, { isAdmin: !u.isAdmin });
      setUsers(us => us.map(x => x.id === u.id ? { ...x, isAdmin: updated.isAdmin } : x));
    } catch {}
  };

  const deleteUser = async (id) => {
    try {
      await usersApi.remove(id);
      setUsers(us => us.filter(u => u.id !== id));
    } catch {}
  };

  const openCreate = () => { setMode("create"); setForm(empty); setImageFile(null); setOpen(true); dispatch(clearError()); };
  
  const openEdit = (x) => {
    setMode("edit"); setImageFile(null);
    setForm({ 
      id: x.id, 
      nameEn: x?.name?.en || "", nameRu: x?.name?.ru || "", nameTj: x?.name?.tj || "", 
      locationEn: x?.location?.en || "", locationRu: x?.location?.ru || "", locationTj: x?.location?.tj || "", 
      typeEn: x?.type?.en || "", typeRu: x?.type?.ru || "", typeTj: x?.type?.tj || "", 
      rooms: String(x.rooms ?? ""), price: String(x.price ?? ""), about: x.about || "",
      image: x.image || ""
    });
    setOpen(true); dispatch(clearError());
  };

  const submit = async (ev) => {
    ev.preventDefault();
    const fd = new FormData();
    if (imageFile) fd.append("image", imageFile);
    const nameObj = { en: form.nameEn, ru: form.nameRu, tj: form.nameTj };
    const locObj  = { en: form.locationEn, ru: form.locationRu, tj: form.locationTj };
    const typeObj = { en: form.typeEn, ru: form.typeRu, tj: form.typeTj };
    fd.append("name", JSON.stringify(nameObj));
    fd.append("location", JSON.stringify(locObj));
    fd.append("type", JSON.stringify(typeObj));
    fd.append("rooms", form.rooms); fd.append("price", form.price); fd.append("about", form.about || "");

    if (mode === "create") { await dispatch(createListing(fd)); }
    else { await dispatch(updateListing({ id: form.id, payload: fd })); }
    setOpen(false); dispatch(fetchListings());
  };

  // Animation Variants
  const containerVars = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };
  
  const itemVars = {
    hidden: { opacity: 0, scale: 0.95, y: 15 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
    exit: { opacity: 0, scale: 0.9, y: -10, transition: { duration: 0.2 } }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4 bg-background">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full">
          <Card className="rounded-[2.5rem] text-center shadow-2xl shadow-rose-900/10 border-0 bg-card overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-transparent pointer-events-none" />
            <div className="h-32 bg-rose-500/10 border-b border-rose-500/20" />
            <CardContent className="p-10 flex flex-col items-center gap-5 -mt-16">
              <div className="h-24 w-24 rounded-full bg-background flex items-center justify-center p-2 shadow-xl ring-1 ring-border relative z-10">
                <div className="h-full w-full rounded-full bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center text-rose-500">
                  <Lock className="h-8 w-8" />
                </div>
              </div>
              <div className="space-y-2 relative z-10">
                <h2 className="text-3xl font-black">{t("admin.accessDenied", "Access Denied")}</h2>
                <p className="text-muted-foreground">{t("admin.accessDeniedDesc", "This area is highly restricted.")}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  const TABS = [
    { id: "listings", label: t("admin.tabs.properties", "Properties"), icon: HomeIcon, count: items.length },
    { id: "messages", label: t("admin.tabs.bookings", "Bookings"), icon: MessageSquare, count: messages.length },
    { id: "users", label: t("admin.tabs.accounts", "Accounts"), icon: Users, count: users.length },
  ];

  // Filtering Logic
  const filteredListings = items.filter(i => 
    i.name?.en?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    i.location?.en?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredMessages = messages.filter(m => 
    m.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.phone?.includes(searchQuery) ||
    m.listing?.nameEn?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen px-4 py-8 md:py-12 pb-32">
      <div className="mx-auto max-w-7xl flex flex-col gap-8 md:gap-12">
        
        {/* ── Dashboard Hero ───────────────────────────────────────── */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative overflow-hidden rounded-[2.5rem] bg-indigo-950 text-white shadow-2xl flex flex-col"
        >
          {/* Decorative Background Orbs */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-sky-500/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/30 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3 pointer-events-none" />
          
          {/* Top Half: Title & Branding */}
          <div className="p-8 md:p-12 pb-8 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6 lg:gap-8 relative z-10">
            <div className="h-20 w-20 md:h-24 md:w-24 rounded-[1.5rem] bg-white/10 backdrop-blur-xl flex items-center justify-center ring-1 ring-white/20 shadow-xl shrink-0">
              <KeyRound className="h-10 w-10 md:h-12 md:w-12 text-sky-400" />
            </div>
            <div className="pt-2 md:pt-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-3">
                {t("admin.heroTitle", "Command Center")}
              </h1>
              <p className="text-indigo-200/90 font-medium text-lg leading-relaxed max-w-xl">
                {t("admin.heroDesc", "Master control for properties, user accounts, and booking analytics.")}
              </p>
            </div>
          </div>
          
          {/* Bottom Half: Continuous Metrics Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/10 border-t border-white/10 bg-black/20 backdrop-blur-md relative z-10">
            {[
              { label: t("admin.stats.activeProps", "Listings"), icon: HomeIcon, count: items.length, color: "text-emerald-400" },
              { label: t("admin.stats.totalBookings", "Bookings"), icon: MessageSquare, count: messages.length, color: "text-sky-400", loading: msgsLoading && tab !== 'messages' },
              { label: t("admin.stats.registeredUsers", "Users"), icon: Users, count: users.length, color: "text-violet-400", loading: usersLoading && tab !== 'users' },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-6 md:p-8 hover:bg-white/5 transition-colors">
                <div className={`p-4 rounded-2xl bg-white/5 ring-1 ring-white/10 shadow-inner ${stat.color} shrink-0`}>
                  <stat.icon className="h-6 w-6 md:h-8 md:w-8" />
                </div>
                <div className="flex flex-col items-center sm:items-start">
                  <span className="text-xs font-bold uppercase tracking-widest text-indigo-200/70 mb-1">{stat.label}</span>
                  <span className="text-3xl md:text-4xl font-black">{stat.count}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Toolbar ───────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 z-20">
          
          {/* Navigation Tabs */}
          <div className="flex p-1.5 bg-muted/60 backdrop-blur-md rounded-2xl border border-border/50 shrink-0 overflow-x-auto w-max max-w-full">
            {TABS.map(({ id, label, icon: Icon, count }) => {
              const isActive = tab === id;
              return (
                <button 
                  key={id} 
                  onClick={() => setTab(id)} 
                  className={`relative flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-xl transition-colors whitespace-nowrap outline-none z-10 min-w-32 justify-center
                  ${isActive ? "text-indigo-700 dark:text-indigo-400" : "text-muted-foreground hover:text-foreground"}`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="adminTabIndicator"
                      className="absolute inset-0 bg-background shadow-md rounded-xl border border-border/50 z-[-1]"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                  <Badge variant={isActive ? "default" : "secondary"} className={`ml-1.5 shadow-sm bg-transparent border-0 px-1 font-black ${isActive ? "text-indigo-700 dark:text-indigo-400" : "text-muted-foreground"}`}>
                    {count}
                  </Badge>
                </button>
              );
            })}
          </div>
          
          {/* Actions & Search */}
          <div className="flex flex-col sm:flex-row gap-3 md:w-auto w-full">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search records..." 
                className="pl-10 h-12 rounded-xl bg-card border-border/60 shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Button variant="outline" onClick={() => { dispatch(fetchListings()); if(tab==="messages")loadMessages(); if(tab==="users")loadUsers(); }} className="h-12 w-12 p-0 shrink-0 rounded-xl shadow-sm border-border/60 text-muted-foreground hover:text-foreground">
              <RefreshCw className={`h-4 w-4 ${loading || msgsLoading || usersLoading ? "animate-spin text-indigo-500" : ""}`} />
            </Button>
            
            {tab === "listings" && (
              <Button onClick={openCreate} className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 rounded-xl h-12 px-6 shadow-xl shadow-indigo-600/20 font-bold sm:w-auto w-full">
                <Plus className="h-5 w-5" /> {t("admin.newProperty", "Add Property")}
              </Button>
            )}
          </div>
        </div>

        {/* ── Content Area ───────────────────────────────────────── */}
        <div className="relative min-h-[400px]">
          <AnimatePresence mode="popLayout">
            
            {/* ── LISTINGS TAB ── */}
            {tab === "listings" && (
              <motion.div key="listings" variants={containerVars} initial="hidden" animate="visible" exit="exit" className="w-full">
                {items.length === 0 && !loading ? (
                   <div className="py-24 text-center flex flex-col items-center">
                     <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-6"><HomeIcon className="h-8 w-8 text-muted-foreground" /></div>
                     <h3 className="text-2xl font-black mb-2">{t("admin.emptyProps.title", "Empty Catalog")}</h3>
                     <p className="text-muted-foreground max-w-md mx-auto mb-8">{t("admin.emptyProps.desc", "No properties found. Add your first listing to start renting.")}</p>
                     <Button onClick={openCreate} className="h-12 px-8 rounded-full">{t("admin.emptyProps.btn", "Create First Property")}</Button>
                   </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                      {filteredListings.map(x => (
                        <motion.div key={x.id} variants={itemVars} layout>
                          <Card className="rounded-[2rem] overflow-hidden border-border/40 bg-card/60 backdrop-blur-xl shadow-md hover:shadow-2xl hover:shadow-indigo-500/10 group transition-shadow">
                            <div className="h-52 bg-muted relative overflow-hidden">
                              {x.image ? (
                                <img src={x.image} alt={x?.name?.en} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                              ) : (
                                <div className="absolute inset-0 flex items-center justify-center bg-card"><ImagePlus className="h-8 w-8 text-muted-foreground/30" /></div>
                              )}
                              <div className="absolute top-4 left-4">
                                {x.status && (
                                  <Badge className={`backdrop-blur-md shadow-lg px-3 py-1 text-xs font-black flex items-center gap-1.5 ${STATUS_CONFIG[x.status]?.cls || ''}`}>
                                    {React.createElement(STATUS_CONFIG[x.status]?.icon || Clock, { className: "h-3.5 w-3.5" })}
                                    {STATUS_CONFIG[x.status]?.label || "Pending"}
                                  </Badge>
                                )}
                              </div>
                              <div className="absolute top-4 right-4"><Badge className="bg-background/90 text-foreground backdrop-blur-md border-0 shadow-lg px-3 py-1 text-sm font-black">${x.price}<span className="text-[10px] uppercase font-bold text-muted-foreground ml-1">/NT</span></Badge></div>
                              <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                                <Badge variant="secondary" className="bg-background/80 backdrop-blur-md shadow-sm border-0 font-bold uppercase text-[10px] tracking-wider">{x?.location?.en || "Unknown"}</Badge>
                                <Badge variant="secondary" className="bg-background/80 backdrop-blur-md shadow-sm border-0 font-bold uppercase text-[10px] tracking-wider">{x.rooms} Rooms</Badge>
                              </div>
                            </div>
                            <CardContent className="p-6">
                              <h3 className="font-black text-xl mb-6 truncate">{x?.name?.en || t("admin.untitled", "Untitled Property")}</h3>
                              <div className="flex gap-3">
                                <Button variant="secondary" className="flex-1 rounded-xl h-11 bg-muted hover:bg-muted/80 font-bold gap-2 text-foreground" onClick={() => openEdit(x)}>
                                  <Pencil className="h-4 w-4" /> {t("admin.edit", "Edit")}
                                </Button>
                                <Button variant="ghost" className="h-11 w-11 shrink-0 p-0 rounded-xl text-rose-500 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40" onClick={() => dispatch(deleteListing(x.id))} disabled={String(deletingId) === String(x.id)}>
                                  {String(deletingId) === String(x.id) ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                                </Button>
                              </div>
                              {x.status === "PENDING" && (
                                <div className="flex gap-2 mt-3 pt-3 border-t border-border/40">
                                  <Button className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold h-10 rounded-xl" onClick={() => changeListingStatus(x.id, "ACCEPTED")}>
                                    <Check className="h-4 w-4 mr-2" /> {t("admin.accept", "Accept")}
                                  </Button>
                                  <Button variant="outline" className="flex-1 text-rose-500 hover:text-rose-600 hover:bg-rose-50 border-rose-200 h-10 rounded-xl font-bold" onClick={() => changeListingStatus(x.id, "REJECTED")}>
                                    <XCircle className="h-4 w-4 mr-2" /> {t("admin.reject", "Reject")}
                                  </Button>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </motion.div>
            )}

            {/* ── BOOKINGS TAB ── */}
            {tab === "messages" && (
              <motion.div key="messages" variants={containerVars} initial="hidden" animate="visible" exit="exit" className="w-full">
                <Card className="rounded-[2.5rem] border-border/40 shadow-xl overflow-hidden bg-card/60 backdrop-blur-xl">
                  {msgsLoading && messages.length === 0 ? <div className="py-24 text-center"><RefreshCw className="h-8 w-8 animate-spin mx-auto text-indigo-500" /></div> 
                   : filteredMessages.length === 0 ? <div className="py-24 text-center text-muted-foreground font-medium">No booking requests found.</div>
                   : (
                     <div className="divide-y divide-border/50">
                       <AnimatePresence>
                         {filteredMessages.map(m => {
                           const cfg = STATUS_CONFIG[m.status] || STATUS_CONFIG.PENDING;
                           return (
                             <motion.div key={m.id} variants={itemVars} layout className="p-6 md:p-8 flex flex-col lg:flex-row gap-6 hover:bg-muted/30 transition-colors">
                               
                               <div className="flex-1 flex gap-4 md:gap-6">
                                 <div className="h-14 w-14 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 shrink-0 flex items-center justify-center text-white font-black shadow-lg shadow-indigo-500/20 text-xl hidden sm:flex">
                                   {m.name?.[0]?.toUpperCase()}
                                 </div>
                                 <div className="flex flex-col w-full">
                                   <div className="flex flex-wrap items-center gap-2 mb-1 pl-1">
                                     <span className="font-black text-lg">{m.name}</span>
                                     <Badge variant="outline" className={`ml-auto lg:ml-2 rounded-full border px-2 py-0.5 font-bold uppercase tracking-wider text-[10px] ${cfg.cls}`}>
                                       {cfg.label}
                                     </Badge>
                                   </div>
                                   <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-muted-foreground mb-4 pl-1">
                                     <span>{m.phone}</span>
                                     {m.user && <span>• {m.user.email}</span>}
                                   </div>
                                   <div className="bg-background rounded-2xl p-5 border border-border/50 shadow-sm">
                                      <p className="text-sm font-medium leading-relaxed">"{m.message}"</p>
                                   </div>
                                 </div>
                               </div>
                               
                               <div className="w-full lg:w-72 shrink-0 bg-muted/30 rounded-2xl p-5 border border-border/50 flex flex-col gap-4 justify-center">
                                 <div>
                                   <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">{t("admin.targetProp", "Property")}</span>
                                   <p className="font-bold text-sm truncate mt-1 flex items-center gap-2">
                                     <HomeIcon className="h-3 w-3 text-indigo-500" /> {m.listing?.nameEn || `#${m.listingId}`}
                                   </p>
                                 </div>
                                 <div className="grid grid-cols-2 gap-2 text-sm">
                                   <div>
                                     <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest block">{t("admin.bookingFor", "Duration")}</span>
                                     <span className="font-bold">{m.days} Nts</span>
                                   </div>
                                   <div>
                                     <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest block">{t("admin.receivedOn", "Date")}</span>
                                     <span className="font-bold">{new Date(m.createdAt).toLocaleDateString()}</span>
                                   </div>
                                 </div>
                                 
                                 <div className="flex gap-2 mt-2 pt-4 border-t border-border/50">
                                   {m.status === "PENDING" ? (
                                     <>
                                       <Button size="sm" onClick={() => changeMessageStatus(m.id, "ACCEPTED")} className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold h-9">{t("admin.accept", "Accept")}</Button>
                                       <Button size="sm" variant="outline" onClick={() => changeMessageStatus(m.id, "REJECTED")} className="flex-1 text-rose-500 hover:bg-rose-50 hover:text-rose-600 border-rose-200 h-9 font-bold">{t("admin.reject", "Reject")}</Button>
                                     </>
                                   ) : (
                                     <Button size="sm" variant="outline" onClick={() => changeMessageStatus(m.id, "PENDING")} className="flex-1 h-9 font-bold">{t("admin.setPending", "Reset Status")}</Button>
                                   )}
                                   <Button size="icon" variant="ghost" onClick={() => requestDeleteMessage(m.id)} className="h-9 w-9 shrink-0 text-rose-500 hover:bg-rose-100"><Trash2 className="h-4 w-4"/></Button>
                                 </div>
                               </div>
                               
                             </motion.div>
                           )
                         })}
                       </AnimatePresence>
                     </div>
                   )}
                </Card>
              </motion.div>
            )}

            {/* ── USERS TAB ── */}
            {tab === "users" && (
              <motion.div key="users" variants={containerVars} initial="hidden" animate="visible" exit="exit" className="w-full">
                <Card className="rounded-[2.5rem] border-border/40 shadow-xl overflow-hidden bg-card/60 backdrop-blur-xl">
                  {usersLoading && users.length === 0 ? <div className="py-24 text-center"><RefreshCw className="h-8 w-8 animate-spin mx-auto text-indigo-500" /></div> 
                   : filteredUsers.length === 0 ? <div className="py-24 text-center text-muted-foreground font-medium">No accounts found.</div>
                   : (
                     <div className="divide-y divide-border/50">
                       <AnimatePresence>
                         {filteredUsers.map(u => (
                           <motion.div key={u.id} variants={itemVars} layout className="p-5 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4 hover:bg-muted/30 transition-colors">
                             
                             <div className="flex items-center gap-4 w-full md:w-auto">
                               <div className={`h-12 w-12 rounded-full flex items-center justify-center font-black ${u.isAdmin?'bg-amber-100 text-amber-700':'bg-muted text-muted-foreground'}`}>{u.name?.[0]?.toUpperCase()}</div>
                               <div className="flex flex-col">
                                 <div className="flex items-center gap-2">
                                   <span className="font-bold">{u.name}</span>
                                   {u.isAdmin && <Badge className="bg-amber-500 text-white border-0 text-[9px] uppercase tracking-wider px-1.5 py-0">ADMIN</Badge>}
                                   {u.id === user?.id && <Badge variant="outline" className="text-[9px] uppercase tracking-wider px-1.5 py-0 text-indigo-600 border-indigo-200">YOU</Badge>}
                                 </div>
                                 <span className="text-xs font-medium text-muted-foreground mt-0.5">{u.email}</span>
                               </div>
                             </div>
                             
                             <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                               <span className="text-xs font-medium text-muted-foreground mr-2 hidden lg:block">Joined: {new Date(u.createdAt).toLocaleDateString()}</span>
                               <Button size="sm" variant={u.isAdmin ? "outline" : "secondary"} className={`h-9 font-bold ${u.isAdmin ? 'text-rose-500 hover:text-rose-600 border-rose-200 hover:bg-rose-50':'bg-muted hover:bg-muted/80'}`} onClick={()=>toggleAdmin(u)} disabled={u.id===user?.id}>
                                 {u.isAdmin ? t("admin.revoke", "Revoke Admin") : t("admin.makeAdmin", "Make Admin")}
                               </Button>
                               <Button size="icon" variant="ghost" className="h-9 w-9 text-rose-500 hover:bg-rose-100" onClick={()=>deleteUser(u.id)} disabled={u.id===user?.id}>
                                 <Trash2 className="h-4 w-4" />
                               </Button>
                             </div>
                             
                           </motion.div>
                         ))}
                       </AnimatePresence>
                     </div>
                   )}
                </Card>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* ── Forms Modal ───────────────────────────────────────── */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] p-8 md:p-10 border-0 shadow-2xl bg-card">
            <DialogHeader className="mb-6 pb-6 border-b border-border/50 flex flex-row items-center gap-4 space-y-0">
              <div className="h-12 w-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center shrink-0">
                {mode === "create" ? <Plus className="h-6 w-6 text-indigo-600 dark:text-indigo-400" /> : <Pencil className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />}
              </div>
              <DialogTitle className="text-2xl font-black">
                {mode === "create" ? t("admin.form.addTitle", "Add New Property") : t("admin.form.editTitle", "Edit Property")}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              
              {/* Left Column - Image & Quick Settings */}
              <div className="lg:col-span-2 flex flex-col gap-6">
                <label className="relative overflow-hidden flex flex-col items-center justify-center aspect-[4/3] rounded-[2rem] border-2 border-dashed border-border/80 hover:border-indigo-500 bg-muted/30 hover:bg-muted/50 transition-all cursor-pointer group">
                  {(imageFile || form.image) && (
                    <img src={imageFile ? URL.createObjectURL(imageFile) : form.image} alt="Cover" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 group-hover:opacity-50 transition-all duration-500" />
                  )}
                  <div className={`relative z-10 flex flex-col items-center p-6 text-center ${imageFile || form.image ? 'opacity-0 group-hover:opacity-100' : ''} transition-opacity duration-300`}>
                    <div className="h-14 w-14 rounded-2xl bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-3 group-hover:scale-110 transition-transform shadow-sm">
                      <ImagePlus className="h-6 w-6" />
                    </div>
                    <span className="font-bold text-sm bg-background/90 backdrop-blur px-3 py-1.5 rounded-lg shadow-sm border border-border/50">{t("admin.form.selectCover", "Upload Cover Photo")}</span>
                  </div>
                  <Input type="file" accept="image/*" className="hidden" onChange={e => setImageFile(e.target.files?.[0] || null)} />
                </label>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-1">{t("admin.form.price", "Price / Nt ($)")}</label>
                    <Input required type="number" min="0" value={form.price} onChange={e=>setForm(f=>({...f,price:e.target.value}))} className="h-14 rounded-2xl bg-muted/50 border-transparent hover:bg-muted focus-visible:bg-background focus-visible:border-indigo-500 text-lg font-bold px-4" placeholder="150" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-1">{t("admin.form.rooms", "Rooms")}</label>
                    <Input required type="number" min="1" value={form.rooms} onChange={e=>setForm(f=>({...f,rooms:e.target.value}))} className="h-14 rounded-2xl bg-muted/50 border-transparent hover:bg-muted focus-visible:bg-background focus-visible:border-indigo-500 text-lg font-bold px-4" placeholder="3" />
                  </div>
                </div>
              </div>
              
              {/* Right Column - Elaborate Details */}
              <div className="lg:col-span-3 flex flex-col gap-6">
                <div className="bg-muted/20 border border-border/50 rounded-[2rem] p-6 sm:p-8 flex flex-col gap-6">
                  {/* Title Fields */}
                  <div className="flex flex-col gap-3">
                    <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-1 border-b border-border/50 pb-2">{t("admin.form.titleLabel", "Property Title")}</span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {['En', 'Ru', 'Tj'].map(lang => (
                        <div key={`name${lang}`} className="relative">
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-black text-muted-foreground uppercase">{lang}</span>
                          <Input required={lang==='En'} value={form[`name${lang}`]} onChange={e=>setForm(f=>({...f,[`name${lang}`]:e.target.value}))} placeholder={`Title...`} className="h-12 rounded-xl border-border/60 bg-background pr-8 text-sm font-medium focus-visible:border-indigo-500 focus-visible:ring-indigo-500/20" />
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Location Fields */}
                  <div className="flex flex-col gap-3">
                    <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-1 border-b border-border/50 pb-2">{t("admin.form.locationLabel", "Location")}</span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {['En', 'Ru', 'Tj'].map(lang => (
                        <div key={`loc${lang}`} className="relative">
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-black text-muted-foreground uppercase">{lang}</span>
                          <Input required={lang==='En'} value={form[`location${lang}`]} onChange={e=>setForm(f=>({...f,[`location${lang}`]:e.target.value}))} placeholder={`City, Dist...`} className="h-12 rounded-xl border-border/60 bg-background pr-8 text-sm font-medium focus-visible:border-indigo-500 focus-visible:ring-indigo-500/20" />
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Type Fields */}
                  <div className="flex flex-col gap-3">
                    <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-1 border-b border-border/50 pb-2">{t("admin.form.typeLabel", "Type (House, Flat, Dacha)")}</span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {['En', 'Ru', 'Tj'].map(lang => (
                        <div key={`type${lang}`} className="relative">
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-black text-muted-foreground uppercase">{lang}</span>
                          <Input required={lang==='En'} value={form[`type${lang}`]} onChange={e=>setForm(f=>({...f,[`type${lang}`]:e.target.value}))} placeholder={`Type...`} className="h-12 rounded-xl border-border/60 bg-background pr-8 text-sm font-medium focus-visible:border-indigo-500 focus-visible:ring-indigo-500/20" />
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Description */}
                  <div className="flex flex-col gap-3">
                    <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-1 border-b border-border/50 pb-2">{t("admin.form.descLabel", "Description")}</span>
                    <Textarea value={form.about} onChange={e=>setForm(f=>({...f,about:e.target.value}))} placeholder={t("admin.form.descPlaceholder", "Detailed property description...")} className="min-h-[120px] rounded-xl border-border/60 bg-background p-4 text-sm font-medium focus-visible:border-indigo-500 focus-visible:ring-indigo-500/20 resize-y" />
                  </div>
                </div>
                
                <div className="flex gap-4 mt-auto">
                  <Button type="button" variant="ghost" className="flex-1 h-14 rounded-2xl font-bold hover:bg-rose-50 hover:text-rose-600" onClick={() => setOpen(false)}>{t("admin.form.cancel", "Cancel")}</Button>
                  <Button type="submit" disabled={saving} className="flex-[2] h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black shadow-lg shadow-indigo-600/20 text-base">{saving ? t("admin.form.saving", "Saving...") : t("admin.form.save", "Save Property")}</Button>
                </div>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* ── Delete Confirmation Modal ───────────────────────────────────────── */}
        <Dialog open={!!messageToDelete} onOpenChange={(val) => !val && setMessageToDelete(null)}>
          <DialogContent className="sm:max-w-md rounded-2xl p-6 border-0 shadow-2xl bg-card">
            <DialogHeader className="mb-2">
              <div className="h-12 w-12 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center text-rose-500 mb-4">
                <Trash2 className="h-6 w-6" />
              </div>
              <DialogTitle className="text-xl font-black">{t("admin.deleteConfirmTitle", "Delete Booking Request?")}</DialogTitle>
            </DialogHeader>
            <p className="text-muted-foreground mb-6 font-medium">
              {t("admin.deleteConfirmDesc", "This action cannot be undone. This will permanently delete the booking request.")}
            </p>
            <div className="flex gap-3 justify-end">
              <Button variant="ghost" onClick={() => setMessageToDelete(null)} className="rounded-xl font-bold hover:bg-muted">
                {t("admin.form.cancel", "Cancel")}
              </Button>
              <Button onClick={confirmDeleteMessage} className="bg-rose-500 hover:bg-rose-600 text-white rounded-xl shadow-lg shadow-rose-500/20 font-bold border-0">
                {t("admin.delete", "Delete forever")}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminListings;
