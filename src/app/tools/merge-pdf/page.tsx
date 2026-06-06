"use client";

import ToolPageShell from "@/components/ToolPageShell";
import FileToolForm from "@/components/FileToolForm";

export default function MergePdfPage() {
  return (
    <ToolPageShell toolId="merge-pdf">
      <FileToolForm
        toolId="merge-pdf"
        endpoint="/api/pdf/merge"
        fieldName="files"
        accept="application/pdf,.pdf"
        multiple
        hint="pdf"
        sortable
        validate={(files) => {
          if (files.length < 2) return "error.minTwo";
          if (files.some((f) => !f.name.toLowerCase().endsWith(".pdf")))
            return "error.wrongPdf";
          return null;
        }}
        outputName={() => "qalamdocs-birlashtirilgan.pdf"}
      />
    </ToolPageShell>
  );
}
