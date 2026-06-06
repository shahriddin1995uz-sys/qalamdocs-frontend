"use client";

import Link from "next/link";
import { useLanguage } from "@/i18n/LanguageProvider";
import { tools } from "@/lib/tools";
import ToolCard from "@/components/ToolCard";
import { Bolt, Shield, Gift, Globe, Check, ArrowRight } from "@/components/icons";

export default function HomePage() {
  const { t } = useLanguage();

  const features = [
    { icon: Bolt, titleKey: "feature.fast.title", descKey: "feature.fast.desc" },
    { icon: Shield, titleKey: "feature.secure.title", descKey: "feature.secure.desc" },
    { icon: Gift, titleKey: "feature.free.title", descKey: "feature.free.desc" },
    { icon: Globe, titleKey: "feature.uz.title", descKey: "feature.uz.desc" },
  ] as const;

  return (
    <>
      {/* Hero */}
      <section className="hero-surface">
        <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8 lg:py-28">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-4 py-1.5 text-sm font-medium text-brand-700 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-brand-500" />
            {t("hero.badge")}
          </span>
          <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-extrabold leading-tight tracking-tight text-ink-900 sm:text-5xl lg:text-6xl">
            {t("hero.title")}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink-600">
            {t("hero.subtitle")}
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="#tools"
              className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-brand-600/20 transition hover:bg-brand-700"
            >
              {t("hero.cta")}
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="#why"
              className="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-white px-7 py-3.5 text-base font-semibold text-ink-700 transition hover:border-ink-300"
            >
              {t("section.why.title")}
            </Link>
          </div>
        </div>
      </section>

      {/* Tools */}
      <section id="tools" className="tool-grid-bg border-y border-ink-100">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
              {t("section.tools.title")}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-ink-600">
              {t("section.tools.subtitle")}
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {tools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </div>
      </section>

      {/* Why */}
      <section id="why" className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
              {t("section.why.title")}
            </h2>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div key={f.titleKey} className="text-center sm:text-left">
                <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 sm:mx-0">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-ink-900">{t(f.titleKey)}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-500">{t(f.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing / CTA banner */}
      <section id="pricing" className="bg-white pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-brand-800 px-8 py-14 text-center text-white sm:px-16">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              {t("feature.free.title")} · {t("hero.badge")}
            </h2>
            <ul className="mx-auto mt-8 flex max-w-2xl flex-col items-start gap-3 sm:flex-row sm:justify-center sm:gap-8">
              {(["feature.fast.title", "feature.secure.title", "feature.uz.title"] as const).map(
                (k) => (
                  <li key={k} className="flex items-center gap-2 text-base font-medium">
                    <Check className="h-5 w-5 text-brand-200" />
                    {t(k)}
                  </li>
                )
              )}
            </ul>
            <Link
              href="#tools"
              className="mt-9 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-base font-semibold text-brand-700 shadow-lg transition hover:bg-brand-50"
            >
              {t("hero.cta")}
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
