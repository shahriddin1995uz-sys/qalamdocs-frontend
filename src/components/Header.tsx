"use client";

import Link from "next/link";
import { useState } from "react";
import { useLanguage } from "@/i18n/LanguageProvider";
import LanguageSwitcher from "./LanguageSwitcher";
import { Logo } from "./icons";

export default function Header() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  const navLinks = [
    { href: "/#tools", label: t("nav.allTools") },
    { href: "/#why", label: t("nav.help") },
    { href: "/#pricing", label: t("nav.pricing") },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-ink-100 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <Logo className="h-9 w-9" />
          <span className="text-lg font-extrabold tracking-tight text-ink-900">
            Qalam<span className="text-brand-600">Docs</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-ink-600 transition hover:text-brand-600"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <Link
            href="/#tools"
            className="hidden rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 sm:inline-block"
          >
            {t("hero.cta")}
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-ink-200 text-ink-700 md:hidden"
          >
            <span className="text-lg leading-none">{open ? "✕" : "☰"}</span>
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-ink-100 bg-white px-4 py-3 md:hidden">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2.5 text-sm font-medium text-ink-700 hover:bg-ink-50"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
