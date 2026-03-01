import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearError, createListing, deleteListing, fetchListings, updateListing } from "../../reducers/listingSlice";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, RefreshCw, MessageSquare, Home as HomeIcon, Users, CheckCircle, XCircle, Clock, ShieldCheck, ShieldOff, Lock, TrendingUp, KeyRound, ImagePlus } from "lucide-react";
import { messagesApi, usersApi } from "../../api/listingsAPI";
import { getUserToken } from "../../utils/url";
import { motion, AnimatePresence } from "framer-motion";

const STATUS_CONFIG = {
  PENDING:  { label: "Pending",  icon: Clock,       cls: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 border-amber-200 dark:border-amber-900", dot: "bg-amber-500" },
  ACCEPTED: { label: "Accepted", icon: CheckCircle, cls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900", dot: "bg-emerald-500" },
  REJECTED: { label: "Rejected", icon: XCircle,     cls: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400 border-rose-200 dark:border-rose-900", dot: "bg-rose-500" },
};

const empty = { id: "", nameEn: "", nameRu: "", nameTj: "", locationEn: "", locationRu: "", locationTj: "", typeEn: "", typeRu: "", typeTj: "", rooms: "", price: "", about: "" };

const AdminListings = () => {
  const dispatch = useDispatch();
  const { items = [], loading, saving, deletingId, error } = useSelector((s) => s.listings || {});

  const user = (() => { try { return JSON.parse(getUserToken()); } catch { return null; } })();
  const isAdmin = user?.isAdmin || !!localStorage.getItem("admin");

  const [tab, setTab] = useState("listings");
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("create");
  const [form, setForm] = useState(empty);
  const [imageFile, setImageFile] = useState(null);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [msgsLoading, setMsgsLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);

  useEffect(() => { dispatch(fetchListings()); window.scrollTo(0,0); }, [dispatch]);

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

  const deleteMessage = async (id) => {
    try {
      if (!confirm("Are you sure you want to delete this booking request forever?")) return;
      await messagesApi.remove(id);
      setMessages(ms => ms.filter(m => m.id !== id));
    } catch {}
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
    setForm({ id: x.id, nameEn: x?.name?.en || "", nameRu: x?.name?.ru || "", nameTj: x?.name?.tj || "", locationEn: x?.location?.en || "", locationRu: x?.location?.ru || "", locationTj: x?.location?.tj || "", typeEn: x?.type?.en || "", typeRu: x?.type?.ru || "", typeTj: x?.type?.tj || "", rooms: String(x.rooms ?? ""), price: String(x.price ?? ""), about: x.about || "" });
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

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 20 }} className="max-w-md w-full">
          <Card className="rounded-[2.5rem] text-center shadow-2xl overflow-hidden border-0 bg-card/80 backdrop-blur-xl relative">
            <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 via-transparent to-transparent opacity-50" />
            <div className="h-40 bg-gradient-to-br from-rose-500 via-rose-600 to-rose-900 relative">
               <div className="absolute inset-0 bg-white/10 backdrop-blur-2xl" />
            </div>
            <CardContent className="p-10 flex flex-col items-center gap-5 -mt-16 relative z-10">
              <div className="h-24 w-24 rounded-[2rem] bg-white dark:bg-slate-900 shadow-2xl flex items-center justify-center border-4 border-background">
                <Lock className="h-10 w-10 text-rose-500" />
              </div>
              <div>
                <p className="text-3xl font-black tracking-tight mt-2 mb-2">Access Denied</p>
                <p className="text-base text-muted-foreground font-medium">This area is highly restricted. Only platform administrators may enter.</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  const TABS = [
    { id: "listings", label: "Properties", icon: HomeIcon, count: items.length },
    { id: "messages", label: "Bookings", icon: MessageSquare, count: messages.length },
    { id: "users", label: "Accounts", icon: Users, count: users.length },
  ];

  return (
    <div className="min-h-screen px-4 py-8">
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="mx-auto max-w-7xl flex flex-col gap-8">
        
        {/* ── Hero Dashboard Header ───────────────────────────────────────── */}
        <motion.div variants={fadeUp} className="relative overflow-hidden rounded-[2.5rem] bg-slate-950 p-8 md:p-12 text-white shadow-2xl shadow-amber-900/10 flex flex-col lg:flex-row gap-8 lg:items-center justify-between">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full -translate-y-1/2 translate-x-1/4 blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-500/10 rounded-full translate-y-1/3 -translate-x-1/4 blur-[80px] pointer-events-none" />
          
          <div className="relative flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6 z-10">
            <div className="h-24 w-24 rounded-3xl bg-white/10 backdrop-blur-xl flex items-center justify-center ring-4 ring-white/10 shadow-2xl shrink-0 overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <KeyRound className="h-10 w-10 text-amber-400 group-hover:scale-110 transition-transform duration-500" />
            </div>
            <div className="flex flex-col gap-2 pt-2">
              <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none text-white">Admin Command Center</h1>
              <p className="text-amber-100/70 font-medium text-lg">Platform management & analytics for Rent-A-Room</p>
            </div>
          </div>
          
          <div className="relative flex gap-4 overflow-x-auto pb-4 scrollbar-none flex-nowrap w-full lg:w-auto z-10 lg:self-end">
            {[
              { label: "Active Properties", icon: HomeIcon, count: items.length },
              { label: "Total Bookings", icon: MessageSquare, count: messages.length, loading: msgsLoading && tab !== 'messages' },
              { label: "Registered Users", icon: Users, count: users.length, loading: usersLoading && tab !== 'users' },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 min-w-[150px] transition-all hover:bg-white/10 hover:-translate-y-1 shadow-lg shrink-0">
                <div className="flex items-center gap-2 text-amber-400 mb-2">
                  <stat.icon className="h-4 w-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">{stat.label}</span>
                </div>
                <span className="text-3xl font-black text-white">{stat.count}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Toolbar & Animated Tabs ───────────────────────────────────────── */}
        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 z-20 sticky top-20 bg-background/80 backdrop-blur-xl py-4 -mx-4 px-4 sm:mx-0 sm:px-0 sm:static sm:bg-transparent rounded-2xl">
          
          <div className="flex p-1.5 bg-muted/60 backdrop-blur-md rounded-2xl overflow-x-auto border border-border/50 shrink-0 w-max max-w-full">
            {TABS.map(({ id, label, icon: Icon, count }) => (
              <button key={id} onClick={() => setTab(id)} 
                className={`relative flex items-center gap-2 px-6 py-2.5 text-sm font-bold rounded-xl transition-all whitespace-nowrap outline-none z-10
                ${tab === id ? "text-amber-800 dark:text-amber-400" : "text-muted-foreground hover:text-foreground"}`}>
                
                {tab === id && (
                  <motion.div
                    layoutId="activeAdminTab"
                    className="absolute inset-0 bg-background shadow-sm rounded-xl border border-border/50 z-[-1]"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                
                <Icon className={`h-4 w-4 relative z-10`} />
                <span className="relative z-10">{label}</span>
                <Badge variant={tab === id ? "default" : "secondary"} className={`relative z-10 ml-2 shadow-sm font-bold ${tab === id ? "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-400" : "bg-muted text-muted-foreground"}`}>{count}</Badge>
              </button>
            ))}
          </div>
          
          <div className="flex gap-3 shrink-0">
            <Button variant="outline" onClick={() => { dispatch(fetchListings()); if (tab === "messages") loadMessages(); if (tab === "users") loadUsers(); }} className="gap-2 rounded-xl h-12 px-6 border-border/50 shadow-sm hover:bg-muted font-bold transition-all">
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh Data
            </Button>
            {tab === "listings" && (
              <Button onClick={openCreate} className="bg-amber-500 hover:bg-amber-600 text-white gap-2 rounded-xl h-12 px-6 shadow-lg shadow-amber-500/20 font-bold transition-all hover:-translate-y-0.5 border-0">
                <Plus className="h-5 w-5" /> New Property
              </Button>
            )}
          </div>
        </motion.div>

        {error && (
          <motion.div variants={fadeUp}>
            <Card className="rounded-2xl border-rose-200 bg-rose-50 dark:bg-rose-950/20 shadow-none">
              <CardContent className="p-4 flex justify-between items-center gap-3">
                <p className="text-sm text-rose-600 font-bold">{error}</p>
                <Button variant="ghost" size="sm" onClick={() => dispatch(clearError())} className="text-rose-700 hover:bg-rose-100 focus:ring-0">Dismiss</Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* ── Tab Content Area ───────────────────────────────────────── */}
        <div className="relative">
          <AnimatePresence mode="wait">
            
            {/* ── Listings Tab ── */}
            {tab === "listings" && (
              <motion.div key="listings" variants={staggerContainer} initial="hidden" animate="visible" exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.2 }}>
                {items.length === 0 && !loading ? (
                  <Card className="rounded-[2.5rem] border-dashed border-2 bg-muted/20 backdrop-blur-sm"><CardContent className="py-32 flex flex-col items-center justify-center text-center"><HomeIcon className="h-16 w-16 text-amber-500 mb-6" /><p className="font-black text-2xl tracking-tight">No properties yet</p><p className="text-base text-muted-foreground font-medium mb-8 max-w-sm mt-2">Your property catalog is empty. Click the button above to add your very first listing to the platform.</p><Button onClick={openCreate} className="bg-amber-500 hover:bg-amber-600 rounded-2xl h-14 px-8 font-bold text-lg shadow-xl shadow-amber-500/20 border-0">Create First Property</Button></CardContent></Card>
                ) : (
                  <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((x) => (
                      <motion.div variants={fadeUp} key={x.id}>
                        <Card className="rounded-[2rem] overflow-hidden border-border/40 bg-card/80 backdrop-blur-xl shadow-lg hover:shadow-2xl hover:shadow-amber-500/5 hover:-translate-y-1 transition-all duration-500 group">
                          <div className="h-56 w-full bg-muted overflow-hidden relative">
                            {x.image ? (
                              <img src={x.image} alt="" className="h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110" />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/30 bg-card"><ImagePlus className="h-10 w-10 text-amber-500/30" /></div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-5 opacity-90">
                              <Badge className="bg-amber-500 text-white font-black text-lg tracking-wide shadow-xl border-0 px-3 py-1.5 backdrop-blur-md bg-amber-500/90">${x.price ?? 0} <span className="text-[10px] font-bold opacity-80 ml-1 uppercase">/NIGHT</span></Badge>
                            </div>
                          </div>
                          <CardContent className="p-6 flex flex-col gap-5">
                            <div>
                              <p className="font-black text-xl leading-tight truncate">{x?.name?.en || "Untitled Property"}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant="secondary" className="text-[10px] uppercase font-bold text-muted-foreground bg-muted tracking-wider">{x?.location?.en || "Unknown"}</Badge>
                                <Badge variant="secondary" className="text-[10px] uppercase font-bold text-muted-foreground bg-muted tracking-wider">{x.rooms} Rooms</Badge>
                              </div>
                            </div>
                            
                            <div className="flex gap-3 pt-2">
                              <Button variant="secondary" className="flex-1 gap-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:hover:bg-amber-900/50 dark:text-amber-400 border-0 h-11 font-bold shadow-sm" onClick={() => openEdit(x)}>
                                <Pencil className="h-4 w-4" /> Edit
                              </Button>
                              <Button variant="ghost" className="flex-1 gap-2 rounded-xl hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30 text-rose-500 border-0 h-11 font-bold" onClick={() => dispatch(deleteListing(x.id))} disabled={String(deletingId) === String(x.id)}>
                                {String(deletingId) === String(x.id) ? "Deleting..." : <><Trash2 className="h-4 w-4" /> Delete</>}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* ── Bookings / Messages Tab ── */}
            {tab === "messages" && (
              <motion.div key="messages" variants={staggerContainer} initial="hidden" animate="visible" exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.2 }}>
                <Card className="rounded-[2.5rem] shadow-2xl border-border/40 bg-card/80 backdrop-blur-xl overflow-hidden">
                  <div className="p-8 border-b border-border/50"><h2 className="text-2xl font-black">Booking Requests ({messages.length})</h2></div>
                  <div className="p-0">
                    {msgsLoading ? <div className="py-24 flex justify-center"><RefreshCw className="h-10 w-10 animate-spin text-amber-500" /></div>
                      : messages.length === 0 ? (
                        <div className="py-32 flex flex-col items-center justify-center text-center"><MessageSquare className="h-16 w-16 text-amber-500 mb-6" /><p className="font-black text-2xl tracking-tight">No requests yet</p><p className="text-base font-medium text-muted-foreground mt-2 max-w-sm">When users book a property, their requests will appear here for you to approve or reject.</p></div>
                      ) : (
                        <div className="flex flex-col divide-y divide-border/50">
                          {messages.map((m, i) => {
                            const cfg = STATUS_CONFIG[m.status] || STATUS_CONFIG.PENDING;
                            const StatusIcon = cfg.icon;
                            return (
                              <motion.div variants={fadeUp} key={m.id} className="p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-10 hover:bg-muted/40 transition-colors">
                                
                                <div className="flex-1 flex flex-col gap-4">
                                  <div className="flex items-center gap-4 flex-wrap">
                                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-amber-500/20">
                                      {m.name?.[0]?.toUpperCase() || "U"}
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="font-black text-lg leading-tight">{m.name}</span>
                                      <span className="text-sm font-medium text-muted-foreground">{m.phone}{m.user ? ` · ${m.user.email}` : ""}</span>
                                    </div>
                                    <div className={`ml-auto lg:ml-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border shadow-sm ${cfg.cls}`}>
                                      <StatusIcon className="h-4 w-4" /> {cfg.label}
                                    </div>
                                  </div>
                                  
                                  <div className="mt-2 bg-background p-5 rounded-2xl border border-border/50 shadow-sm relative">
                                    <div className="absolute top-0 left-6 w-4 h-4 bg-background border-t border-l border-border/50 rotate-45 -translate-y-1/2" />
                                    <p className="text-base font-medium text-foreground/80 relative z-10 leading-relaxed">"{m.message}"</p>
                                  </div>
                                </div>
                                
                                <div className="w-px bg-border/50 hidden md:block" />
                                
                                <div className="md:w-72 flex flex-col justify-between gap-6 shrink-0 bg-muted/20 md:bg-transparent p-5 rounded-2xl md:p-0 md:rounded-none border border-border/50 md:border-none">
                                  <div className="flex flex-col gap-3">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b border-border/50 pb-2">Target Property</span>
                                    <div className="flex items-center gap-3">
                                      <div className="p-2 bg-amber-500/10 rounded-lg text-amber-600"><HomeIcon className="h-5 w-5 shrink-0" /></div>
                                      <span className="font-bold text-base truncate">{m.listing?.nameEn || `Listing #${m.listingId}`}</span>
                                    </div>
                                    <div className="flex flex-col gap-1 mt-1">
                                      <span className="text-sm font-medium text-muted-foreground flex items-center gap-2"><Clock className="h-4 w-4 text-emerald-500" /> Booking for <strong className="text-foreground">{m.days} days</strong></span>
                                      <span className="text-sm font-medium text-muted-foreground flex items-center gap-2"><TrendingUp className="h-4 w-4 text-sky-500" /> Received <strong className="text-foreground">{new Date(m.createdAt).toLocaleDateString()}</strong></span>
                                    </div>
                                  </div>
                                  
                                  {/* Action Buttons */}
                                  <div className="flex gap-2 w-full">
                                    {m.status === "PENDING" && (
                                      <>
                                        <Button size="sm" onClick={() => changeMessageStatus(m.id, "ACCEPTED")} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-11 font-bold shadow-lg shadow-emerald-600/20 border-0 transition-all hover:-translate-y-0.5">Accept</Button>
                                        <Button size="sm" variant="outline" onClick={() => changeMessageStatus(m.id, "REJECTED")} className="flex-1 rounded-xl h-11 font-bold text-rose-500 hover:bg-rose-50 hover:text-rose-600 border-rose-200 hover:border-rose-300">Reject</Button>
                                      </>
                                    )}
                                    {m.status !== "PENDING" && (
                                      <Button size="sm" variant="outline" onClick={() => changeMessageStatus(m.id, "PENDING")} className="flex-1 rounded-xl h-11 font-bold text-amber-600 border-amber-200 hover:bg-amber-50 hover:border-amber-300">Set Pending</Button>
                                    )}
                                    <Button size="icon" variant="secondary" className="h-11 w-11 shrink-0 rounded-xl hover:bg-rose-100 text-rose-500 hover:text-rose-600 dark:bg-rose-950/20 dark:hover:bg-rose-900/40 border-0" onClick={() => deleteMessage(m.id)}>
                                      <Trash2 className="h-5 w-5" />
                                    </Button>
                                  </div>
                                </div>
                                
                              </motion.div>
                            );
                          })}
                        </div>
                      )}
                  </div>
                </Card>
              </motion.div>
            )}

            {/* ── Users Tab ── */}
            {tab === "users" && (
              <motion.div key="users" variants={staggerContainer} initial="hidden" animate="visible" exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.2 }}>
                <Card className="rounded-[2.5rem] shadow-2xl border-border/40 bg-card/80 backdrop-blur-xl overflow-hidden">
                  <div className="p-8 border-b border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h2 className="text-2xl font-black">Registered Users ({users.length})</h2>
                    <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-400 px-4 py-1.5 font-bold shadow-sm rounded-lg text-sm">{users.filter(u => u.isAdmin).length} Admins Active</Badge>
                  </div>
                  <div className="p-0">
                    {usersLoading ? <div className="py-24 flex justify-center"><RefreshCw className="h-10 w-10 animate-spin text-amber-500" /></div>
                      : users.length === 0 ? (
                        <div className="py-32 flex flex-col items-center justify-center text-center"><Users className="h-16 w-16 text-amber-500 mb-6" /><p className="font-black text-2xl tracking-tight">No users found</p></div>
                      ) : (
                        <div className="flex flex-col divide-y divide-border/50">
                          {users.map((u) => (
                            <motion.div variants={fadeUp} key={u.id} className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-muted/40 transition-colors group">
                              
                              <div className="flex items-center gap-6">
                                <div className={`h-16 w-16 rounded-[1.5rem] flex items-center justify-center shrink-0 shadow-md border-2 ${u.isAdmin ? 'bg-amber-100 border-amber-300 text-amber-700 dark:bg-amber-900/60 dark:border-amber-700 dark:text-amber-400 shadow-amber-500/20' : 'bg-background border-border text-foreground'}`}>
                                  <span className="text-2xl font-black">{u.name?.[0]?.toUpperCase()}</span>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="font-black text-lg">{u.name}</span>
                                    {u.isAdmin && <Badge className="bg-amber-500 hover:bg-amber-600 text-white border-0 text-[10px] font-black tracking-wider px-2 py-0.5 rounded-md shadow-sm"><KeyRound className="h-3 w-3 mr-1" /> ADMIN</Badge>}
                                    {u.id === user?.id && <Badge variant="outline" className="text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded-md text-emerald-600 border-emerald-200 bg-emerald-50 dark:bg-emerald-950/30 dark:border-emerald-900">YOU</Badge>}
                                  </div>
                                  <span className="text-sm font-medium text-muted-foreground flex items-center gap-2"><Mail className="h-4 w-4" /> {u.email}</span>
                                </div>
                              </div>
                              
                              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 shrink-0 bg-muted/20 md:bg-transparent p-5 rounded-2xl md:p-0 md:rounded-none border border-border/50 md:border-none">
                                <div className="flex flex-col gap-1">
                                  <span className="text-[10px] uppercase font-black text-muted-foreground tracking-widest pl-1">Joined Date</span>
                                  <span className="text-base font-bold bg-background md:bg-transparent px-3 py-1 md:p-0 rounded-lg">{new Date(u.createdAt).toLocaleDateString()}</span>
                                </div>
                                
                                <div className="w-px h-10 bg-border/50 hidden sm:block" />
                                
                                <div className="flex items-center gap-3 w-full sm:w-auto">
                                  <Button size="sm" variant={u.isAdmin ? "outline" : "secondary"} className={`rounded-xl h-11 flex-1 sm:flex-initial font-bold shadow-sm ${u.isAdmin ? "hover:bg-rose-50 hover:text-rose-600 hover:border-rose-300 text-rose-500 border-border" : "bg-card border border-border"}`}
                                    onClick={() => toggleAdmin(u)} disabled={u.id === user?.id}>
                                    {u.isAdmin ? <><ShieldOff className="h-4 w-4 mr-2" /> Revoke</> : <><ShieldCheck className="h-4 w-4 mr-2 text-emerald-500" /> Make Admin</>}
                                  </Button>
                                  
                                  <Button size="icon" variant="secondary" className="h-11 w-11 rounded-xl hover:bg-rose-100 hover:text-rose-600 text-muted-foreground bg-background border border-border/50 shrink-0"
                                    onClick={() => deleteUser(u.id)} disabled={u.id === user?.id}>
                                    <Trash2 className="h-5 w-5" />
                                  </Button>
                                </div>
                              </div>
                              
                            </motion.div>
                          ))}
                        </div>
                      )}
                  </div>
                </Card>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* ── Create/Edit Modal overlay styling ────────────────────────────── */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-4xl max-h-[95vh] overflow-y-auto rounded-[2.5rem] p-8 md:p-10 border-0 shadow-2xl shadow-emerald-900/20 bg-card/95 backdrop-blur-3xl">
            <DialogHeader className="mb-6 pb-6 border-b border-border/50">
              <DialogTitle className="text-3xl font-black flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  {mode === "create" ? <Plus className="h-6 w-6 text-amber-500" /> : <Pencil className="h-6 w-6 text-amber-500" />}
                </div>
                {mode === "create" ? "Add New Property" : "Edit Property"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={submit} className="grid gap-8 lg:grid-cols-5">
              
              <div className="flex flex-col gap-6 lg:col-span-2">
                <label className="flex flex-col items-center justify-center gap-4 border-2 border-dashed border-border/80 hover:border-amber-500 rounded-[2rem] p-10 cursor-pointer bg-muted/30 hover:bg-muted/60 transition-all duration-300 relative overflow-hidden group">
                  {form.image && !imageFile && (
                    <div className="absolute inset-0 w-full h-full opacity-30 blur-sm pointer-events-none">
                       <img src={form.image} alt="preview bg" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="h-16 w-16 rounded-3xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shadow-lg border border-amber-200 dark:border-amber-800 mb-2 group-hover:scale-110 transition-transform">
                      <ImagePlus className="h-8 w-8 text-amber-600 dark:text-amber-500" />
                    </div>
                    <span className="text-sm font-bold text-center bg-background/80 backdrop-blur-md px-4 py-2 rounded-xl border border-border/50 shadow-sm">{imageFile ? imageFile.name : "Select property cover"}</span>
                  </div>
                  <Input type="file" accept="image/*" className="hidden" onChange={e => setImageFile(e.target.files?.[0] || null)} />
                </label>
                {(imageFile || form.image) && (
                  <div className="rounded-[2rem] overflow-hidden border border-border/50 shadow-xl aspect-[4/3] bg-card">
                    <img src={imageFile ? URL.createObjectURL(imageFile) : (typeof form.image === "string" ? form.image : "")} alt="" className="h-full w-full object-cover" />
                  </div>
                )}
                
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-black uppercase text-muted-foreground tracking-widest pl-1">Price per night ($)</label>
                    <Input className="h-14 rounded-2xl bg-muted/40 border-transparent hover:bg-muted/60 focus-visible:bg-transparent focus-visible:border-amber-500 transition-colors font-bold text-lg px-4" type="number" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} placeholder="150" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-black uppercase text-muted-foreground tracking-widest pl-1">Total Rooms</label>
                    <Input className="h-14 rounded-2xl bg-muted/40 border-transparent hover:bg-muted/60 focus-visible:bg-transparent focus-visible:border-amber-500 transition-colors font-bold text-lg px-4" type="number" value={form.rooms} onChange={e => setForm(p => ({ ...p, rooms: e.target.value }))} placeholder="3" />
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-8 lg:col-span-3">
                <div className="p-8 rounded-[2.5rem] bg-muted/20 border border-border/50 flex flex-col gap-8 shadow-inner">
                  {[["Title", "nameEn", "nameRu", "nameTj"], ["Location", "locationEn", "locationRu", "locationTj"], ["Property Type", "typeEn", "typeRu", "typeTj"]].map(([label, en, ru, tj], idx) => (
                    <div key={label} className="flex flex-col gap-4">
                      <p className="text-xs font-black tracking-widest uppercase text-foreground/80 border-b border-border/50 pb-2 flex items-center gap-2">
                        <span className="flex items-center justify-center bg-muted text-muted-foreground rounded-full h-5 w-5 text-[10px]">{idx + 1}</span> {label}
                      </p>
                      <div className="grid gap-4 sm:grid-cols-3">
                        {[[en, "EN"], [ru, "RU"], [tj, "TJ"]].map(([field, ph]) => (
                          <div key={field} className="flex flex-col gap-1.5 focus-within:text-amber-500 transition-colors">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase pl-1">{ph}</label>
                            <Input placeholder={`in ${ph}...`} className="h-12 rounded-xl bg-background border-border/50 hover:border-amber-500/50 focus-visible:ring-1 focus-visible:ring-amber-500 shadow-sm transition-all text-sm font-medium" value={form[field]} onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))} />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  
                  <div className="flex flex-col gap-2 mt-2">
                    <label className="text-xs font-black uppercase text-muted-foreground tracking-widest pl-1 border-b border-border/50 pb-2 flex items-center gap-2">
                       <span className="flex items-center justify-center bg-muted text-muted-foreground rounded-full h-5 w-5 text-[10px]">4</span> Description
                    </label>
                    <Textarea placeholder="Share details that highlight the property's best features..." className="form-textarea mt-1 min-h-[140px] rounded-2xl bg-background border-border/50 hover:border-amber-500/50 focus-visible:ring-1 focus-visible:ring-amber-500 shadow-sm resize-y text-base p-4 font-medium" value={form.about} onChange={e => setForm(p => ({ ...p, about: e.target.value }))} />
                  </div>
                </div>
                
                <div className="flex flex-wrap sm:flex-nowrap gap-4 mt-auto">
                  <Button type="button" variant="ghost" className="w-full sm:flex-1 rounded-2xl h-14 font-bold text-base hover:bg-rose-50 hover:text-rose-600 transition-colors" onClick={() => setOpen(false)}>Cancel Edit</Button>
                  <Button type="submit" disabled={saving} className="w-full sm:flex-[2] bg-amber-500 hover:bg-amber-600 border-0 rounded-2xl h-14 font-black shadow-xl shadow-amber-500/20 text-white text-base transition-all hover:-translate-y-0.5">{saving ? "Saving Property..." : "Save Property to Platform"}</Button>
                </div>
              </div>

            </form>
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  );
};
export default AdminListings;
