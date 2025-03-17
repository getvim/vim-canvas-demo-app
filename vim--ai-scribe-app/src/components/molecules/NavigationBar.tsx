import { Mic, ClipboardList, User } from 'lucide-react';
import { IconButton } from '../atoms/IconButton';

interface NavigationBarProps {
  activeTab: 'record' | 'notes' | 'user';
  onTabChange: (tab: 'record' | 'notes' | 'user') => void;
  hasCurrentNote: boolean;
}

export function NavigationBar({ activeTab, onTabChange, hasCurrentNote }: NavigationBarProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div className="max-w-3xl mx-auto px-4 py-2 flex justify-around">
        <IconButton
          Icon={Mic}
          onClick={() => onTabChange('record')}
          active={activeTab === 'record'}
        />
        <IconButton
          Icon={ClipboardList}
          onClick={() => onTabChange('notes')}
          active={activeTab === 'notes'}
          disabled={!hasCurrentNote}
        />
        <IconButton
          Icon={User}
          onClick={() => onTabChange('user')}
          active={activeTab === 'user'}
        />
      </div>
    </nav>
  );
}