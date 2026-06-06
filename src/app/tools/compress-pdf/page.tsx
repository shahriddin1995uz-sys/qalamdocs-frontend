"use client";

import { useState } from "react";
import ToolPageShell from "@/components/ToolPageShell";
import FileToolForm from "@/components/FileToolForm";
import { Spinner } from "@/components/icons";
import { postJson, formatBytes } from "@/lib/api";
import { useLanguage } from "@/i18n/LanguageProvider";
import type { TranslationKey } from "@/i18n/translations";

type Quality = "high" | "recommended" | "maximum";

const QUALITIES: Quality[] = ["high", "recommended", "maximum"];

interface CompressEstimate {
  original: number;
  approx?: boolean;
  estimates: Record<Quality, { size: number; reduction: number; approx?: boolean }>;
}

export default function CompressPdfPage() {
  const { t } = useLanguage();
  const [quality, setQuality] = useState<Quality>("recommended");
  const [estimate, setEstimate] = useState<CompressEstimate | null>(null);
  const [estimating, setEstimating] = useState(false);
  const [estimateFailed, setEstimateFailed] = useState(false);

  const handleFilesChange = async (files: File[]) => {
    // Reset previous estimate whenever the selection changes.
    setEstimate(null);
    setEstimateFailed(false);

    if (files.length === 0) {
      setEstimating(false);
      return;
    }

    setEstimating(true);
    const formData = new FormData();
    formData.append("file", files[0]);

    try {
      const data = await postJson<CompressEstimate>(
        "/api/pdf/compress-estimate",
        formData
      );
      setEstimate(data);
    } catch {
      // Estimate is best-effort: user can still compress with the default quality.
      setEstimateFailed(true);
    } finally {
      setEstimating(false);
    }
  };

  return (
    <ToolPageShell toolId="compress-pdf">
      <FileToolForm
        toolId="compress-pdf"
        endpoint="/api/pdf/compress"
        fieldName="file"
        accept="application/pdf,.pdf"
        hint="pdf"
        quality={quality}
        onFilesChange={handleFilesChange}
        validate={(files) => {
          if (files.length === 0) return "error.needFile";
          if (!files[0].name.toLowerCase().endsWith(".pdf")) return "error.wrongPdf";
          return null;
        }}
        outputName={(files) => `siqilgan-${files[0]?.name ?? "hujjat.pdf"}`}
      >
        <div className="mt-6 space-y-4">
          {estimating && (
            <p className="flex items-center gap-2 text-sm font-medium text-ink-500">
              <Spinner className="h-4 w-4 animate-spin" />
              {t("compress.estimating")}
            </p>
          )}

          {estimateFailed && (
            <p className="rounded-lg bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700">
              {t("compress.estimateFailed")}
            </p>
          )}

          {estimate && (
            <div className="rounded-lg bg-ink-50 p-4">
              <p className="text-sm font-medium text-ink-600">
                {t("compress.original")}:{" "}
                <span className="font-bold text-ink-900">
                  {formatBytes(estimate.original)}
                </span>
              </p>
            </div>
          )}

          {(estimate || estimateFailed) && (
            <div className="space-y-3">
              <p className="text-sm font-semibold text-ink-900">
                {t("compress.choose")}
              </p>
              {estimate && (
                <p className="text-xs text-ink-500">{t("compress.approxNote")}</p>
              )}

              {QUALITIES.map((q) => {
                const est = estimate?.estimates[q];
                const labelKey = `compress.quality.${q}` as TranslationKey;
                const descKey = `compress.quality.${q}.desc` as TranslationKey;
                const selected = quality === q;

                return (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setQuality(q)}
                    aria-pressed={selected}
                    className={`w-full rounded-lg border-2 p-4 text-left transition ${
                      selected
                        ? "border-brand-600 bg-brand-50"
                        : "border-ink-200 bg-white hover:border-ink-300"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-ink-900">{t(labelKey)}</p>
                        <p className="text-sm text-ink-600">
                          {est
                            ? `${t("compress.result")}: ~${formatBytes(est.size)} (~${Math.max(0, est.reduction)}% ${t("compress.reduction")})`
                            : t(descKey)}
                        </p>
                      </div>
                      <div
                        className={`h-5 w-5 shrink-0 rounded-full border-2 ${
                          selected
                            ? "border-brand-600 bg-brand-600"
                            : "border-ink-300 bg-white"
                        }`}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </FileToolForm>
    </ToolPageShell>
  );
}
