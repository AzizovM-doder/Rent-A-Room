import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bed, MapPin, Heart, Star, ArrowRight, Building2 } from "lucide-react";
import { Link } from "react-router-dom";
import { addUserFav, removeUserFav, isFav } from "../../utils/url";
import { useTranslation } from "react-i18next";

const TIER = (p) => p < 30 ? { label: "Budget", cls: "bg-sky-500" } : p < 70 ? { label: "Mid-range", cls: "bg-emerald-600" } : { label: "Premium", cls: "bg-violet-600" };

const Cards = ({ e, index = 0 }) => {
  const { i18n, t } = useTranslation();
  const lang = (i18n.language || "en").slice(0, 2);

  const getText = (v) => {
    if (!v) return "";
    if (typeof v === "string") return v;
    if (typeof v === "object") return v[lang] || v.en || v.ru || v.tj || "";
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
      <div className="relative rounded-2xl overflow-hidden border bg-card hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 h-full flex flex-col">

        {/* Image */}
        <div className="relative h-52 overflow-hidden shrink-0 bg-muted">
          {e.image ? (
            <img src={e.image} alt={getText(e.name)} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              <Building2 className="h-10 w-10 text-muted-foreground/30" />
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Price tier badge */}
          <div className={`absolute top-3 left-3 rounded-xl px-2.5 py-1 text-xs font-bold text-white ${tier.cls} shadow-lg`}>
            ${e.price}/night
          </div>

          {/* Favourite button */}
          <button type="button" onClick={toggleFav} aria-label="Toggle favourite"
            className="absolute top-3 right-3 h-9 w-9 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition shadow-md">
            <Heart className={`h-4 w-4 transition ${liked ? "text-rose-400 fill-rose-400" : "text-white"}`} />
          </button>

          {/* Type tag at bottom */}
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
            <div className="rounded-lg bg-black/40 backdrop-blur-sm px-2 py-0.5 text-xs text-white capitalize">
              {getText(e.type)}
            </div>
            <div className="flex items-center gap-1 rounded-lg bg-black/40 backdrop-blur-sm px-2 py-0.5 text-xs text-amber-300">
              <Star className="h-3 w-3 fill-amber-300" /> 4.8
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-4 flex flex-col gap-3 flex-1">
          <div>
            <h3 className="font-bold text-base leading-tight line-clamp-1 group-hover:text-emerald-600 transition-colors">
              {getText(e.name) || "Listing"}
            </h3>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{getText(e.location) || "Location"}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Bed className="h-3.5 w-3.5" />
              {e.rooms} {t("common.rooms", "rooms")}
            </span>
            <Badge variant="secondary" className="text-xs">{tier.label}</Badge>
          </div>

          <div className="mt-auto flex items-center justify-between pt-3 border-t">
            <div>
              <span className="text-lg font-extrabold text-emerald-600">${e.price}</span>
              <span className="text-xs text-muted-foreground">/night</span>
            </div>
            <div className="flex items-center gap-1 text-xs font-medium text-emerald-600 group-hover:gap-2 transition-all">
              {t("common.explore", "Explore")} <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Cards;
