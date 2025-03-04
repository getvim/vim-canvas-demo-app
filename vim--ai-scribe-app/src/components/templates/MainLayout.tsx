import { ReactNode } from 'react';
import { Stethoscope } from 'lucide-react';
import { NavigationBar } from '../molecules/NavigationBar';

interface MainLayoutProps {
  children: ReactNode;
  activeTab: 'record' | 'notes' | 'user';
  onTabChange: (tab: 'record' | 'notes' | 'user') => void;
  hasCurrentNote: boolean;
}

export function MainLayout({
  children,
  activeTab,
  onTabChange,
  hasCurrentNote
}: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-center">
          <div className="flex flex-col items-center space-y-2">
            <Stethoscope className="h-12 w-12 text-green-500" />
            <h1 className="text-3xl font-bold text-green-600">AIScribe</h1>
          </div>
        </div>
      </header>

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