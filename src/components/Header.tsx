import React from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Printer,
  Settings as SettingsIcon,
  LayoutGrid,
  Columns,
  ListFilter,
  BarChart3,
  Download,
  Menu,
} from 'lucide-react';
import { StudioSettings, ViewMode } from '../types';
import { formatDateDisplay, addDays, getTodayDateString } from '../utils/dateUtils';

interface HeaderProps {
  selectedDate: string;
  onDateChange: (newDate: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (view: ViewMode) => void;
  settings: StudioSettings;
  onOpenBookingModal: (prefill?: { roomId?: 'room-1' | 'room-2'; hour?: number; date?: string }) => void;
  onOpenSettings: () => void;
  onOpenPrint: () => void;
  onOpenExportModal: () => void;
  onToggleMobileSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  selectedDate,
  onDateChange,
  viewMode,
  onViewModeChange,
  settings,
  onOpenBookingModal,
  onOpenSettings,
  onOpenPrint,
  onOpenExportModal,
  onToggleMobileSidebar,
}) => {
  const isToday = selectedDate === getTodayDateString();

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 md:px-8 flex items-center justify-between shrink-0 sticky top-0 z-30 shadow-2xs">
      {/* Left: Mobile Toggle & Date Header with Segmented Navigation */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Mobile menu toggle */}
        {onToggleMobileSidebar && (
          <button
            onClick={onToggleMobileSidebar}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 md:hidden transition-colors"
            title="Open Studio Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {/* Date Display */}
        <div className="flex items-center gap-2 sm:gap-3">
          <h2 className="text-sm sm:text-base md:text-xl font-bold tracking-tight text-slate-900 truncate">
            {formatDateDisplay(selectedDate)}
          </h2>

          {/* Segmented Date Switcher */}
          <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white shadow-2xs">
            <button
              id="btn-prev-day"
              onClick={() => onDateChange(addDays(selectedDate, -1))}
              aria-label="Previous day"
              className="px-2.5 sm:px-3 py-1 bg-white border-r border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors"
              title="Previous Day"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            <div className="relative">
              <input
                id="date-picker-input"
                type="date"
                value={selectedDate}
                onChange={(e) => e.target.value && onDateChange(e.target.value)}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
              />
              <button
                id="btn-go-today"
                onClick={() => onDateChange(getTodayDateString())}
                className={`px-3 sm:px-4 py-1 text-xs sm:text-sm font-medium transition-colors ${
                  isToday ? 'bg-slate-50 text-indigo-600 font-semibold' : 'bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                Today
              </button>
            </div>

            <button
              id="btn-next-day"
              onClick={() => onDateChange(addDays(selectedDate, 1))}
              aria-label="Next day"
              className="px-2.5 sm:px-3 py-1 bg-white border-l border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors"
              title="Next Day"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Right: View switcher & Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* View Switcher Tabs (Desktop) */}
        <div className="hidden lg:flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
          <button
            id="view-tab-dual-day"
            onClick={() => onViewModeChange('dual-day')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
              viewMode === 'dual-day'
                ? 'bg-white text-indigo-700 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Day Matrix
          </button>

          <button
            id="view-tab-weekly"
            onClick={() => onViewModeChange('weekly')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
              viewMode === 'weekly'
                ? 'bg-white text-indigo-700 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Weekly Matrix
          </button>
        </div>

        {/* Action icons */}
        <div className="hidden sm:flex items-center gap-1 text-slate-500">
          <button
            id="btn-print-schedule"
            onClick={onOpenPrint}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            title="Print Call Sheet"
          >
            <Printer className="w-4 h-4" />
          </button>

          <button
            id="btn-export-backup"
            onClick={onOpenExportModal}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            title="Export & Backup Data"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            id="btn-open-settings"
            onClick={onOpenSettings}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            title="Studio Settings"
          >
            <SettingsIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Primary "+ New Booking" Button */}
        <button
          id="btn-new-booking-header"
          onClick={() => onOpenBookingModal()}
          className="px-3.5 sm:px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs sm:text-sm font-semibold shadow-xs hover:bg-indigo-700 active:bg-indigo-800 transition-colors flex items-center gap-1.5 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>New Booking</span>
        </button>
      </div>
    </header>
  );
};
