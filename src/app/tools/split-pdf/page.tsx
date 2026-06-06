"use client";

import { useMemo, useState } from "react";
import ToolPageShell from "@/components/ToolPageShell";
import FileDropzone from "@/components/FileDropzone";
import { Spinner, Check, ArrowRight } from "@/components/icons";
import { ApiError, postFile, downloadBlob } from "@/lib/api";
import { generatePageThumbnails } from "@/lib/pdfUtils";
import { useLanguage } from "@/i18n/LanguageProvider";
import type { TranslationKey } from "@/i18n/translations";

type Mode = "range" | "every" | "each";
type Status = "idle" | "thumbs" | "ready" | "processing" | "done";

/** Parse a ranges string like "1-5, 8, 10-12" into the set of covered page numbers. */
function parseCovered(spec: string, pageCount: number): Set<number> {
  const set = new Set<number>();
  for (const part of spec.split(",")) {
    const s = part.trim();
    if (!s) continue;
    const m = s.match(/^(\d+)\s*-\s*(\d+)$/) || s.match(/^(\d+)$/);
    if (!m) continue;
    const a = parseInt(m[1], 10);
    const b = m[2] ? parseInt(m[2], 10) : a;
    if (a < 1 || b < 1 || a > pageCount || b > pageCount || a > b) continue;
    for (let i = a; i <= b; i++) set.add(i);
  }
  return set;
}

/** How many output files the current settings will produce (null if invalid). */
function outputCount(
  mode: Mode,
  spec: string,
  everyN: string,
  pageCount: number
): number | null {
  if (pageCount === 0) return null;
  if (mode === "each") return pageCount;
  if (mode === "every") {
    const n = parseInt(everyN, 10);
    return n >= 1 ? Math.ceil(pageCount / n) : null;
  }
  // range: count valid groups
  let count = 0;
  for (const part of spec.split(",")) {
    const s = part.trim();
    if (!s) continue;
    const m = s.match(/^(\d+)\s*-\s*(\d+)$/) || s.match(/^(\d+)$/);
    if (!m) return null;
    const a = parseInt(m[1], 10);
    const b = m[2] ? parseInt(m[2], 10) : a;
    if (a < 1 || b < 1 || a > pageCount || b > pageCount || a > b) return null;
    count++;
  }
  return count > 0 ? count : null;
}

export default function SplitPdfPage() {
  const { t } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [thumbs, setThumbs] = useState<string[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [status, setStatus] = useState<Status>("idle");
  const [mode, setMode] = useState<Mode>("range");
  const [rangesInput, setRangesInput] = useState("");
  const [everyN, setEveryN] = useState("2");
  const [errorKey, setErrorKey] = useState<TranslationKey | null>(null);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [result, setResult] = useState<{ blob: Blob; filename: string } | null>(null);

  const reset = () => {
    setFile(null);
    setThumbs([]);
    setPageCount(0);
    setStatus("idle");
    setMode("range");
    setRangesInput("");
    setEveryN("2");
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
      setPageCount(pageCount);
      setStatus("ready");
    } catch {
      setFile(null);
      setStatus("idle");
      setErrorKey("error.wrongPdf");
    }
  };

  const covered = useMemo(
    () => parseCovered(rangesInput, pageCount),
    [rangesInput, pageCount]
  );
  const count = useMemo(
    () => outputCount(mode, rangesInput, everyN, pageCount),
    [mode, rangesInput, everyN, pageCount]
  );

  const onThumbClick = (pageNum: number) => {
    if (mode !== "range") return;
    setRangesInput((prev) =>
      prev.trim() ? `${prev.trim()}, ${pageNum}` : `${pageNum}`
    );
  };

  const run = async () => {
    if (!file) return;
    // Client-side validation
    if (mode === "range" && outputCount("range", rangesInput, everyN, pageCount) === null) {
      setErrorKey("error.split.range");
      return;
    }
    if (mode === "every") {
      const n = parseInt(everyN, 10);
      if (!(n >= 1)) {
        setErrorKey("error.split.every");
        return;
      }
    }

    setErrorKey(null);
    setErrorText(null);
    setStatus("processing");

    const fd = new FormData();
    fd.append("file", file);
    fd.append("mode", mode);
    if (mode === "range") fd.append("ranges", rangesInput);
    if (mode === "every") fd.append("every_n", everyN);

    try {
      const blob = await postFile("/api/pdf/split", fd);
      const ext = blob.type.includes("zip") ? "zip" : "pdf";
      const base = file.name.replace(/\.pdf$/i, "") || "hujjat";
      setResult({ blob, filename: `${base}_ajratilgan.${ext}` });
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
      <ToolPageShell toolId="split-pdf">
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

  const modes: { id: Mode; titleKey: TranslationKey; descKey: TranslationKey }[] = [
    { id: "range", titleKey: "split.mode.range", descKey: "split.mode.range.desc" },
    { id: "every", titleKey: "split.mode.every", descKey: "split.mode.every.desc" },
    { id: "each", titleKey: "split.mode.each", descKey: "split.mode.each.desc" },
  ];

  return (
    <ToolPageShell toolId="split-pdf">
      {!file && (
        <FileDropzone
          files={[]}
          onChange={onSelect}
          accept="application/pdf,.pdf"
          hint="pdf"
          previewIcon="split-pdf"
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
                · {pageCount} {t("split.pages")}
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

          {/* Mode selector */}
          <p className="mt-6 text-sm font-semibold text-ink-900">{t("split.choose")}</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {modes.map((m) => {
              const selected = mode === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    setMode(m.id);
                    setErrorKey(null);
                  }}
                  aria-pressed={selected}
                  className={`rounded-lg border-2 p-3 text-left transition ${
                    selected
                      ? "border-brand-600 bg-brand-50"
                      : "border-ink-200 bg-white hover:border-ink-300"
                  }`}
                >
                  <p className="text-sm font-semibold text-ink-900">{t(m.titleKey)}</p>
                  <p className="mt-0.5 text-xs text-ink-500">{t(m.descKey)}</p>
                </button>
              );
            })}
          </div>

          {/* Mode-specific input */}
          <div className="mt-5">
            {mode === "range" && (
              <div>
                <label className="text-sm font-medium text-ink-700" htmlFor="ranges">
                  {t("split.ranges.label")}
                </label>
                <input
                  id="ranges"
                  type="text"
                  inputMode="numeric"
                  value={rangesInput}
                  onChange={(e) => {
                    setRangesInput(e.target.value);
                    setErrorKey(null);
                  }}
                  placeholder="1-5, 8, 10-12"
                  className="mt-1.5 w-full rounded-lg border border-ink-200 px-4 py-2.5 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                />
                <p className="mt-1.5 text-xs text-ink-400">{t("split.ranges.hint")}</p>
              </div>
            )}

            {mode === "every" && (
              <div>
                <label className="text-sm font-medium text-ink-700" htmlFor="everyN">
                  {t("split.every.label")}
                </label>
                <input
                  id="everyN"
                  type="number"
                  min={1}
                  max={pageCount}
                  value={everyN}
                  onChange={(e) => {
                    setEveryN(e.target.value);
                    setErrorKey(null);
                  }}
                  className="mt-1.5 w-28 rounded-lg border border-ink-200 px-4 py-2.5 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                />
              </div>
            )}

            {mode === "each" && (
              <p className="text-sm text-ink-600">{t("split.each.info")}</p>
            )}
          </div>

          {/* Output summary */}
          {count !== null && (
            <p className="mt-4 rounded-lg bg-ink-50 px-4 py-2.5 text-sm text-ink-600">
              {t("split.willCreate")}{" "}
              <span className="font-semibold text-ink-900">{count}</span>{" "}
              {count === 1 ? t("split.oneFile") : t("split.files")}
            </p>
          )}

          {/* Page thumbnails */}
          <p className="mt-6 text-sm font-semibold text-ink-900">{t("split.pagesTitle")}</p>
          <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5 md:grid-cols-6">
            {thumbs.map((src, idx) => {
              const pageNum = idx + 1;
              const isCovered = mode === "range" && covered.has(pageNum);
              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => onThumbClick(pageNum)}
                  disabled={mode !== "range"}
                  className={`group relative overflow-hidden rounded-lg border bg-white transition ${
                    isCovered
                      ? "border-brand-500 ring-2 ring-brand-200"
                      : "border-ink-200"
                  } ${mode === "range" ? "cursor-pointer hover:border-brand-400" : "cursor-default"}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={`${t("split.pages")} ${pageNum}`}
                    className="h-auto w-full"
                  />
                  <span className="absolute bottom-1 right-1 rounded bg-ink-900/70 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                    {pageNum}
                  </span>
                </button>
              );
            })}
          </div>

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
            disabled={status === "processing" || count === null}
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
