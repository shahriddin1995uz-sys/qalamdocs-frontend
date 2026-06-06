"use client";

import { useState } from "react";
import ToolPageShell from "@/components/ToolPageShell";
import FileToolForm from "@/components/FileToolForm";
import { useLanguage } from "@/i18n/LanguageProvider";
import type { TranslationKey } from "@/i18n/translations";

type Quality = "high" | "recommended" | "maximum";

interface CompressEstimate {
  original: number;
  estimates: Record<Quality, { size: number; reduction: number }>;
}

export default function CompressPdfPage() {
  const { t } = useLanguage();
  const [quality, setQuality] = useState<Quality>("recommended");
  const [estimate, setEstimate] = useState<CompressEstimate | null>(null);

  const handleFilesChange = async (files: File[]) => {
    if (files.length === 0) {
      setEstimate(null);
      return;
    }

    const formData = new FormData();
    formData.append("file", files[0]);

    try {
      const res = await fetch("/api/pdf/compress-estimate", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        setEstimate(await res.json());
      }
    } catch {
      // Estimate failed, continue anyway
    }
  };

  const formatSize = (bytes: number): string => {
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
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
      />

      {estimate && (
        <div className="mt-8 space-y-4">
          <div className="rounded-lg bg-ink-50 p-4">
            <p className="text-sm font-medium text-ink-600">
              Asl hajm: <span className="font-bold text-ink-900">{formatSize(estimate.original)}</span>
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold text-ink-900">Siqish variantlarini tanlang:</p>

            {(["high", "recommended", "maximum"] as Quality[]).map((q) => {
              const est = estimate.estimates[q];
              const labels: Record<Quality, string> = {
                high: "Yuqori sifat",
                recommended: "Tavsiya etilgan",
                maximum: "Maksimal siqish",
              };

              return (
                <button
                  key={q}
                  type="button"
                  onClick={() => setQuality(q)}
                  className={`w-full rounded-lg border-2 p-4 text-left transition ${
                    quality === q
                      ? "border-brand-600 bg-brand-50"
                      : "border-ink-200 bg-white hover:border-ink-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-ink-900">{labels[q]}</p>
                      <p className="text-sm text-ink-600">
                        Natija: {formatSize(est.size)} ({est.reduction}% qisqarish)
                      </p>
                    </div>
                    <div
                      className={`h-5 w-5 rounded-full border-2 ${
                        quality === q
                          ? "border-brand-600 bg-brand-600"
                          : "border-ink-300 bg-white"
                      }`}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </ToolPageShell>
  );
}
