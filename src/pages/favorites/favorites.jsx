import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ArrowLeft, MapPin, Bed, HomeIcon } from "lucide-react";
import { addUserFav, getUserFav, isFav, removeUserFav } from "../../utils/url";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const Favorites = () => {
  const { i18n, t } = useTranslation();
  const lang = (i18n.language || "en").slice(0, 2);

  const getText = (v) => {
    if (!v) return "";
    if (typeof v === "string") return v;
    if (typeof v === "object") return v[lang] || v.en || v.ru || v.tj || "";
    return String(v);
  };

  const [favorites, setFavorites] = useState(getUserFav());

  const toggleFav = (item) => {
    if (isFav(item.id)) {
      removeUserFav(item.id);
    } else {
      addUserFav(item);
    }
    setFavorites(getUserFav());
  };

  return (
    <div className="min-h-[75vh] px-4 py-10">
      <div className="mx-auto max-w-6xl flex flex-col gap-8">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/profile">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold">
            {t("favorites.title", "Favorites")}
          </h1>
          <Badge variant="secondary">{favorites.length}</Badge>
        </div>

        {favorites.length === 0 ? (
          <Card className="rounded-2xl">
            <CardContent className="p-12 flex flex-col items-center text-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-emerald-600/10 flex items-center justify-center">
                <Heart className="h-7 w-7 text-emerald-600" />
              </div>
              <h2 className="text-lg font-semibold">
                {t("favorites.emptyTitle", "No favorites yet")}
              </h2>
              <p className="text-sm text-muted-foreground max-w-sm">
                {t(
                  "favorites.emptyDesc",
                  "Save homes you like and they’ll appear here for quick access."
                )}
              </p>
              <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
                <Link to="/">{t("favorites.browseBtn", "Browse homes")}</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {favorites.map((e) => (
              <Card
                key={e.id}
                className="rounded-2xl overflow-hidden hover:shadow-md pt-0 hover:scale-[1.02] transition"
              >
                <div className="h-48 w-full relative">
                  <img
                    src={e.image}
                    alt={getText(e.name)}
                    className="h-full w-full object-cover"
                  />

                  <button
                    type="button"
                    onClick={() => toggleFav(e)}
                    className="absolute top-3 right-3 h-9 w-9 rounded-full bg-background/80 backdrop-blur flex items-center justify-center hover:scale-105 transition"
                  >
                    <Heart
                      className={`h-5 w-5 transition ${
                        isFav(e.id)
                          ? "text-emerald-600 fill-emerald-600"
                          : "text-muted-foreground"
                      }`}
                    />
                  </button>
                </div>

                <CardContent className="p-5 pb-0 flex flex-col gap-2">
                  <h3 className="font-semibold">{getText(e.name)}</h3>

                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {getText(e.location)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Bed className="h-4 w-4" />
                      {e.rooms} {t("common.rooms", "rooms")}
                    </span>
                    <span className="flex items-center gap-1 capitalize">
                      <HomeIcon className="h-4 w-4" />
                      {getText(e.type)}
                    </span>
                  </div>

                  <div className="flex w-full justify-between items-center">
                    <span className="font-medium text-emerald-600">
                      ${e.price} / {t("common.night", "night")}
                    </span>
                    <Link to={`/explore/${e.id}`}>
                      <Button className="bg-emerald-500 hover:bg-emerald-600">
                        {t("common.explore", "EXPLORE")}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
