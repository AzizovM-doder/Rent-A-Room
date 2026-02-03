import React from "react";
import { Users, Home, ShieldCheck, Leaf } from "lucide-react";
import Logo from "/logo.png";

const About = () => {
  return (
    <div className="flex flex-col gap-24">
      <section className="flex flex-col gap-6 max-w-4xl">
        <div className="flex items-center gap-6">
          <img
            src={Logo}
            alt="Rent a Room logo"
            className="h-20 w-20 object-contain"
          />
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl md:text-4xl font-bold">About us</h1>
            <p className="text-muted-foreground">
              Rent a Room is a platform built to make renting houses, dachas, and
              apartments across Tajikistan simple, transparent, and reliable.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-4">
        {[
          {
            icon: Home,
            title: "Real homes",
            text: "Only real listings from verified property owners.",
          },
          {
            icon: Users,
            title: "For people",
            text: "Built for renters and owners with zero unnecessary steps.",
          },
          {
            icon: ShieldCheck,
            title: "Trust first",
            text: "Transparency and safety are always our priority.",
          },
          {
            icon: Leaf,
            title: "Green mindset",
            text: "We support sustainable living and nature-friendly locations.",
          },
        ].map((e, i) => (
          <div
            key={i}
            className="rounded-xl border p-6 flex flex-col gap-4 transition
            hover:scale-[1.02] hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-500/20"
          >
            <e.icon className="h-6 w-6 text-emerald-600" />
            <h3 className="font-semibold">{e.title}</h3>
            <p className="text-sm text-muted-foreground">{e.text}</p>
          </div>
        ))}
      </section>

      <section className="relative overflow-hidden rounded-2xl bg-emerald-600 p-12 text-white max-w-5xl">
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10" />
        <div className="absolute -left-16 -bottom-16 h-56 w-56 rounded-full bg-black/10" />

        <div className="relative flex flex-col gap-4">
          <h2 className="text-2xl font-semibold">Our mission</h2>
          <p className="text-white/90 leading-relaxed max-w-3xl">
            To connect people with comfortable places to live and relax, while
            helping property owners reach the right audience with ease,
            confidence, and long-term trust.
          </p>
        </div>
      </section>
    </div>
  );
};

export default About;
