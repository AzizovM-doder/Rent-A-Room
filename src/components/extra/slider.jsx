import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeftCircleIcon, ArrowRightCircleIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { fetchListings } from "../../reducers/listingSlice";

const Slider = () => {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language || "en").slice(0, 2);

  const getText = (v) => {
    if (!v) return "";
    if (typeof v === "string") return v;
    if (typeof v === "object") return v[lang] || v.en || v.ru || v.tj || "";
    return String(v);
  };

  const dispatch = useDispatch();
  const { items = [] } = useSelector((s) => s.listings || {});

  const slides = useMemo(() => (items || []).slice(0, 5), [items]);

  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const safeLen = slides.length || 1;

  const next = () => setActive((p) => (p + 1) % safeLen);
  const prev = () => setActive((p) => (p - 1 + safeLen) % safeLen);

  const thumbAt = (offset) => slides[(active + offset) % safeLen];
  const thumbIndex = (offset) => (active + offset) % safeLen;

  useEffect(() => {
    dispatch(fetchListings());
  }, [dispatch]);

  useEffect(() => {
    if (!slides.length) return;
    if (active > slides.length - 1) setActive(0);
  }, [slides.length, active]);

  useEffect(() => {
    if (!slides.length || paused) return;
    const id = setInterval(() => {
      setActive((p) => (p + 1) % slides.length);
    }, 2500);
    return () => clearInterval(id);
  }, [slides.length, paused]);

  if (!slides.length)
    return <div className="w-full h-90 rounded-2xl border bg-muted" />;

  return (
    <div
      className="w-full"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative w-full h-100 rounded-2xl overflow-hidden border">
        {slides.map((s, i) => (
          <Link
            key={s?.id}
            to={`/explore/${s?.id}`}
            className={`absolute inset-0 transition-opacity duration-700 ${
              i === active ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <img
              src={s.image}
              alt={getText(s.name)}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </Link>
        ))}

        <div
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.70), rgba(0,0,0,0.30), transparent)",
          }}
          className="absolute inset-0"
        />

        <div className="absolute inset-x-0 bottom-0 p-4">
          <div className="flex items-end justify-between gap-4">
            <div className="flex flex-col gap-1">
              <p className="text-white font-semibold leading-tight">
                {getText(slides[active]?.name)}
              </p>
              <p className="text-white/80 text-sm">
                {getText(slides[active]?.location)} · {slides[active]?.rooms}{" "}
                rooms · {getText(slides[active]?.type)}
              </p>
            </div>
            <div className="text-white font-semibold">
              ${slides[active]?.price}/{t("common.night", "night")}
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActive(i)}
                className={`h-2 rounded-full transition-all ${
                  i === active
                    ? "w-8 bg-white"
                    : "w-2 bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={prev}
          className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/35 hover:bg-black/55 text-white grid place-items-center transition"
        >
          <ArrowLeftCircleIcon />
        </button>
        <button
          type="button"
          onClick={next}
          className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/35 hover:bg-black/55 text-white grid place-items-center transition"
        >
          <ArrowRightCircleIcon />
        </button>
      </div>

    </div>
  );
};

export default Slider;
