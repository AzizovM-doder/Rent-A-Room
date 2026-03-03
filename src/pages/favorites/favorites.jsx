import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ArrowLeft, MapPin, Bed, Building2 } from "lucide-react";
import { addUserFav, getUserFav, isFav, removeUserFav } from "../../utils/url";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const Favorites = () => {
  const { i18n, t } = useTranslation();
  const lang = (i18n.language || "en").slice(0, 2);
  const getText = (v) => { if (!v) return ""; if (typeof v === "string") return v; if (typeof v === "object") return v[lang] || v.en || v.ru || v.tj || ""; return String(v); };

  const [favorites, setFavorites] = useState(getUserFav());

  const remove = (item) => {
    removeUserFav(item.id);
    setFavorites(getUserFav());
    toast(t("favorites.removedToast", "Removed from saved"), { icon: "💔" });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col gap-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      <div className="flex items-center gap-4 border-b border-border/40 pb-6">
        <Button variant="outline" size="icon" className="h-12 w-12 rounded-full hover:bg-emerald-500 hover:text-white transition-colors hover:border-emerald-500 group" asChild>
          <Link to="/"><ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" /></Link>
        </Button>
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight flex items-center gap-3">
            {t("favorites.title", "Saved homes")}
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 text-lg px-3 py-0.5 rounded-full shadow-inner">
              {favorites.length}
            </Badge>
          </h1>
          <p className="text-sm font-medium text-muted-foreground mt-1">
            {favorites.length === 0 ? t("favorites.emptySubtitle", "Start saving homes you like to see them here") : t("favorites.count", "You have {{count}} saved properties waiting for you").replace('{{count}}', favorites.length)}
          </p>
        </div>
      </div>

      {favorites.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 20 }}
          className="w-full mt-4"
        >
          <Card className="rounded-[2rem] border-dashed border-2 border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/50 dark:bg-emerald-950/20 backdrop-blur-xl shadow-xl shadow-emerald-500/5">
            <CardContent className="p-16 flex flex-col items-center text-center gap-6 relative overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-400/10 blur-[60px] rounded-full pointer-events-none" />
              
              <div className="relative">
                <div className="absolute inset-0 bg-rose-400/20 blur-xl rounded-full" />
                <div className="h-24 w-24 rounded-[2rem] bg-white dark:bg-slate-900 flex items-center justify-center shadow-lg border border-rose-100 dark:border-rose-900/50 relative z-10">
                  <Heart className="h-12 w-12 text-rose-500" />
                </div>
              </div>

              <div className="relative z-10">
                <h2 className="text-2xl font-extrabold">{t("favorites.emptyTitle", "No saved homes yet")}</h2>
                <p className="text-base text-muted-foreground mt-2 max-w-sm mx-auto font-medium leading-relaxed">
                  {t("favorites.emptyDesc", "Tap the heart on any listing to save it here for quick access. Your dream space is waiting!")}
                </p>
              </div>

              <Button asChild className="relative z-10 h-14 px-8 rounded-full text-base font-bold bg-emerald-600 hover:bg-emerald-700 shadow-xl shadow-emerald-600/20 hover:-translate-y-1 transition-all">
                <Link to="/">{t("favorites.browseBtn", "Browse listings now")}</Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {favorites.map((e, i) => (
            <motion.div key={e.id} variants={itemVariants} className="h-full">
              <Link to={`/explore/${e.id}`} className="group block h-full">
                <Card className="rounded-3xl overflow-hidden border-border/50 bg-background/60 backdrop-blur-md hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-2 transition-all duration-300 h-full flex flex-col">
                  {/* Image Container */}
                  <div className="relative h-56 overflow-hidden bg-muted shrink-0 w-full">
                    {e.image ? (
                      <img src={e.image} alt={getText(e.name)} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                    ) : (
                      <div className="h-full flex items-center justify-center bg-emerald-50 dark:bg-emerald-950/30">
                        <Building2 className="h-12 w-12 text-emerald-600/30" />
                      </div>
                    )}
                    
                    {/* Inner Shadow Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
                    
                    {/* Price Badge */}
                    <div className="absolute bottom-4 left-4 rounded-xl bg-emerald-500/90 backdrop-blur-md px-3 py-1.5 text-sm font-black text-white shadow-lg border border-white/20">
                      ${e.price} <span className="text-xs font-medium text-white/80 shrink-0">{t("favorites.night", "/ night")}</span>
                    </div>

                    {/* Un-Favorite Button */}
                    <button 
                      type="button" 
                      onClick={(ev) => { ev.preventDefault(); remove(e); }}
                      className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/40 border border-white/30 hover:scale-110 active:scale-95 transition-all shadow-xl z-20"
                    >
                      <Heart className="h-5 w-5 text-rose-500 fill-rose-500 drop-shadow-md" />
                    </button>
                  </div>

                  {/* Content Container */}
                  <CardContent className="p-5 flex flex-col gap-3 flex-1 justify-between">
                    <div>
                      <h3 className="font-bold text-lg leading-tight group-hover:text-emerald-600 transition-colors line-clamp-1">
                        {getText(e.name) || t("favorites.defaultListingName", "Beautiful Listing")}
                      </h3>
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1 line-clamp-1">
                        <MapPin className="h-4 w-4 shrink-0 text-emerald-500/70" />
                        <span className="truncate">{getText(e.location)}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 pt-3 border-t border-border/50">
                      <div className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 bg-muted rounded-md text-foreground/80">
                        <Bed className="h-3.5 w-3.5" />
                        {e.rooms} {e.rooms === 1 ? t("common.room", "room") : t("common.rooms", "rooms")}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default Favorites;
