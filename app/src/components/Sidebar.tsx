import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';

interface SidebarProps {
  onCreateTask?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onCreateTask }) => {
  const [expanded, setExpanded] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useApp();

  const NAV_ITEMS = [
    { path: '/dashboard', icon: 'grid_view',     label: t.myTasks },
    { path: '/spaces',    icon: 'workspaces',     label: t.spaces },
    { path: '/calendar',  icon: 'calendar_today', label: t.calendar },
    { path: '/reports',   icon: 'bar_chart',      label: t.reports },
    { path: '/inbox',     icon: 'inbox',          label: t.inbox },
  ];

  return (
    <aside className={`${expanded ? 'w-56' : 'w-16'} hidden md:flex flex-col h-full bg-surface-container/95 backdrop-blur-xl p-3 gap-1 border-r border-outline-variant/25 z-40 transition-all duration-300 ease-in-out shrink-0`}>
      {/* Header */}
      <div className="flex items-center justify-between px-2 mb-4">
        {expanded && (
          <div className="overflow-hidden">
            <h2 className="text-sm font-bold text-on-surface whitespace-nowrap">{t.appName}</h2>
            <p className="text-[10px] text-on-surface-variant">{t.readOnly}</p>
          </div>
        )}
        <button onClick={() => setExpanded(!expanded)} className="p-1.5 hover:bg-surface-container-high rounded-md transition-colors text-on-surface-variant ml-auto">
          <span className="material-symbols-outlined text-sm">{expanded ? 'chevron_left' : 'chevron_right'}</span>
        </button>
      </div>

      {/* Create Task Button */}
      <button onClick={onCreateTask}
        className="mb-3 bg-gradient-to-r from-primary to-primary-dim text-on-primary py-2 px-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-md hover:opacity-90 transition-all overflow-hidden">
        <span className="material-symbols-outlined text-lg shrink-0">add</span>
        {expanded && <span className="whitespace-nowrap text-xs">{t.newLocalTask}</span>}
      </button>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-0.5">
        {NAV_ITEMS.map(item => {
          const isActive = location.pathname === item.path;
          return (
            <button key={item.path} onClick={() => navigate(item.path)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all w-full text-left ${
                isActive
                  ? 'bg-primary-container/75 text-on-primary-container shadow-sm font-bold'
                  : 'text-on-surface-variant hover:bg-surface-container-high'
              }`}>
              <span className="material-symbols-outlined text-[20px] shrink-0" style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}>
                {item.icon}
              </span>
              {expanded && <span className="text-sm whitespace-nowrap">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-outline-variant/25 pt-2 flex flex-col gap-0.5 mt-2">
        <button onClick={() => navigate('/settings')}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all w-full text-left ${location.pathname === '/settings' ? 'bg-primary-container/75 text-on-primary-container font-bold' : 'text-on-surface-variant hover:bg-surface-container-high'}`}>
          <span className="material-symbols-outlined text-[20px] shrink-0">settings</span>
          {expanded && <span className="text-sm whitespace-nowrap">{t.settings}</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
