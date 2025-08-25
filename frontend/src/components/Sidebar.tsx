import React from 'react';
import { useApp } from '../context/AppContext';
import Navigation from './Navigation';

interface AppState {
  menuOpen: boolean;
  user: any;
  cart: {
    items: any[];
  };
  notifications: {
    unread: number;
  };
}

const Sidebar: React.FC = () => {
  const { state } = useApp();
  const appState = state as AppState;

  return (
    <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r transform ${
      appState.menuOpen ? 'translate-x-0' : '-translate-x-full'
    } lg:translate-x-0 transition-transform duration-200 ease-in-out`}>
      <div className="h-full flex flex-col">
        {/* Logo section - visible on desktop */}
        <div className="h-16 flex-shrink-0 flex items-center justify-center border-b lg:hidden">
          <img
            className="h-8 w-auto"
            src="/assets/logo.jpg"
            alt="Tabison Suppliers"
          />
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto pt-5 pb-4">
          <Navigation />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
