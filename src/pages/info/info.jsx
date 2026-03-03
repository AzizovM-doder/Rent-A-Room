import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Bed, Home as HomeIcon, ArrowLeft, Heart, Share2, Calendar, Clock, Star, Map, ShieldCheck, CheckCircle2, MessageCircle } from "lucide-react";
import { addUserFav, isFav, removeUserFav } from "../../utils/url";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { fetchListings } from "../../reducers/listingSlice";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const Info = () => {
  const { i18n, t } = useTranslation();
  const lang = (i18n.language || "en").slice(0, 2);
  const getText = (v) => { if (!v) return ""; if (typeof v === "string") return v; if (typeof v === "object") return v[lang] || v.en || v.ru || v.tj || ""; return String(v); };

  const dispatch = useDispatch();
  const { items = [], loading } = useSelector((s) => s.listings || {});
  const { id } = useParams();

  useEffect(() => { dispatch(fetchListings()); }, [dispatch]);

  const item = (items || []).find((e) => String(e.id) === String(id));
  const [liked, setLiked] = useState(() => isFav(id));
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => { setLiked(isFav(id)); }, [id]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const toggleFav = () => {
    if (!item) return;
    if (liked) { removeUserFav(item.id); toast(t("info.removedToast", "Removed from saved"), { icon: "💔" }); }
    else { addUserFav(item); toast.success(t("info.savedToast", "Saved to favorites!")); }
    setLiked((v) => !v);
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: getText(item?.name), text: t("info.shareText", "Check out this incredible listing on Rent.A.Room"), url }); }
      catch {}
    } else {
      await navigator.clipboard.writeText(url);
      toast.success(t("info.copiedToast", "Link copied to clipboard!"));
    }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
  };

  if (loading && items.length === 0) {
    return (
      <div className="flex flex-col gap-8 max-w-7xl mx-auto px-4 md:px-8 py-10 animate-pulse">
        <div className="skeleton h-8 w-40 rounded-xl" />
        <div className="skeleton h-[50vh] w-full rounded-[2rem]" />
        <div className="grid lg:grid-cols-3 gap-12 mt-8">
           <div className="lg:col-span-2 space-y-6">
              <div className="skeleton h-12 w-3/4 rounded-xl" />
              <div className="skeleton h-32 rounded-2xl" />
              <div className="skeleton h-64 rounded-2xl" />
           </div>
           <div className="skeleton h-[400px] rounded-3xl" />
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 animate-fade-up">
        <Card className="max-w-md w-full rounded-[2.5rem] text-center overflow-hidden border-0 shadow-2xl bg-background/80 backdrop-blur-xl">
          <div className="h-40 bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-900 w-full relative">
             <div className="absolute inset-0 bg-white/5 backdrop-blur-3xl" />
          </div>
          <CardContent className="p-10 flex flex-col items-center gap-5 -mt-16 relative z-10">
            <div className="h-24 w-24 rounded-[2rem] bg-white dark:bg-slate-900 shadow-2xl flex items-center justify-center border-4 border-background">
              <HomeIcon className="h-10 w-10 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-2xl font-black mb-2">{t("info.notFound", "Listing Unavailable")}</h2>
              <p className="text-muted-foreground font-medium">{t("info.notFoundDesc", "This property does not exist, has been removed by the host, or is currently private.")}</p>
            </div>
            <Button asChild className="mt-4 h-14 w-full rounded-2xl bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/20 text-base font-bold">
              <Link to="/"><ArrowLeft className="h-5 w-5 mr-2" />{t("info.returnDiscover", "Return to Discover")}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32">
      
      {/* ── Top Nav ───────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
        <Button variant="ghost" asChild className="hover:bg-muted text-muted-foreground hover:text-foreground group h-10 px-3 -ml-3">
          <Link to="/"><ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />{t("info.back", "Back to listings")}</Link>
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleShare} className="rounded-full shadow-sm hover:border-emerald-500 hover:text-emerald-600 transition-colors">
            <Share2 className="h-4 w-4 mr-2" /> {t("info.share", "Share")}
          </Button>
          <Button variant="outline" size="sm" onClick={toggleFav} className="rounded-full shadow-sm hover:border-rose-300 transition-colors group">
            <Heart className={`h-4 w-4 mr-2 transition-transform group-active:scale-75 ${liked ? "text-rose-500 fill-rose-500" : "group-hover:text-rose-400"}`} />
            {liked ? t("info.saved", 'Saved') : t("info.save", 'Save')}
          </Button>
        </div>
      </motion.div>

      {/* ── Title Area ───────────────────────────────────────── */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="mb-8">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-[1.1] mb-4">{getText(item.name)}</h1>
        <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-sm font-medium text-muted-foreground">
          <span className="flex items-center gap-1.5 text-foreground/90">
             <Star className="h-4 w-4 fill-amber-400 text-amber-400" /> 4.98 <span className="text-muted-foreground underline ml-1 cursor-pointer">(124 {t("info.reviews", "reviews")})</span>
          </span>
          <span className="hidden sm:inline text-border">•</span>
          <span className="flex items-center gap-1.5">
             <ShieldCheck className="h-4 w-4 text-emerald-500" /> {t("info.superhost", "Superhost")}
          </span>
          <span className="hidden sm:inline text-border">•</span>
          <span className="flex items-center gap-1.5 underline cursor-pointer hover:text-foreground transition-colors">
            <MapPin className="h-4 w-4" /> {getText(item.location)}
          </span>
        </div>
      </motion.div>

      {/* ── Massive Image Gallery (Bento Style) ───────────────────────────────────────── */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative h-[40vh] min-h-[300px] md:h-[60vh] md:min-h-[500px] rounded-[2rem] overflow-hidden bg-muted shadow-2xl mb-12 group"
      >
        {item.image ? (
          <img 
            src={item.image} 
            alt={getText(item.name)} 
            onLoad={() => setImgLoaded(true)}
            className={`w-full h-full object-cover transition-all duration-[1.5s] ease-out ${imgLoaded ? "scale-100 opacity-100 filter-none" : "scale-110 opacity-0 blur-md"}`} 
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-emerald-50 dark:bg-emerald-950/20">
            <HomeIcon className="h-24 w-24 text-emerald-600/20" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <Button variant="secondary" className="absolute bottom-6 right-6 rounded-full shadow-xl bg-white/90 hover:bg-white text-black font-bold border-0 backdrop-blur-md opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
           <Map className="h-4 w-4 mr-2" /> {t("info.showMap", "Show Map")}
        </Button>
      </motion.div>

      {/* ── Content Split ───────────────────────────────────────── */}
      <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 relative">
        
        {/* Left Column (Details) */}
        <div className="lg:col-span-8 flex flex-col gap-10">
          
          {/* Host Info */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="flex items-center justify-between pb-8 border-b border-border/50">
            <div>
              <h2 className="text-2xl font-extrabold mb-1">{t("info.entire", "Entire")} {getText(item.type) || t("info.home", "home")} {t("info.hostedBy", "hosted by")} Rent.A.Room</h2>
              <p className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
                {item.rooms} {t("info.beds", "beds")} <span className="text-border">•</span> 1 {t("info.bath", "bath")} <span className="text-border">•</span> {t("info.fastWifi", "Fast Wifi")}
              </p>
            </div>
            <div className="h-16 w-16 rounded-full bg-slate-900 border-2 border-emerald-500 flex items-center justify-center shrink-0 shadow-xl overflow-hidden relative">
               <div className="absolute inset-0 bg-emerald-500 text-white flex items-center justify-center font-black text-2xl">R</div>
            </div>
          </motion.div>

          {/* Quick Perks */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="flex flex-col gap-6 py-4">
             <div className="flex gap-4">
                <div className="mt-1"><HomeIcon className="h-7 w-7 text-foreground/80" /></div>
                <div>
                   <h3 className="font-bold text-lg leading-none mb-1">{t("info.perks.entirePlace.title", "Entire place")}</h3>
                   <p className="text-muted-foreground text-sm">{t("info.perks.entirePlace.desc", "You'll have the space to yourself.")}</p>
                </div>
             </div>
             <div className="flex gap-4">
                <div className="mt-1"><CheckCircle2 className="h-7 w-7 text-foreground/80" /></div>
                <div>
                   <h3 className="font-bold text-lg leading-none mb-1">{t("info.perks.clean.title", "Enhanced Clean")}</h3>
                   <p className="text-muted-foreground text-sm">{t("info.perks.clean.desc", "This Host committed to a 5-step enhanced cleaning process.")}</p>
                </div>
             </div>
             <div className="flex gap-4">
                <div className="mt-1"><Calendar className="h-7 w-7 text-foreground/80" /></div>
                <div>
                   <h3 className="font-bold text-lg leading-none mb-1">{t("info.perks.cancel.title", "Free cancellation for 48 hours")}</h3>
                   <p className="text-muted-foreground text-sm">{t("info.perks.cancel.desc", "Lock in this price and cancel without penalty.")}</p>
                </div>
             </div>
          </motion.div>

          <div className="h-px w-full bg-border/50" />

          {/* About description */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}>
            <h2 className="text-2xl font-extrabold mb-4">{t("info.aboutTitle", "About this space")}</h2>
            <div className="prose prose-emerald dark:prose-invert max-w-none">
              {item.about ? (
                <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed text-[15px] font-medium">{item.about}</p>
              ) : (
                <p className="text-muted-foreground italic bg-muted/50 p-6 rounded-2xl border border-dashed border-border">{t("info.noDesc", "The host hasn't provided a detailed description yet.")}</p>
              )}
            </div>
          </motion.div>

        </div>

        {/* Right Column (Sticky Booking Sidebar) */}
        <div className="lg:col-span-4 select-none">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.8, type: "spring", stiffness: 100 }}
            className="sticky top-28" // Magic class for smooth sticky scrolling
          >
             <Card className="rounded-[2rem] border-border/50 shadow-2xl shadow-emerald-500/5 bg-background/80 backdrop-blur-xl overflow-hidden p-[2px]">
               <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-transparent to-transparent opacity-50" />
               <CardContent className="p-6 sm:p-8 flex flex-col gap-6 relative z-10 bg-background rounded-[calc(2rem-2px)] h-full">
                 
                 {/* Price Header */}
                 <div className="flex items-end justify-between">
                    <div>
                      <span className="text-3xl font-black text-foreground">${item.price}</span>
                      <span className="text-base font-medium text-muted-foreground ml-1">{t("info.night", "night")}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm font-bold">
                       <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                       4.98
                    </div>
                 </div>

                 {/* Mock Inputs container */}
                 <div className="rounded-2xl border border-border/60 overflow-hidden text-sm">
                   <div className="flex divide-x border-b border-border/60">
                     <div className="flex-1 p-3 hover:bg-muted/30 cursor-pointer transition-colors">
                       <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 mb-0.5">{t("info.checkIn", "Check-in")}</p>
                       <p className="font-medium">{t("info.addDate", "Add date")}</p>
                     </div>
                     <div className="flex-1 p-3 hover:bg-muted/30 cursor-pointer transition-colors">
                       <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 mb-0.5">{t("info.checkout", "Checkout")}</p>
                       <p className="font-medium">{t("info.addDate", "Add date")}</p>
                     </div>
                   </div>
                   <div className="p-3 hover:bg-muted/30 cursor-pointer transition-colors flex justify-between items-center">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 mb-0.5">{t("info.guests", "Guests")}</p>
                        <p className="font-medium">1 {t("info.guest", "guest")}</p>
                      </div>
                      <ArrowLeft className="h-4 w-4 -rotate-90 text-muted-foreground" />
                   </div>
                 </div>

                 {/* Action Buttons */}
                 <div className="flex flex-col gap-3">
                   <Button asChild className="w-full h-14 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-bold text-lg shadow-[0_8px_30px_rgb(16,185,129,0.3)] hover:shadow-[0_8px_30px_rgb(16,185,129,0.5)] transition-all hover:-translate-y-0.5 border-0">
                     <Link to={`/massage/${id}`}>{t("info.reserveBtn", "Reserve Space")}</Link>
                   </Button>
                   <p className="text-center text-xs text-muted-foreground font-medium mt-1">{t("info.noChargeMsg", "You won't be charged yet")}</p>
                 </div>

                 <div className="h-px bg-border/50 my-2" />

                 {/* Total mock math */}
                 <div className="flex flex-col gap-3 text-sm font-medium text-muted-foreground">
                    <div className="flex justify-between items-center">
                      <span className="underline"> ${item.price} x 5 {t("info.nights", "nights")}</span>
                      <span>${item.price * 5}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="underline">{t("info.cleaningFee", "Cleaning fee")}</span>
                      <span>$45</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="underline">{t("info.serviceFee", "Service fee")}</span>
                      <span>$70</span>
                    </div>
                 </div>

                 <div className="h-px bg-border/50" />

                 <div className="flex justify-between items-center font-black text-foreground text-lg">
                    <span>{t("info.totalBeforeTaxes", "Total before taxes")}</span>
                    <span>${(item.price * 5) + 45 + 70}</span>
                 </div>

               </CardContent>
             </Card>

             <div className="flex justify-center mt-6">
               <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm font-medium transition-colors">
                 <ShieldCheck className="h-4 w-4" />
                 {t("info.report", "Report this listing")}
               </button>
             </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
};

export default Info;
