import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImagePlus, MapPin, Bed, Home as HomeIcon, DollarSign, CheckCircle, Upload, PenLine, Sparkles, Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { createListing, fetchListings } from "../../reducers/listingSlice";
import toast from "react-hot-toast";
import { getUserToken } from "../../utils/url";

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
    if (!imageFile) return toast.error("Pick an image");
    if (!nameEn && !nameRu && !nameTj) return toast.error("Enter a name");
    if (!location) return toast.error("Select location");
    if (!type) return toast.error("Select type");
    if (!rooms) return toast.error("Enter number of rooms");
    if (!price) return toast.error("Enter price");

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
      reset(); setPosted(true); dispatch(fetchListings());
    } catch {}
  };

  if (posted) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 animate-scale-in">
        <Card className="max-w-md w-full rounded-3xl text-center overflow-hidden border-0 shadow-2xl bg-card/80 backdrop-blur pt-0">
          <div className="h-28 bg-gradient-to-br from-emerald-600 to-teal-800" />
          <CardContent className="p-8 flex flex-col items-center gap-4 -mt-8">
            <div className="h-16 w-16 rounded-2xl bg-white shadow-xl flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight">Listing Posted!</h2>
              <p className="text-sm text-muted-foreground mt-1">Your room is now live on the platform</p>
            </div>
            <Button className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 font-bold shadow-lg shadow-emerald-600/20 mt-2" onClick={reset}>Post another room</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[75vh] px-4 py-8 animate-fade-up">
      <div className="mx-auto max-w-6xl flex flex-col gap-8">
        
        {/* Header section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 p-8 md:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl pointer-events-none" />
          
          <div className="relative flex items-center gap-5">
            <div className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center ring-2 ring-white/30 shadow-lg shrink-0">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <div className="flex flex-col gap-1">
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">Post a listing</h1>
              <p className="text-emerald-100 text-sm md:text-base">Reach thousands of renters by sharing your space</p>
            </div>
          </div>
          
          <div className="relative flex flex-col rounded-2xl bg-black/10 backdrop-blur border border-white/10 p-4 md:w-64 shrink-0 transition-colors">
            <span className="text-xs font-semibold text-emerald-200 uppercase tracking-widest mb-1">Total Audience</span>
            <span className="text-2xl font-bold leading-none">2,000+ <span className="text-sm font-medium text-white/70">active users</span></span>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-5 items-start">
          {/* Main Form (Takes 3 columns on large screens) */}
          <Card className="rounded-3xl shadow-lg border-0 bg-card/80 backdrop-blur lg:col-span-3">
            <div className="p-6 md:p-8 flex flex-col gap-6">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2"><PenLine className="h-5 w-5 text-emerald-600" /> Property Details</h2>
                <p className="text-sm text-muted-foreground mt-1">Fill out the information below. All fields marked with * are required.</p>
              </div>
              
              <form id="post-form" onSubmit={submit} className="flex flex-col gap-5">
                {/* Image upload */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold">Cover Image *</label>
                  <label className={`flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-2xl p-6 cursor-pointer transition-all duration-300 ${previewUrl ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20" : "border-muted-foreground/20 hover:border-emerald-500 hover:bg-muted/50"}`}>
                    <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                      <Upload className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold">{imageFile ? imageFile.name : "Click to upload an image"}</p>
                      <p className="text-xs text-muted-foreground mt-1">JPEG, PNG or WebP (Max 10MB)</p>
                    </div>
                    <Input name="image" type="file" accept="image/*" onChange={onPickImage} className="hidden" />
                  </label>
                </div>

                {/* Names */}
                <div className="grid gap-4 sm:grid-cols-3 pt-2">
                  {[
                    { lang: "EN", val: nameEn, setter: setNameEn, placeholder: "Modern Apt" }, 
                    { lang: "RU", val: nameRu, setter: setNameRu, placeholder: "Кв. в центре" }, 
                    { lang: "TJ", val: nameTj, setter: setNameTj, placeholder: "Хонаи муосир" }
                  ].map(({ lang, val, setter, placeholder }) => (
                    <div key={lang} className="flex flex-col gap-2">
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Title ({lang})</label>
                      <Input placeholder={placeholder} value={val} onChange={e => setter(e.target.value)} className="h-11 rounded-xl bg-muted/50 transition-colors focus-visible:bg-transparent" />
                    </div>
                  ))}
                </div>

                {/* Price & Rooms */}
                <div className="grid gap-4 sm:grid-cols-2 pt-2">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold">Price per night ($) *</label>
                    <div className="relative group">
                      <DollarSign className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-emerald-600" />
                      <Input type="number" className="pl-10 h-11 rounded-xl bg-muted/50 transition-colors focus-visible:bg-transparent" placeholder="50" value={price} onChange={e => setPrice(e.target.value)} min={1} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold">Number of rooms *</label>
                    <div className="relative group">
                      <Bed className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-emerald-600" />
                      <Input type="number" className="pl-10 h-11 rounded-xl bg-muted/50 transition-colors focus-visible:bg-transparent" placeholder="2" value={rooms} onChange={e => setRooms(e.target.value)} min={1} />
                    </div>
                  </div>
                </div>

                {/* Location & Type */}
                <div className="grid gap-4 sm:grid-cols-2 pt-2">
                  {[
                    { label: "Location *", val: location, setter: setLocation, opts: locations, icon: MapPin }, 
                    { label: "Property Type *", val: type, setter: setType, opts: types, icon: HomeIcon }
                  ].map(({ label, val, setter, opts, icon: Icon }) => (
                    <div key={label} className="flex flex-col gap-2">
                      <label className="text-sm font-semibold">{label}</label>
                      <Select value={val} onValueChange={setter}>
                        <SelectTrigger className="h-11 rounded-xl bg-muted/50 transition-colors focus:bg-transparent">
                          <div className="flex items-center gap-2"><Icon className="h-4 w-4 text-muted-foreground" /><SelectValue placeholder={`Select...`} /></div>
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">{opts.map(o => <SelectItem key={o} value={o} className="rounded-lg">{o}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>

                {/* About text */}
                <div className="flex flex-col gap-2 pt-2">
                  <label className="text-sm font-semibold">Description</label>
                  <Textarea placeholder="Describe the place, rules, amenities..." value={about} onChange={e => setAbout(e.target.value)} className="min-h-32 rounded-xl bg-muted/50 transition-colors focus-visible:bg-transparent resize-y" />
                </div>
              </form>
            </div>
          </Card>

          {/* Right sidebar - Live Preview & Actions */}
          <div className="flex flex-col gap-6 lg:col-span-2">
            
            <Card className="rounded-3xl shadow-lg border-0 bg-card/80 backdrop-blur sticky top-24">
              <div className="p-6 border-b flex items-center justify-between">
                <p className="font-bold">Live Preview</p>
                {price ? <Badge className="bg-emerald-600 shadow shadow-emerald-500/20">${price}/night</Badge> : <Badge variant="secondary">No price</Badge>}
              </div>
              <div className="p-6 flex flex-col gap-5">
                {/* Card preview visual */}
                <div className="rounded-2xl overflow-hidden border bg-muted group relative">
                  <div className="aspect-[4/3] w-full relative">
                    {previewUrl ? (
                      <img src={previewUrl} alt="preview" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-muted-foreground/50 bg-muted/50">
                        <ImagePlus className="h-10 w-10" />
                        <span className="text-sm font-medium">Image preview</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                  </div>
                </div>

                {/* Card preview text */}
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-bold leading-tight">{nameEn || nameRu || nameTj || "Your Listing Title"}</h3>
                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground font-medium">
                    <span className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md"><MapPin className="h-3 w-3" />{location || "City"}</span>
                    <span className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md"><Bed className="h-3 w-3" />{rooms ? `${rooms} rooms` : "Rooms"}</span>
                    <span className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md capitalize"><HomeIcon className="h-3 w-3" />{type || "Type"}</span>
                  </div>
                  {about && <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{about}</p>}
                </div>

                <div className="w-full h-px bg-border my-2" />
                
                {user && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Posting as</span>
                    <span className="font-semibold px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
                      {user.name}
                    </span>
                  </div>
                )}
                
                {/* Action buttons */}
                <div className="flex flex-col gap-2 pt-2">
                  <Button type="submit" form="post-form" disabled={!!saving} className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 font-bold shadow-lg shadow-emerald-600/20 transition-all text-base gap-2">
                    {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Upload className="h-5 w-5" />}
                    {saving ? "Publishing..." : "Publish Listing"}
                  </Button>
                  <Button type="button" variant="ghost" onClick={reset} className="w-full h-10 rounded-xl hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30 transition-colors">
                    Clear Form
                  </Button>
                </div>
              </div>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
};
export default Post;
