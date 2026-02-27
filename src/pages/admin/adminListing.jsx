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

const STATUS_CONFIG = {
  PENDING:  { label: "Pending",  icon: Clock,       cls: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-900", dot: "bg-amber-500" },
  ACCEPTED: { label: "Accepted", icon: CheckCircle, cls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900", dot: "bg-emerald-500" },
  REJECTED: { label: "Rejected", icon: XCircle,     cls: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 border-rose-200 dark:border-rose-900", dot: "bg-rose-500" },
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

  useEffect(() => { dispatch(fetchListings()); }, [dispatch]);

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

  if (!isAdmin) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <Card className="max-w-md w-full rounded-3xl text-center shadow-2xl overflow-hidden border-0">
          <div className="h-28 bg-gradient-to-br from-rose-500 to-rose-700" />
          <CardContent className="p-8 flex flex-col items-center gap-4 -mt-10">
            <div className="h-20 w-20 rounded-2xl bg-white dark:bg-zinc-900 shadow-xl flex items-center justify-center">
              <Lock className="h-10 w-10 text-rose-500" />
            </div>
            <div>
              <p className="text-2xl font-extrabold tracking-tight mt-2">Access Denied</p>
              <p className="text-sm text-muted-foreground mt-1">You must be an administrator to view this area.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const TABS = [
    { id: "listings", label: "Properties", icon: HomeIcon, count: items.length },
    { id: "messages", label: "Bookings", icon: MessageSquare, count: messages.length },
    { id: "users", label: "Accounts", icon: Users, count: users.length },
  ];

  return (
    <div className="min-h-[75vh] px-4 py-8 animate-fade-up">
      <div className="mx-auto max-w-7xl flex flex-col gap-8">
        
        {/* New Hero Dashboard Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 p-8 md:p-10 text-white shadow-xl flex flex-col lg:flex-row gap-8 lg:items-center justify-between">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full translate-y-1/3 -translate-x-1/4 blur-2xl pointer-events-none" />
          
          <div className="relative flex items-center gap-5">
            <div className="h-20 w-20 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center ring-4 ring-white/30 shadow-lg shrink-0 overflow-hidden">
              <KeyRound className="h-10 w-10 text-white/90" />
            </div>
            <div className="flex flex-col gap-1.5">
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-none">Admin Area</h1>
              <p className="text-amber-100 font-medium">Control center for Rent-A-Room platform</p>
            </div>
          </div>
          
          <div className="relative flex gap-4 overflow-x-auto pb-2 scrollbar-none flex-nowrap w-full lg:w-auto">
            {[
              { label: "Active Properties", icon: HomeIcon, count: items.length },
              { label: "Total Bookings", icon: MessageSquare, count: messages.length, loading: msgsLoading && tab !== 'messages' },
              { label: "Registered Users", icon: Users, count: users.length, loading: usersLoading && tab !== 'users' },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col bg-black/10 backdrop-blur border border-white/10 rounded-2xl p-4 min-w-[140px] transition-colors hover:bg-black/20">
                <div className="flex items-center gap-2 text-amber-100/80 mb-1">
                  <stat.icon className="h-4 w-4" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">{stat.label}</span>
                </div>
                <span className="text-2xl font-bold">{stat.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Toolbar & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Custom animated tabs */}
          <div className="flex bg-muted/50 p-1 rounded-2xl overflow-x-auto">
            {TABS.map(({ id, label, icon: Icon, count }) => (
              <button key={id} onClick={() => setTab(id)} 
                className={`relative flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl transition-all whitespace-nowrap overflow-hidden
                ${tab === id ? "text-amber-700 dark:text-amber-400 bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
                <Icon className={`h-4 w-4 relative z-10 ${tab === id ? "text-amber-600 dark:text-amber-400" : ""}`} />
                <span className="relative z-10">{label}</span>
                <Badge variant={tab === id ? "default" : "secondary"} className={`relative z-10 ml-1 ${tab === id ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 hover:bg-amber-200" : ""}`}>{count}</Badge>
              </button>
            ))}
          </div>
          
          <div className="flex gap-2 shrink-0">
            <Button variant="outline" onClick={() => { dispatch(fetchListings()); if (tab === "messages") loadMessages(); if (tab === "users") loadUsers(); }} className="gap-2 rounded-xl h-11 border-border/60 hover:bg-muted font-medium">
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh
            </Button>
            {tab === "listings" && (
              <Button onClick={openCreate} className="bg-amber-500 hover:bg-amber-600 text-white gap-2 rounded-xl h-11 px-5 shadow-lg shadow-amber-500/20 font-bold">
                <Plus className="h-5 w-5" /> New property
              </Button>
            )}
          </div>
        </div>

        {error && (
          <Card className="rounded-2xl border-red-200 bg-red-50 dark:bg-red-950/20 shadow-none">
            <CardContent className="p-4 flex justify-between items-center gap-3">
              <p className="text-sm text-red-600 font-medium">{error}</p>
              <Button variant="ghost" size="sm" onClick={() => dispatch(clearError())} className="text-red-700 hover:bg-red-100">Dismiss</Button>
            </CardContent>
          </Card>
        )}

        {/* ── Listings Tab ───────────────────────────────────────── */}
        {tab === "listings" && (
          items.length === 0 && !loading ? (
            <Card className="rounded-3xl border-dashed border-2 bg-muted/30"><CardContent className="py-20 flex flex-col items-center justify-center text-center"><HomeIcon className="h-12 w-12 text-muted-foreground/50 mb-4" /><p className="font-bold text-lg">No properties yet</p><p className="text-sm text-muted-foreground mb-6">Add your first listing to start renting</p><Button onClick={openCreate} className="bg-amber-500 hover:bg-amber-600 rounded-xl h-11">Create Property</Button></CardContent></Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {items.map((x, i) => (
                <Card key={x.id} className="rounded-3xl overflow-hidden border-0 bg-card/80 backdrop-blur shadow-lg hover:-translate-y-1 transition-all duration-300 group" style={{ animationDelay: `${i * 50}ms` }}>
                  <div className="h-48 w-full bg-muted overflow-hidden relative">
                    {x.image ? (
                      <img src={x.image} alt="" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/30"><ImagePlus className="h-8 w-8" /></div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                      <Badge className="bg-amber-500 text-white font-bold text-sm tracking-wide shadow-md border-0">${x.price ?? 0} <span className="text-[10px] font-normal opacity-80 ml-1">/NIGHT</span></Badge>
                    </div>
                  </div>
                  <CardContent className="p-5 flex flex-col gap-4">
                    <div>
                      <p className="font-bold text-lg leading-tight truncate">{x?.name?.en || "Untitled Property"}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <Badge variant="outline" className="text-[10px] uppercase font-bold text-muted-foreground">{x?.location?.en || "Unknown"}</Badge>
                        <Badge variant="outline" className="text-[10px] uppercase font-bold text-muted-foreground">{x.rooms} Rooms</Badge>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 pt-1">
                      <Button variant="secondary" className="flex-1 gap-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:hover:bg-amber-900/50 dark:text-amber-400 border-0" onClick={() => openEdit(x)}>
                        <Pencil className="h-4 w-4" /> Edit
                      </Button>
                      <Button variant="ghost" className="flex-1 gap-2 rounded-xl hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30 text-rose-500" onClick={() => dispatch(deleteListing(x.id))} disabled={String(deletingId) === String(x.id)}>
                        <Trash2 className="h-4 w-4" /> {String(deletingId) === String(x.id) ? "Deleting..." : "Delete"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )
        )}

        {/* ── Bookings / Messages Tab ────────────────────────────── */}
        {tab === "messages" && (
          <Card className="rounded-3xl shadow-lg border-0 bg-card/80 backdrop-blur overflow-hidden">
            <div className="p-6 border-b"><h2 className="text-xl font-bold">Booking Requests ({messages.length})</h2></div>
            <div className="p-0">
              {msgsLoading ? <div className="py-20 flex justify-center"><RefreshCw className="h-8 w-8 animate-spin text-amber-500" /></div>
                : messages.length === 0 ? (
                  <div className="py-20 flex flex-col items-center justify-center text-center"><MessageSquare className="h-12 w-12 text-muted-foreground/50 mb-4" /><p className="font-bold text-lg">No booking requests</p><p className="text-sm text-muted-foreground">Requests from clients will appear here</p></div>
                ) : (
                  <div className="flex flex-col divide-y">
                    {messages.map((m) => {
                      const cfg = STATUS_CONFIG[m.status] || STATUS_CONFIG.PENDING;
                      const StatusIcon = cfg.icon;
                      return (
                        <div key={m.id} className="p-6 flex flex-col md:flex-row gap-6 hover:bg-muted/30 transition-colors">
                          
                          <div className="flex-1 flex flex-col gap-3">
                            <div className="flex items-center gap-3 flex-wrap">
                              <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center font-bold text-amber-700 dark:text-amber-400">
                                {m.name?.[0]?.toUpperCase() || "U"}
                              </div>
                              <div className="flex flex-col">
                                <span className="font-bold">{m.name}</span>
                                <span className="text-xs text-muted-foreground">{m.phone}{m.user ? ` · ${m.user.email}` : ""}</span>
                              </div>
                              <div className={`ml-auto md:ml-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${cfg.cls}`}>
                                <StatusIcon className="h-3.5 w-3.5" /> {cfg.label}
                              </div>
                            </div>
                            
                            <div className="mt-1 bg-muted/40 p-3 rounded-xl border border-transparent">
                              <p className="text-sm italic text-foreground/80">"{m.message}"</p>
                            </div>
                          </div>
                          
                          <div className="w-px bg-border hidden md:block" />
                          
                          <div className="md:w-64 flex flex-col justify-between gap-4 shrink-0">
                            <div className="flex flex-col gap-1">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Target Property</span>
                              <div className="flex items-center gap-2">
                                <HomeIcon className="h-4 w-4 text-amber-500 shrink-0" />
                                <span className="font-semibold text-sm truncate">{m.listing?.nameEn || `Listing #${m.listingId}`}</span>
                              </div>
                              <span className="text-xs text-muted-foreground mt-1 flex items-center gap-1"><Clock className="h-3 w-3" /> Booking for {m.days} days</span>
                              <span className="text-xs text-muted-foreground flex items-center gap-1"><TrendingUp className="h-3 w-3" /> Received {new Date(m.createdAt).toLocaleDateString()}</span>
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="flex gap-2 w-full mt-2">
                              {m.status === "PENDING" && (
                                <>
                                  <Button size="sm" onClick={() => changeMessageStatus(m.id, "ACCEPTED")} className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg h-9">Accept</Button>
                                  <Button size="sm" variant="destructive" onClick={() => changeMessageStatus(m.id, "REJECTED")} className="flex-1 rounded-lg h-9">Reject</Button>
                                </>
                              )}
                              {m.status !== "PENDING" && (
                                <Button size="sm" variant="outline" onClick={() => changeMessageStatus(m.id, "PENDING")} className="w-full rounded-lg h-9">Move to Pending</Button>
                              )}
                            </div>
                          </div>
                          
                        </div>
                      );
                    })}
                  </div>
                )}
            </div>
          </Card>
        )}

        {/* ── Users Tab ──────────────────────────────────────────── */}
        {tab === "users" && (
          <Card className="rounded-3xl shadow-lg border-0 bg-card/80 backdrop-blur overflow-hidden">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold">Registered Users ({users.length})</h2>
              <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-400 px-3 py-1 font-semibold">{users.filter(u => u.isAdmin).length} Admins</Badge>
            </div>
            <div className="p-0">
              {usersLoading ? <div className="py-20 flex justify-center"><RefreshCw className="h-8 w-8 animate-spin text-amber-500" /></div>
                : users.length === 0 ? (
                  <div className="py-20 flex flex-col items-center justify-center text-center"><Users className="h-12 w-12 text-muted-foreground/50 mb-4" /><p className="font-bold text-lg">No users found</p></div>
                ) : (
                  <div className="flex flex-col divide-y">
                    {users.map((u) => (
                      <div key={u.id} className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-muted/30 transition-colors group">
                        
                        <div className="flex items-center gap-4 flex-1">
                          <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border ${u.isAdmin ? 'bg-amber-100 border-amber-200 text-amber-700 dark:bg-amber-900/40 dark:border-amber-800 dark:text-amber-400' : 'bg-muted border-transparent text-muted-foreground'}`}>
                            <span className="text-lg font-bold">{u.name?.[0]?.toUpperCase()}</span>
                          </div>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <span className="font-bold">{u.name}</span>
                              {u.isAdmin && <Badge className="bg-amber-500 hover:bg-amber-500 text-white border-0 text-[10px] h-5 px-1.5"><KeyRound className="h-3 w-3 mr-1" /> ADMIN</Badge>}
                              {u.id === user?.id && <Badge variant="outline" className="text-[10px] h-5 px-1.5">YOU</Badge>}
                            </div>
                            <span className="text-sm text-muted-foreground">{u.email}</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-3 sm:gap-6 shrink-0 bg-muted/30 sm:bg-transparent p-3 sm:p-0 rounded-xl">
                          <div className="flex flex-col">
                            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Joined</span>
                            <span className="text-sm font-medium">{new Date(u.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="w-px h-8 bg-border hidden sm:block" />
                          
                          <div className="flex items-center gap-2 ml-auto">
                            <Button size="sm" variant={u.isAdmin ? "outline" : "secondary"} className={`rounded-lg h-9 hidden md:flex ${u.isAdmin ? "hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200" : ""}`}
                              onClick={() => toggleAdmin(u)} disabled={u.id === user?.id}>
                              {u.isAdmin ? <><ShieldOff className="h-4 w-4 mr-1.5" /> Revoke</> : <><ShieldCheck className="h-4 w-4 mr-1.5" /> Make Admin</>}
                            </Button>
                            
                            {/* Mobile only admin toggle (icon only) */}
                            <Button size="icon" variant={u.isAdmin ? "outline" : "secondary"} className="h-9 w-9 rounded-lg md:hidden"
                              onClick={() => toggleAdmin(u)} disabled={u.id === user?.id}>
                              {u.isAdmin ? <ShieldOff className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
                            </Button>

                            <Button size="icon" variant="ghost" className="h-9 w-9 rounded-lg hover:bg-rose-100 hover:text-rose-600 text-muted-foreground"
                              onClick={() => deleteUser(u.id)} disabled={u.id === user?.id}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                      </div>
                    ))}
                  </div>
                )}
            </div>
          </Card>
        )}

        {/* Create/Edit Modal overlay styling */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 md:p-8 border-0 shadow-2xl bg-card">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">{mode === "create" ? <><Plus className="h-6 w-6 text-amber-500" /> New Property</> : <><Pencil className="h-6 w-6 text-amber-500" /> Edit Property</>}</DialogTitle>
            </DialogHeader>
            <form onSubmit={submit} className="grid gap-6 md:grid-cols-2">
              <div className="flex flex-col gap-5">
                <label className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-border/60 hover:border-amber-500 rounded-3xl p-6 cursor-pointer bg-muted/20 hover:bg-muted/50 transition-all duration-300">
                  <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center"><ImagePlus className="h-6 w-6 text-amber-600 dark:text-amber-500" /></div>
                  <span className="text-sm font-semibold text-center">{imageFile ? imageFile.name : "Click to select property image"}</span>
                  <Input type="file" accept="image/*" className="hidden" onChange={e => setImageFile(e.target.files?.[0] || null)} />
                </label>
                {(imageFile || form.image) && (
                  <div className="rounded-2xl overflow-hidden border bg-muted aspect-[4/3] shadow-inner relative">
                    <img src={imageFile ? URL.createObjectURL(imageFile) : (typeof form.image === "string" ? form.image : "")} alt="" className="h-full w-full object-cover" />
                  </div>
                )}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5"><label className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Price ($/night)</label><Input className="h-11 rounded-xl bg-muted/50" type="number" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} /></div>
                  <div className="flex flex-col gap-1.5"><label className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Rooms</label><Input className="h-11 rounded-xl bg-muted/50" type="number" value={form.rooms} onChange={e => setForm(p => ({ ...p, rooms: e.target.value }))} /></div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Description</label>
                  <Textarea placeholder="Property details..." className="min-h-[120px] rounded-xl bg-muted/50 resize-y" value={form.about} onChange={e => setForm(p => ({ ...p, about: e.target.value }))} />
                </div>
              </div>
              
              <div className="flex flex-col gap-6">
                <div className="p-5 rounded-3xl bg-muted/30 border flex flex-col gap-5">
                  {[["Title", "nameEn", "nameRu", "nameTj"], ["Location", "locationEn", "locationRu", "locationTj"], ["Property Type", "typeEn", "typeRu", "typeTj"]].map(([label, en, ru, tj]) => (
                    <div key={label} className="flex flex-col gap-3">
                      <p className="text-sm font-bold border-b pb-1">{label}</p>
                      <div className="grid gap-3 sm:grid-cols-3">
                        {[[en, "EN"], [ru, "RU"], [tj, "TJ"]].map(([field, ph]) => (
                          <Input key={field} placeholder={ph} className="h-10 rounded-lg bg-background" value={form[field]} onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-3 mt-auto">
                  <Button type="button" variant="ghost" className="flex-1 rounded-xl h-12 hover:bg-rose-50 hover:text-rose-600" onClick={() => setOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={saving} className="flex-[2] bg-amber-500 hover:bg-amber-600 rounded-xl h-12 font-bold shadow-lg shadow-amber-500/20 text-white">{saving ? "Saving..." : "Save Property"}</Button>
                </div>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
export default AdminListings;
