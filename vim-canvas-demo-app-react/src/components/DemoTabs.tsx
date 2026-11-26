import { useRef, useState, type PropsWithChildren, type ReactNode } from "react";
import { Database, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "entities", label: "EHR data", icon: Database },
  { id: "actions", label: "Adapter Actions", icon: Terminal },
] as const;

export function DemoTabs({ children, actions }: PropsWithChildren<{ actions: ReactNode }>) {
  const [active, setActive] = useState(0);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);

  return (
    <>
      <div className="border-b border-slate-200 bg-white px-3 py-2">
        <div
          role="tablist"
          aria-label="Vim Canvas demo"
          className="mx-auto grid max-w-lg grid-cols-2 gap-1 rounded-lg bg-slate-100 p-1"
        >
          {tabs.map(({ id, label, icon: Icon }, index) => (
            <button
              key={id}
              ref={(button) => { buttons.current[index] = button; }}
              id={`demo-tab-${id}`}
              type="button"
              role="tab"
              aria-selected={index === active}
              aria-controls={`demo-panel-${id}`}
              tabIndex={index === active ? 0 : -1}
              className={cn(
                "flex min-w-0 items-center justify-center gap-1.5 rounded-md px-1.5 py-2 text-xs font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-700",
                index === active
                  ? "bg-white text-teal-800 shadow-sm"
                  : "text-slate-600 hover:bg-white/60 hover:text-slate-900"
              )}
              onClick={() => setActive(index)}
              onKeyDown={(event) => {
                const { key } = event;
                if (key !== "ArrowLeft" && key !== "ArrowRight" && key !== "Home" && key !== "End") {
                  return;
                }
                event.preventDefault();
                const next = key === "Home" ? 0 : key === "End" ? tabs.length - 1 : (index + 1) % tabs.length;
                setActive(next);
                buttons.current[next]?.focus();
              }}
            >
              <Icon aria-hidden="true" className="size-3.5 shrink-0" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>
      <div id="demo-panel-entities" aria-labelledby="demo-tab-entities" role="tabpanel" hidden={active !== 0}>
        {children}
      </div>
      <div id="demo-panel-actions" aria-labelledby="demo-tab-actions" role="tabpanel" hidden={active !== 1}>
        {actions}
      </div>
    </>
  );
}
