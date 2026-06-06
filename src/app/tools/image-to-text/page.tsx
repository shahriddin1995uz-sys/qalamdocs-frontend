"use client";

import { useState } from "react";
import ToolPageShell from "@/components/ToolPageShell";
import FileDropzone from "@/components/FileDropzone";
import { useLanguage } from "@/i18n/LanguageProvider";
import type { TranslationKey } from "@/i18n/translations";
import { ApiError, postJson } from "@/lib/api";
import { Spinner, ArrowRight, Copy, Check } from "@/components/icons";

type Status = "idle" | "processing" | "done" | "error";

export default function ImageToTextPage() {
  const { t } = useLanguage();
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [errorKey, setErrorKey] = useState<TranslationKey | null>(null);
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  const reset = () => {
    setFiles([]);
    setStatus("idle");
    setErrorKey(null);
    setText("");
    setCopied(false);
  };

  const run = async () => {
    if (files.length === 0) {
      setErrorKey("error.needFile");
      setStatus("error");
      return;
    }
    const type = files[0].type;
    if (!["image/jpeg", "image/jpg", "image/png"].includes(type)) {
      setErrorKey("error.wrongImage");
      setStatus("error");
      return;
    }

    setStatus("processing");
    setErrorKey(null);

    const formData = new FormData();
    formData.append("file", files[0]);

    try {
      const data = await postJson<{ text: string; filename: string }>(
        "/api/ocr/image-to-text",
        formData
      );
      setText(data.text ?? "");
      setStatus("done");
    } catch (err) {
      const code = err instanceof ApiError ? err.code : "server";
      setErrorKey(code === "network" ? "error.network" : "error.server");
      setStatus("error");
    }
  };

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolPageShell toolId="image-to-text">
      {status === "done" ? (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-bold text-ink-900">
              <Check className="h-5 w-5 text-emerald-600" />
              {t("tool.result.ready")}
            </h2>
            <button
              type="button"
              onClick={copy}
              className="inline-flex items-center gap-1.5 rounded-full border border-ink-200 px-3.5 py-1.5 text-sm font-semibold text-ink-700 transition hover:border-brand-300 hover:text-brand-600"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? t("tool.action.copied") : t("tool.action.copy")}
            </button>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={14}
            className="w-full resize-y rounded-xl border border-ink-200 bg-ink-50/50 p-4 text-sm leading-relaxed text-ink-800 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
          <button
            type="button"
            onClick={reset}
            className="mt-5 w-full rounded-full border border-ink-200 px-6 py-3.5 text-base font-semibold text-ink-700 transition hover:border-ink-300"
          >
            {t("tool.action.reset")}
          </button>
        </div>
      ) : (
        <div>
          <FileDropzone
            files={files}
            onChange={(f) => {
              setFiles(f);
              if (status === "error") {
                setStatus("idle");
                setErrorKey(null);
              }
            }}
            accept="image/png,image/jpeg,.png,.jpg,.jpeg"
            hint="image"
            previewIcon="image-to-text"
          />

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
      )}
    </ToolPageShell>
  );
}
