import { ReactNode } from "react";
import { NavigationBar } from "../molecules/NavigationBar";
import { AppHeader } from "../organisms/ai-scribe-demo/AppHeader";

interface MainLayoutProps {
  children: ReactNode;
  activeTab: "record" | "notes" | "user";
  onTabChange: (tab: "record" | "notes" | "user") => void;
  hasCurrentNote: boolean;
}

export function MainLayout({
  children,
  activeTab,
  onTabChange,
  hasCurrentNote,
}: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <AppHeader />

      <main className="max-w-3xl mx-auto px-4 py-6 sm:px-6 lg:px-8 mb-24">
        {children}
      </main>

      <NavigationBar
        activeTab={activeTab}
        onTabChange={onTabChange}
        hasCurrentNote={hasCurrentNote}
      />
    </div>
  );
}
