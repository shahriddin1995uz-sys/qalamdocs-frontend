"use client";

import { useRef, useState } from "react";
import { useLanguage } from "@/i18n/LanguageProvider";
import type { TranslationKey } from "@/i18n/translations";
import type { ToolId } from "@/lib/tools";
import { ApiError, downloadBlob, postFile } from "@/lib/api";
import FileDropzone from "./FileDropzone";
import SortableFileList from "./SortableFileList";
import { Spinner, Check, ArrowRight } from "./icons";

type Props = {
  toolId: ToolId;
  endpoint: string;
  /** form field name expected by the backend */
  fieldName: string;
  accept: string;
  multiple?: boolean;
  hint: "pdf" | "image";
  /** returns a translation key for an error, or null if valid */
  validate: (files: File[]) => TranslationKey | null;
  /** builds the output filename from the input files */
  outputName: (files: File[]) => string;
  /** enable drag & drop reordering of files (default: false) */
  sortable?: boolean;
  /** quality parameter for compress tool */
  quality?: string;
  /** callback when files change (for estimates) */
  onFilesChange?: (files: File[]) => void;
  /** extra content rendered between the file list and the run button (e.g. options) */
  children?: React.ReactNode;
};

type Status = "idle" | "processing" | "done" | "error";

export default function FileToolForm({
  toolId,
  endpoint,
  fieldName,
  accept,
  multiple = false,
  hint,
  validate,
  outputName,
  sortable = false,
  quality,
  onFilesChange,
  children,
}: Props) {
  const { t } = useLanguage();
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [errorKey, setErrorKey] = useState<TranslationKey | null>(null);
  const [result, setResult] = useState<{ blob: Blob; filename: string } | null>(null);

  const reset = () => {
    setFiles([]);
    setStatus("idle");
    setErrorKey(null);
    setResult(null);
  };

  const run = async () => {
    const validationError = validate(files);
    if (validationError) {
      setErrorKey(validationError);
      setStatus("error");
      return;
    }
    setStatus("processing");
    setErrorKey(null);

    const formData = new FormData();
    if (multiple) {
      files.forEach((f) => formData.append(fieldName, f));
    } else {
      formData.append(fieldName, files[0]);
    }
    if (quality) {
      formData.append("quality", quality);
    }

    try {
      const blob = await postFile(endpoint, formData);
      setResult({ blob, filename: outputName(files) });
      setStatus("done");
    } catch (err) {
      const code = err instanceof ApiError ? err.code : "server";
      setErrorKey(code === "network" ? "error.network" : "error.server");
      setStatus("error");
    }
  };

  if (status === "done" && result) {
    return (
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
    );
  }

  return (
    <div>
      <FileDropzone
        files={files}
        onChange={(f) => {
          setFiles(f);
          onFilesChange?.(f);
          if (status === "error") {
            setStatus("idle");
            setErrorKey(null);
          }
        }}
        accept={accept}
        multiple={multiple}
        hint={hint}
        previewIcon={toolId}
        forwardRef={inputRef}
        showList={!sortable}
      />

      {files.length > 0 && sortable && (
        <SortableFileList
          files={files}
          onReorder={setFiles}
          onRemove={(idx) => setFiles(files.filter((_, i) => i !== idx))}
          onAddMore={() => inputRef.current?.click()}
          previewIcon={toolId}
          multiple={multiple}
        />
      )}

      {files.length > 0 && children}

      {errorKey && (
        <p className="mt-4 rounded-lg bg-brand-50 px-4 py-3 text-sm font-medium text-brand-700">
          {t(errorKey)}
        </p>
      )}

      <button
        type="button"
        onClick={run}
        disabled={status === "processing" || files.length === 0}
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
  );
}
