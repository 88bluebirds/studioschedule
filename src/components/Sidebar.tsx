import React from 'react';
import {
  Calendar,
  LayoutGrid,
  ListFilter,
  BarChart3,
  Printer,
  Download,
  Settings as SettingsIcon,
  Users,
  Sparkles,
  Layers,
  Clock,
  X,
} from 'lucide-react';
import { Booking, StudioSettings, ViewMode } from '../types';
import { getTodayDateString } from '../utils/dateUtils';

interface SidebarProps {
  viewMode: ViewMode;
  onViewModeChange: (view: ViewMode) => void;
  settings: StudioSettings;
  bookings: Booking[];
  selectedDate: string;
  onOpenSettings: () => void;
  onOpenPrint: () => void;
  onOpenExportModal: () => void;
  onOpenBookingModal: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  viewMode,
  onViewModeChange,
  settings,
  bookings,
  selectedDate,
  onOpenSettings,
  onOpenPrint,
  onOpenExportModal,
  onOpenBookingModal,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const isToday = selectedDate === getTodayDateString();

  // Calculate today's occupancy rate
  const targetDateBookings = bookings.filter(
    (b) => b.date === selectedDate && b.status !== 'cancelled'
  );
  const totalBookedHours = targetDateBookings.reduce((sum, b) => sum + b.durationHours, 0);
  const totalAvailableHours = (settings.endHour - settings.startHour + 1) * 2; // 2 rooms
  const occupancyPercent = Math.min(
    100,
    Math.round((totalBookedHours / Math.max(1, totalAvailableHours)) * 100)
  );

  const handleNavClick = (view: ViewMode) => {
    onViewModeChange(view);
    if (onCloseMobile) onCloseMobile();
  };

  const content = (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-full shrink-0 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-100 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1.5">
            {/* Ballet Slipper with soft pink background */}
            <div
              id="sidebar-ballerina-logo"
              className="w-9 h-9 bg-pink-100 border border-pink-200/80 rounded-xl flex items-center justify-center text-rose-900 shadow-2xs shrink-0 ring-1 ring-pink-200/60"
              title="Athabasca Dance"
            >
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5 fill-rose-900"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                {/* Ballet Slipper / Pointe Shoe Silhouette with Ribbons */}
                {/* Criss-cross Ribbons */}
                <path
                  d="M8.2 2.5c.3 0 .6.2.7.5.7 1.4 1.7 2.6 2.9 3.5.3.2.4.6.2.9-.2.3-.6.4-.9.2-1.4-1-2.5-2.4-3.3-4-.1-.3 0-.7.4-.9v-.2z"
                  opacity="0.75"
                />
                <path
                  d="M15.8 2.5c-.3 0-.6.2-.7.5-.7 1.4-1.7 2.6-2.9 3.5-.3.2-.4.6-.2.9.2.3.6.4.9.2 1.4-1 2.5-2.4 3.3-4 .1-.3 0-.7-.4-.9v-.2z"
                  opacity="0.75"
                />
                <path
                  d="M12 5.8c.8.7 1.7 1.3 2.7 1.8.3.2.4.6.2.9-.2.3-.6.4-.9.2-1.1-.5-2.1-1.2-3-2-.3-.2-.4-.6-.2-.9.2-.3.6-.4.9-.2.1.1.2.1.3.2z"
                  opacity="0.75"
                />
                <path
                  d="M12 5.8c-.8.7-1.7 1.3-2.7 1.8-.3.2-.4.6-.2.9.2.3.6.4.9.2 1.1-.5 2.1-1.2 3-2 .3-.2.4-.6.2-.9-.2-.3-.6-.4-.9-.2-.1.1-.2.1-.3.2z"
                  opacity="0.75"
                />
                {/* Left Slipper */}
                <path d="M7 8.5c-.5 1.5-.7 3.5-.6 5.8.2 3.1 1.2 5.8 2.3 6.9.5.5 1.2.4 1.7-.1.5-.5.6-1.2.4-1.9-.3-1.6-.9-3.9-1.2-6.3-.2-1.9-.1-3.5.3-4.4.2-.4 0-.9-.4-1.1-.4-.2-.9 0-1.1.4-.2.2-.3.4-.4.7z" />
                {/* Right Slipper (Pointe Shoe) */}
                <path d="M13.2 8c-.6 1.8-.8 4.2-.7 6.8.2 3.5 1.3 6.6 2.6 7.7.5.5 1.3.5 1.8-.1.5-.5.6-1.3.4-2.1-.4-1.8-1-4.4-1.3-7.1-.2-2.1-.1-3.9.4-4.9.2-.4 0-.9-.4-1.1-.4-.2-.9 0-1.1.4-.3.4-.5.8-.7 1.4z" />
                {/* Pointe box tips */}
                <rect x="8.5" y="20.8" width="2.4" height="1" rx="0.5" transform="rotate(-10 9.7 21.3)" opacity="0.6" />
                <rect x="14.8" y="21.5" width="2.6" height="1" rx="0.5" transform="rotate(-8 16.1 22)" opacity="0.6" />
              </svg>
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-slate-900 truncate max-w-[150px]">
                {settings.studioName || 'Athabasca Dance'}
              </h1>
            </div>
          </div>
          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-50 border border-rose-100/80 text-[10px] text-rose-800 font-bold uppercase tracking-wider">
            <span>Staff & Exec Access</span>
          </div>
        </div>

        {isMobileOpen && onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 md:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Timetable & Spaces
        </div>

        <button
          onClick={() => handleNavClick('dual-day')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-md font-medium text-sm transition-colors text-left ${
            viewMode === 'dual-day'
              ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-2xs'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Calendar className="w-4 h-4 text-indigo-600 shrink-0" />
          <span>📅 Schedule View (Day)</span>
        </button>

        <button
          onClick={() => handleNavClick('weekly')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-md font-medium text-sm transition-colors text-left ${
            viewMode === 'weekly'
              ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-2xs'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <LayoutGrid className="w-4 h-4 text-indigo-600 shrink-0" />
          <span>📊 Weekly Matrix</span>
        </button>

        {/* Studio Operations */}
        <div className="pt-4 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Operations & Tools
        </div>

        <button
          onClick={() => {
            onOpenPrint();
            if (onCloseMobile) onCloseMobile();
          }}
          className="w-full flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-md text-sm font-medium transition-colors text-left"
        >
          <Printer className="w-4 h-4 text-slate-400 shrink-0" />
          <span>🖨️ Print Call Sheet</span>
        </button>

        <button
          onClick={() => {
            onOpenExportModal();
            if (onCloseMobile) onCloseMobile();
          }}
          className="w-full flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-md text-sm font-medium transition-colors text-left"
        >
          <Download className="w-4 h-4 text-slate-400 shrink-0" />
          <span>💾 Backup & Export</span>
        </button>

        <button
          onClick={() => {
            onOpenSettings();
            if (onCloseMobile) onCloseMobile();
          }}
          className="w-full flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-md text-sm font-medium transition-colors text-left"
        >
          <SettingsIcon className="w-4 h-4 text-slate-400 shrink-0" />
          <span>⚙️ Settings & Rooms</span>
        </button>
      </nav>

      {/* Sidebar Bottom: Occupancy Widget */}
      <div className="p-4 border-t border-slate-100">
        <div className="bg-slate-900 rounded-xl p-4 text-white shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>{isToday ? 'Occupancy Today' : 'Day Occupancy'}</span>
            <span className="text-[10px] font-mono text-slate-400">2 Rooms</span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black">{occupancyPercent}%</span>
            <span className="text-xs text-emerald-400 font-semibold">
              {totalBookedHours} hrs booked
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-700 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-indigo-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${occupancyPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2">
            <span>{targetDateBookings.length} sessions</span>
            <span>{settings.rooms['room-1'].name.split(' ')[0]} + {settings.rooms['room-2'].name.split(' ')[0]}</span>
          </div>
        </div>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <div className="hidden md:flex shrink-0 h-full">{content}</div>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white z-10 shadow-2xl animate-in slide-in-from-left duration-200">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
