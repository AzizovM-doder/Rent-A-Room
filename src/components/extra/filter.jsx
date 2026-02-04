import React, { useEffect, useState } from "react";
// import { baseData } from "../../data/base/baseData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Search, MapPin, Home as HomeIcon, Bed, Tag } from "lucide-react";
import Cards from "./cards";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { fetchListings } from "../../reducers/listingSlice";

const Filter = () => {
  const { i18n, t } = useTranslation();
  const lang = (i18n.language || "en").slice(0, 2);

  const dispatch = useDispatch();
  const { items = [] } = useSelector((s) => s.listings || {});
  const baseData = [...items];
  const getText = (v) => {
    if (!v) return "";
    if (typeof v === "string") return v;
    if (typeof v === "object") return v[lang] || v.en || v.ru || v.tj || "";
    return String(v);
  };

  const ITEMS_PER_PAGE = 3;

  const [search, setSearch] = useState("");
  const [city, setCity] = useState("all");
  const [type, setType] = useState("all");
  const [rooms, setRooms] = useState("all");
  const [price, setPrice] = useState([10, 200]);

  const [filteredData, setFilteredData] = useState([...baseData]);
  const [page, setPage] = useState(1);

  const cities = [];
  baseData.map((e) => {
    if (!cities.includes(e?.location?.en)) {
      cities.push(e?.location?.en);
    }
  });
  useEffect(() => {
    dispatch(fetchListings());
    const q = search.trim().toLowerCase();

    const next = baseData.filter((e) => {
      const name = getText(e.name).toLowerCase();
      const loc = getText(e.location).toLowerCase();
      const typ = getText(e.type).toLowerCase();

      const matchSearch =
        !q || name.includes(q) || loc.includes(q) || typ.includes(q);

      const matchCity =
        city === "all" ||
        getText(e.location).toLowerCase() === city.toLowerCase();

      const matchType =
        type === "all" || getText(e.type).toLowerCase() === type.toLowerCase();

      const matchRooms =
        rooms === "all" ||
        (rooms === "4+" ? e.rooms >= 4 : e.rooms === Number(rooms));

      const matchPrice = e.price >= price[0] && e.price <= price[1];

      return matchSearch && matchCity && matchType && matchRooms && matchPrice;
    });

    setFilteredData(next);
    setPage(1);
  }, [search, city, type, rooms, price, lang,]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE) || 1;
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  const pageData = filteredData.slice(start, end);

  function reset(){
    setSearch("");
    setCity("all");
    setType("all");
    setRooms("all");
    setPrice([10, 200]);
    setPage(1);
  };

  const typeLabel = (v) => {
    if (v === "all") return t("filter.allTypes", "All types");
    if (v === "house") return t("filter.type.house", "House");
    if (v === "apartment") return t("filter.type.apartment", "Apartment");
    if (v === "dacha") return t("filter.type.dacha", "Dacha");
    return v;
  };

  const roomsLabel = () => {
    if (rooms === "all") return t("filter.anyRooms", "any rooms");
    if (rooms === "4+") return t("filter.rooms4plus", "4+ rooms");
    return `${rooms} ${t("common.rooms", "rooms")}`;
  };

  return (
    <div className="flex flex-col gap-10">
      <Card className="rounded-2xl">
        <CardContent className="p-4 md:p-5 flex flex-col gap-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-600/10 flex items-center justify-center">
                <HomeIcon className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold">
                  {t("filter.title", "Filter homes")}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {t("filter.subtitle", "Find the right place fast.")}
                </p>
              </div>
            </div>
            <Button variant="outline">
              {t("filter.reset", "Reset")}
            </Button>
          </div>

          <div className="grid gap-4 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t(
                    "filter.searchPlaceholder",
                    "Search name, city, type...",
                  )}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="lg:col-span-3">
              <Select value={city} onValueChange={setCity}>
                <SelectTrigger>
                  <SelectValue placeholder={t("filter.city", "City")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {t("filter.allCities", "All cities")}
                  </SelectItem>
                  {cities.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="lg:col-span-2">
              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue placeholder={t("filter.typeLabel", "Type")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {t("filter.allTypes", "All types")}
                  </SelectItem>
                  <SelectItem value="house">
                    {t("filter.type.house", "House")}
                  </SelectItem>
                  <SelectItem value="apartment">
                    {t("filter.type.apartment", "Apartment")}
                  </SelectItem>
                  <SelectItem value="dacha">
                    {t("filter.type.dacha", "Dacha")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="lg:col-span-2">
              <Select value={rooms} onValueChange={setRooms}>
                <SelectTrigger>
                  <SelectValue placeholder={t("filter.rooms", "Rooms")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {t("filter.anyRoomsLabel", "Any rooms")}
                  </SelectItem>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4+">4+</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">
                {t("filter.priceRange", "Price range")}
              </span>
              <span className="text-muted-foreground">
                ${price[0]} – ${price[1]}
              </span>
            </div>
            <Slider
              value={price}
              onValueChange={setPrice}
              min={0}
              max={300}
              step={5}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {city === "all" ? t("filter.allCitiesShort", "all cities") : city}
            </Badge>

            <Badge variant="secondary" className="gap-1">
              <Tag className="h-3.5 w-3.5" />
              {typeLabel(type)}
            </Badge>

            <Badge variant="secondary" className="gap-1">
              <Bed className="h-3.5 w-3.5" />
              {roomsLabel()}
            </Badge>

            <Badge variant="secondary">
              ${price[0]}–${price[1]}
            </Badge>

            <Badge className="bg-emerald-600 hover:bg-emerald-600">
              {filteredData.length} {t("filter.results", "results")}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">{t("filter.homes", "Homes")}</h2>
      </div>

      {filteredData.length === 0 ? (
        <Card className="rounded-2xl">
          <CardContent className="p-10 text-center">
            <p className="text-lg font-semibold">
              {t("filter.noResults", "No results")}
            </p>
            <p className="text-sm text-muted-foreground">
              {t("filter.tryDifferent", "Try different filters.")}
            </p>
            <div className="pt-4">
              <Button
                onClick={reset}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {t("filter.resetFilters", "Reset filters")}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-3">
            {pageData.map((e) => (
              <Cards key={e.id} e={e} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 pt-6 flex-wrap items-center">
              <Button
                variant="outline"
                disabled={safePage === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                {t("filter.prev", "Prev")}
              </Button>

              <Button
                variant={safePage === 1 ? "default" : "outline"}
                className={
                  safePage === 1 ? "bg-emerald-600 hover:bg-emerald-700" : ""
                }
                onClick={() => setPage(1)}
              >
                1
              </Button>

              <Button
                variant={safePage === 2 ? "default" : "outline"}
                className={
                  safePage === 2 ? "bg-emerald-600 hover:bg-emerald-700" : ""
                }
                onClick={() => setPage(2)}
              >
                2
              </Button>

              {totalPages > 3 && safePage > 3 && (
                <span className="px-1 text-muted-foreground select-none">
                  ...
                </span>
              )}

              {safePage > 2 && safePage < totalPages && (
                <Button
                  variant="default"
                  className="bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => setPage(safePage)}
                >
                  {safePage}
                </Button>
              )}

              {totalPages > 3 && safePage < totalPages - 1 && (
                <span className="px-1 text-muted-foreground select-none">
                  ...
                </span>
              )}

              {totalPages > 2 && (
                <Button
                  variant={safePage === totalPages ? "default" : "outline"}
                  className={
                    safePage === totalPages
                      ? "bg-emerald-600 hover:bg-emerald-700"
                      : ""
                  }
                  onClick={() => setPage(totalPages)}
                >
                  {totalPages}
                </Button>
              )}

              <Button
                variant="outline"
                disabled={safePage === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                {t("filter.next", "Next")}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Filter;
