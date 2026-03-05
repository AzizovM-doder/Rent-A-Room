import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bed, MapPin, Heart, Star, ArrowRight, Building2, Wifi, Car, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { addUserFav, removeUserFav, isFav } from "../../utils/url";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

const TIER = (p) => p < 30 ? { label: "Budget", cls: "bg-sky-500", color: "text-sky-600" } : p < 70 ? { label: "Mid-range", cls: "bg-emerald-600", color: "text-emerald-600" } : { label: "Premium", cls: "bg-violet-600", color: "text-violet-600" };

const Cards = ({ e, index = 0 }) => {
  const { i18n, t } = useTranslation();
  const lang = (i18n.language || "en").slice(0, 2);

  // Enhanced text extraction with better language fallback
  const getText = (v) => {
    if (!v) return "";
    if (typeof v === "string") return v;
    if (typeof v === "object") {
      // Priority: current language > English > Russian > Tajik > first available
      return v[lang] || v.en || v.ru || v.tj || Object.values(v)[0] || "";
    }
    return String(v);
  };

  const [liked, setLiked] = useState(isFav(e.id));

  const toggleFav = (ev) => {
    ev.preventDefault();
    if (liked) removeUserFav(e.id); else addUserFav(e);
    setLiked((v) => !v);
  };

  const tier = TIER(e.price || 0);

  return (
    <Link to={`/explore/${e.id}`} className="group block" style={{ animationDelay: `${index * 75}ms` }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        whileHover={{ y: -8, transition: { duration: 0.2 } }}
        className="relative rounded-2xl overflow-hidden border bg-card hover:shadow-2xl transition-all duration-300 h-full flex flex-col"
      >
        {/* Image Section */}
        <div className="relative h-56 sm:h-52 overflow-hidden shrink-0 bg-muted">
          {e.image ? (
            <>
              <img 
                src={e.image} 
                alt={getText(e.name)} 
                className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" 
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
            </>
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-linear-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20">
              <Building2 className="h-12 w-12 text-emerald-600/30 dark:text-emerald-400/30" />
            </div>
          )}

          {/* Price badge with tier */}
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            <div className={`rounded-xl px-3 py-1.5 text-xs font-bold text-white ${tier.cls} shadow-lg backdrop-blur-sm`}>
              ${e.price}
              <span className="text-xs opacity-90">/night</span>
            </div>
            <Badge className={`text-xs ${tier.color} bg-white/90 dark:bg-gray-800/90 font-medium`}>
              {tier.label}
            </Badge>
          </div>

          {/* Favourite button */}
          <motion.button 
            type="button" 
            onClick={toggleFav} 
            aria-label="Toggle favourite"
            className="absolute top-3 right-3 h-10 w-10 rounded-full bg-white/90 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center shadow-lg border border-white/20"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Heart className={`h-4 w-4 transition-all ${liked ? "text-rose-500 fill-rose-500" : "text-gray-600 dark:text-gray-400"}`} />
          </motion.button>

          {/* Type and rating at bottom */}
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
            <div className="rounded-lg bg-black/60 backdrop-blur-sm px-3 py-1.5 text-xs text-white font-medium capitalize">
              {getText(e.type)}
            </div>
            <div className="flex items-center gap-1 rounded-lg bg-black/60 backdrop-blur-sm px-3 py-1.5 text-xs text-amber-300">
              <Star className="h-3 w-3 fill-amber-300" />
              <span>4.8</span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4 sm:p-5 flex flex-col gap-3 flex-1">
          {/* Title and Location */}
          <div className="flex-1">
            <h3 className="font-bold text-base sm:text-lg leading-tight line-clamp-2 group-hover:text-emerald-600 transition-colors mb-2">
              {getText(e.name) || "Property Listing"}
            </h3>
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
              <span className="line-clamp-1">{getText(e.location) || "Location"}</span>
            </div>
          </div>

          {/* Features */}
          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded-lg">
              <Bed className="h-3.5 w-3.5" />
              {e.rooms} {t("common.rooms", "rooms")}
            </span>
            {e.wifi && (
              <span className="flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded-lg">
                <Wifi className="h-3.5 w-3.5" />
                {t("common.wifi", "WiFi")}
              </span>
            )}
            {e.parking && (
              <span className="flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded-lg">
                <Car className="h-3.5 w-3.5" />
                {t("common.parking", "Parking")}
              </span>
            )}
            {e.capacity && (
              <span className="flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded-lg">
                <Users className="h-3.5 w-3.5" />
                {e.capacity} {t("common.guests", "guests")}
              </span>
            )}
          </div>

          {/* Price and CTA */}
          <div className="flex items-center justify-between pt-3 border-t">
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1">
                <span className={`text-xl sm:text-2xl font-extrabold ${tier.color}`}>
                  ${e.price}
                </span>
                <span className="text-xs text-muted-foreground">/night</span>
              </div>
              {e.originalPrice && e.originalPrice > e.price && (
                <div className="flex items-center gap-1">
                  <span className="text-xs text-muted-foreground line-through">
                    ${e.originalPrice}
                  </span>
                  <Badge className="text-xs bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400">
                    {Math.round((1 - e.price / e.originalPrice) * 100)}% OFF
                  </Badge>
                </div>
              )}
            </div>
            
            <motion.div
              className="flex items-center gap-1.5 text-sm font-medium text-emerald-600"
              whileHover={{ gap: 2.5 }}
              transition={{ duration: 0.2 }}
            >
              {t("common.explore", "Explore")}
              <ArrowRight className="h-4 w-4" />
            </motion.div>
          </div>
        </div>

        {/* Hover overlay effect */}
        <div className="absolute inset-0 bg-emerald-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl" />
      </motion.div>
    </Link>
  );
};

export default Cards;
