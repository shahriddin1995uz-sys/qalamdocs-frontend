import type { ToolId } from "@/lib/tools";

type IconProps = React.SVGProps<SVGSVGElement>;

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
};

export function Logo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" aria-hidden>
      <rect x="2" y="2" width="28" height="28" rx="8" fill="url(#qg)" />
      <path
        d="M11 21.5 20.5 12 22 13.5 12.5 23H11v-1.5Z"
        fill="#fff"
      />
      <path d="M19 13.5 18.5 11l2.5.5" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="9.5" y="9" width="7" height="2" rx="1" fill="#fff" opacity="0.9" />
      <defs>
        <linearGradient id="qg" x1="2" y1="2" x2="30" y2="30" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ef4444" />
          <stop offset="1" stopColor="#be123c" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function Globe(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18" />
    </svg>
  );
}

export function Check(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m20 6-11 11-5-5" />
    </svg>
  );
}

export function ArrowRight(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5 12h14m-6-6 6 6-6 6" />
    </svg>
  );
}

export function UploadCloud(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M16 16l-4-4-4 4m4-4v9" />
      <path d="M20.4 18.4A5 5 0 0 0 18 9h-1.3A8 8 0 1 0 4 16.3" />
    </svg>
  );
}

export function Trash(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3 6h18m-2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" />
    </svg>
  );
}

export function Spinner(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.4" opacity="0.2" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

export function RotateCw(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M21 12a9 9 0 1 1-2.6-6.36L21 8" />
      <path d="M21 3v5h-5" />
    </svg>
  );
}

export function RotateCcw(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3 12a9 9 0 1 0 2.6-6.36L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );
}

export function Eye(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M1.5 12s4.5-7.5 10.5-7.5S22.5 12 22.5 12s-4.5 7.5-10.5 7.5S1.5 12 1.5 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function Copy(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15V5a2 2 0 0 1 2-2h10" />
    </svg>
  );
}

export function Shield(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export function Bolt(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />
    </svg>
  );
}

export function Gift(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="8" width="18" height="4" rx="1" />
      <path d="M5 12v9h14v-9M12 8v13M12 8S10 3 7.5 4.5 9.5 8 12 8Zm0 0s2-5 4.5-3.5S14.5 8 12 8Z" />
    </svg>
  );
}

export function GripVertical(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="9" cy="6" r="1.5" />
      <circle cx="9" cy="12" r="1.5" />
      <circle cx="9" cy="18" r="1.5" />
      <circle cx="15" cy="6" r="1.5" />
      <circle cx="15" cy="12" r="1.5" />
      <circle cx="15" cy="18" r="1.5" />
    </svg>
  );
}

/* ---- Tool icons ---- */

function MergeIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="4" width="9" height="11" rx="2" />
      <rect x="12" y="9" width="9" height="11" rx="2" />
    </svg>
  );
}

function CompressIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M9 9l3-3 3 3M9 15l3 3 3-3" />
    </svg>
  );
}

function PdfToWordIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 3h7l5 5v13a0 0 0 0 1 0 0H6a0 0 0 0 1 0 0V3Z" />
      <path d="M13 3v5h5" />
      <path d="M8 14l1 3 1.2-3 1.2 3 1-3" />
    </svg>
  );
}

function OcrIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="4" width="18" height="14" rx="2" />
      <path d="M7 9h4M7 13h6" />
      <circle cx="16.5" cy="9.5" r="1.5" />
    </svg>
  );
}

function SplitIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="4" width="8" height="16" rx="2" />
      <rect x="13" y="4" width="8" height="16" rx="2" strokeDasharray="3 3" />
    </svg>
  );
}

function RotateIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M21 12a9 9 0 1 1-3-6.7" />
      <path d="M21 3v5h-5" />
    </svg>
  );
}

function PdfToJpgIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <circle cx="8.5" cy="10" r="1.5" />
      <path d="m4 17 5-5 4 4 3-3 4 4" />
    </svg>
  );
}

function JpgToPdfIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="5" width="12" height="10" rx="2" />
      <circle cx="7" cy="9" r="1.2" />
      <path d="m4 14 3.5-3.5L11 14" />
      <path d="M16 9h5v9a2 2 0 0 1-2 2h-6" />
      <path d="M13 16l2 2 2-2" />
    </svg>
  );
}

function OrganizeIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <path d="M14 17.5h7m-3-3 3 3-3 3" />
    </svg>
  );
}

function WordToPdfIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 3h7l5 5v13H6V3Z" />
      <path d="M13 3v5h5" />
      <path d="M9 13h6M9 16h4" />
    </svg>
  );
}

function ProtectIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
      <circle cx="12" cy="15.5" r="1" />
    </svg>
  );
}

function SignIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3 19c3-1 4-4 6-4s2 2 4 2 3-5 5-5" />
      <path d="M3 21h18" />
    </svg>
  );
}

const toolIcons: Record<ToolId, (p: IconProps) => React.ReactElement> = {
  "merge-pdf": MergeIcon,
  "compress-pdf": CompressIcon,
  "pdf-to-word": PdfToWordIcon,
  "image-to-text": OcrIcon,
  "split-pdf": SplitIcon,
  "rotate-pdf": RotateIcon,
  "pdf-to-jpg": PdfToJpgIcon,
  "jpg-to-pdf": JpgToPdfIcon,
  "organize-pdf": OrganizeIcon,
  "word-to-pdf": WordToPdfIcon,
  "protect-pdf": ProtectIcon,
  "sign-pdf": SignIcon,
};

export function ToolIcon({ id, ...props }: { id: ToolId } & IconProps) {
  const Cmp = toolIcons[id];
  return <Cmp {...props} />;
}
