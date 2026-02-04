import { ShieldCheck, Leaf, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Filter from "../../components/extra/filter";
import Slider from "../../components/extra/slider";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const Home = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-24">
      <section className="grid gap-12 lg:grid-cols-2 items-center">
        <div className="flex flex-col gap-6">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            {t("main.hero.titleBefore")}{" "}
            <span className="text-emerald-600">{t("main.hero.titleHighlight")}</span>
            <br />
            {t("main.hero.titleAfter")}
          </h1>
          <p className="text-muted-foreground max-w-xl">
            {t("main.hero.desc")}
          </p>
          <div className="flex gap-3">
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              {t("main.hero.browseBtn")}
            </Button>
            <Button variant="outline">{t("main.hero.listBtn")}</Button>
          </div>
        </div>

        <Slider />
      </section>

      <Filter />

      <section className="grid gap-6 md:grid-cols-3">
        {[
          {
            icon: ShieldCheck,
            title: t("main.features.verified.title"),
            desc: t("main.features.verified.desc"),
          },
          {
            icon: Leaf,
            title: t("main.features.natureCity.title"),
            desc: t("main.features.natureCity.desc"),
          },
          {
            icon: Star,
            title: t("main.features.topRated.title"),
            desc: t("main.features.topRated.desc"),
          },
        ].map((e, i) => (
          <div
            key={i}
            className="rounded-xl border p-6 flex flex-col gap-4 hover:scale-101 hover:border-emerald-500 shadow-xs shadow-[#00000000] hover:shadow-emerald-500"
          >
            <e.icon className="h-6 w-6 text-emerald-600" />
            <h3 className="font-semibold text-lg">{e.title}</h3>
            <p className="text-sm text-muted-foreground">{e.desc}</p>
          </div>
        ))}
      </section>

      <section className="rounded-2xl bg-emerald-600 p-12 text-white flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-semibold">{t("main.cta.title")}</h2>
          <p className="text-white/80 max-w-lg">{t("main.cta.desc")}</p>
        </div>
        <Link to={'post'}>
        <Button variant="secondary" className="text-emerald-700">
          {t("main.cta.button")}
        </Button>
        </Link>
      </section>
    </div>
  );
};

export default Home;
