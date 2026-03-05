import React, { useEffect, useState, useMemo } from "react";

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
import { Search, MapPin, Home as HomeIcon, Bed, Tag, Filter as FilterIcon, X } from "lucide-react";
import Cards from "./cards";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { fetchListings } from "../../reducers/listingSlice";
import { motion, AnimatePresence } from "framer-motion";

const Filter = () => {
  const { i18n, t } = useTranslation();
  const lang = (i18n.language || "en").slice(0, 2);

  const dispatch = useDispatch();
  const { items = [] } = useSelector((s) => s.listings || {});
  
  // Enhanced text extraction with better language fallback
  const getText = (v) => {
    if (!v) return "";
    if (typeof v === "string") return v;
    if (typeof v === "object") {
      // Priority: current language > English > Russian > Tajik > first available
      return v[lang] || v.en || v.ru || v.tj || Object.values(v)[0] || "";
    }
    return String(v);
  };

  const ITEMS_PER_PAGE = 6; // Increased for better UX

  const [search, setSearch] = useState("");
  const [city, setCity] = useState("all");
  const [type, setType] = useState("all");
  const [rooms, setRooms] = useState("all");
  const [price, setPrice] = useState([10, 200]);
  const [page, setPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Memoized filtered data to prevent re-renders
  const filteredData = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((e) => {
      const name = getText(e.name).toLowerCase();
      const loc = getText(e.location).toLowerCase();
      const typ = getText(e.type).toLowerCase();

      const matchSearch = !q || name.includes(q) || loc.includes(q) || typ.includes(q);
      const matchCity = city === "all" || getText(e.location).toLowerCase() === city.toLowerCase();
      const matchType = type === "all" || getText(e.type).toLowerCase() === type.toLowerCase();
      const matchRooms = rooms === "all" || (rooms === "4+" ? e.rooms >= 4 : e.rooms === Number(rooms));
      const matchPrice = e.price >= price[0] && e.price <= price[1];

      return matchSearch && matchCity && matchType && matchRooms && matchPrice;
    });
  }, [items, search, city, type, rooms, price, lang]);

  // Memoized cities list
  const cities = useMemo(() => {
    const cityList = [];
    items.forEach((e) => {
      const cityName = getText(e.location);
      if (cityName && !cityList.includes(cityName)) {
        cityList.push(cityName);
      }
    });
    return cityList;
  }, [items, lang]);

  useEffect(() => {
    dispatch(fetchListings());
  }, [dispatch]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [search, city, type, rooms, price]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE) || 1;
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  const pageData = filteredData.slice(start, end);

  const reset = () => {
    setSearch("");
    setCity("all");
    setType("all");
    setRooms("all");
    setPrice([10, 200]);
    setPage(1);
    setMobileFiltersOpen(false);
  };

  const hasActiveFilters = search || city !== "all" || type !== "all" || rooms !== "all" || (price[0] !== 10 || price[1] !== 200);

  // Type labels with i18n
  const typeLabels = {
    all: t("filter.allTypes", "All types"),
    house: t("filter.type.house", "House"),
    apartment: t("filter.type.apartment", "Apartment"),
    dacha: t("filter.type.dacha", "Dacha"),
  };

  const roomsLabels = {
    all: t("filter.anyRooms", "Any rooms"),
    "4+": t("filter.rooms4plus", "4+ rooms"),
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Filter Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <Card className="rounded-[2rem] border-emerald-100/50 dark:border-white/10 shadow-2xl shadow-emerald-500/10 backdrop-blur-xl bg-background/80 overflow-hidden">
          <CardContent className="p-4 sm:p-6 lg:p-8 flex flex-col gap-6 relative">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-75 h-75 bg-emerald-500/5 blur-[80px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2" />
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-600/10 flex items-center justify-center">
                  <HomeIcon className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-semibold">
                    {t("filter.title", "Filter homes")}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {t("filter.subtitle", "Find right place fast.")}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {/* Mobile filter toggle */}
                <Button
                  variant="outline"
                  size="sm"
                  className="sm:hidden"
                  onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                >
                  <FilterIcon className="h-4 w-4 mr-2" />
                  {t("filter.filters", "Filters")}
                  {hasActiveFilters && (
                    <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                      !
                    </Badge>
                  )}
                </Button>
                
                <Button variant="outline" size="sm" onClick={reset}>
                  <X className="h-4 w-4 mr-2" />
                  {t("filter.reset", "Reset")}
                </Button>
              </div>
            </div>

            {/* Filters - Desktop always visible, Mobile collapsible */}
            <AnimatePresence>
              {(mobileFiltersOpen || !mobileFiltersOpen) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`${mobileFiltersOpen ? 'sm:block' : 'block'}`}
                >
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-12">
                    {/* Search */}
                    <div className="sm:col-span-2 lg:col-span-5 relative">
                      <Search className="h-4 w-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={t("filter.searchPlaceholder", "Search name, city, type...")}
                        className="pl-11 h-12 rounded-xl bg-background/50 backdrop-blur-sm border-muted-foreground/20 focus-visible:ring-emerald-500/30 transition-shadow"
                      />
                    </div>

                    {/* City */}
                    <div className="sm:col-span-2 lg:col-span-3">
                      <Select value={city} onValueChange={setCity}>
                        <SelectTrigger className="h-12 rounded-xl bg-background/50 backdrop-blur-sm border-muted-foreground/20 focus:ring-emerald-500/30 transition-shadow">
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

                    {/* Type */}
                    <div className="sm:col-span-1 lg:col-span-2">
                      <Select value={type} onValueChange={setType}>
                        <SelectTrigger className="h-12 rounded-xl bg-background/50 backdrop-blur-sm border-muted-foreground/20 focus:ring-emerald-500/30 transition-shadow">
                          <SelectValue placeholder={t("filter.typeLabel", "Type")} />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(typeLabels).map(([value, label]) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Rooms */}
                    <div className="sm:col-span-1 lg:col-span-2">
                      <Select value={rooms} onValueChange={setRooms}>
                        <SelectTrigger className="h-12 rounded-xl bg-background/50 backdrop-blur-sm border-muted-foreground/20 focus:ring-emerald-500/30 transition-shadow">
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

                  {/* Price Range */}
                  <div className="flex flex-col gap-2 mt-4">
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
                      className="w-full"
                    />
                  </div>

                  {/* Active Filters */}
                  <div className="flex flex-wrap items-center gap-2 mt-4">
                    <Badge variant="secondary" className="gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {city === "all" ? t("filter.allCitiesShort", "all cities") : city}
                    </Badge>

                    <Badge variant="secondary" className="gap-1">
                      <Tag className="h-3.5 w-3.5" />
                      {typeLabels[type]}
                    </Badge>

                    <Badge variant="secondary" className="gap-1">
                      <Bed className="h-3.5 w-3.5" />
                      {rooms === "all" ? roomsLabels.all : `${rooms} ${t("common.rooms", "rooms")}`}
                    </Badge>

                    <Badge variant="secondary">
                      ${price[0]}–${price[1]}
                    </Badge>

                    <Badge className="bg-emerald-600 hover:bg-emerald-600 shadow-sm shadow-emerald-600/30">
                      {filteredData.length} {t("filter.results", "results")}
                    </Badge>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>

      {/* Results Section */}
      <div className="flex flex-col gap-6">
        {/* Results Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{t("filter.homes", "Homes")}</h2>
            <p className="text-sm text-muted-foreground">
              {t("filter.propertiesFound", { count: filteredData.length, defaultValue: `${filteredData.length} properties found` })}
            </p>
          </div>
        </div>

        {/* No Results */}
        {filteredData.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-3xl border border-dashed border-emerald-200 dark:border-emerald-800/40 bg-emerald-50/30 dark:bg-emerald-950/20"
          >
            <div className="p-8 sm:p-16 text-center flex flex-col items-center gap-4">
              <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-3xl bg-background flex items-center justify-center shadow-sm border border-emerald-100 dark:border-emerald-900/50">
                <Search className="h-6 w-6 sm:h-8 sm:w-8 text-emerald-600/50 dark:text-emerald-400/50" />
              </div>
              <div>
                <p className="text-lg sm:text-xl font-bold">{t("filter.noResults", "No properties found")}</p>
                <p className="text-muted-foreground mt-2 text-sm sm:text-base">
                  {t("filter.tryDifferent", "Try adjusting your filters or searching for something else.")}
                </p>
              </div>
              <Button onClick={reset} className="mt-2 h-12 rounded-full px-6 sm:px-8 bg-emerald-600 hover:bg-emerald-700 shadow-md transition-all font-semibold">
                {t("filter.resetFilters", "Reset all filters")}
              </Button>
            </div>
          </motion.div>
        ) : (
          <>
            {/* Property Cards Grid */}
            <motion.div 
              initial="hidden" 
              animate="visible" 
              viewport={{ once: true, margin: "-100px" }}
              variants={{
                visible: { transition: { staggerChildren: 0.1 } },
                hidden: {}
              }}
              className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            >
              {pageData.map((e, i) => (
                <motion.div
                  key={`${e.id}-${safePage}`}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
                  }}
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                >
                  <Cards e={e} index={i} />
                </motion.div>
              ))}
            </motion.div>

            {/* Pagination */}
            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex justify-center gap-1 sm:gap-2 pt-4 sm:pt-6 flex-wrap items-center"
              >
                <Button
                  variant="outline"
                  size="sm"
                  disabled={safePage === 1}
                  onClick={() => setPage(safePage - 1)}
                  className="h-10 px-3 sm:px-4"
                >
                  {t("filter.prev", "Prev")}
                </Button>

                {/* Page numbers */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (safePage <= 3) {
                    pageNum = i + 1;
                  } else if (safePage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = safePage - 2 + i;
                  }

                  return (
                    <Button
                      key={pageNum}
                      variant={safePage === pageNum ? "default" : "outline"}
                      size="sm"
                      className={`h-10 px-3 sm:px-4 ${
                        safePage === pageNum ? "bg-emerald-600 hover:bg-emerald-700" : ""
                      }`}
                      onClick={() => setPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}

                {totalPages > 5 && safePage < totalPages - 2 && (
                  <span className="px-1 sm:px-2 text-muted-foreground select-none text-sm">
                    ...
                  </span>
                )}

                {totalPages > 5 && safePage < totalPages - 2 && (
                  <Button
                    variant={safePage === totalPages ? "default" : "outline"}
                    size="sm"
                    className={`h-10 px-3 sm:px-4 ${
                      safePage === totalPages ? "bg-emerald-600 hover:bg-emerald-700" : ""
                    }`}
                    onClick={() => setPage(totalPages)}
                  >
                    {totalPages}
                  </Button>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  disabled={safePage === totalPages}
                  onClick={() => setPage(safePage + 1)}
                  className="h-10 px-3 sm:px-4"
                >
                  {t("filter.next", "Next")}
                </Button>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Filter;
