"use client";

import ToolPageShell from "@/components/ToolPageShell";
import FileToolForm from "@/components/FileToolForm";

export default function PdfToJpgPage() {
  return (
    <ToolPageShell toolId="pdf-to-jpg">
      <FileToolForm
        toolId="pdf-to-jpg"
        endpoint="/api/pdf/pdf-to-jpg"
        fieldName="file"
        accept="application/pdf,.pdf"
        hint="pdf"
        validate={(files) => {
          if (files.length === 0) return "error.needFile";
          if (!files[0].name.toLowerCase().endsWith(".pdf")) return "error.wrongPdf";
          return null;
        }}
        outputName={(files) =>
          `${(files[0]?.name ?? "hujjat.pdf").replace(/\.pdf$/i, "")}_rasmlar.zip`
        }
      />
    </ToolPageShell>
  );
}
