"use client";

import { useMemo, useState } from "react";
import ToolPageShell from "@/components/ToolPageShell";
import FileDropzone from "@/components/FileDropzone";
import { Spinner, Check, ArrowRight, RotateCw, RotateCcw } from "@/components/icons";
import { ApiError, postFile, downloadBlob } from "@/lib/api";
import { generatePageThumbnails } from "@/lib/pdfUtils";
import { useLanguage } from "@/i18n/LanguageProvider";
import type { TranslationKey } from "@/i18n/translations";

type Status = "idle" | "thumbs" | "ready" | "processing" | "done";

const norm = (deg: number) => ((deg % 360) + 360) % 360;

export default function RotatePdfPage() {
  const { t } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [thumbs, setThumbs] = useState<string[]>([]);
  const [rotations, setRotations] = useState<number[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [errorKey, setErrorKey] = useState<TranslationKey | null>(null);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [result, setResult] = useState<{ blob: Blob; filename: string } | null>(null);

  const reset = () => {
    setFile(null);
    setThumbs([]);
    setRotations([]);
    setStatus("idle");
    setErrorKey(null);
    setErrorText(null);
    setResult(null);
  };

  const onSelect = async (files: File[]) => {
    const f = files[0];
    if (!f) return;
    setErrorKey(null);
    setErrorText(null);
    setResult(null);
    if (!f.name.toLowerCase().endsWith(".pdf")) {
      setFile(null);
      setStatus("idle");
      setErrorKey("error.wrongPdf");
      return;
    }
    setFile(f);
    setStatus("thumbs");
    try {
      const { thumbnails, pageCount } = await generatePageThumbnails(f);
      setThumbs(thumbnails);
      setRotations(new Array(pageCount).fill(0));
      setStatus("ready");
    } catch {
      setFile(null);
      setStatus("idle");
      setErrorKey("error.wrongPdf");
    }
  };

  const rotatePage = (idx: number, delta: number) => {
    setRotations((prev) => prev.map((r, i) => (i === idx ? norm(r + delta) : r)));
    setErrorKey(null);
  };
  const rotateAll = (delta: number) => {
    setRotations((prev) => prev.map((r) => norm(r + delta)));
    setErrorKey(null);
  };
  const resetRotations = () => setRotations((prev) => prev.map(() => 0));

  const changedCount = useMemo(
    () => rotations.filter((r) => r !== 0).length,
    [rotations]
  );

  const run = async () => {
    if (!file) return;
    if (changedCount === 0) {
      setErrorKey("error.rotate.none");
      return;
    }
    setErrorKey(null);
    setErrorText(null);
    setStatus("processing");

    const pairs = rotations
      .map((r, i) => (r !== 0 ? `${i + 1}:${r}` : null))
      .filter(Boolean)
      .join(",");

    const fd = new FormData();
    fd.append("file", file);
    fd.append("rotations", pairs);

    try {
      const blob = await postFile("/api/pdf/rotate", fd);
      const base = file.name.replace(/\.pdf$/i, "") || "hujjat";
      setResult({ blob, filename: `${base}_aylantirilgan.pdf` });
      setStatus("done");
    } catch (err) {
      if (err instanceof ApiError && err.code === "server" && err.detail) {
        setErrorText(err.detail);
      } else if (err instanceof ApiError && err.code === "network") {
        setErrorKey("error.network");
      } else {
        setErrorKey("error.server");
      }
      setStatus("ready");
    }
  };

  // ---- Result screen ----
  if (status === "done" && result) {
    return (
      <ToolPageShell toolId="rotate-pdf">
        <div className="text-center">
          <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <Check className="h-8 w-8" />
          </div>
          <h2 className="mt-5 text-2xl font-bold text-ink-900">{t("tool.result.ready")}</h2>
          <p className="mt-2 text-ink-500">{t("tool.result.readyDesc")}</p>
          <p className="mt-4 truncate rounded-lg bg-ink-50 px-4 py-2 text-sm font-medium text-ink-700">
            {result.filename}
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => downloadBlob(result.blob, result.filename)}
              className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-brand-600/20 transition hover:bg-brand-700"
            >
              {t("tool.action.download")}
            </button>
            <button
              type="button"
              onClick={reset}
              className="rounded-full border border-ink-200 px-7 py-3.5 text-base font-semibold text-ink-700 transition hover:border-ink-300"
            >
              {t("tool.action.reset")}
            </button>
          </div>
        </div>
      </ToolPageShell>
    );
  }

  return (
    <ToolPageShell toolId="rotate-pdf">
      {!file && (
        <FileDropzone
          files={[]}
          onChange={onSelect}
          accept="application/pdf,.pdf"
          hint="pdf"
          previewIcon="rotate-pdf"
          showList={false}
        />
      )}

      {errorKey && !file && (
        <p className="mt-4 rounded-lg bg-brand-50 px-4 py-3 text-sm font-medium text-brand-700">
          {t(errorKey)}
        </p>
      )}

      {status === "thumbs" && (
        <p className="mt-6 flex items-center justify-center gap-2 text-sm font-medium text-ink-500">
          <Spinner className="h-5 w-5 animate-spin" />
          {t("split.thumbsLoading")}
        </p>
      )}

      {file && status !== "thumbs" && (
        <div>
          {/* File header */}
          <div className="flex items-center justify-between gap-3">
            <p className="min-w-0 truncate text-sm font-medium text-ink-700">
              {file.name}{" "}
              <span className="text-ink-400">
                · {rotations.length} {t("split.pages")}
              </span>
            </p>
            <button
              type="button"
              onClick={reset}
              className="shrink-0 text-sm font-semibold text-brand-600 hover:text-brand-700"
            >
              {t("split.changeFile")}
            </button>
          </div>

          {/* Global rotation controls */}
          <p className="mt-6 text-sm font-semibold text-ink-900">{t("rotate.choose")}</p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-sm text-ink-600">{t("rotate.all")}</span>
            <button
              type="button"
              onClick={() => rotateAll(270)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm font-medium text-ink-700 transition hover:border-brand-400 hover:text-brand-600"
            >
              <RotateCcw className="h-4 w-4" />
              {t("rotate.left")}
            </button>
            <button
              type="button"
              onClick={() => rotateAll(90)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm font-medium text-ink-700 transition hover:border-brand-400 hover:text-brand-600"
            >
              <RotateCw className="h-4 w-4" />
              {t("rotate.right")}
            </button>
            <button
              type="button"
              onClick={() => rotateAll(180)}
              className="rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm font-medium text-ink-700 transition hover:border-brand-400 hover:text-brand-600"
            >
              180°
            </button>
            {changedCount > 0 && (
              <button
                type="button"
                onClick={resetRotations}
                className="rounded-lg px-3 py-2 text-sm font-medium text-ink-500 transition hover:text-brand-600"
              >
                {t("rotate.reset")}
              </button>
            )}
          </div>
          <p className="mt-2 text-xs text-ink-400">{t("rotate.hint")}</p>

          {/* Page thumbnails with per-page rotate */}
          <div className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
            {thumbs.map((src, idx) => (
              <div
                key={idx}
                className="relative flex aspect-square items-center justify-center overflow-hidden rounded-lg border border-ink-200 bg-ink-50"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={`${t("split.pages")} ${idx + 1}`}
                  className="max-h-full max-w-full object-contain transition-transform duration-200"
                  style={{ transform: `rotate(${rotations[idx]}deg)` }}
                />
                <span className="absolute left-1 top-1 rounded bg-ink-900/70 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                  {idx + 1}
                </span>
                {rotations[idx] !== 0 && (
                  <span className="absolute left-1 bottom-1 rounded bg-brand-600 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                    {rotations[idx]}°
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => rotatePage(idx, 90)}
                  aria-label={t("rotate.right")}
                  className="absolute bottom-1 right-1 inline-flex h-7 w-7 items-center justify-center rounded-md bg-white/90 text-ink-700 shadow-sm transition hover:bg-brand-600 hover:text-white"
                >
                  <RotateCw className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Summary */}
          {changedCount > 0 && (
            <p className="mt-4 rounded-lg bg-ink-50 px-4 py-2.5 text-sm text-ink-600">
              <span className="font-semibold text-ink-900">{changedCount}</span>{" "}
              {t("rotate.willRotate")}
            </p>
          )}

          {/* Error */}
          {(errorKey || errorText) && (
            <p className="mt-5 rounded-lg bg-brand-50 px-4 py-3 text-sm font-medium text-brand-700">
              {errorText ?? (errorKey ? t(errorKey) : null)}
            </p>
          )}

          {/* Run button */}
          <button
            type="button"
            onClick={run}
            disabled={status === "processing" || changedCount === 0}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-brand-600 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-brand-600/20 transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-ink-300 disabled:shadow-none"
          >
            {status === "processing" ? (
              <>
                <Spinner className="h-5 w-5 animate-spin" />
                {t("tool.action.processing")}
              </>
            ) : (
              <>
                {t("tool.action.run")}
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
        </div>
      )}
    </ToolPageShell>
  );
}
