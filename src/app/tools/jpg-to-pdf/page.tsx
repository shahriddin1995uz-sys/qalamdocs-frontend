"use client";

import ToolPageShell from "@/components/ToolPageShell";
import FileToolForm from "@/components/FileToolForm";

export default function JpgToPdfPage() {
  return (
    <ToolPageShell toolId="jpg-to-pdf">
      <FileToolForm
        toolId="jpg-to-pdf"
        endpoint="/api/pdf/jpg-to-pdf"
        fieldName="files"
        accept="image/jpeg,image/png,.jpg,.jpeg,.png"
        multiple
        sortable
        hint="image"
        validate={(files) => {
          if (files.length === 0) return "error.needFile";
          if (files.some((f) => !/\.(jpe?g|png)$/i.test(f.name))) return "error.wrongImage";
          return null;
        }}
        outputName={() => "rasmlardan-pdf.pdf"}
      />
    </ToolPageShell>
  );
}
