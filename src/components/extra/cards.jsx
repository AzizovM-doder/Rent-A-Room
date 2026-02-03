import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Bed, HomeIcon, MapPin, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { addUserFav, removeUserFav, isFav } from "../../utils/url";

const Cards = ({ e }) => {
  const [liked, setLiked] = useState(isFav(e.id));

  const toggleFav = () => {
    if (liked) {
      removeUserFav(e.id);
    } else {
      addUserFav(e);
    }
    setLiked(!liked);
  };

  return (
    <Card className="rounded-2xl overflow-hidden hover:shadow-md pt-0 hover:scale-[1.02] transition">
      <div className="h-48 w-full relative">
        <img
          src={e.image}
          alt={e.name}
          className="h-full w-full object-cover"
        />

        <button
          type="button"
          onClick={toggleFav}
          className="absolute top-3 right-3 h-9 w-9 rounded-full bg-background/80 backdrop-blur flex items-center justify-center hover:scale-105 transition"
        >
          <Heart
            className={`h-5 w-5 transition ${
              liked
                ? "text-emerald-600 fill-emerald-600"
                : "text-muted-foreground"
            }`}
          />
        </button>
      </div>

      <CardContent className="p-5 pb-0 flex flex-col gap-2">
        <h3 className="font-semibold">{e.name}</h3>

        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {e.location}
          </span>
          <span className="flex items-center gap-1">
            <Bed className="h-4 w-4" />
            {e.rooms} rooms
          </span>
          <span className="flex items-center gap-1 capitalize">
            <HomeIcon className="h-4 w-4" />
            {e.type}
          </span>
        </div>

        <div className="flex w-full justify-between items-center">
          <span className="font-medium text-emerald-600">
            ${e.price} / night
          </span>
          <Link to={`/explore/${e.id}`}>
            <Button className="bg-emerald-500 hover:bg-emerald-600">
              EXPLORE
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default Cards;
