"use client";

import ToolPageShell from "@/components/ToolPageShell";
import FileToolForm from "@/components/FileToolForm";

export default function PdfToWordPage() {
  return (
    <ToolPageShell toolId="pdf-to-word">
      <FileToolForm
        toolId="pdf-to-word"
        endpoint="/api/ocr/pdf-to-word"
        fieldName="file"
        accept="application/pdf,.pdf"
        hint="pdf"
        validate={(files) => {
          if (files.length === 0) return "error.needFile";
          if (!files[0].name.toLowerCase().endsWith(".pdf")) return "error.wrongPdf";
          return null;
        }}
        outputName={(files) =>
          (files[0]?.name ?? "hujjat.pdf").replace(/\.pdf$/i, ".docx")
        }
      />
    </ToolPageShell>
  );
}
