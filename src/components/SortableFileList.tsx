"use client";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { useLanguage } from "@/i18n/LanguageProvider";
import { formatBytes } from "@/lib/api";
import { GripVertical, Trash, ToolIcon } from "./icons";
import PDFThumbnail from "./PDFThumbnail";
import type { ToolId } from "@/lib/tools";

type SortableItemProps = {
  file: File;
  index: number;
  onRemove: (index: number) => void;
  previewIcon: ToolId;
};

function SortableItem({ file, index, onRemove, previewIcon }: SortableItemProps) {
  const { t } = useLanguage();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `file-${index}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 rounded-xl border border-ink-100 bg-white px-3 py-2.5 transition ${
        isDragging ? "shadow-lg shadow-brand-600/20" : ""
      }`}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        aria-label={t("drop.dragHandle")}
        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-ink-300 transition hover:bg-ink-50 hover:text-ink-500 active:text-ink-600"
      >
        <GripVertical className="h-5 w-5" />
      </button>

      {/* Item order number (index + 1) */}
      <div className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-ink-50 text-ink-500 text-sm font-medium">
        {index + 1}
      </div>

      {/* PDF Thumbnail for PDF files */}
      {file.type === "application/pdf" ? (
        <div className="shrink-0">
          <PDFThumbnail file={file} thumbWidth={80} thumbHeight={100} />
        </div>
      ) : (
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
          <ToolIcon id={previewIcon} className="h-5 w-5" />
        </span>
      )}

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-ink-900">{file.name}</p>
        <p className="text-xs text-ink-400">{formatBytes(file.size)}</p>
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove(index);
        }}
        aria-label={t("drop.remove")}
        className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-ink-400 transition hover:bg-brand-50 hover:text-brand-600"
      >
        <Trash className="h-4 w-4" />
      </button>
    </li>
  );
}

type Props = {
  files: File[];
  onReorder: (files: File[]) => void;
  onRemove: (index: number) => void;
  onAddMore?: () => void;
  previewIcon: ToolId;
  multiple?: boolean;
};

export default function SortableFileList({
  files,
  onReorder,
  onRemove,
  onAddMore,
  previewIcon,
  multiple = false,
}: Props) {
  const { t } = useLanguage();

  const sensors = useSensors(
    useSensor(PointerSensor, {
activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const actualOldIndex = parseInt(active.id.toString().split("-")[1]);
      const actualNewIndex = parseInt(over.id.toString().split("-")[1]);

      onReorder(arrayMove(files, actualOldIndex, actualNewIndex));
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={files.map((_, idx) => `file-${idx}`)}
        strategy={verticalListSortingStrategy}
      >
        <div className="mt-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-ink-700">
              {t("drop.selected")} ({files.length})
            </p>
            {multiple && onAddMore && (
              <button
                type="button"
                onClick={onAddMore}
                className="text-sm font-semibold text-brand-600 hover:text-brand-700"
              >
                + {t("drop.addMore")}
              </button>
            )}
          </div>
          <ul className="mt-3 space-y-2">
            {files.map((file, idx) => (
              <SortableItem
                key={`${file.name}-${idx}`}
                file={file}
                index={idx}
                onRemove={onRemove}
                previewIcon={previewIcon}
              />
            ))}
          </ul>
        </div>
      </SortableContext>
    </DndContext>
  );
}
