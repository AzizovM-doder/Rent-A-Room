import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ImagePlus,
  MapPin,
  Bed,
  Home as HomeIcon,
  DollarSign,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { createListing, fetchListings } from "../../reducers/listingSlice";
import toast from "react-hot-toast";

const Post = () => {
  const dispatch = useDispatch();
  const { items = [], saving } = useSelector((s) => s.listings || {});
  const baseData = items;

  const [imageBase64, setImageBase64] = useState("");

  const [nameEn, setNameEn] = useState("");
  const [nameRu, setNameRu] = useState("");
  const [nameTj, setNameTj] = useState("");

  const [price, setPrice] = useState("");
  const [about, setAbout] = useState("");

  const [location, setLocation] = useState("");
  const [rooms, setRooms] = useState("");
  const [type, setType] = useState("");

  const [locations, setLocations] = useState([]);
  const [types, setTypes] = useState([]);

  useEffect(() => {
    dispatch(fetchListings());
  }, [dispatch]);

  useEffect(() => {
    const locSet = new Set();
    const typeSet = new Set();

    baseData.forEach((e) => {
      const loc = e?.location?.en || e?.location || "";
      const ty = e?.type?.en || e?.type || "";
      if (loc) locSet.add(String(loc));
      if (ty) typeSet.add(String(ty));
    });

    setLocations(Array.from(locSet).sort((a, b) => a.localeCompare(b)));
    setTypes(Array.from(typeSet).sort((a, b) => a.localeCompare(b)));
  }, [baseData]);

  const onPickImage = (ev) => {
    const file = ev.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setImageBase64(String(reader.result || ""));
    reader.readAsDataURL(file);
  };

  const reset = () => {
    setImageBase64("");
    setNameEn("");
    setNameRu("");
    setNameTj("");
    setPrice("");
    setAbout("");
    setLocation("");
    setRooms("");
    setType("");
  };

  const submit = async (ev) => {
    ev.preventDefault();

    if (!imageBase64) return toast.error("Pick an image");
    if (!nameEn && !nameRu && !nameTj) return toast.error("Write a name");
    if (!location) return toast.error("Select location");
    if (!type) return toast.error("Select type");
    if (!rooms) return toast.error("Write rooms");
    if (!price) return toast.error("Write price");

    const payload = {
      image: imageBase64,
      name: { en: nameEn, ru: nameRu, tj: nameTj },
      price: Number(price || 0),
      about: about || "",
      location: { en: location, ru: location, tj: location },
      rooms: Number(rooms || 0),
      type: { en: type, ru: type, tj: type },
    };

    const admin = localStorage.getItem("admin") || "";

    if (admin.length > 10) {
      try {
        await toast.promise(dispatch(createListing(payload)).unwrap(), {
          loading: "Posting...",
          success: "Posted",
          error: (e) => e?.message || "Something went wrong",
        });
        reset();
        dispatch(fetchListings());
      } catch {}
      return;
    }

    const token = "8288912810:AAF4ccMayE1GQj6IVji9bQ5YhquyKMDvIrQ";
    const chatId = "8030302693";

    const request = `New post request:
Name EN: ${payload.name.en || "-"}
Name RU: ${payload.name.ru || "-"}
Name TJ: ${payload.name.tj || "-"}
Location: ${payload.location.en || "-"}
Type: ${payload.type.en || "-"}
Rooms: ${payload.rooms}
Price: $${payload.price} / night
About: ${payload.about || "-"}
Image(Base64): ${payload.image.slice(0, 150)}...`;

    try {
      await toast.promise(
        axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
          chat_id: chatId,
          text: request,
        }),
        {
          loading: "Sending request...",
          success: "Request sent",
          error: "Something went wrong",
        },
      );
      reset();
    } catch (error) {
      console.log("Error sending message:", error);
    }
  };

  return (
    <div className="min-h-[75vh] px-4 py-10">
      <div className="mx-auto max-w-6xl grid gap-6 lg:grid-cols-2 items-start">
        <Card className="rounded-2xl overflow-hidden">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between gap-3">
              <div className="flex flex-col">
                <p className="text-xl font-semibold">Preview</p>
                <p className="text-sm text-muted-foreground">
                  Image + main info will show here
                </p>
              </div>
              {price ? (
                <Badge className="bg-emerald-600 hover:bg-emerald-600">
                  ${price} / night
                </Badge>
              ) : (
                <Badge variant="secondary">No price</Badge>
              )}
            </div>
          </CardHeader>

          <CardContent className="p-6 flex flex-col gap-5">
            <div className="rounded-2xl border overflow-hidden">
              <div className="relative h-56 w-full bg-muted">
                {imageBase64 ? (
                  <img
                    src={imageBase64}
                    alt="preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <ImagePlus className="h-7 w-7" />
                    <p className="text-sm">Upload an image to preview</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-2xl font-bold leading-tight">
                {nameEn || nameRu || nameTj || "Listing name"}
              </p>

              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {location || "Location"}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Bed className="h-4 w-4" />
                  {rooms ? `${rooms} rooms` : "Rooms"}
                </span>
                <span className="inline-flex items-center gap-1 capitalize">
                  <HomeIcon className="h-4 w-4" />
                  {type || "Type"}
                </span>
              </div>

              <p className="text-sm text-muted-foreground pt-2">
                {about || "About the place will show here..."}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl overflow-hidden">
          <CardHeader className="border-b">
            <div className="flex flex-col">
              <p className="text-xl font-semibold">Create post</p>
              <p className="text-sm text-muted-foreground">
                Fill the form and you’ll get base64 image + details
              </p>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <form onSubmit={submit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Image</label>
                <Input
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={onPickImage}
                />
                {imageBase64 ? (
                  <p className="text-xs text-muted-foreground break-all">
                    {imageBase64.slice(0, 80)}...
                  </p>
                ) : null}
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Name (EN)</label>
                  <Input
                    name="nameEn"
                    placeholder="Modern Apartment"
                    value={nameEn}
                    onChange={(e) => setNameEn(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Name (RU)</label>
                  <Input
                    name="nameRu"
                    placeholder="Современная квартира"
                    value={nameRu}
                    onChange={(e) => setNameRu(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Name (TJ)</label>
                  <Input
                    name="nameTj"
                    placeholder="Хонаи замонавӣ"
                    value={nameTj}
                    onChange={(e) => setNameTj(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Price ($)</label>
                  <div className="relative">
                    <DollarSign className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      name="price"
                      type="number"
                      className="pl-9"
                      placeholder="50"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      min={0}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Rooms</label>
                  <Input
                    name="rooms"
                    type="number"
                    placeholder="3"
                    value={rooms}
                    onChange={(e) => setRooms(e.target.value)}
                    min={0}
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Location</label>
                  <Select value={location} onValueChange={setLocation}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Type</label>
                  <Select value={type} onValueChange={setType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {types.map((ty) => (
                        <SelectItem key={ty} value={ty}>
                          {ty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">About</label>
                <Textarea
                  name="about"
                  placeholder="Tell people about the place..."
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  className="min-h-28"
                />
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <Button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 w-full"
                  disabled={!!saving}
                >
                  {saving ? "Posting..." : "Post"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={reset}
                >
                  Reset
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Post;
