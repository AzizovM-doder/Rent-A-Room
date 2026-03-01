import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImagePlus, MapPin, Bed, Home as HomeIcon, DollarSign, CheckCircle, Upload, PenLine, Sparkles, Loader2, Image as ImageIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { createListing, fetchListings } from "../../reducers/listingSlice";
import toast from "react-hot-toast";
import { getUserToken } from "../../utils/url";
import { motion, AnimatePresence } from "framer-motion";

const Post = () => {
  const dispatch = useDispatch();
  const { items = [], saving } = useSelector((s) => s.listings || {});
  const user = (() => { try { return JSON.parse(getUserToken()); } catch { return null; } })();

  const [previewUrl, setPreviewUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [nameEn, setNameEn] = useState(""); const [nameRu, setNameRu] = useState(""); const [nameTj, setNameTj] = useState("");
  const [price, setPrice] = useState(""); const [about, setAbout] = useState("");
  const [location, setLocation] = useState(""); const [rooms, setRooms] = useState(""); const [type, setType] = useState("");
  const [locations, setLocations] = useState([]); const [types, setTypes] = useState([]);
  const [posted, setPosted] = useState(false);

  useEffect(() => { dispatch(fetchListings()); }, [dispatch]);

  useEffect(() => {
    const locSet = new Set(); const typeSet = new Set();
    items.forEach((e) => {
      const loc = e?.location?.en || ""; const ty = e?.type?.en || "";
      if (loc) locSet.add(loc); if (ty) typeSet.add(ty);
    });
    setLocations([...locSet].sort()); setTypes([...typeSet].sort());
  }, [items]);

  const onPickImage = (ev) => {
    const file = ev.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const reset = () => {
    setPreviewUrl(""); setImageFile(null); setNameEn(""); setNameRu(""); setNameTj("");
    setPrice(""); setAbout(""); setLocation(""); setRooms(""); setType(""); setPosted(false);
  };

  const submit = async (ev) => {
    ev.preventDefault();
    if (!imageFile) return toast.error("Please provide a cover image for your listing.");
    if (!nameEn && !nameRu && !nameTj) return toast.error("A title is required.");
    if (!location) return toast.error("Please select a location.");
    if (!type) return toast.error("Please select a property type.");
    if (!rooms) return toast.error("Please specify the number of rooms.");
    if (!price) return toast.error("Please set a nightly price.");

    const fd = new FormData();
    fd.append("image", imageFile);
    fd.append("name", JSON.stringify({ en: nameEn, ru: nameRu, tj: nameTj }));
    fd.append("location", JSON.stringify({ en: location, ru: location, tj: location }));
    fd.append("type", JSON.stringify({ en: type, ru: type, tj: type }));
    fd.append("rooms", rooms);
    fd.append("price", price);
    fd.append("about", about);

    try {
      await dispatch(createListing(fd)).unwrap();
      reset(); 
      setPosted(true); 
      dispatch(fetchListings());
      window.scrollTo(0, 0);
    } catch {}
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  if (posted) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 20 }} className="w-full max-w-md">
          <Card className="rounded-[2.5rem] text-center overflow-hidden border-0 shadow-2xl shadow-emerald-500/10 bg-background/80 backdrop-blur-xl relative">
            <div className="h-40 bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-800 relative overflow-hidden">
               <div className="absolute inset-0 bg-white/10 backdrop-blur-2xl" />
            </div>
            <CardContent className="p-10 flex flex-col items-center gap-5 -mt-16 relative z-10">
              <div className="h-24 w-24 rounded-[2rem] bg-white dark:bg-slate-900 shadow-2xl flex items-center justify-center border-4 border-background">
                <CheckCircle className="h-10 w-10 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-3xl font-black tracking-tight mb-2">Listing Alive!</h2>
                <p className="text-muted-foreground font-medium">Your spectacular space is now live for thousands of renters to discover.</p>
              </div>
              <Button className="w-full h-14 mt-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 font-bold shadow-xl shadow-emerald-500/20 text-base transition-all hover:-translate-y-0.5" onClick={reset}>
                Post another listing
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-12">
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="mx-auto max-w-7xl flex flex-col gap-10">
        
        {/* Header section */}
        <motion.div variants={fadeUp} className="relative overflow-hidden rounded-[2.5rem] bg-slate-950 p-10 md:p-14 text-white shadow-2xl shadow-emerald-900/10 flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Background visuals */}
          <div className="absolute inset-0 z-0">
             <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
             <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-teal-500/20 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/3 pointer-events-none" />
          </div>
          
          <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6">
            <div className="h-20 w-20 rounded-[2rem] bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-2xl shrink-0">
              <Sparkles className="h-10 w-10 text-emerald-400" />
            </div>
            <div className="flex flex-col gap-2 pt-1">
              <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">Post your space.</h1>
              <p className="text-white/70 text-lg font-medium max-w-md">Reach an elite audience and start earning from your incredible properties today.</p>
            </div>
          </div>
          
          <div className="relative z-10 flex flex-col rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 p-6 md:w-72 shrink-0 shadow-2xl items-center md:items-start text-center md:text-left text-white h-auto">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-2 flex items-center gap-2">
               <span className="relative flex h-2 w-2">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
               </span>
               Network Status
            </span>
            <span className="text-3xl font-black leading-none mb-1">Thousands</span>
            <span className="text-sm font-medium text-white/60">of active renters waiting</span>
          </div>
        </motion.div>

        <div className="grid gap-10 lg:grid-cols-12 items-start">
          
          {/* Main Form */}
          <motion.div variants={fadeUp} className="lg:col-span-8">
            <Card className="rounded-[2.5rem] shadow-2xl border-border/40 bg-background/80 backdrop-blur-xl">
              <div className="p-8 md:p-10 flex flex-col gap-8">
                <div>
                  <h2 className="text-2xl font-black flex items-center gap-3">
                     <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-600"><PenLine className="h-6 w-6" /></div>
                     Property Details
                  </h2>
                  <p className="text-base text-muted-foreground mt-2 font-medium">Please provide accurate information to attract the best guests.</p>
                </div>
                
                <form id="post-form" onSubmit={submit} className="flex flex-col gap-8">
                  
                  {/* Image upload */}
                  <div className="flex flex-col gap-3">
                    <label className="text-sm font-bold border-b border-border/50 pb-2 flex justify-between">
                       Media <span className="text-rose-500">*</span>
                    </label>
                    <label className={`flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-3xl p-10 cursor-pointer overflow-hidden relative transition-all duration-300 ${previewUrl ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20" : "border-border hover:border-emerald-500 hover:bg-muted/50"}`}>
                      {previewUrl ? (
                         <div className="absolute inset-0 w-full h-full opacity-30 blur-sm pointer-events-none">
                            <img src={previewUrl} alt="blurred preview bg" className="w-full h-full object-cover" />
                         </div>
                      ) : null}
                      <div className="relative z-10 flex flex-col items-center">
                         <div className="h-16 w-16 rounded-[2rem] bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center shadow-lg border border-emerald-200 dark:border-emerald-800 mb-2">
                           {previewUrl ? <ImageIcon className="h-8 w-8 text-emerald-600" /> : <Upload className="h-8 w-8 text-emerald-600" />}
                         </div>
                         <div className="text-center bg-background/80 backdrop-blur-md px-4 py-2 rounded-xl mt-2 border border-border/50 shadow-sm">
                           <p className="text-sm font-bold text-foreground">{imageFile ? imageFile.name : "Click to upload your best photo"}</p>
                           <p className="text-xs text-muted-foreground mt-0.5 font-medium">High res JPEG or PNG (Max 10MB)</p>
                         </div>
                      </div>
                      <Input name="image" type="file" accept="image/*" onChange={onPickImage} className="hidden" />
                    </label>
                  </div>

                  {/* Names */}
                  <div className="flex flex-col gap-3">
                    <label className="text-sm font-bold border-b border-border/50 pb-2">Listing Titles <span className="text-rose-500">*</span></label>
                    <div className="grid gap-4 sm:grid-cols-3 pt-2">
                      {[
                        { lang: "EN", val: nameEn, setter: setNameEn, placeholder: "Luxury Villa" }, 
                        { lang: "RU", val: nameRu, setter: setNameRu, placeholder: "Роскошная вилла" }, 
                        { lang: "TJ", val: nameTj, setter: setNameTj, placeholder: "Вилаи боҳашамат" }
                      ].map(({ lang, val, setter, placeholder }) => (
                        <div key={lang} className="flex flex-col gap-1.5 pl-2 border-l-[3px] border-muted focus-within:border-emerald-500 transition-colors">
                          <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">Title in {lang}</label>
                          <Input placeholder={placeholder} value={val} onChange={e => setter(e.target.value)} className="h-12 rounded-xl bg-muted/40 border-transparent hover:bg-muted/60 focus-visible:bg-transparent focus-visible:border-emerald-500 shadow-sm transition-all text-sm font-medium" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pricing & Rooms */}
                  <div className="flex flex-col gap-3">
                    <label className="text-sm font-bold border-b border-border/50 pb-2">Core Information <span className="text-rose-500">*</span></label>
                    <div className="grid gap-6 sm:grid-cols-2 pt-2">
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider pl-1">Price per night ($)</label>
                        <div className="relative group">
                          <DollarSign className="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-emerald-600 transition-colors" />
                          <Input type="number" className="pl-12 h-14 rounded-2xl bg-muted/40 border-transparent hover:bg-muted/60 focus-visible:bg-transparent focus-visible:border-emerald-500 shadow-sm transition-all text-base font-bold" placeholder="150" value={price} onChange={e => setPrice(e.target.value)} min={1} />
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider pl-1">Number of rooms</label>
                        <div className="relative group">
                          <Bed className="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-emerald-600 transition-colors" />
                          <Input type="number" className="pl-12 h-14 rounded-2xl bg-muted/40 border-transparent hover:bg-muted/60 focus-visible:bg-transparent focus-visible:border-emerald-500 shadow-sm transition-all text-base font-bold" placeholder="3" value={rooms} onChange={e => setRooms(e.target.value)} min={1} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Location & Type */}
                  <div className="grid gap-6 sm:grid-cols-2 pt-2">
                    {[
                      { label: "Location", val: location, setter: setLocation, opts: locations, icon: MapPin }, 
                      { label: "Property Type", val: type, setter: setType, opts: types, icon: HomeIcon }
                    ].map(({ label, val, setter, opts, icon: Icon }) => (
                      <div key={label} className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider pl-1">{label} <span className="text-rose-500">*</span></label>
                        <Select value={val} onValueChange={setter}>
                          <SelectTrigger className="h-14 rounded-2xl bg-muted/40 border-transparent hover:bg-muted/60 focus:bg-transparent focus:border-emerald-500 shadow-sm transition-all text-base font-medium">
                            <div className="flex items-center gap-3"><Icon className="h-5 w-5 text-muted-foreground" /><SelectValue placeholder={`Choose ${label.toLowerCase()}`} /></div>
                          </SelectTrigger>
                          <SelectContent className="rounded-xl font-medium">{opts.map(o => <SelectItem key={o} value={o} className="rounded-lg cursor-pointer">{o}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                    ))}
                  </div>

                  {/* About text */}
                  <div className="flex flex-col gap-2 pt-2">
                    <label className="text-sm font-bold border-b border-border/50 pb-2">Description</label>
                    <Textarea placeholder="Share what makes this place special. Mention cool amenities, the neighborhood, and anything guests should know..." value={about} onChange={e => setAbout(e.target.value)} className="min-h-40 rounded-2xl bg-muted/40 border-transparent hover:bg-muted/60 focus-visible:bg-transparent focus-visible:border-emerald-500 shadow-sm transition-all text-base p-5 resize-y font-medium leading-relaxed" />
                  </div>
                </form>
              </div>
            </Card>
          </motion.div>

          {/* Right sidebar - Live Preview */}
          <motion.div variants={fadeUp} className="lg:col-span-4 flex flex-col gap-6">
            <Card className="rounded-[2.5rem] shadow-2xl border-0 bg-background/80 backdrop-blur-xl sticky top-28 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 via-transparent to-transparent pointer-events-none" />
              
              <div className="p-8 border-b border-border/40 flex items-center justify-between relative z-10">
                <p className="font-extrabold text-lg flex items-center gap-2">
                  <Eye className="h-5 w-5 text-emerald-500" /> Live Preview
                </p>
                {price ? <Badge className="bg-emerald-600 shadow-lg shadow-emerald-500/20 px-3 py-1 font-bold text-sm rounded-lg">${price}</Badge> : <Badge variant="secondary" className="px-3 py-1 rounded-lg">No price</Badge>}
              </div>

              <div className="p-8 flex flex-col gap-6 relative z-10">
                {/* Visual Preview */}
                <div className="rounded-3xl overflow-hidden shadow-xl border border-border/50 bg-muted relative group">
                  <div className="aspect-[4/3] w-full relative bg-card">
                    {previewUrl ? (
                      <img src={previewUrl} alt="preview" className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-emerald-600/40 bg-emerald-50/50 dark:bg-emerald-950/20">
                        <div className="h-16 w-16 rounded-[2rem] bg-emerald-100/50 dark:bg-emerald-900/30 flex items-center justify-center border border-emerald-200/50 dark:border-emerald-800/50 shadow-sm">
                           <ImagePlus className="h-8 w-8" />
                        </div>
                        <span className="text-sm font-bold uppercase tracking-wider">Awaiting Image</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                  </div>
                </div>

                {/* Text Preview */}
                <div className="flex flex-col gap-3">
                  <h3 className="text-xl font-black leading-tight line-clamp-2">
                     {nameEn || nameRu || nameTj || "Your Stunning Property"}
                  </h3>
                  <div className="flex flex-wrap gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    <span className="flex items-center gap-1.5 bg-muted/80 px-2.5 py-1.5 rounded-lg border border-border/50"><MapPin className="h-3.5 w-3.5 text-emerald-500" />{location || "City"}</span>
                    <span className="flex items-center gap-1.5 bg-muted/80 px-2.5 py-1.5 rounded-lg border border-border/50"><Bed className="h-3.5 w-3.5 text-emerald-500" />{rooms ? `${rooms} rooms` : "Rooms"}</span>
                    <span className="flex items-center gap-1.5 bg-muted/80 px-2.5 py-1.5 rounded-lg border border-border/50 capitalize"><HomeIcon className="h-3.5 w-3.5 text-emerald-500" />{type || "Type"}</span>
                  </div>
                  {about ? (
                    <p className="text-sm text-muted-foreground line-clamp-3 mt-1 font-medium leading-relaxed bg-muted/30 p-4 rounded-xl border border-border/30">{about}</p>
                  ) : (
                    <div className="h-20 w-full rounded-xl bg-muted/40 border border-dashed border-border/50 flex items-center justify-center mt-1">
                       <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">No Description Yet</span>
                    </div>
                  )}
                </div>

                <div className="w-full h-px bg-border/40 my-1" />
                
                {user && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Host</span>
                    <span className="font-bold px-3 py-1.5 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-black shadow-md border border-border/50 flex items-center gap-2">
                      <div className="h-5 w-5 rounded-full bg-emerald-500 flex items-center justify-center text-[10px] text-white">R</div>
                      {user.name}
                    </span>
                  </div>
                )}
                
                {/* Actions */}
                <div className="flex flex-col gap-3 pt-2">
                  <Button type="submit" form="post-form" disabled={!!saving} className="w-full h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-700 font-bold shadow-xl shadow-emerald-500/20 text-base transition-all hover:-translate-y-0.5 border-0">
                    {saving ? <Loader2 className="h-5 w-5 mr-2 animate-spin" /> : <Upload className="h-5 w-5 mr-2" />}
                    {saving ? "Publishing Space..." : "Publish To Production"}
                  </Button>
                  <Button type="button" variant="ghost" onClick={reset} className="w-full h-12 rounded-2xl hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30 text-muted-foreground transition-colors font-bold">
                    Clear Form
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>

        </div>
      </motion.div>
    </div>
  );
};

export default Post;
