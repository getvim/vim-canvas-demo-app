import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Download, Minus, Plus } from "lucide-react";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import type { PDFDocumentLoadingTask, PDFDocumentProxy, RenderTask } from "pdfjs-dist";
import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { Button } from "./ui/button";
import { Loading } from "./ui/loading";

GlobalWorkerOptions.workerSrc = pdfWorkerUrl;
const pdfAssets = `${import.meta.env.BASE_URL}pdfjs/`;

function decodePdf(pdf: string): ArrayBuffer {
  const bytes = atob(pdf.trim().replace(/^data:application\/pdf;base64,/i, ""));
  if (!bytes.slice(0, 1024).includes("%PDF-")) {
    throw new Error("The response does not contain PDF data.");
  }
  return Uint8Array.from(bytes, (byte) => byte.charCodeAt(0)).buffer;
}

export default function PdfPreview({ pdf }: { pdf: string }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [file, setFile] = useState<{ document: PDFDocumentProxy; downloadUrl: string }>();
  const [loadError, setLoadError] = useState(false);
  const [pageError, setPageError] = useState(false);
  const [pageReady, setPageReady] = useState(false);
  const [width, setWidth] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [zoom, setZoom] = useState(100);

  useEffect(() => {
    let loadingTask: PDFDocumentLoadingTask | undefined;
    let downloadUrl: string | undefined;
    let disposed = false;

    try {
      const data = decodePdf(pdf);
      downloadUrl = URL.createObjectURL(new Blob([data], { type: "application/pdf" }));
      const url = downloadUrl;
      loadingTask = getDocument({
        data,
        cMapUrl: `${pdfAssets}cmaps/`,
        iccUrl: `${pdfAssets}iccs/`,
        standardFontDataUrl: `${pdfAssets}standard_fonts/`,
        wasmUrl: `${pdfAssets}wasm/`,
        isEvalSupported: false,
      });
      void loadingTask.promise.then(
        (document) => { if (!disposed) setFile({ document, downloadUrl: url }); },
        () => { if (!disposed) setLoadError(true); }
      );
    } catch {
      setLoadError(true);
    }

    return () => {
      disposed = true;
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);
      void loadingTask?.destroy().catch(() => {});
    };
  }, [pdf]);

  useEffect(() => {
    const scroller = scrollRef.current;
    if (!scroller) return;

    const observer = new ResizeObserver(([entry]) => {
      setWidth(Math.floor(entry.contentRect.width));
    });
    observer.observe(scroller);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!file || !canvas || width <= 0) return;

    let renderTask: RenderTask | undefined;
    let disposed = false;
    setPageReady(false);
    setPageError(false);

    async function renderPage(document: PDFDocumentProxy, target: HTMLCanvasElement) {
      const page = await document.getPage(pageNumber);
      if (disposed) return;
      const pageWidth = page.getViewport({ scale: 1 }).width;
      const viewport = page.getViewport({ scale: width / pageWidth * zoom / 100 });
      // Bound raster size for large pages and high-density displays.
      const scale = Math.min(window.devicePixelRatio || 1, 2, 4096 / Math.max(viewport.width, viewport.height));
      const context = target.getContext("2d");
      if (!context || !Number.isFinite(scale) || scale <= 0) {
        throw new Error("Could not render the PDF page.");
      }

      target.width = Math.max(1, Math.floor(viewport.width * scale));
      target.height = Math.max(1, Math.floor(viewport.height * scale));
      target.style.width = `${viewport.width}px`;
      target.style.height = `${viewport.height}px`;

      renderTask = page.render({
        canvasContext: context,
        viewport,
        transform: [scale, 0, 0, scale, 0, 0],
      });
      await renderTask.promise;
      if (!disposed) setPageReady(true);
    }

    void renderPage(file.document, canvas).catch(() => {
      if (!disposed) setPageError(true);
    });

    return () => {
      disposed = true;
      renderTask?.cancel();
    };
  }, [file, pageNumber, width, zoom]);

  function goToPage(next: number) {
    setPageNumber(next);
    scrollRef.current?.scrollTo(0, 0);
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border bg-slate-100">
      {file && (
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-b bg-white px-2 py-1.5">
          <div role="group" aria-label="PDF pages" className="flex items-center gap-1">
            <Button type="button" variant="ghost" size="icon" className="size-8" aria-label="Previous page" disabled={pageNumber === 1} onClick={() => goToPage(pageNumber - 1)}>
              <ChevronLeft aria-hidden="true" className="size-4" />
            </Button>
            <span aria-live="polite" className="whitespace-nowrap text-xs tabular-nums">
              {pageNumber} / {file.document.numPages}
            </span>
            <Button type="button" variant="ghost" size="icon" className="size-8" aria-label="Next page" disabled={pageNumber === file.document.numPages} onClick={() => goToPage(pageNumber + 1)}>
              <ChevronRight aria-hidden="true" className="size-4" />
            </Button>
          </div>
          <div role="group" aria-label="PDF zoom" className="flex items-center gap-1">
            <Button type="button" variant="ghost" size="icon" className="size-8" aria-label="Zoom out" disabled={zoom === 100} onClick={() => setZoom(zoom - 25)}>
              <Minus aria-hidden="true" className="size-4" />
            </Button>
            <span aria-live="polite" className="w-10 text-center text-xs tabular-nums">{zoom}%</span>
            <Button type="button" variant="ghost" size="icon" className="size-8" aria-label="Zoom in" disabled={zoom === 200} onClick={() => setZoom(zoom + 25)}>
              <Plus aria-hidden="true" className="size-4" />
            </Button>
          </div>
          <Button asChild variant="outline" size="sm" className="h-8 gap-1.5 px-2 text-xs">
            <a href={file.downloadUrl} download="encounter.pdf">
              <Download aria-hidden="true" className="size-3.5" />
              Download PDF
            </a>
          </Button>
        </div>
      )}
      <div ref={scrollRef} tabIndex={0} aria-label="PDF document" className="min-h-0 flex-1 overflow-auto p-2">
        {loadError || pageError ? (
          <p role="alert" className="p-4 text-sm text-red-800">
            {loadError ? "Couldn’t open the PDF returned by the adapter." : "Couldn’t render this page."}
          </p>
        ) : !pageReady && (
          <div role="status" className="p-4 text-sm text-slate-600"><Loading label="Rendering PDF…" /></div>
        )}
        <canvas
          ref={canvasRef}
          role="img"
          aria-label={`PDF page ${pageNumber}`}
          className="mx-auto max-w-none bg-white shadow-sm"
          hidden={!pageReady}
        />
      </div>
    </div>
  );
}
