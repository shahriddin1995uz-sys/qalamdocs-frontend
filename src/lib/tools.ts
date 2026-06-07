import type { TranslationKey } from "@/i18n/translations";

export type ToolId =
  | "merge-pdf"
  | "compress-pdf"
  | "pdf-to-word"
  | "image-to-text"
  | "split-pdf"
  | "rotate-pdf"
  | "pdf-to-jpg"
  | "jpg-to-pdf"
  | "pdf-to-excel"
  | "organize-pdf"
  | "word-to-pdf"
  | "protect-pdf"
  | "sign-pdf";

export type Tool = {
  id: ToolId;
  href: string;
  titleKey: TranslationKey;
  descKey: TranslationKey;
  icon: ToolId;
  /** tailwind gradient classes for the icon badge */
  gradient: string;
  available: boolean;
  isNew?: boolean;
};

export const tools: Tool[] = [
  {
    id: "merge-pdf",
    href: "/tools/merge-pdf",
    titleKey: "tool.merge-pdf.title",
    descKey: "tool.merge-pdf.desc",
    icon: "merge-pdf",
    gradient: "from-rose-500 to-red-600",
    available: true,
  },
  {
    id: "compress-pdf",
    href: "/tools/compress-pdf",
    titleKey: "tool.compress-pdf.title",
    descKey: "tool.compress-pdf.desc",
    icon: "compress-pdf",
    gradient: "from-emerald-500 to-green-600",
    available: true,
  },
  {
    id: "pdf-to-word",
    href: "/tools/pdf-to-word",
    titleKey: "tool.pdf-to-word.title",
    descKey: "tool.pdf-to-word.desc",
    icon: "pdf-to-word",
    gradient: "from-sky-500 to-blue-600",
    available: true,
  },
  {
    id: "image-to-text",
    href: "/tools/image-to-text",
    titleKey: "tool.image-to-text.title",
    descKey: "tool.image-to-text.desc",
    icon: "image-to-text",
    gradient: "from-violet-500 to-purple-600",
    available: true,
    isNew: true,
  },
  {
    id: "split-pdf",
    href: "/tools/split-pdf",
    titleKey: "tool.split-pdf.title",
    descKey: "tool.split-pdf.desc",
    icon: "split-pdf",
    gradient: "from-amber-500 to-orange-600",
    available: true,
    isNew: true,
  },
  {
    id: "rotate-pdf",
    href: "/tools/rotate-pdf",
    titleKey: "tool.rotate-pdf.title",
    descKey: "tool.rotate-pdf.desc",
    icon: "rotate-pdf",
    gradient: "from-cyan-500 to-teal-600",
    available: true,
    isNew: true,
  },
  {
    id: "pdf-to-jpg",
    href: "/tools/pdf-to-jpg",
    titleKey: "tool.pdf-to-jpg.title",
    descKey: "tool.pdf-to-jpg.desc",
    icon: "pdf-to-jpg",
    gradient: "from-fuchsia-500 to-pink-600",
    available: true,
    isNew: true,
  },
  {
    id: "jpg-to-pdf",
    href: "/tools/jpg-to-pdf",
    titleKey: "tool.jpg-to-pdf.title",
    descKey: "tool.jpg-to-pdf.desc",
    icon: "jpg-to-pdf",
    gradient: "from-pink-500 to-fuchsia-600",
    available: true,
    isNew: true,
  },
  {
    id: "pdf-to-excel",
    href: "/tools/pdf-to-excel",
    titleKey: "tool.pdf-to-excel.title",
    descKey: "tool.pdf-to-excel.desc",
    icon: "pdf-to-excel",
    gradient: "from-lime-500 to-green-600",
    available: true,
    isNew: true,
  },
  {
    id: "organize-pdf",
    href: "/tools/organize-pdf",
    titleKey: "tool.organize-pdf.title",
    descKey: "tool.organize-pdf.desc",
    icon: "organize-pdf",
    gradient: "from-teal-500 to-emerald-600",
    available: true,
    isNew: true,
  },
  {
    id: "word-to-pdf",
    href: "#",
    titleKey: "tool.word-to-pdf.title",
    descKey: "tool.word-to-pdf.desc",
    icon: "word-to-pdf",
    gradient: "from-indigo-500 to-blue-700",
    available: false,
  },
  {
    id: "protect-pdf",
    href: "#",
    titleKey: "tool.protect-pdf.title",
    descKey: "tool.protect-pdf.desc",
    icon: "protect-pdf",
    gradient: "from-slate-500 to-slate-700",
    available: false,
  },
  {
    id: "sign-pdf",
    href: "#",
    titleKey: "tool.sign-pdf.title",
    descKey: "tool.sign-pdf.desc",
    icon: "sign-pdf",
    gradient: "from-rose-500 to-pink-600",
    available: false,
  },
];

export const availableTools = tools.filter((t) => t.available);

export function getTool(id: ToolId): Tool | undefined {
  return tools.find((t) => t.id === id);
}
