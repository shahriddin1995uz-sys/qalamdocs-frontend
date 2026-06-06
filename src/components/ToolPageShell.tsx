"use client";

import Link from "next/link";
import { useLanguage } from "@/i18n/LanguageProvider";
import { getTool, type ToolId } from "@/lib/tools";
import { ToolIcon } from "./icons";

export default function ToolPageShell({
  toolId,
  children,
}: {
  toolId: ToolId;
  children: React.ReactNode;
}) {
  const { t } = useLanguage();
  const tool = getTool(toolId)!;

  return (
    <div className="hero-surface min-h-[calc(100vh-4rem)]">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
        <nav className="mb-8 flex items-center gap-1.5 text-sm text-ink-500">
          <Link href="/" className="hover:text-brand-600">
            {t("common.backHome")}
          </Link>
          <span>/</span>
          <span className="font-medium text-ink-700">{t(tool.titleKey)}</span>
        </nav>

        <div className="text-center">
          <div
            className={`mx-auto inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${tool.gradient} text-white shadow-lg`}
          >
            <ToolIcon id={tool.icon} className="h-8 w-8" />
          </div>
          <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
            {t(tool.titleKey)}
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-ink-600">{t(tool.descKey)}</p>
        </div>

        <div className="mt-10 animate-float-up rounded-3xl border border-ink-100 bg-white p-5 shadow-[var(--shadow-card)] sm:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
