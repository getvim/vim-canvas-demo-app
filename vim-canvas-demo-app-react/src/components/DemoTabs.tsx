import type { PropsWithChildren, ReactNode } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { Database, Terminal } from "lucide-react";

const tabs = [
  { id: "entities", label: "EHR data", icon: Database },
  { id: "actions", label: "Adapter Actions", icon: Terminal },
] as const;

export function DemoTabs({ children, actions }: PropsWithChildren<{ actions: ReactNode }>) {
  return (
    <Tabs.Root defaultValue="entities">
      <div className="border-b border-slate-200 bg-white px-3 py-2">
        <Tabs.List
          aria-label="Vim Canvas demo"
          className="mx-auto grid max-w-lg grid-cols-2 gap-1 rounded-lg bg-slate-100 p-1"
        >
          {tabs.map(({ id, label, icon: Icon }) => (
            <Tabs.Trigger
              key={id}
              value={id}
              className="flex min-w-0 items-center justify-center gap-1.5 rounded-md px-1.5 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-white/60 hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-700 data-[state=active]:bg-white data-[state=active]:text-teal-800 data-[state=active]:shadow-sm"
            >
              <Icon aria-hidden="true" className="size-3.5 shrink-0" />
              <span>{label}</span>
            </Tabs.Trigger>
          ))}
        </Tabs.List>
      </div>
      <Tabs.Content value="entities" forceMount className="data-[state=inactive]:hidden">
        {children}
      </Tabs.Content>
      <Tabs.Content value="actions" forceMount className="data-[state=inactive]:hidden">
        {actions}
      </Tabs.Content>
    </Tabs.Root>
  );
}
