import React, { useEffect, useState } from "react";
import { Home, Users, ShieldCheck, Leaf, Building2, TrendingUp, MapPin } from "lucide-react";
import Logo from "/logo.png";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const About = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch(`${BASE_URL}/listings/stats`)
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {});
  }, []);

  const FEATURES = [
    { icon: Home, title: t("about.features.realHomes.title"), text: t("about.features.realHomes.text"), color: "bg-emerald-600/10 text-emerald-600" },
    { icon: Users, title: t("about.features.forPeople.title"), text: t("about.features.forPeople.text"), color: "bg-sky-600/10 text-sky-600" },
    { icon: ShieldCheck, title: t("about.features.trust.title"), text: t("about.features.trust.text"), color: "bg-violet-600/10 text-violet-600" },
    { icon: Leaf, title: t("about.features.green.title"), text: t("about.features.green.text"), color: "bg-teal-600/10 text-teal-600" },
  ];

  const TIMELINE = [
    { year: "2024", title: "Idea born", desc: "Started as a small project to help people find rooms in Tajikistan." },
    { year: "2024", title: "Beta launch", desc: "First version with listings, authentication, and booking messages." },
    { year: "2025", title: "Full upgrade", desc: "JWT auth, image uploads, admin panel, dark mode, and premium UI." },
  ];

  return (
    <div className="flex flex-col gap-20 animate-fade-up">
      {/* Hero */}
      <section className="relative flex flex-col gap-6 max-w-4xl">
        <div className="pointer-events-none absolute -top-32 -left-32 h-[300px] w-[300px] rounded-full bg-emerald-400/15 blur-[100px]" />
        <div className="flex items-center gap-5">
          <img src={Logo} alt="Rent a Room logo" className="h-16 w-16 object-contain" />
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">{t("about.title")}</h1>
            <p className="text-muted-foreground text-lg">{t("about.subtitle")}</p>
          </div>
        </div>
      </section>

      {/* Live stats */}
      {stats && (
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Building2, value: stats.total, label: "Listings", color: "text-emerald-600" },
            { icon: MapPin, value: stats.cities.length, label: "Cities", color: "text-sky-600" },
            { icon: TrendingUp, value: stats.types.length, label: "Types", color: "text-violet-600" },
            { icon: Home, value: `$${stats.minPrice}–$${stats.maxPrice}`, label: "Price range", color: "text-teal-600" },
          ].map(({ icon: Icon, value, label, color }) => (
            <div key={label} className="rounded-2xl border p-5 flex flex-col items-center gap-2 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <Icon className={`h-6 w-6 ${color}`} />
              <p className="text-2xl font-extrabold">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </section>
      )}

      {/* Features */}
      <section className="grid gap-5 md:grid-cols-4 animate-stagger">
        {FEATURES.map((e, i) => (
          <div key={i} className="group rounded-2xl border p-6 flex flex-col gap-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-emerald-500/50">
            <div className={`h-12 w-12 rounded-xl ${e.color} flex items-center justify-center`}>
              <e.icon className="h-6 w-6" />
            </div>
            <h3 className="font-bold">{e.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{e.text}</p>
          </div>
        ))}
      </section>

      {/* Timeline */}
      <section className="flex flex-col gap-8">
        <h2 className="text-2xl md:text-3xl font-bold">Our journey</h2>
        <div className="relative pl-8 border-l-2 border-emerald-200 dark:border-emerald-900 flex flex-col gap-8">
          {TIMELINE.map(({ year, title, desc }, i) => (
            <div key={i} className="relative">
              <div className="absolute -left-[25px] top-1 h-4 w-4 rounded-full bg-emerald-600 border-4 border-background shadow" />
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="secondary" className="text-xs">{year}</Badge>
                <h3 className="font-bold">{title}</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-700 p-10 md:p-14 text-white">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-white/5 rounded-full -translate-x-1/3 translate-y-1/3 pointer-events-none" />
        <div className="relative flex flex-col gap-4 max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-bold">{t("about.mission.title")}</h2>
          <p className="text-white/90 leading-relaxed text-lg">{t("about.mission.text")}</p>
        </div>
      </section>
    </div>
  );
};

export default About;