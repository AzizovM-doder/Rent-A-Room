import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearError, createListing, deleteListing, fetchListings, updateListing } from "../../reducers/listingSlice";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, RefreshCw, MessageSquare, Home as HomeIcon, Users, CheckCircle, XCircle, Clock, Lock, KeyRound, ImagePlus, Search, Check, Ban, Calendar, User as UserIcon, Shield, RotateCcw, Filter } from "lucide-react";
import { listingsApi, messagesApi, usersApi } from "../../api/listingsAPI";
import { getUserToken } from "../../utils/url";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

const STATUS_CONFIG = {
  PENDING:  { label: "Pending",  icon: Clock,       color: "amber",  cls: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30" },
  ACCEPTED: { label: "Accepted", icon: CheckCircle, color: "emerald", cls: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30" },
  REJECTED: { label: "Rejected", icon: XCircle,     color: "rose",   cls: "bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-500/30" },
};

const STATUS_FILTERS = [
  { id: "ALL",      label: "All" },
  { id: "PENDING",  label: "Pending" },
  { id: "ACCEPTED", label: "Live" },
  { id: "REJECTED", label: "Rejected" },
];

const empty = { id: "", nameEn: "", nameRu: "", nameTj: "", locationEn: "", locationRu: "", locationTj: "", typeEn: "", typeRu: "", typeTj: "", rooms: "", price: "", about: "" };

const AdminListings = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { items = [], loading, saving, deletingId } = useSelector((s) => s.listings || {});

  const user = (() => { try { return JSON.parse(getUserToken()); } catch { return null; } })();
  const isAdmin = user?.isAdmin || !!localStorage.getItem("admin");

  const [tab, setTab] = useState("listings");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("create");
  const [form, setForm] = useState(empty);
  const [imageFile, setImageFile] = useState(null);
  const [messageToDelete, setMessageToDelete] = useState(null);
  
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [msgsLoading, setMsgsLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => { dispatch(fetchListings()); loadMessages(); loadUsers(); window.scrollTo(0, 0); }, [dispatch]);

  const loadMessages = async () => { setMsgsLoading(true); try { setMessages(await messagesApi.getAll()); } catch {} finally { setMsgsLoading(false); } };
  const loadUsers = async () => { setUsersLoading(true); try { setUsers(await usersApi.getAll()); } catch {} finally { setUsersLoading(false); } };

  useEffect(() => { if (tab === "messages") loadMessages(); }, [tab]);
  useEffect(() => { if (tab === "users") loadUsers(); }, [tab]);

  const changeMessageStatus = async (id, status) => { try { await messagesApi.updateStatus(id, status); setMessages(ms => ms.map(m => m.id === id ? { ...m, status } : m)); } catch {} };
  const changeListingStatus = async (id, status) => { try { await listingsApi.updateStatus(id, status); dispatch(fetchListings()); } catch {} };
  const requestDeleteMessage = (id) => setMessageToDelete(id);
  const confirmDeleteMessage = async () => { if (!messageToDelete) return; try { await messagesApi.remove(messageToDelete); setMessages(ms => ms.filter(m => m.id !== messageToDelete)); } catch {} finally { setMessageToDelete(null); } };
  const toggleAdmin = async (u) => { try { const updated = await usersApi.update(u.id, { isAdmin: !u.isAdmin }); setUsers(us => us.map(x => x.id === u.id ? { ...x, isAdmin: updated.isAdmin } : x)); } catch {} };
  const deleteUser = async (id) => { try { await usersApi.remove(id); setUsers(us => us.filter(u => u.id !== id)); dispatch(fetchListings()); } catch {} };

  const openCreate = () => { setMode("create"); setForm(empty); setImageFile(null); setOpen(true); dispatch(clearError()); };
  const openEdit = (x) => {
    setMode("edit"); setImageFile(null);
    setForm({ id: x.id, nameEn: x?.name?.en || "", nameRu: x?.name?.ru || "", nameTj: x?.name?.tj || "", locationEn: x?.location?.en || "", locationRu: x?.location?.ru || "", locationTj: x?.location?.tj || "", typeEn: x?.type?.en || "", typeRu: x?.type?.ru || "", typeTj: x?.type?.tj || "", rooms: String(x.rooms ?? ""), price: String(x.price ?? ""), about: x.about || "", image: x.image || "" });
    setOpen(true); dispatch(clearError());
  };

  const submit = async (ev) => {
    ev.preventDefault();
    const fd = new FormData();
    if (imageFile) fd.append("image", imageFile);
    fd.append("name", JSON.stringify({ en: form.nameEn, ru: form.nameRu, tj: form.nameTj }));
    fd.append("location", JSON.stringify({ en: form.locationEn, ru: form.locationRu, tj: form.locationTj }));
    fd.append("type", JSON.stringify({ en: form.typeEn, ru: form.typeRu, tj: form.typeTj }));
    fd.append("rooms", form.rooms); fd.append("price", form.price); fd.append("about", form.about || "");
    if (mode === "create") { await dispatch(createListing(fd)); }
    else { await dispatch(updateListing({ id: form.id, payload: fd })); }
    setOpen(false); dispatch(fetchListings());
  };

  // Counts
  const pendingCount = items.filter(i => i.status === "PENDING").length;
  const acceptedCount = items.filter(i => i.status === "ACCEPTED").length;
  const rejectedCount = items.filter(i => i.status === "REJECTED").length;

  // Filtering
  const filteredListings = items
    .filter(i => statusFilter === "ALL" || i.status === statusFilter)
    .filter(i => i.name?.en?.toLowerCase().includes(searchQuery.toLowerCase()) || i.location?.en?.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredMessages = messages.filter(m => m.name?.toLowerCase().includes(searchQuery.toLowerCase()) || m.phone?.includes(searchQuery));
  const filteredUsers = users.filter(u => u.name?.toLowerCase().includes(searchQuery.toLowerCase()) || u.email?.toLowerCase().includes(searchQuery.toLowerCase()));

  // Animations
  const containerVars = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.04 } } };
  const itemVars = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 400, damping: 30 } }, exit: { opacity: 0, scale: 0.95, transition: { duration: 0.15 } } };

  if (!isAdmin) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-sm w-full">
          <Card className="rounded-3xl text-center shadow-2xl border-0 overflow-hidden">
            <div className="h-28 bg-gradient-to-br from-rose-500/20 to-rose-500/5" />
            <CardContent className="p-8 -mt-10 flex flex-col items-center gap-4">
              <div className="h-20 w-20 rounded-full bg-background shadow-xl ring-1 ring-border flex items-center justify-center">
                <Lock className="h-8 w-8 text-rose-500" />
              </div>
              <h2 className="text-2xl font-black">{t("admin.accessDenied", "Access Denied")}</h2>
              <p className="text-muted-foreground text-sm">{t("admin.accessDeniedDesc", "This area is restricted to administrators.")}</p>
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

  return (
    <div className="min-h-screen px-4 py-6 md:py-10 pb-32">
      <div className="mx-auto max-w-7xl flex flex-col gap-6 md:gap-8">
        
        {/* ── Compact Hero ─────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900 text-white shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/15 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/4 pointer-events-none" />
          
          <div className="relative z-10 p-6 md:p-8 flex flex-col sm:flex-row items-center gap-5">
            <div className="h-14 w-14 rounded-2xl bg-white/10 backdrop-blur-xl flex items-center justify-center ring-1 ring-white/20 shrink-0">
              <KeyRound className="h-7 w-7 text-sky-400" />
            </div>
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-2xl md:text-3xl font-black tracking-tight">{t("admin.heroTitle", "Command Center")}</h1>
              <p className="text-indigo-200/70 text-sm font-medium mt-1">{t("admin.heroDesc", "Manage properties, bookings, and user accounts.")}</p>
            </div>
            {/* Inline stats */}
            <div className="flex gap-6 sm:gap-8">
              {[
                { n: items.length, l: t("admin.stats.activeProps", "Listings"), c: "text-emerald-400" },
                { n: pendingCount, l: t("admin.stats.pending", "Pending"), c: "text-amber-400" },
                { n: users.length, l: t("admin.stats.registeredUsers", "Users"), c: "text-violet-400" },
              ].map((s, i) => (
                <div key={i} className="text-center">
                  <p className={`text-2xl md:text-3xl font-black ${s.c}`}>{s.n}</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-300/60">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── Toolbar ─────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex p-1 bg-muted/50 backdrop-blur-md rounded-xl border border-border/40 shrink-0 overflow-x-auto w-max max-w-full">
            {TABS.map(({ id, label, icon: Icon, count }) => {
              const isActive = tab === id;
              return (
                <button key={id} onClick={() => { setTab(id); setSearchQuery(""); }} className={`relative flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg transition-colors whitespace-nowrap outline-none z-10 ${isActive ? "text-indigo-700 dark:text-indigo-400" : "text-muted-foreground hover:text-foreground"}`}>
                  {isActive && <motion.div layoutId="adminTab" className="absolute inset-0 bg-background shadow-sm rounded-lg border border-border/40 z-[-1]" transition={{ type: "spring", stiffness: 500, damping: 35 }} />}
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                  <span className={`text-xs font-black ml-1 ${isActive ? "text-indigo-600 dark:text-indigo-400" : "text-muted-foreground/60"}`}>{count}</span>
                </button>
              );
            })}
          </div>
          
          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-56">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder={t("admin.search", "Search...")} className="pl-9 h-10 rounded-lg bg-card border-border/50 text-sm" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            <Button variant="outline" onClick={() => { dispatch(fetchListings()); if(tab==="messages")loadMessages(); if(tab==="users")loadUsers(); }} className="h-10 w-10 p-0 shrink-0 rounded-lg border-border/50">
              <RefreshCw className={`h-4 w-4 ${loading||msgsLoading||usersLoading ? "animate-spin text-indigo-500" : "text-muted-foreground"}`} />
            </Button>
            {tab === "listings" && (
              <Button onClick={openCreate} className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 rounded-lg h-10 px-5 shadow-lg shadow-indigo-600/20 font-bold text-sm">
                <Plus className="h-4 w-4" /> {t("admin.newProperty", "Add")}
              </Button>
            )}
          </div>
        </div>

        {/* ── Content ─────────────────────────────────────────── */}
        <AnimatePresence mode="popLayout">

          {/* ── LISTINGS TAB ── */}
          {tab === "listings" && (
            <motion.div key="listings" variants={containerVars} initial="hidden" animate="visible" exit="exit" className="flex flex-col gap-5">
              
              {/* Status sub-filters */}
              <div className="flex items-center gap-2 flex-wrap">
                <Filter className="h-4 w-4 text-muted-foreground mr-1" />
                {STATUS_FILTERS.map(f => {
                  const active = statusFilter === f.id;
                  const count = f.id === "ALL" ? items.length : items.filter(i => i.status === f.id).length;
                  return (
                    <button key={f.id} onClick={() => setStatusFilter(f.id)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${active ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20" : "bg-card border-border/50 text-muted-foreground hover:text-foreground hover:border-border"}`}>
                      {f.label}
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-black ${active ? "bg-white/20" : "bg-muted"}`}>{count}</span>
                    </button>
                  );
                })}
              </div>

              {filteredListings.length === 0 ? (
                <div className="py-20 text-center flex flex-col items-center">
                  <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mb-4"><HomeIcon className="h-7 w-7 text-muted-foreground" /></div>
                  <h3 className="text-xl font-black mb-1">{statusFilter !== "ALL" ? `No ${statusFilter.toLowerCase()} listings` : t("admin.emptyProps.title", "Empty Catalog")}</h3>
                  <p className="text-muted-foreground max-w-sm mx-auto text-sm">{t("admin.emptyProps.desc", "No properties match your current filter.")}</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <AnimatePresence>
                    {filteredListings.map(x => {
                      const cfg = STATUS_CONFIG[x.status] || STATUS_CONFIG.PENDING;
                      const StatusIcon = cfg.icon;
                      return (
                        <motion.div key={x.id} variants={itemVars} layout>
                          <Card className="rounded-2xl overflow-hidden border-border/40 bg-card/80 backdrop-blur-md shadow-sm hover:shadow-lg transition-shadow">
                            <div className="flex flex-col sm:flex-row">
                              {/* Image */}
                              <div className="sm:w-48 h-40 sm:h-auto bg-muted relative overflow-hidden shrink-0">
                                {x.image ? (
                                  <img src={x.image} alt={x?.name?.en} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="absolute inset-0 flex items-center justify-center"><ImagePlus className="h-6 w-6 text-muted-foreground/30" /></div>
                                )}
                                <div className="absolute top-3 left-3">
                                  <Badge className={`text-[10px] font-black flex items-center gap-1 px-2 py-0.5 ${cfg.cls}`}>
                                    <StatusIcon className="h-3 w-3" /> {cfg.label}
                                  </Badge>
                                </div>
                              </div>
                              
                              {/* Content */}
                              <div className="flex-1 p-4 sm:p-5 flex flex-col gap-3">
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-base truncate">{x?.name?.en || t("admin.untitled", "Untitled")}</h3>
                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-muted-foreground">
                                      <span>{x?.location?.en || "—"}</span>
                                      <span>•</span>
                                      <span>{x.rooms} {t("common.rooms", "rooms")}</span>
                                      <span>•</span>
                                      <span className="font-bold text-foreground">${x.price}<span className="text-muted-foreground font-normal">/nt</span></span>
                                    </div>
                                  </div>
                                  <Badge className="bg-background border border-border/50 text-foreground font-black px-2.5 py-1 text-sm shrink-0">${x.price}</Badge>
                                </div>

                                {/* Submitter info */}
                                {x.user && (
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded-lg px-3 py-2">
                                    <div className="h-6 w-6 rounded-full bg-indigo-500/15 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-black text-[10px]">{x.user.name?.[0]?.toUpperCase()}</div>
                                    <span className="font-semibold text-foreground">{x.user.name}</span>
                                    <span className="hidden sm:inline">• {x.user.email}</span>
                                    <span className="ml-auto flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(x.createdAt).toLocaleDateString()}</span>
                                  </div>
                                )}
                                
                                {/* Actions */}
                                <div className="flex items-center gap-2 mt-auto pt-1">
                                  {x.status === "PENDING" && (
                                    <>
                                      <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold h-8 px-3 rounded-lg text-xs" onClick={() => changeListingStatus(x.id, "ACCEPTED")}>
                                        <Check className="h-3.5 w-3.5 mr-1" /> {t("admin.accept", "Accept")}
                                      </Button>
                                      <Button size="sm" variant="outline" className="text-rose-500 hover:bg-rose-50 border-rose-200 dark:border-rose-900 h-8 px-3 rounded-lg text-xs font-bold" onClick={() => changeListingStatus(x.id, "REJECTED")}>
                                        <XCircle className="h-3.5 w-3.5 mr-1" /> {t("admin.reject", "Reject")}
                                      </Button>
                                    </>
                                  )}
                                  {x.status === "ACCEPTED" && (
                                    <Button size="sm" variant="outline" className="h-8 px-3 rounded-lg text-xs font-bold text-amber-600 border-amber-200 dark:border-amber-900 hover:bg-amber-50" onClick={() => changeListingStatus(x.id, "PENDING")}>
                                      <RotateCcw className="h-3.5 w-3.5 mr-1" /> {t("admin.setPending", "Unpublish")}
                                    </Button>
                                  )}
                                  {x.status === "REJECTED" && (
                                    <Button size="sm" variant="outline" className="h-8 px-3 rounded-lg text-xs font-bold text-emerald-600 border-emerald-200 dark:border-emerald-900 hover:bg-emerald-50" onClick={() => changeListingStatus(x.id, "ACCEPTED")}>
                                      <Check className="h-3.5 w-3.5 mr-1" /> {t("admin.approve", "Approve")}
                                    </Button>
                                  )}
                                  <div className="flex-1" />
                                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-lg text-muted-foreground hover:text-foreground" onClick={() => openEdit(x)}>
                                    <Pencil className="h-3.5 w-3.5" />
                                  </Button>
                                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30" onClick={() => dispatch(deleteListing(x.id))} disabled={String(deletingId) === String(x.id)}>
                                    {String(deletingId) === String(x.id) ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          )}

          {/* ── BOOKINGS TAB ── */}
          {tab === "messages" && (
            <motion.div key="messages" variants={containerVars} initial="hidden" animate="visible" exit="exit" className="w-full">
              <Card className="rounded-2xl border-border/40 shadow-lg overflow-hidden bg-card/80 backdrop-blur-md">
                {msgsLoading && messages.length === 0 ? (
                  <div className="py-20 text-center"><RefreshCw className="h-6 w-6 animate-spin mx-auto text-indigo-500" /></div>
                ) : filteredMessages.length === 0 ? (
                  <div className="py-20 text-center text-muted-foreground text-sm font-medium">{t("admin.noBookings", "No booking requests found.")}</div>
                ) : (
                  <div className="divide-y divide-border/40">
                    <AnimatePresence>
                      {filteredMessages.map(m => {
                        const cfg = STATUS_CONFIG[m.status] || STATUS_CONFIG.PENDING;
                        return (
                          <motion.div key={m.id} variants={itemVars} layout className="p-4 sm:p-5 flex flex-col sm:flex-row gap-4 hover:bg-muted/20 transition-colors">
                            <div className="flex items-start gap-3 flex-1 min-w-0">
                              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 shrink-0 flex items-center justify-center text-white font-black text-sm">
                                {m.name?.[0]?.toUpperCase()}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-bold text-sm">{m.name}</span>
                                  <Badge variant="outline" className={`text-[10px] font-bold px-1.5 py-0 ${cfg.cls}`}>{cfg.label}</Badge>
                                </div>
                                <p className="text-xs text-muted-foreground mt-0.5">{m.phone} {m.user && `• ${m.user.email}`}</p>
                                <p className="text-sm mt-2 bg-muted/40 rounded-lg px-3 py-2 border border-border/30 line-clamp-2">"{m.message}"</p>
                              </div>
                            </div>
                            
                            <div className="sm:w-56 shrink-0 flex flex-col gap-2">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground">{t("admin.targetProp", "Property")}</span>
                                <span className="font-bold truncate ml-2">{m.listing?.nameEn || `#${m.listingId}`}</span>
                              </div>
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground">{t("admin.bookingFor", "Duration")}</span>
                                <span className="font-bold">{m.days} nts</span>
                              </div>
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground">{t("admin.receivedOn", "Date")}</span>
                                <span className="font-bold">{new Date(m.createdAt).toLocaleDateString()}</span>
                              </div>
                              <div className="flex gap-1.5 mt-1 pt-2 border-t border-border/30">
                                {m.status === "PENDING" ? (
                                  <>
                                    <Button size="sm" className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold h-7 text-xs rounded-md" onClick={() => changeMessageStatus(m.id, "ACCEPTED")}>{t("admin.accept", "Accept")}</Button>
                                    <Button size="sm" variant="outline" className="flex-1 text-rose-500 border-rose-200 h-7 text-xs rounded-md font-bold" onClick={() => changeMessageStatus(m.id, "REJECTED")}>{t("admin.reject", "Reject")}</Button>
                                  </>
                                ) : (
                                  <Button size="sm" variant="outline" className="flex-1 h-7 text-xs rounded-md font-bold" onClick={() => changeMessageStatus(m.id, "PENDING")}>{t("admin.setPending", "Reset")}</Button>
                                )}
                                <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-950/30 rounded-md" onClick={() => requestDeleteMessage(m.id)}>
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </div>
                          </motion.div>
                        );
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
              <Card className="rounded-2xl border-border/40 shadow-lg overflow-hidden bg-card/80 backdrop-blur-md">
                {usersLoading && users.length === 0 ? (
                  <div className="py-20 text-center"><RefreshCw className="h-6 w-6 animate-spin mx-auto text-indigo-500" /></div>
                ) : filteredUsers.length === 0 ? (
                  <div className="py-20 text-center text-muted-foreground text-sm font-medium">{t("admin.noUsers", "No accounts found.")}</div>
                ) : (
                  <div className="divide-y divide-border/40">
                    <AnimatePresence>
                      {filteredUsers.map(u => (
                        <motion.div key={u.id} variants={itemVars} layout className="p-4 sm:p-5 flex items-center gap-4 hover:bg-muted/20 transition-colors">
                          <div className={`h-11 w-11 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${u.isAdmin ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400' : 'bg-muted text-muted-foreground'}`}>
                            {u.name?.[0]?.toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm truncate">{u.name}</span>
                              {u.isAdmin && <Badge className="bg-amber-500 text-white border-0 text-[9px] uppercase tracking-wider px-1.5 py-0">Admin</Badge>}
                              {u.id === user?.id && <Badge variant="outline" className="text-[9px] uppercase tracking-wider px-1.5 py-0 text-indigo-600 border-indigo-200">You</Badge>}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                              <span className="truncate">{u.email}</span>
                              <span className="hidden md:inline">• Joined {new Date(u.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <Button size="sm" variant={u.isAdmin ? "outline" : "secondary"} className={`h-8 text-xs font-bold rounded-lg ${u.isAdmin ? 'text-rose-500 border-rose-200 hover:bg-rose-50' : ''}`} onClick={() => toggleAdmin(u)} disabled={u.id === user?.id}>
                              <Shield className="h-3.5 w-3.5 mr-1" />
                              {u.isAdmin ? t("admin.revoke", "Revoke") : t("admin.makeAdmin", "Admin")}
                            </Button>
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-950/30 rounded-lg" onClick={() => deleteUser(u.id)} disabled={u.id === user?.id}>
                              <Ban className="h-3.5 w-3.5" />
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

        {/* ── Create/Edit Modal ─────────────────────────────────── */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl p-6 md:p-8 border-0 shadow-2xl bg-card">
            <DialogHeader className="mb-4 pb-4 border-b border-border/40 flex flex-row items-center gap-3 space-y-0">
              <div className="h-10 w-10 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center shrink-0">
                {mode === "create" ? <Plus className="h-5 w-5 text-indigo-600 dark:text-indigo-400" /> : <Pencil className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />}
              </div>
              <DialogTitle className="text-xl font-black">{mode === "create" ? t("admin.form.addTitle", "New Property") : t("admin.form.editTitle", "Edit Property")}</DialogTitle>
            </DialogHeader>
            <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* Left */}
              <div className="lg:col-span-2 flex flex-col gap-4">
                <label className="relative overflow-hidden flex flex-col items-center justify-center aspect-[4/3] rounded-2xl border-2 border-dashed border-border/60 hover:border-indigo-500 bg-muted/20 hover:bg-muted/40 transition-all cursor-pointer group">
                  {(imageFile || form.image) && <img src={imageFile ? URL.createObjectURL(imageFile) : form.image} alt="Cover" className="absolute inset-0 w-full h-full object-cover group-hover:opacity-40 transition-opacity" />}
                  <div className={`relative z-10 flex flex-col items-center p-4 text-center ${imageFile || form.image ? 'opacity-0 group-hover:opacity-100' : ''} transition-opacity`}>
                    <ImagePlus className="h-8 w-8 text-indigo-500 mb-2" />
                    <span className="text-xs font-bold">{t("admin.form.selectCover", "Upload Photo")}</span>
                  </div>
                  <Input type="file" accept="image/*" className="hidden" onChange={e => setImageFile(e.target.files?.[0] || null)} />
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-1">{t("admin.form.price", "Price ($)")}</label>
                    <Input required type="number" min="0" value={form.price} onChange={e => setForm(f => ({...f, price: e.target.value}))} className="h-12 rounded-xl bg-muted/40 border-transparent text-lg font-bold px-3" placeholder="150" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-1">{t("admin.form.rooms", "Rooms")}</label>
                    <Input required type="number" min="1" value={form.rooms} onChange={e => setForm(f => ({...f, rooms: e.target.value}))} className="h-12 rounded-xl bg-muted/40 border-transparent text-lg font-bold px-3" placeholder="3" />
                  </div>
                </div>
              </div>
              {/* Right */}
              <div className="lg:col-span-3 flex flex-col gap-4">
                <div className="bg-muted/10 border border-border/40 rounded-2xl p-5 flex flex-col gap-4">
                  {[
                    { key: "name", label: t("admin.form.titleLabel", "Title") },
                    { key: "location", label: t("admin.form.locationLabel", "Location") },
                    { key: "type", label: t("admin.form.typeLabel", "Type") },
                  ].map(({ key, label }) => (
                    <div key={key} className="flex flex-col gap-1.5">
                      <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-1">{label}</span>
                      <div className="grid grid-cols-3 gap-2">
                        {['En','Ru','Tj'].map(lang => (
                          <div key={`${key}${lang}`} className="relative">
                            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] font-black text-muted-foreground">{lang}</span>
                            <Input required={lang==='En'} value={form[`${key}${lang}`]} onChange={e => setForm(f => ({...f, [`${key}${lang}`]: e.target.value}))} placeholder={`${label}...`} className="h-10 rounded-lg border-border/50 bg-background pr-7 text-sm" />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-1">{t("admin.form.descLabel", "Description")}</span>
                    <Textarea value={form.about} onChange={e => setForm(f => ({...f, about: e.target.value}))} placeholder={t("admin.form.descPlaceholder", "Property description...")} className="min-h-[80px] rounded-lg border-border/50 bg-background p-3 text-sm resize-y" />
                  </div>
                </div>
                <div className="flex gap-3 mt-auto">
                  <Button type="button" variant="ghost" className="flex-1 h-12 rounded-xl font-bold hover:bg-rose-50 hover:text-rose-600" onClick={() => setOpen(false)}>{t("admin.form.cancel", "Cancel")}</Button>
                  <Button type="submit" disabled={saving} className="flex-[2] h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black shadow-lg shadow-indigo-600/20">{saving ? t("admin.form.saving", "Saving...") : t("admin.form.save", "Save Property")}</Button>
                </div>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* ── Delete Confirmation ──────────────────────────────── */}
        <Dialog open={!!messageToDelete} onOpenChange={(val) => !val && setMessageToDelete(null)}>
          <DialogContent className="sm:max-w-sm rounded-2xl p-6 border-0 shadow-2xl bg-card">
            <DialogHeader className="mb-2">
              <div className="h-10 w-10 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center text-rose-500 mb-3"><Trash2 className="h-5 w-5" /></div>
              <DialogTitle className="text-lg font-black">{t("admin.deleteConfirmTitle", "Delete Request?")}</DialogTitle>
            </DialogHeader>
            <p className="text-muted-foreground mb-5 text-sm">{t("admin.deleteConfirmDesc", "This action cannot be undone.")}</p>
            <div className="flex gap-2 justify-end">
              <Button variant="ghost" className="rounded-lg font-bold text-sm" onClick={() => setMessageToDelete(null)}>{t("admin.form.cancel", "Cancel")}</Button>
              <Button className="bg-rose-500 hover:bg-rose-600 text-white rounded-lg shadow-lg font-bold text-sm" onClick={confirmDeleteMessage}>{t("admin.delete", "Delete")}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminListings;
