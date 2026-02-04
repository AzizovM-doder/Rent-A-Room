import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Bed,
  Home as HomeIcon,
  ArrowLeft,
  Heart,
  Phone,
  MessageCircle,
} from "lucide-react";
import { addUserFav, isFav, removeUserFav } from "../../utils/url";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { fetchListings } from "../../reducers/listingSlice";

const Info = () => {
  const { i18n, t } = useTranslation();
  const lang = (i18n.language || "en").slice(0, 2);

  const getText = (v) => {
    if (!v) return "";
    if (typeof v === "string") return v;
    if (typeof v === "object") return v[lang] || v.en || v.ru || v.tj || "";
    return String(v);
  };

  const dispatch = useDispatch();
  const { items = [] } = useSelector((s) => s.listings || {});
  const { id } = useParams();

  useEffect(() => {
    dispatch(fetchListings());
  }, [dispatch]);

  const item = (items || []).find((e) => String(e.id) === String(id));

  const [liked, setLiked] = useState(() => isFav(id));

  useEffect(() => {
    setLiked(isFav(id));
  }, [id]);

  const toggleFav = () => {
    if (!item) return;
    if (liked) {
      removeUserFav(item.id);
    } else {
      addUserFav(item);
    }
    setLiked((v) => !v);
  };

  if (!item) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="p-10 flex flex-col items-center gap-4 text-center">
            <div className="h-12 w-12 rounded-full bg-emerald-600/10 flex items-center justify-center">
              <HomeIcon className="h-6 w-6 text-emerald-600" />
            </div>
            <h2 className="text-xl font-semibold">
              {t("info.notFound", "Not found")}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t(
                "info.notFoundDesc",
                "This property does not exist or was removed.",
              )}
            </p>
            <Button
              asChild
              className="bg-emerald-600 hover:bg-emerald-700 px-5"
            >
              <Link to="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t("info.backHome", "Back to home")}
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      <Button variant="ghost" asChild className="w-fit text-muted-foreground">
        <Link to="/">
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t("info.back", "Back")}
        </Link>
      </Button>

      <Card className="overflow-hidden pt-0 rounded-2xl">
        <div className="h-95 w-full overflow-hidden relative">
          <img
            src={item.image}
            alt={getText(item.name)}
            className="h-full w-full object-cover"
          />

          <button
            type="button"
            onClick={toggleFav}
            className="absolute top-4 right-4 h-10 w-10 rounded-full bg-background/80 backdrop-blur flex items-center justify-center hover:scale-105 transition"
          >
            <Heart
              className={`h-5 w-5 ${
                liked
                  ? "text-emerald-600 fill-emerald-600"
                  : "text-muted-foreground"
              }`}
            />
          </button>
        </div>

        <CardContent className="p-6 flex flex-col gap-5">
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-3xl font-bold">{getText(item.name)}</h1>
            <Badge className="bg-emerald-600">
              ${item.price} / {t("common.night", "night")}
            </Badge>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {getText(item.location)}
            </span>
            <span className="flex items-center gap-1">
              <Bed className="h-4 w-4" />
              {item.rooms} {t("common.rooms", "rooms")}
            </span>
            <span className="flex items-center gap-1 capitalize">
              <HomeIcon className="h-4 w-4" />
              {getText(item.type)}
            </span>
          </div>

          <div className="rounded-2xl border p-5 text-muted-foreground">
            {t("info.descBeforeType", "Comfortable")} {getText(item.type)}{" "}
            {t("info.descBetween", "located in")} {getText(item.location)}.{" "}
            {t("info.descAfter", "Perfect for short or long stays with")}{" "}
            {item.rooms} {t("common.rooms", "rooms")}.
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link to={`/massage/${id}`}>
              <Button className="bg-emerald-600 hover:bg-emerald-700 gap-2">
                <MessageCircle className="h-4 w-4" />
                {t("info.messageOwner", "Message owner")}
              </Button>
            </Link>

            <Button variant="outline" className="gap-2">
              <Phone className="h-4 w-4" />
              {t("info.call", "Call")}
            </Button>

            <Button variant="outline" onClick={toggleFav} className="gap-2">
              {liked ? (
                <Heart className="h-4 text-emerald-500 fill-emerald-500 w-4" />
              ) : (
                <Heart className="h-4 w-4" />
              )}{" "}
              {liked ? t("info.saved", "Saved") : t("info.save", "Save")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Info;
