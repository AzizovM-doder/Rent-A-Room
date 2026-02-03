import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { baseData } from "../../data/base/baseData";
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

const Info = () => {
  const { id } = useParams();
  const item = baseData.find((e) => String(e.id) === id);

  const [liked, setLiked] = useState(item ? isFav(item.id) : false);

  if (!item) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="p-10 flex flex-col items-center gap-4 text-center">
            <div className="h-12 w-12 rounded-full bg-emerald-600/10 flex items-center justify-center">
              <HomeIcon className="h-6 w-6 text-emerald-600" />
            </div>
            <h2 className="text-xl font-semibold">Not found</h2>
            <p className="text-sm text-muted-foreground">
              This property does not exist or was removed.
            </p>
            <Button
              asChild
              className="bg-emerald-600 hover:bg-emerald-700 px-5"
            >
              <Link to="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to home
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const toggleFav = () => {
    if (liked) {
      removeUserFav(item.id);
    } else {
      addUserFav(item); // FULL OBJECT
    }
    setLiked((v) => !v);
  };

  return (
    <div className="flex flex-col gap-10">
      <Button variant="ghost" asChild className="w-fit text-muted-foreground">
        <Link to="/">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Link>
      </Button>
      <Card className="overflow-hidden pt-0 rounded-2xl">
        <div className="h-95 w-full overflow-hidden relative">
          <img
            src={item.image}
            alt={item.name}
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
            <h1 className="text-3xl font-bold">{item.name}</h1>
            <Badge className="bg-emerald-600">${item.price} / night</Badge>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {item.location}
            </span>
            <span className="flex items-center gap-1">
              <Bed className="h-4 w-4" />
              {item.rooms} rooms
            </span>
            <span className="flex items-center gap-1 capitalize">
              <HomeIcon className="h-4 w-4" />
              {item.type}
            </span>
          </div>

          <div className="rounded-2xl border p-5 text-muted-foreground">
            Comfortable {item.type} located in {item.location}. Perfect for
            short or long stays with {item.rooms} rooms.
          </div>

          <div className="flex flex-col sm:flex-row gap-3">

            <Link to={`/massage/${id}`}>
            <Button className="bg-emerald-600 hover:bg-emerald-700 gap-2">
              <MessageCircle className="h-4 w-4" />
              Message owner
            </Button>
            </Link>
            <Button variant="outline" className="gap-2">
              <Phone className="h-4 w-4" />
              Call
            </Button>
            <Button variant="outline" onClick={toggleFav} className="gap-2">
              {liked ? (
                <Heart className="h-4 text-emerald-500 fill-emerald-500 w-4" />
              ) : (
                <Heart className="h-4 w-4" />
              )}{" "}
              {liked ? "Saved" : "Save"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Info;
