"use client";

import ToolPageShell from "@/components/ToolPageShell";
import FileToolForm from "@/components/FileToolForm";

export default function PdfToExcelPage() {
  return (
    <ToolPageShell toolId="pdf-to-excel">
      <FileToolForm
        toolId="pdf-to-excel"
        endpoint="/api/pdf/pdf-to-excel"
        fieldName="file"
        accept="application/pdf,.pdf"
        hint="pdf"
        validate={(files) => {
          if (files.length === 0) return "error.needFile";
          if (!files[0].name.toLowerCase().endsWith(".pdf")) return "error.wrongPdf";
          return null;
        }}
        outputName={(files) =>
          `${(files[0]?.name ?? "hujjat.pdf").replace(/\.pdf$/i, "")}.xlsx`
        }
      />
    </ToolPageShell>
  );
}
