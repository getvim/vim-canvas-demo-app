import { createElement, lazy, Suspense, useMemo, useState, type ReactNode } from "react";
import { Braces, Check, Copy, FileText } from "lucide-react";
import { useVimOsContext } from "@/hooks/useVimOsContext";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "./ui/dialog";
import { JSONView } from "./ui/jsonView";
import { Loading } from "./ui/loading";

const largeJsonLength = 100_000;
const PdfPreview = lazy(() => import("./PdfPreview").catch(() => ({
  default: () => <p role="alert" className="p-4 text-sm text-red-800">Couldn’t load the PDF viewer. Reload the app to try again.</p>,
})));
const documentTags = new Set([
  "article", "section", "div", "p", "span", "br", "hr",
  "h1", "h2", "h3", "h4", "h5", "h6", "strong", "b", "em", "i", "u", "small",
  "blockquote", "pre", "ul", "ol", "li", "dl", "dt", "dd",
  "table", "caption", "thead", "tbody", "tfoot", "tr", "th", "td",
]);
const omittedTags = new Set([
  "script", "style", "template", "noscript", "iframe", "object", "embed", "svg", "math",
]);

function renderDocumentNodes(nodes: NodeListOf<ChildNode>, depth = 0): ReactNode {
  if (depth >= 64) return null;

  return Array.from(nodes, (node, key) => {
    if (node.nodeType === Node.TEXT_NODE) return node.textContent;
    if (!(node instanceof HTMLElement) || omittedTags.has(node.localName)) return null;

    // Rebuild only document structure. Source attributes, CSS, and links are inert.
    const tag = node.localName;
    if (tag === "br" || tag === "hr") return createElement(tag, { key });

    const children = renderDocumentNodes(node.childNodes, depth + 1);
    if (tag === "th" || tag === "td") {
      const cell = node as HTMLTableCellElement;
      return createElement(tag, { key, colSpan: cell.colSpan, rowSpan: cell.rowSpan }, children);
    }
    return createElement(documentTags.has(tag) ? tag : "span", { key }, children);
  });
}

export type ActionResponse = { json: string; html?: string; pdf?: string };

export function AdapterActionResponse({ response }: { response: ActionResponse }) {
  const { utils } = useVimOsContext();
  const [view, setView] = useState(response.html ? "preview" : "json");
  const [pdfOpen, setPdfOpen] = useState(false);
  const [copyState, setCopyState] = useState<"idle" | "copying" | "copied" | "failed">("idle");
  const jsonValue = useMemo(() => {
    if (view !== "json") return null;
    const value: unknown = JSON.parse(response.json);
    return value !== null && typeof value === "object" ? value : { value };
  }, [response.json, view]);
  const [documentContent] = useState(() => {
    if (!response.html) return null;
    // Template contents are inert, including resource URLs, before rebuilding.
    const template = window.document.createElement("template");
    template.innerHTML = response.html;
    return renderDocumentNodes(template.content.childNodes);
  });

  async function copyResponse() {
    setCopyState("copying");
    try {
      await utils.copyToClipboard(response.json);
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }
  }

  return (
    <section aria-label="Action response" className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2">
        <h3 className="flex items-center gap-2 text-xs font-semibold text-slate-700">
          <Braces aria-hidden="true" className="size-4 text-teal-800" />
          Action response
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {response.pdf && (
            <Dialog open={pdfOpen} onOpenChange={setPdfOpen}>
              <DialogTrigger asChild>
                <Button
                  type="button"
                  size="sm"
                  className="h-7 gap-1.5 rounded-md bg-teal-800 px-2 text-xs text-white hover:bg-teal-900"
                >
                  <FileText aria-hidden="true" className="size-3.5" />
                  View PDF
                </Button>
              </DialogTrigger>
              {pdfOpen && (
                <DialogContent className="flex h-[90dvh] w-[calc(100%-1rem)] max-w-5xl flex-col gap-2 overflow-hidden rounded-lg p-3.5">
                  <DialogTitle className="pr-8 text-sm">Encounter PDF</DialogTitle>
                  <DialogDescription className="sr-only">PDF returned by the adapter action.</DialogDescription>
                  <Suspense fallback={<div role="status" className="p-4 text-sm"><Loading label="Loading viewer…" /></div>}>
                    <PdfPreview pdf={response.pdf} />
                  </Suspense>
                </DialogContent>
              )}
            </Dialog>
          )}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-7 gap-1.5 rounded-md border-slate-200 px-2 text-xs text-slate-700 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-700"
            onClick={copyResponse}
            disabled={copyState === "copying"}
          >
            {copyState === "copied"
              ? <Check aria-hidden="true" className="size-3.5 text-teal-800" />
              : <Copy aria-hidden="true" className="size-3.5" />}
            {copyState === "copied" ? "Copied" : "Copy JSON"}
          </Button>
        </div>
      </div>
      <span className="sr-only" role="status">
        {copyState === "copied" ? "Response copied." : ""}
      </span>
      {copyState === "failed" && (
        <p role="alert" className="px-3.5 pb-2 text-xs text-red-800">Couldn’t copy the response. Try again.</p>
      )}
      {response.html && (
        <div role="group" aria-label="Response view" className="flex gap-1 border-t border-slate-100 px-3.5 py-1.5">
          {(["preview", "json"] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              aria-pressed={view === mode}
              onClick={() => setView(mode)}
              className="rounded-md px-2.5 py-1 text-xs font-medium text-slate-600 aria-pressed:bg-teal-50 aria-pressed:text-teal-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-700"
            >
              {mode === "preview" ? "Document" : "JSON"}
            </button>
          ))}
        </div>
      )}
      {view === "preview" ? (
        <div
          tabIndex={0}
          aria-label="Document preview"
          className="max-h-96 overflow-auto break-words border-t border-slate-200 bg-slate-50 px-3.5 py-3 text-sm leading-relaxed text-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-teal-700 [&_h1]:text-lg [&_h2]:text-base [&_:is(h1,h2,h3,h4,h5,h6)]:mb-1 [&_:is(h1,h2,h3,h4,h5,h6)]:font-semibold [&_p]:mb-2 [&_ul]:list-disc [&_ol]:list-decimal [&_:is(ul,ol)]:pl-5 [&_table]:my-2 [&_td]:border [&_td]:p-1.5 [&_th]:border [&_th]:bg-slate-100 [&_th]:p-1.5 [&_pre]:whitespace-pre-wrap"
        >
          {documentContent}
        </div>
      ) : jsonValue ? (
        <div
          tabIndex={0}
          aria-label="Response JSON"
          className="max-h-96 overflow-auto border-t border-slate-200 p-3.5 [overflow-wrap:anywhere] focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-teal-700"
        >
          <JSONView value={jsonValue} collapsed={response.json.length > largeJsonLength} />
        </div>
      ) : null}
    </section>
  );
}
