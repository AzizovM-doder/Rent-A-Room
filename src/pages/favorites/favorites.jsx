import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ArrowLeft, MapPin, Bed, Building2 } from "lucide-react";
import { addUserFav, getUserFav, isFav, removeUserFav } from "../../utils/url";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

const Favorites = () => {
  const { i18n, t } = useTranslation();
  const lang = (i18n.language || "en").slice(0, 2);
  const getText = (v) => { if (!v) return ""; if (typeof v === "string") return v; if (typeof v === "object") return v[lang] || v.en || v.ru || v.tj || ""; return String(v); };

  const [favorites, setFavorites] = useState(getUserFav());

  const remove = (item) => {
    removeUserFav(item.id);
    setFavorites(getUserFav());
    toast("Removed from saved");
  };

  return (
    <div className="flex flex-col gap-8 animate-fade-up">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/"><ArrowLeft className="h-5 w-5" /></Link>
        </Button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            {t("favorites.title", "Saved homes")}
            <Badge variant="secondary">{favorites.length}</Badge>
          </h1>
          <p className="text-sm text-muted-foreground">{favorites.length === 0 ? "Start saving homes you like" : `${favorites.length} saved listing${favorites.length !== 1 ? "s" : ""}`}</p>
        </div>
      </div>

      {favorites.length === 0 ? (
        <Card className="rounded-3xl border-dashed">
          <CardContent className="p-14 flex flex-col items-center text-center gap-5">
            <div className="h-20 w-20 rounded-3xl bg-rose-50 dark:bg-rose-950/30 flex items-center justify-center">
              <Heart className="h-10 w-10 text-rose-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold">{t("favorites.emptyTitle", "No saved homes yet")}</h2>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                {t("favorites.emptyDesc", "Tap the heart on any listing to save it here for quick access.")}
              </p>
            </div>
            <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
              <Link to="/">{t("favorites.browseBtn", "Browse homes")}</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-5 md:grid-cols-3 animate-stagger">
          {favorites.map((e, i) => (
            <Link key={e.id} to={`/explore/${e.id}`} className="group block" style={{ animationDelay: `${i * 75}ms` }}>
              <Card className="rounded-2xl overflow-hidden pt-0 border hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-muted shrink-0">
                  {e.image ? (
                    <img src={e.image} alt={getText(e.name)} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <Building2 className="h-10 w-10 text-muted-foreground/30" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  {/* Price */}
                  <div className="absolute bottom-3 left-3 rounded-xl bg-emerald-600 px-2.5 py-1 text-xs font-bold text-white shadow">
                    ${e.price}/night
                  </div>
                  {/* Remove from fav */}
                  <button type="button" onClick={(ev) => { ev.preventDefault(); remove(e); }}
                    className="absolute top-3 right-3 h-9 w-9 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition shadow">
                    <Heart className="h-4 w-4 text-rose-400 fill-rose-400" />
                  </button>
                </div>

                <CardContent className="p-4 flex flex-col gap-2 flex-1">
                  <h3 className="font-bold leading-tight group-hover:text-emerald-600 transition-colors">{getText(e.name) || "Listing"}</h3>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />{getText(e.location)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Bed className="h-3.5 w-3.5" />{e.rooms} {t("common.rooms", "rooms")}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
