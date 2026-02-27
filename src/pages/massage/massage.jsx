import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MapPin, Bed, Home as HomeIcon, ArrowLeft, ShieldCheck, Send, Loader2, CheckCircle, Building2, DollarSign } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getUserToken } from "../../utils/url";
import { Label } from "@/components/ui/label";
import { useDispatch, useSelector } from "react-redux";
import { fetchListings } from "../../reducers/listingSlice";
import { messagesApi } from "../../api/listingsAPI";
import toast from "react-hot-toast";

const Message = () => {
  const { i18n, t } = useTranslation();
  const lang = (i18n.language || "en").slice(0, 2);
  const dispatch = useDispatch();
  const { items = [] } = useSelector((s) => s.listings || {});
  const { id } = useParams();

  const user = (() => { try { return JSON.parse(getUserToken()); } catch { return null; } })();

  useEffect(() => { dispatch(fetchListings()); }, [dispatch]);

  const getText = (v) => { if (!v) return ""; if (typeof v === "string") return v; if (typeof v === "object") return v[lang] || v.en || v.ru || v.tj || ""; return String(v); };
  const item = items.find((e) => String(e.id) === id);

  const [days, setDays] = useState(3);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const totalCost = item ? item.price * Math.max(days, 1) : 0;

  const submitRequest = async (ev) => {
    ev.preventDefault();
    const fd = new FormData(ev.target);
    const data = {
      listingId: Number(id),
      userId: user?.id || null,
      name: fd.get("reqName"),
      phone: fd.get("phone"),
      message: fd.get("message"),
      days: Number(fd.get("days")),
    };
    if (!data.name || !data.phone || !data.message) {
      toast.error("Please fill all fields");
      return;
    }
    setSending(true);
    try {
      await messagesApi.send(data);
      setSent(true);
    } catch (err) {
      toast.error(err.message || "Failed to send");
    } finally {
      setSending(false);
    }
  };

  if (!item) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4 animate-fade-up">
        <Card className="max-w-md w-full rounded-3xl text-center overflow-hidden pt-0">
          <div className="h-28 bg-gradient-to-br from-emerald-600 to-teal-700" />
          <CardContent className="p-8 flex flex-col items-center gap-4 -mt-8">
            <div className="h-14 w-14 rounded-2xl bg-white shadow-lg flex items-center justify-center">
              <HomeIcon className="h-7 w-7 text-emerald-600" />
            </div>
            <h2 className="text-lg font-bold">{t("message.notFound", "Not found")}</h2>
            <p className="text-sm text-muted-foreground">{t("message.notFoundDesc", "This listing does not exist.")}</p>
            <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
              <Link to="/"><ArrowLeft className="h-4 w-4 mr-2" />{t("message.backHome", "Back to home")}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (sent) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4 animate-scale-in">
        <Card className="max-w-md w-full rounded-3xl text-center overflow-hidden pt-0">
          <div className="h-28 bg-gradient-to-br from-emerald-600 to-teal-700" />
          <CardContent className="p-8 flex flex-col items-center gap-4 -mt-8">
            <div className="h-16 w-16 rounded-2xl bg-white shadow-lg flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-emerald-600" />
            </div>
            <h2 className="text-xl font-bold">Message sent!</h2>
            <p className="text-sm text-muted-foreground">The property owner will get back to you soon.</p>
            <div className="rounded-xl border p-3 w-full text-left">
              <p className="text-xs text-muted-foreground">Listing</p>
              <p className="text-sm font-medium">{getText(item.name)} — ${totalCost} for {days} night{days !== 1 ? "s" : ""}</p>
            </div>
            <div className="flex gap-3 w-full">
              <Button asChild variant="outline" className="flex-1">
                <Link to={`/explore/${item.id}`}>View listing</Link>
              </Button>
              <Button asChild className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                <Link to="/">Browse more</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-up">
      <Button variant="ghost" asChild className="w-fit text-muted-foreground hover:text-foreground -ml-2">
        <Link to={`/explore/${item.id}`}><ArrowLeft className="h-4 w-4 mr-2" />{t("message.back", "Back to listing")}</Link>
      </Button>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Listing summary */}
        <Card className="rounded-2xl pt-0 overflow-hidden h-fit">
          <div className="relative h-56 w-full bg-muted">
            {item.image ? (
              <img src={item.image} alt={getText(item.name)} className="h-full w-full object-cover" />
            ) : (
              <div className="h-full flex items-center justify-center"><Building2 className="h-12 w-12 text-muted-foreground/20" /></div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute left-4 right-4 bottom-4 flex items-end justify-between gap-3">
              <div>
                <p className="text-white text-xl font-bold leading-tight">{getText(item.name)}</p>
                <div className="flex flex-wrap items-center gap-2 text-xs text-white/80 mt-1">
                  <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{getText(item.location)}</span>
                  <span className="flex items-center gap-1"><Bed className="h-3.5 w-3.5" />{item.rooms} rooms</span>
                  <span className="flex items-center gap-1 capitalize"><HomeIcon className="h-3.5 w-3.5" />{getText(item.type)}</span>
                </div>
              </div>
              <Badge className="bg-emerald-600 hover:bg-emerald-600 shrink-0 shadow">${item.price}/night</Badge>
            </div>
          </div>
          <CardContent className="p-5 flex flex-col gap-4">
            <div className="rounded-xl border p-4 flex items-center justify-between gap-3 bg-emerald-50 dark:bg-emerald-950/30">
              <div>
                <p className="text-sm font-semibold">{t("message.ownerStatus", "Owner status")}</p>
                <p className="text-xs text-muted-foreground">{t("message.ownerStatusDesc", "Verified listing, quick response.")}</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-emerald-600/10 flex items-center justify-center shrink-0">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
              </div>
            </div>

            {/* Live cost calculator */}
            <div className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-white/70">Estimated total</p>
                  <p className="text-2xl font-extrabold">${totalCost}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-white/70">${item.price} × {days} night{days !== 1 ? "s" : ""}</p>
                  <DollarSign className="h-8 w-8 text-white/30 ml-auto" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Booking form */}
        <Card className="rounded-2xl pt-0 overflow-hidden">
          <div className="relative border-b p-6 bg-gradient-to-r from-emerald-600 to-teal-600">
            <p className="text-xl font-bold text-white">{t("message.sendTitle", "Book this place")}</p>
            <p className="text-sm text-white/80">{t("message.sendDesc", "Send a message to the owner.")}</p>
          </div>
          <CardContent className="p-6">
            <form onSubmit={submitRequest} className="flex flex-col gap-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <Label>{t("message.yourName", "Your name")} *</Label>
                  <Input name="reqName" required defaultValue={user?.name || ""} placeholder="Your name" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>{t("message.yourPhone", "Phone number")} *</Label>
                  <Input name="phone" required defaultValue={user?.phone || ""} placeholder="+992 ..." />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label>{t("message.yourMessage", "Message")} *</Label>
                <textarea name="message" required
                  placeholder={t("message.yourMessage", "Tell the owner what you need...")}
                  className="min-h-28 w-full rounded-xl border bg-transparent px-3 py-2.5 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] resize-none transition"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label>How many nights? (min 1)</Label>
                <Input name="days" type="number" required value={days} onChange={(e) => setDays(Math.max(1, Number(e.target.value)))} min={1} />
              </div>

              <div className="rounded-xl border p-3 bg-muted/30 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Total estimate</p>
                  <p className="text-xs text-muted-foreground">${item.price} × {days} night{days !== 1 ? "s" : ""}</p>
                </div>
                <p className="text-emerald-600 font-extrabold text-xl">${totalCost}</p>
              </div>

              <Button type="submit" disabled={sending} className="bg-emerald-600 hover:bg-emerald-700 gap-2 h-11 shadow-lg shadow-emerald-600/20">
                {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {sending ? "Sending..." : t("message.sendBtn", "Send message")}
              </Button>
              <p className="text-xs text-muted-foreground text-center">{t("message.respect", "By sending, you agree to communicate respectfully.")}</p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Message;
