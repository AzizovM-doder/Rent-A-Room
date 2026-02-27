import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Bed, Home as HomeIcon, ArrowLeft, Heart, Phone, MessageCircle, Share2, Calendar, Clock } from "lucide-react";
import { addUserFav, isFav, removeUserFav } from "../../utils/url";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { fetchListings } from "../../reducers/listingSlice";
import toast from "react-hot-toast";

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

  const toggleFav = () => {
    if (!item) return;
    if (liked) { removeUserFav(item.id); toast("Removed from saved"); }
    else { addUserFav(item); toast.success("Saved!"); }
    setLiked((v) => !v);
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: getText(item?.name), text: `Check out this listing on Rent-A-Room`, url }); }
      catch {}
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    }
  };

  const priceColor = !item ? "" : item.price < 30 ? "bg-sky-500" : item.price < 70 ? "bg-emerald-600" : "bg-violet-600";

  if (loading && items.length === 0) {
    return (
      <div className="flex flex-col gap-6 animate-pulse">
        <div className="skeleton h-10 w-32 rounded-xl" />
        <div className="skeleton h-80 w-full rounded-3xl" />
        <div className="grid md:grid-cols-3 gap-4">
          <div className="skeleton h-32 rounded-2xl" />
          <div className="skeleton h-32 rounded-2xl" />
          <div className="skeleton h-32 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center animate-fade-up">
        <Card className="max-w-md w-full rounded-3xl text-center overflow-hidden pt-0">
          <div className="h-32 bg-gradient-to-br from-emerald-600 to-teal-700" />
          <CardContent className="p-8 flex flex-col items-center gap-4 -mt-10">
            <div className="h-16 w-16 rounded-2xl bg-white shadow-lg flex items-center justify-center">
              <HomeIcon className="h-8 w-8 text-emerald-600" />
            </div>
            <h2 className="text-xl font-bold">{t("info.notFound", "Not found")}</h2>
            <p className="text-sm text-muted-foreground">{t("info.notFoundDesc", "This property does not exist or was removed.")}</p>
            <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
              <Link to="/"><ArrowLeft className="h-4 w-4 mr-2" />{t("info.backHome", "Back to home")}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 animate-fade-up pb-10">
      {/* Back */}
      <Button variant="ghost" asChild className="w-fit text-muted-foreground hover:text-foreground -ml-2">
        <Link to="/"><ArrowLeft className="h-4 w-4 mr-2" />{t("info.back", "Back")}</Link>
      </Button>

      {/* Hero image */}
      <div className="relative h-[420px] rounded-3xl overflow-hidden bg-muted shadow-2xl">
        {item.image ? (
          <img src={item.image} alt={getText(item.name)} onLoad={() => setImgLoaded(true)}
            className={`h-full w-full object-cover transition-all duration-700 ${imgLoaded ? "scale-100 opacity-100" : "scale-105 opacity-0"}`} />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-muted">
            <HomeIcon className="h-20 w-20 text-muted-foreground/20" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        {/* Title overlay */}
        <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-4">
          <div className="text-white">
            <h1 className="text-3xl md:text-4xl font-extrabold drop-shadow-lg leading-tight">{getText(item.name)}</h1>
            <div className="flex items-center gap-1.5 mt-1.5 text-white/80 text-sm">
              <MapPin className="h-4 w-4" /> {getText(item.location)}
            </div>
          </div>
          <div className={`rounded-2xl px-4 py-2 text-white font-bold text-lg shadow-lg shrink-0 ${priceColor}`}>
            ${item.price}<span className="text-xs font-normal">/night</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button onClick={toggleFav} aria-label="Save" className="h-10 w-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition shadow">
            <Heart className={`h-5 w-5 transition ${liked ? "text-rose-400 fill-rose-400" : "text-white"}`} />
          </button>
          <button onClick={handleShare} aria-label="Share" className="h-10 w-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition shadow">
            <Share2 className="h-5 w-5 text-white" />
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: Bed, label: "Rooms", value: item.rooms },
              { icon: HomeIcon, label: "Type", value: getText(item.type) || "—" },
              { icon: Calendar, label: "Available", value: "Now" },
            ].map(({ icon: Icon, label, value }) => (
              <Card key={label} className="rounded-2xl">
                <CardContent className="p-4 flex flex-col items-center gap-1.5 text-center">
                  <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-emerald-600" />
                  </div>
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="font-bold capitalize">{value}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* About — only if real `about` text exists */}
          {item.about ? (
            <Card className="rounded-2xl">
              <CardContent className="p-6 flex flex-col gap-3">
                <h2 className="font-bold text-lg">About this place</h2>
                <p className="text-muted-foreground leading-relaxed">{item.about}</p>
              </CardContent>
            </Card>
          ) : (
            <Card className="rounded-2xl border-dashed">
              <CardContent className="p-6 text-center text-muted-foreground text-sm">
                No description provided for this listing yet.
              </CardContent>
            </Card>
          )}
        </div>

        {/* Booking sidebar */}
        <div className="flex flex-col gap-4">
          <Card className="rounded-2xl shadow-xl border-2 border-emerald-100 dark:border-emerald-900/40 sticky top-24">
            <CardContent className="p-6 flex flex-col gap-5">
              <div>
                <p className="text-3xl font-extrabold text-emerald-600">${item.price}<span className="text-base font-normal text-muted-foreground">/night</span></p>
                <p className="text-xs text-muted-foreground mt-1">{item.rooms} room{item.rooms !== 1 ? "s" : ""} · {getText(item.location)}</p>
              </div>

              <div className="rounded-xl border overflow-hidden divide-y">
                <div className="flex items-center gap-2 p-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Type</p>
                    <p className="text-sm font-medium capitalize">{getText(item.type) || "—"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Availability</p>
                    <p className="text-sm font-medium text-emerald-600">Available now</p>
                  </div>
                </div>
              </div>

              <Link to={`/massage/${id}`} className="block">
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 gap-2 h-11 shadow-lg shadow-emerald-600/25">
                  <MessageCircle className="h-4 w-4" /> {t("info.messageOwner", "Book / Message owner")}
                </Button>
              </Link>

              <Button variant="outline" className="w-full gap-2 h-11" onClick={handleShare}>
                <Share2 className="h-4 w-4" /> Share listing
              </Button>

              <Button variant="ghost" onClick={toggleFav} className="w-full gap-2">
                <Heart className={`h-4 w-4 ${liked ? "text-rose-500 fill-rose-500" : ""}`} />
                {liked ? t("info.saved", "Saved") : t("info.save", "Save")}
              </Button>

              <p className="text-xs text-center text-muted-foreground">You won't be charged yet</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Info;
