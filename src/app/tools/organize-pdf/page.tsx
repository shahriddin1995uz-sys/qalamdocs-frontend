"use client";

import { useRef, useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import ToolPageShell from "@/components/ToolPageShell";
import FileDropzone from "@/components/FileDropzone";
import { Spinner, Check, ArrowRight, Trash, RotateCw } from "@/components/icons";
import { ApiError, postFile, downloadBlob } from "@/lib/api";
import { generatePageThumbnails, generateImageThumbnail } from "@/lib/pdfUtils";
import { useLanguage } from "@/i18n/LanguageProvider";
import type { TranslationKey } from "@/i18n/translations";

// A page in the grid. `src` is "main" (original file) or an addition index
// ("0", "1", ...). `page` is the 0-based page index within that source.
type PageItem = {
  id: string;
  src: string;
  page: number;
  thumb: string;
  rotation: number;
};
type Status = "idle" | "thumbs" | "ready" | "processing" | "done";

const norm = (deg: number) => ((deg % 360) + 360) % 360;
const isImageName = (n: string) => /\.(jpe?g|png)$/i.test(n);

function SortablePage({
  item,
  position,
  onRemove,
  onRotate,
  removable,
  removeLabel,
  rotateLabel,
}: {
  item: PageItem;
  position: number;
  onRemove: (id: string) => void;
  onRotate: (id: string) => void;
  removable: boolean;
  removeLabel: string;
  rotateLabel: string;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`relative flex aspect-square cursor-grab items-center justify-center overflow-hidden rounded-lg border bg-ink-50 transition active:cursor-grabbing ${
        isDragging ? "border-brand-500 shadow-lg shadow-brand-600/20" : "border-ink-200"
      }`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={item.thumb}
        alt=""
        draggable={false}
        className="pointer-events-none max-h-full max-w-full select-none object-contain transition-transform duration-200"
        style={{ transform: `rotate(${item.rotation}deg)` }}
      />
      <span className="absolute left-1 top-1 rounded bg-ink-900/70 px-1.5 py-0.5 text-[10px] font-semibold text-white">
        {position}
      </span>
      <button
        type="button"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          onRemove(item.id);
        }}
        disabled={!removable}
        aria-label={removeLabel}
        className="absolute right-1 top-1 inline-flex h-6 w-6 items-center justify-center rounded-md bg-white/90 text-ink-500 shadow-sm transition hover:bg-brand-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white/90 disabled:hover:text-ink-500"
      >
        <Trash className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          onRotate(item.id);
        }}
        aria-label={rotateLabel}
        className="absolute bottom-1 right-1 inline-flex h-6 w-6 items-center justify-center rounded-md bg-white/90 text-ink-600 shadow-sm transition hover:bg-brand-600 hover:text-white"
      >
        <RotateCw className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export default function OrganizePdfPage() {
  const { t } = useLanguage();
  const addInputRef = useRef<HTMLInputElement>(null);
  const nextId = useRef(0);
  const makeId = () => `p-${nextId.current++}`;

  const [file, setFile] = useState<File | null>(null);
  const [additions, setAdditions] = useState<File[]>([]);
  const [pages, setPages] = useState<PageItem[]>([]);
  const [original, setOriginal] = useState<PageItem[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [adding, setAdding] = useState(false);
  const [errorKey, setErrorKey] = useState<TranslationKey | null>(null);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [result, setResult] = useState<{ blob: Blob; filename: string } | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const reset = () => {
    setFile(null);
    setAdditions([]);
    setPages([]);
    setOriginal([]);
    setStatus("idle");
    setAdding(false);
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
    setAdditions([]);
    setStatus("thumbs");
    try {
      const { thumbnails } = await generatePageThumbnails(f);
      const items: PageItem[] = thumbnails.map((thumb, i) => ({
        id: makeId(),
        src: "main",
        page: i,
        thumb,
        rotation: 0,
      }));
      setOriginal(items);
      setPages(items);
      setStatus("ready");
    } catch {
      setFile(null);
      setStatus("idle");
      setErrorKey("error.wrongPdf");
    }
  };

  const onAddFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setErrorKey(null);
    setErrorText(null);
    setAdding(true);

    const newAdds = [...additions];
    const newItems: PageItem[] = [];
    let hadBad = false;

    for (const f of Array.from(fileList)) {
      const lower = f.name.toLowerCase();
      const addIdx = newAdds.length;
      if (lower.endsWith(".pdf")) {
        newAdds.push(f);
        try {
          const { thumbnails } = await generatePageThumbnails(f);
          thumbnails.forEach((thumb, i) =>
            newItems.push({ id: makeId(), src: String(addIdx), page: i, thumb, rotation: 0 })
          );
        } catch {
          newAdds.pop();
          hadBad = true;
        }
      } else if (isImageName(lower)) {
        newAdds.push(f);
        try {
          const thumb = await generateImageThumbnail(f);
          newItems.push({ id: makeId(), src: String(addIdx), page: 0, thumb, rotation: 0 });
        } catch {
          newAdds.pop();
          hadBad = true;
        }
      } else {
        hadBad = true;
      }
    }

    setAdditions(newAdds);
    if (newItems.length > 0) setPages((prev) => [...prev, ...newItems]);
    if (hadBad) setErrorKey("error.organize.badAdd");
    setAdding(false);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = pages.findIndex((p) => p.id === active.id);
      const newIndex = pages.findIndex((p) => p.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        setPages(arrayMove(pages, oldIndex, newIndex));
      }
    }
  };

  const removePage = (id: string) => {
    setPages((prev) => prev.filter((p) => p.id !== id));
    setErrorKey(null);
  };
  const rotatePage = (id: string) => {
    setPages((prev) =>
      prev.map((p) => (p.id === id ? { ...p, rotation: norm(p.rotation + 90) } : p))
    );
  };
  const restore = () => {
    setAdditions([]);
    setPages(original);
    setErrorKey(null);
  };

  const run = async () => {
    if (!file) return;
    if (pages.length === 0) {
      setErrorKey("error.organize.empty");
      return;
    }
    setErrorKey(null);
    setErrorText(null);
    setStatus("processing");

    const operations = pages.map((p) => ({ src: p.src, page: p.page, rot: p.rotation }));
    const fd = new FormData();
    fd.append("file", file);
    additions.forEach((f) => fd.append("additions", f));
    fd.append("operations", JSON.stringify(operations));

    try {
      const blob = await postFile("/api/pdf/organize", fd);
      const base = file.name.replace(/\.pdf$/i, "") || "hujjat";
      setResult({ blob, filename: `${base}_tahrirlangan.pdf` });
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
      <ToolPageShell toolId="organize-pdf">
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

  const changed = pages.length !== original.length || additions.length > 0;

  return (
    <ToolPageShell toolId="organize-pdf">
      {!file && (
        <FileDropzone
          files={[]}
          onChange={onSelect}
          accept="application/pdf,.pdf"
          hint="pdf"
          previewIcon="organize-pdf"
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
          {/* Header */}
          <div className="flex items-center justify-between gap-3">
            <p className="min-w-0 truncate text-sm font-medium text-ink-700">
              {file.name}{" "}
              <span className="text-ink-400">· {pages.length} {t("organize.remains")}</span>
            </p>
            <div className="flex shrink-0 items-center gap-3">
              {changed && (
                <button
                  type="button"
                  onClick={restore}
                  className="text-sm font-semibold text-ink-500 hover:text-brand-600"
                >
                  {t("organize.restore")}
                </button>
              )}
              <button
                type="button"
                onClick={reset}
                className="text-sm font-semibold text-brand-600 hover:text-brand-700"
              >
                {t("split.changeFile")}
              </button>
            </div>
          </div>

          <p className="mt-3 text-xs text-ink-400">{t("organize.hint")}</p>

          {/* Sortable thumbnail grid */}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={pages.map((p) => p.id)} strategy={rectSortingStrategy}>
              <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
                {pages.map((item, idx) => (
                  <SortablePage
                    key={item.id}
                    item={item}
                    position={idx + 1}
                    onRemove={removePage}
                    onRotate={rotatePage}
                    removable={pages.length > 1}
                    removeLabel={t("drop.remove")}
                    rotateLabel={t("rotate.right")}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          {/* Add pages */}
          <input
            ref={addInputRef}
            type="file"
            accept="application/pdf,.pdf,image/jpeg,image/png,.jpg,.jpeg,.png"
            multiple
            className="hidden"
            onClick={(e) => {
              (e.target as HTMLInputElement).value = "";
            }}
            onChange={(e) => onAddFiles(e.target.files)}
          />
          <button
            type="button"
            onClick={() => addInputRef.current?.click()}
            disabled={adding}
            className="mt-4 inline-flex items-center gap-2 rounded-lg border border-dashed border-ink-300 px-4 py-2.5 text-sm font-semibold text-ink-600 transition hover:border-brand-400 hover:text-brand-600 disabled:opacity-60"
          >
            {adding ? (
              <>
                <Spinner className="h-4 w-4 animate-spin" />
                {t("organize.adding")}
              </>
            ) : (
              <>+ {t("organize.addPages")}</>
            )}
          </button>

          {/* Error */}
          {(errorKey || errorText) && (
            <p className="mt-5 rounded-lg bg-brand-50 px-4 py-3 text-sm font-medium text-brand-700">
              {errorText ?? (errorKey ? t(errorKey) : null)}
            </p>
          )}

          {/* Run */}
          <button
            type="button"
            onClick={run}
            disabled={status === "processing" || pages.length === 0}
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
