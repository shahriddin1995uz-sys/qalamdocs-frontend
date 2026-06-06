"use client";

import Link from "next/link";
import { useLanguage } from "@/i18n/LanguageProvider";
import type { Tool } from "@/lib/tools";
import { ToolIcon, ArrowRight } from "./icons";

export default function ToolCard({ tool }: { tool: Tool }) {
  const { t } = useLanguage();

  const inner = (
    <div
      className={`group relative flex h-full flex-col rounded-2xl border border-ink-100 bg-white p-5 shadow-[var(--shadow-card)] transition-all duration-200 ${
        tool.available
          ? "hover:-translate-y-1 hover:border-brand-200 hover:shadow-[var(--shadow-card-hover)]"
          : "opacity-75"
      }`}
    >
      {tool.isNew && (
        <span className="absolute right-4 top-4 rounded-full bg-brand-100 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-brand-700">
          {t("common.new")}
        </span>
      )}
      {!tool.available && (
        <span className="absolute right-4 top-4 rounded-full bg-ink-100 px-2 py-0.5 text-[11px] font-semibold text-ink-500">
          {t("common.comingSoon")}
        </span>
      )}

      <div
        className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${tool.gradient} text-white shadow-sm`}
      >
        <ToolIcon id={tool.icon} className="h-6 w-6" />
      </div>

      <h3 className="mt-4 text-base font-bold text-ink-900">{t(tool.titleKey)}</h3>
      <p className="mt-1.5 flex-1 text-sm leading-relaxed text-ink-500">
        {t(tool.descKey)}
      </p>

      {tool.available && (
        <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600">
          {t("tool.action.run")}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </div>
      )}
    </div>
  );

  if (!tool.available) {
    return <div className="cursor-not-allowed">{inner}</div>;
  }

  return <Link href={tool.href}>{inner}</Link>;
}
