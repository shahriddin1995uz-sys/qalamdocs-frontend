"use client";

import { useRef, useState } from "react";
import { useLanguage } from "@/i18n/LanguageProvider";
import { formatBytes } from "@/lib/api";
import { UploadCloud, Trash, ToolIcon } from "./icons";
import type { ToolId } from "@/lib/tools";

type Props = {
  files: File[];
  onChange: (files: File[]) => void;
  accept: string;
  multiple?: boolean;
  /** "pdf" | "image" — chooses the hint text */
  hint: "pdf" | "image";
  previewIcon: ToolId;
  forwardRef?: React.RefObject<HTMLInputElement>;
  /** show file list below dropzone (default: true) */
  showList?: boolean;
};

export default function FileDropzone({
  files,
  onChange,
  accept,
  multiple = false,
  hint,
  previewIcon,
  forwardRef,
  showList = true,
}: Props) {
  const { t } = useLanguage();
  const inputRef = useRef<HTMLInputElement>(null);
  const activeInputRef = forwardRef || inputRef;
  const [dragging, setDragging] = useState(false);

  const addFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    const list = Array.from(incoming);
    onChange(multiple ? [...files, ...list] : list.slice(0, 1));
  };

  const removeAt = (idx: number) => {
    onChange(files.filter((_, i) => i !== idx));
  };

  const hintText = hint === "pdf" ? t("drop.hint.pdf") : t("drop.hint.image");

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          addFiles(e.dataTransfer.files);
        }}
        onClick={() => activeInputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") activeInputRef.current?.click();
        }}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-14 text-center transition ${
          dragging
            ? "border-brand-500 bg-brand-50"
            : "border-ink-200 bg-ink-50/50 hover:border-brand-300 hover:bg-brand-50/40"
        }`}
      >
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-brand-600 shadow-sm">
          <UploadCloud className="h-7 w-7" />
        </div>
        <p className="mt-4 text-lg font-semibold text-ink-900">{t("drop.title")}</p>
        <p className="mt-1 text-sm text-ink-400">{t("drop.or")}</p>
        <span className="mt-3 inline-flex items-center gap-2 rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700">
          {t("drop.browse")}
        </span>
        <p className="mt-4 text-xs text-ink-400">{hintText}</p>

        <input
          ref={activeInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onClick={(e) => {
            // allow re-selecting the same file
            (e.target as HTMLInputElement).value = "";
          }}
          onChange={(e) => addFiles(e.target.files)}
        />
      </div>

      {showList && files.length > 0 && (
        <div className="mt-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-ink-700">
              {t("drop.selected")} ({files.length})
            </p>
            {multiple && (
              <button
                type="button"
                onClick={() => activeInputRef.current?.click()}
                className="text-sm font-semibold text-brand-600 hover:text-brand-700"
              >
                + {t("drop.addMore")}
              </button>
            )}
          </div>
          <ul className="mt-3 space-y-2">
            {files.map((file, idx) => (
              <li
                key={`${file.name}-${idx}`}
                className="flex items-center gap-3 rounded-xl border border-ink-100 bg-white px-3 py-2.5"
              >
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                  <ToolIcon id={previewIcon} className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink-900">{file.name}</p>
                  <p className="text-xs text-ink-400">{formatBytes(file.size)}</p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeAt(idx);
                  }}
                  aria-label={t("drop.remove")}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-ink-400 transition hover:bg-brand-50 hover:text-brand-600"
                >
                  <Trash className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
