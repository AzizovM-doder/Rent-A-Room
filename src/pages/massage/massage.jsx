import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
// import { baseData } from "../../data/base/baseData";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Bed,
  Home as HomeIcon,
  ArrowLeft,
  MessageCircle,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { getUserToken } from "../../utils/url";
import { Label } from "@/components/ui/label";
import { useDispatch, useSelector } from "react-redux";
import { fetchListings } from "../../reducers/listingSlice";

const Message = () => {
  const { i18n, t } = useTranslation();
  const lang = (i18n.language || "en").slice(0, 2);

  const dispatch = useDispatch();
  const { items = [] } = useSelector((s) => s.listings || {});
  const baseData = [...items];
  useEffect(() => {
    dispatch(fetchListings());
  }, []);
  const user = JSON.parse(getUserToken());
  const getText = (v) => {
    if (!v) return "";
    if (typeof v === "string") return v;
    if (typeof v === "object") return v[lang] || v.en || v.ru || v.tj || "";
    return String(v);
  };

  const { id } = useParams();
  const item = baseData.find((e) => String(e.id) === id);

  const submitRequest = async (ev) => {
    ev.preventDefault();

    const data = {
      name: ev.target.name.value,
      phone: ev.target.phone.value,
      message: ev.target.message.value,
      days: ev.target.days.value,
    };

    const token = "8288912810:AAF4ccMayE1GQj6IVji9bQ5YhquyKMDvIrQ";
    const chatId = "8030302693";

    try {
      const request = `New request:
Name: ${data.name}
Number: ${data.phone}
House id : ${item.id}
Requested house: ${getText(item?.name)}
Per night: $${item?.price}
Requested days: ${data.days}
Message: ${data.message}`;

      await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
        chat_id: chatId,
        text: request,
      });

      ev.target.reset();
      return true;
    } catch (error) {
      console.log("Error sending message:", error);
      return false;
    }
  };

  if (!item) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <Card className="max-w-md w-full rounded-2xl">
          <CardContent className="p-10 text-center flex flex-col gap-3">
            <p className="text-lg font-semibold">
              {t("message.notFound", "Not found")}
            </p>
            <p className="text-sm text-muted-foreground">
              {t("message.notFoundDesc", "This listing does not exist.")}
            </p>
            <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
              <Link to="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t("message.backHome", "Back to home")}
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  return (
    <div className="min-h-[70vh] px-4 py-8">
      <div className="mx-auto max-w-6xl flex flex-col gap-6">
        <Button variant="ghost" asChild className="w-fit">
          <Link to={`/explore/${item.id}`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("message.back", "Back")}
          </Link>
        </Button>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="rounded-2xl pt-0 overflow-hidden">
            <div className="relative h-64 w-full">
              <img
                src={item.image}
                alt={getText(item.name)}
                className="h-full w-full object-cover"
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.55), rgba(0,0,0,0.15), transparent)",
                }}
              />
              <div className="absolute left-4 right-4 bottom-4 flex items-end justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <p className="text-white text-xl font-semibold leading-tight">
                    {getText(item.name)}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-white/80">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {getText(item.location)}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Bed className="h-3.5 w-3.5" />
                      {item.rooms} {t("common.rooms", "rooms")}
                    </span>
                    <span className="inline-flex items-center gap-1 capitalize">
                      <HomeIcon className="h-3.5 w-3.5" />
                      {getText(item.type)}
                    </span>
                  </div>
                </div>

                <Badge className="bg-emerald-600 hover:bg-emerald-600 h-fit">
                  ${item.price} / {t("common.night", "night")}
                </Badge>
              </div>
            </div>

            <CardContent className="p-5 flex flex-col gap-4">
              <div className="rounded-2xl border p-4 flex items-start justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-semibold">
                    {t("message.ownerStatus", "Owner status")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t(
                      "message.ownerStatusDesc",
                      "Verified listing, quick response.",
                    )}
                  </p>
                </div>
                <div className="h-10 w-10 rounded-2xl bg-emerald-600/10 flex items-center justify-center">
                  <ShieldCheck className="h-5 w-5 text-emerald-600" />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <Button variant="outline" className="justify-between">
                  {t("message.callOwner", "Call owner")}
                  <Phone className="h-4 w-4 text-muted-foreground" />
                </Button>
                <Button variant="outline" className="justify-between">
                  {t("message.askQuestions", "Ask questions")}
                  <MessageCircle className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl pt-0 overflow-hidden">
            <div className="relative border-b p-6">
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to right, rgba(5,150,105,0.55), rgba(5,150,105,0.18), transparent)",
                }}
              />
              <div className="relative flex flex-col gap-1">
                <p className="text-xl font-semibold text-white">
                  {t("message.sendTitle", "Send a message")}
                </p>
                <p className="text-sm text-white">
                  {t(
                    "message.sendDesc",
                    "Contact the owner about this listing.",
                  )}
                </p>
              </div>
            </div>

            <CardContent className="p-6">
              <form onSubmit={submitRequest} className="flex flex-col gap-4">
                <div className="rounded-xl border p-3 bg-muted/30">
                  <p className="text-xs text-muted-foreground">
                    {t("message.listing", "Listing")}
                  </p>
                  <p className="text-sm font-medium">{getText(item.name)}</p>
                </div>

                <Input
                  name="name"
                  required
                  defaultValue={user?.name || ""}
                  placeholder={t("message.yourName", "Your name")}
                />
                <Input
                  name="phone"
                  required
                  defaultValue={user?.phone || ""}
                  placeholder={t("message.yourPhone", "Your phone number")}
                />
                <textarea
                  name="message"
                  className="min-h-30 file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
                  placeholder={t("message.yourMessage", "Your message")}
                  required
                />
                <Label>Rent Days</Label>
                <Input
                  name="days"
                  placeholder={t(
                    "message.daysPlaceholder",
                    "How many days you want to be...",
                  )}
                  type="number"
                  required
                  defaultValue={3}
                  min={3}
                  step=""
                />

                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  {t("message.sendBtn", "Send message")}
                </Button>

                <p className="text-xs text-muted-foreground">
                  {t(
                    "message.respect",
                    "By sending, you agree to communicate respectfully.",
                  )}
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Message;
