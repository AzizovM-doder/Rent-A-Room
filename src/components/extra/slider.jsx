import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { baseData } from "../../data/base/baseData";
import {
  ArrowBigLeft,
  ArrowBigRightDash,
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
} from "lucide-react";

const Slider = () => {
  const slides = baseData.slice(0, 7);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = () => setActive((p) => (p + 1) % slides.length);
  const prev = () => setActive((p) => (p - 1 + slides.length) % slides.length);

  const thumbAt = (offset) => slides[(active + offset) % slides.length];
  const thumbIndex = (offset) => (active + offset) % slides.length;

  useEffect(() => {
    if (!slides.length || paused) return;
    const id = setInterval(next, 2500);
    return () => clearInterval(id);
  }, [active, paused]);

  return (
    <div
      className="w-full"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative w-full h-90 rounded-2xl overflow-hidden border">
        {slides.map((s, i) => (
          <Link
            key={s.id}
            to={`/explore/${s.id}`}
            className={`absolute inset-0 transition-opacity duration-700 ${
              i === active ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <img
              src={s.image}
              alt={s.name}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </Link>
        ))}

        <div className="absolute inset-x-0 bottom-0 p-4 from-black/70 via-black/30 to-transparent">
          <div className="flex items-end justify-between gap-4">
            <div className="flex flex-col gap-1">
              <p className="text-white font-semibold leading-tight">
                {slides[active]?.name}
              </p>
              <p className="text-white/80 text-sm">
                {slides[active]?.location} · {slides[active]?.rooms} rooms ·{" "}
                {slides[active]?.type}
              </p>
            </div>
            <div className="text-white font-semibold">
              ${slides[active]?.price}/night
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
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

      <div className="mt-4 grid grid-cols-4 gap-3">
        {[0, 1, 2, 3].map((k) => {
          const t = thumbAt(k);
          const idx = thumbIndex(k);
          const isActive = idx === active;

          return (
            <Link
              key={t.id}
              to={`/explore/${t.id}`}
              onMouseEnter={() => setActive(idx)}
              className={`relative overflow-hidden rounded-xl border h-20 transition ${
                isActive ? "border-emerald-500" : "hover:border-emerald-400"
              }`}
            >
              <img
                src={t.image}
                alt={t.name}
                className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.06]"
                loading="lazy"
              />
              <div
                className={`absolute inset-0 ${isActive ? "bg-emerald-600/10" : ""}`}
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Slider;
