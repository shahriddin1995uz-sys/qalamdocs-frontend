// Lazy-load pdfjs to avoid SSR/server runtime errors (DOMMatrix, window, etc.).
async function loadPdfjs() {
  const pdfjsLib = await import('pdfjs-dist');

  if (typeof window !== 'undefined') {
    // Ensure worker is set to a local ESM-friendly worker when running in browser.
    try {
      pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsLib.GlobalWorkerOptions.workerSrc || new URL(
        'pdfjs-dist/build/pdf.worker.min.mjs',
        import.meta.url
      ).toString();
    } catch (e) {
      // Fallback: noop — importing on some bundlers may not allow new URL resolution.
    }
  }

  return pdfjsLib;
}

/**
 * Generate a thumbnail (dataURL) from the first page of a PDF file.
 * Returns a data URL that can be used directly in <img> src.
 */
export type PDFThumbResult = {
  dataUrl: string;
  pageWidth: number;
  pageHeight: number;
  aspectRatio: number; // width / height
  renderedWidth: number;
  renderedHeight: number;
};

export async function generatePDFThumbnail(
  file: File,
  maxWidth: number = 100,
  targetHeight: number = 140
): Promise<PDFThumbResult> {
  try {
    const pdfjsLib = await loadPdfjs();
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    // Get first page
    const page = await pdf.getPage(1);

    // Get intrinsic page size and calculate scale to fit within targetHeight and maxWidth
    const viewport = page.getViewport({ scale: 1 });
    const intrinsicW = viewport.width;
    const intrinsicH = viewport.height;
    const aspectRatio = intrinsicW / intrinsicH;

    // Prefer matching the targetHeight, but ensure we don't exceed maxWidth
    let scale = targetHeight / intrinsicH;
    if (intrinsicW * scale > maxWidth) {
      scale = maxWidth / intrinsicW;
    }
    const scaledViewport = page.getViewport({ scale });

    // Create canvas
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("Failed to get canvas context");
    }

    canvas.width = scaledViewport.width;
    canvas.height = scaledViewport.height;

    // Render page to canvas
    await page.render({
      canvasContext: context,
      viewport: scaledViewport,
    }).promise;

    // Return as data URL along with metadata
    return {
      dataUrl: canvas.toDataURL("image/png"),
      pageWidth: intrinsicW,
      pageHeight: intrinsicH,
      aspectRatio,
      renderedWidth: scaledViewport.width,
      renderedHeight: scaledViewport.height,
    };
  } catch (error) {
    console.error("Error generating PDF thumbnail:", error);
    throw error;
  }
}

/**
 * Generate a larger preview (dataURL) from the first page of a PDF file.
 * Used for hover popup preview.
 */
export type PDFPreviewOptions = {
  maxWidth?: number;
  maxHeight?: number;
  scale?: number;
  useBlob?: boolean;
};

async function canvasToBlobUrl(canvas: HTMLCanvasElement): Promise<string> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Failed to convert canvas to Blob"));
        return;
      }
      resolve(URL.createObjectURL(blob));
    }, "image/png");
  });
}

export async function generatePDFPreview(
  file: File,
  options: PDFPreviewOptions = {}
): Promise<string> {
  try {
    const pdfjsLib = await loadPdfjs();
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    // Get first page
    const page = await pdf.getPage(1);
    const viewport1 = page.getViewport({ scale: 1 });

    // Ensure we render at a reasonably high scale for readable text
    const requestedScale = typeof options.scale === "number" ? options.scale : 2.5;
    const maxWidth = options.maxWidth ?? 300;
    const maxHeight = options.maxHeight ?? 400;
    const fitScale = Math.min(maxWidth / viewport1.width, maxHeight / viewport1.height);

    // Prefer the requestedScale (to keep text crisp). If requestedScale is extremely large,
    // cap it to avoid runaway memory usage.
    const cappedRequested = Math.min(requestedScale, 4);

    // Use the requested scale even if it exceeds fitScale so the generated image stays sharp
    // when it's later displayed scaled down via CSS. But avoid creating enormous canvases.
    let scale = Math.max(cappedRequested, Math.min(fitScale, cappedRequested));
    // If fitScale is larger than cappedRequested, we can use the fitScale to avoid upscaling
    if (fitScale > cappedRequested) {
      scale = fitScale;
    }

    const scaledViewport = page.getViewport({ scale });

    // Create canvas
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("Failed to get canvas context");
    }

    canvas.width = scaledViewport.width;
    canvas.height = scaledViewport.height;

    // Render page to canvas
    await page.render({
      canvasContext: context,
      viewport: scaledViewport,
    }).promise;

    if (options.useBlob) {
      return canvasToBlobUrl(canvas);
    }

    return canvas.toDataURL("image/png");
  } catch (error) {
    console.error("Error generating PDF preview:", error);
    throw error;
  }
}

/**
 * Generate previews for all pages of a PDF as blob URLs.
 * Returns an array of blob URLs in page order.
 */
export async function generatePDFPreviews(
  file: File,
  options: PDFPreviewOptions = {}
): Promise<string[]> {
  try {
    const pdfjsLib = await loadPdfjs();
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    const maxWidth = options.maxWidth ?? 1200;
    const maxHeight = options.maxHeight ?? 1600;

    const numPages = pdf.numPages;
    const results: string[] = [];

    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport1 = page.getViewport({ scale: 1 });

      const fitScale = Math.min(maxWidth / viewport1.width, maxHeight / viewport1.height);
      const scale = Math.max(0.5, Math.min(fitScale, 3));

      const scaledViewport = page.getViewport({ scale });

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Failed to get canvas context");

      canvas.width = scaledViewport.width;
      canvas.height = scaledViewport.height;

      await page.render({ canvasContext: context, viewport: scaledViewport }).promise;

      results.push(await canvasToBlobUrl(canvas));
    }

    return results;
  } catch (error) {
    console.error("Error generating PDF previews:", error);
    throw error;
  }
}
