"use client";

import Link from "next/link";
import { useLanguage } from "@/i18n/LanguageProvider";
import { availableTools } from "@/lib/tools";
import { Logo } from "./icons";

export default function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-ink-100 bg-ink-50">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <Logo className="h-9 w-9" />
              <span className="text-lg font-extrabold tracking-tight text-ink-900">
                Qalam<span className="text-brand-600">Docs</span>
              </span>
            </Link>
            <p className="mt-3 max-w-xs text-sm text-ink-500">
              {t("brand.tagline")}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-ink-900">{t("footer.product")}</h3>
            <ul className="mt-4 space-y-2.5">
              {availableTools.map((tool) => (
                <li key={tool.id}>
                  <Link
                    href={tool.href}
                    className="text-sm text-ink-500 transition hover:text-brand-600"
                  >
                    {t(tool.titleKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-ink-900">{t("footer.company")}</h3>
            <ul className="mt-4 space-y-2.5">
              <li><FooterLink>{t("footer.about")}</FooterLink></li>
              <li><FooterLink>{t("footer.contact")}</FooterLink></li>
              <li><FooterLink>{t("nav.pricing")}</FooterLink></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-ink-900">{t("footer.legal")}</h3>
            <ul className="mt-4 space-y-2.5">
              <li><FooterLink>{t("footer.privacy")}</FooterLink></li>
              <li><FooterLink>{t("footer.terms")}</FooterLink></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-ink-200 pt-6 text-sm text-ink-500 sm:flex-row">
          <p>© {year} QalamDocs. {t("footer.rights")}</p>
          <p className="flex items-center gap-1.5">
            🇺🇿 {t("footer.madeIn")}
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ children }: { children: React.ReactNode }) {
  return (
    <span className="cursor-pointer text-sm text-ink-500 transition hover:text-brand-600">
      {children}
    </span>
  );
}
