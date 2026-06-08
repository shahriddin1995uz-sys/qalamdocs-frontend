"use client";

import ReactDOM from "react-dom";
import { useEffect, useRef, useState } from "react";
import { generatePDFThumbnail, generatePDFPreview, generatePDFPreviews, PDFThumbResult } from "@/lib/pdfUtils";
import { Eye, Spinner } from "./icons";

// Preview box max width (px) — adjust here if needed
export const BOX_W = 780;

type Props = {
  file: File;
  /** Thumbnail width in pixels */
  thumbWidth?: number;
  /** Thumbnail height in pixels */
  thumbHeight?: number;
};

export default function PDFThumbnail({
  file,
  thumbWidth = 100,
  // Keep visual card height consistent: use 100px by default
  thumbHeight = 100,
}: Props) {
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  // (modalPages used instead of single modalUrl)
  const [modalLoading, setModalLoading] = useState(false);
  const [modalPages, setModalPages] = useState<string[] | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const thumbRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const prevPreviewUrlRef = useRef<string | null>(null);
  const prevModalUrlsRef = useRef<string[] | null>(null);

  // Actual PDF page pixel dimensions (intrinsic), populated from thumbnail generation
  const [pdfWidth, setPdfWidth] = useState<number | null>(null);
  const [pdfHeight, setPdfHeight] = useState<number | null>(null);

  // Preview box max height (px) derived from window size and kept in state to respond to resizes
  const [boxH, setBoxH] = useState<number>(() =>
    typeof window !== "undefined" ? Math.round(window.innerHeight * 0.82) : 0
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onResize = () => setBoxH(Math.round(window.innerHeight * 0.82));
    window.addEventListener("resize", onResize);
    onResize();
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    // Generate thumbnail on mount
    const generateThumb = async () => {
      try {
        setLoading(true);
        setError(false);
        const result: PDFThumbResult = await generatePDFThumbnail(file, thumbWidth, thumbHeight);
        setThumbnail(result.dataUrl);
        setAspectRatio(result.aspectRatio || result.pageWidth / result.pageHeight);
        // Save intrinsic PDF page pixel dimensions for accurate preview scaling
        setPdfWidth(result.pageWidth);
        setPdfHeight(result.pageHeight);
      } catch (err) {
        console.error("Failed to generate thumbnail:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    generateThumb();
  }, [file, thumbWidth, thumbHeight]);

  useEffect(() => {
    if (prevPreviewUrlRef.current) {
      revokePreviewUrl(prevPreviewUrlRef.current);
      prevPreviewUrlRef.current = null;
    }
    if (prevModalUrlsRef.current) {
      revokeModalUrls(prevModalUrlsRef.current);
      prevModalUrlsRef.current = null;
    }
    setPreviewUrl(null);
    setModalPages(null);
  }, [file]);

  useEffect(() => {
    return () => {
      if (prevPreviewUrlRef.current) {
        revokePreviewUrl(prevPreviewUrlRef.current);
      }
      if (prevModalUrlsRef.current) {
        revokeModalUrls(prevModalUrlsRef.current);
      }
    };
  }, []);

  const revokePreviewUrl = (url: string | null) => {
    if (url && url.startsWith("blob:")) {
      URL.revokeObjectURL(url);
    }
  };

  const revokeModalUrl = (url: string | null) => {
    if (url && url.startsWith("blob:")) {
      URL.revokeObjectURL(url);
    }
  };

  const revokeModalUrls = (urls: string[] | null) => {
    if (!urls) return;
    urls.forEach((url) => {
      if (url && url.startsWith("blob:")) {
        URL.revokeObjectURL(url);
      }
    });
  };

  const handleMouseEnter = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      if (!thumbRef.current) {
        return;
      }

      // On mobile, do not show hover panel
      if (typeof window !== "undefined" && window.innerWidth < 1024) {
        return;
      }

      if (!previewUrl && !previewLoading) {
        const generatePreview = async () => {
          try {
            setPreviewLoading(true);
            const url = await generatePDFPreview(file, {
              maxWidth: 380,
              maxHeight: 640,
              scale: 2.5,
              useBlob: true,
            });
            revokePreviewUrl(prevPreviewUrlRef.current);
            prevPreviewUrlRef.current = url;
            setPreviewUrl(url);
          } catch (err) {
            console.error("Failed to generate preview:", err);
          } finally {
            setPreviewLoading(false);
          }
        };
        generatePreview();
      }

      setShowPopup(true);
    }, 300); // 300ms delay
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setShowPopup(false);
  };

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  useEffect(() => {
    if (!modalOpen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [modalOpen]);

  // When modal closes, revoke generated page URLs and clear state
  useEffect(() => {
    if (modalOpen) return;
    revokeModalUrls(prevModalUrlsRef.current);
    prevModalUrlsRef.current = null;
    setModalPages(null);
  }, [modalOpen]);

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      revokePreviewUrl(prevPreviewUrlRef.current);
      revokeModalUrls(prevModalUrlsRef.current);
    };
  }, []);

  useEffect(() => {
    if (!modalOpen || modalPages || modalLoading) {
      return;
    }

    const loadModalPreviews = async () => {
      try {
        setModalLoading(true);
        const windowWidth = Math.round(window.innerWidth * 0.9);
        const windowHeight = Math.round(window.innerHeight * 0.95);
        const pages = await generatePDFPreviews(file, {
          maxWidth: windowWidth,
          maxHeight: windowHeight,
          useBlob: true,
        });
        // Revoke any previous modal page URLs
        revokeModalUrls(prevModalUrlsRef.current);
        prevModalUrlsRef.current = pages;
        setModalPages(pages);
      } catch (err) {
        console.error("Failed to load modal previews:", err);
      } finally {
        setModalLoading(false);
      }
    };

    loadModalPreviews();
  }, [modalOpen, modalPages, modalLoading, file]);

  if (loading) {
    return (
      <div
        className="flex h-[140px] w-[100px] items-center justify-center rounded-md border border-ink-100 bg-ink-50"
        style={{ width: `${thumbWidth}px`, height: `${thumbHeight}px` }}
      >
        <Spinner className="h-5 w-5 animate-spin text-brand-600" />
      </div>
    );
  }

  if (error || !thumbnail) {
    return (
      <div
        className="flex items-center justify-center rounded-md border border-ink-100 bg-ink-50 text-brand-600"
        style={{ width: `${thumbWidth}px`, height: `${thumbHeight}px` }}
      >
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
      </div>
    );
  }

  const thumbnailWidth = Math.min(
    Math.max(aspectRatio ? Math.round(aspectRatio * thumbHeight) : thumbWidth, 70),
    150
  );

  const isLandscape = aspectRatio ? aspectRatio > 1 : false;
  const modalAspectRatio = aspectRatio || 1;

  // Compute preview display size based on intrinsic PDF pixels and BOX constraints
  const computedBoxW = BOX_W;
  const computedBoxH = boxH || (typeof window !== "undefined" ? Math.round(window.innerHeight * 0.82) : 0);

  let previewWidth = computedBoxW;
  let previewHeight = computedBoxH;

  if (pdfWidth && pdfHeight && computedBoxW > 0 && computedBoxH > 0) {
    const isPdfLandscape = pdfWidth > pdfHeight;
    if (isPdfLandscape) {
      // Force width to BOX_W, height proportional
      previewWidth = computedBoxW;
      previewHeight = Math.max(1, Math.round((computedBoxW * pdfHeight) / pdfWidth));
    } else {
      // Portrait: force height to BOX_H, width proportional
      previewHeight = computedBoxH;
      previewWidth = Math.max(1, Math.round((computedBoxH * pdfWidth) / pdfHeight));
    }
  }

  return (
    <div
      ref={thumbRef}
      className="relative cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={openModal}
    >
      {/* Thumbnail */}
      <div
        className="overflow-hidden rounded-md border border-ink-100 bg-white shadow-sm transition-shadow hover:shadow-md"
        style={{
          height: `${thumbHeight}px`,
          width: `${thumbnailWidth}px`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          src={thumbnail}
          alt="PDF thumbnail"
          className="h-full w-full object-contain"
          loading="lazy"
        />
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            openModal();
          }}
          title="To'liq ko'rish uchun bosing"
          className="absolute right-1 top-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-ink-600 shadow-sm transition hover:bg-white"
        >
          <Eye className="h-4 w-4" />
        </button>
      </div>

      {/* Hover Preview Panel (fixed left center) */}
      {typeof window !== "undefined" && ReactDOM.createPortal(
        <div
          aria-hidden={!showPopup}
          className="fixed z-40 rounded-2xl border border-ink-200 bg-white shadow-2xl transition-opacity"
          style={{
            top: "50%",
            left: "30px",
            transform: "translateY(-50%)",
            width: `${previewWidth}px`,
            height: `${previewHeight}px`,
            opacity: showPopup ? 1 : 0,
            pointerEvents: showPopup ? "auto" : "none",
            transition: "opacity 0.2s ease",
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="PDF preview"
              className="rounded-2xl object-contain"
              style={{ width: `${previewWidth}px`, height: 'auto', maxHeight: `${computedBoxH}px` }}
            />
          ) : previewLoading ? (
            <div className="flex items-center justify-center p-4" style={{ width: previewWidth, height: previewHeight }}>
              <Spinner className="h-6 w-6 animate-spin text-brand-600" />
            </div>
          ) : (
            <div className="flex items-center justify-center p-4 text-sm text-ink-500" style={{ width: previewWidth, height: previewHeight }}>
              Oldindan ko'rinish tayyorlanmoqda...
            </div>
          )}
        </div>,
        document.body
      )}

      {/* Full-screen Modal */}
      {typeof window !== "undefined" && modalOpen && ReactDOM.createPortal(
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={closeModal}
        >
          <div
            className="relative overflow-hidden rounded-3xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
            style={{
              width: isLandscape ? "95vw" : "auto",
              height: isLandscape ? "auto" : "95vh",
              aspectRatio: modalAspectRatio,
              maxWidth: isLandscape ? "95vw" : "none",
              maxHeight: isLandscape ? "none" : "95vh",
              animation: "fadeIn 0.2s ease-in-out",
            }}
          >
            <button
              type="button"
              onClick={closeModal}
              aria-label="Close full preview"
              className="absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-ink-700 shadow-md transition hover:bg-white"
            >
              <span className="text-xl">×</span>
            </button>

            <div className="flex h-full min-h-[320px] w-full items-center justify-center bg-ink-50 p-4">
              {modalLoading ? (
                <div className="flex h-full w-full items-center justify-center">
                  <Spinner className="h-10 w-10 animate-spin text-brand-600" />
                </div>
              ) : modalPages && modalPages.length > 0 ? (
                <div
                  style={{
                    width: '90vw',
                    maxWidth: '95vw',
                    maxHeight: '95vh',
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 16,
                    alignItems: 'center',
                    padding: 8,
                  }}
                >
                  {modalPages.map((src, i) => (
                    <div key={src} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div className="mb-2 text-sm text-ink-500">{`${i + 1} / ${modalPages.length}`}</div>
                      <img src={src} alt={`Page ${i + 1}`} style={{ width: '90%', height: 'auto' }} className="object-contain rounded-md" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm text-ink-500">
                  Pikselga yo'naltirilgan ko'rinish yuklanmoqda...
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
