import React from 'react';
import { X, Printer, Calendar, Clock, Download, MapPin } from 'lucide-react';
import { Booking, StudioSettings } from '../types';
import { formatDateDisplay, formatTimeRange, getTodayDateString } from '../utils/dateUtils';

interface PrintScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string;
  bookings: Booking[];
  settings: StudioSettings;
}

export const PrintScheduleModal: React.FC<PrintScheduleModalProps> = ({
  isOpen,
  onClose,
  selectedDate,
  bookings,
  settings,
}) => {
  if (!isOpen) return null;

  const dayBookings = bookings
    .filter((b) => b.date === selectedDate && b.status !== 'cancelled')
    .sort((a, b) => a.startHour - b.startHour);

  const room1Bookings = dayBookings.filter((b) => b.roomId === 'room-1');
  const room2Bookings = dayBookings.filter((b) => b.roomId === 'room-2');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 print:p-0 print:bg-white print:static">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 print:my-0 print:border-none print:shadow-none animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Controls (hidden when printing) */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-indigo-400" />
            <h2 className="text-sm sm:text-base font-bold text-white">Daily Call Sheet / Print Preview</h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Call Sheet</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-6 sm:p-8 space-y-6 text-slate-900 print:p-0">
          {/* Header */}
          <div className="border-b-2 border-slate-900 pb-4 flex items-start justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                {settings.studioName}
              </h1>
              <p className="text-xs text-slate-600 font-medium">{settings.tagline}</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Daily Schedule</span>
              <p className="text-base sm:text-lg font-bold text-slate-900">
                {formatDateDisplay(selectedDate)}
              </p>
            </div>
          </div>

          {/* Two Studios Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Studio 1 Roster */}
            <div className="border border-slate-300 rounded-xl overflow-hidden">
              <div className="bg-slate-100 p-3 border-b border-slate-300 flex items-center justify-between">
                <h3 className="font-black text-sm text-slate-900 uppercase tracking-wide">
                  {settings.rooms['room-1'].name}
                </h3>
                <span className="text-xs text-slate-600 font-medium">
                  {room1Bookings.length} sessions
                </span>
              </div>

              <div className="divide-y divide-slate-200">
                {room1Bookings.length === 0 ? (
                  <p className="p-4 text-xs text-slate-500 italic text-center">No sessions booked</p>
                ) : (
                  room1Bookings.map((b) => (
                    <div key={b.id} className="p-3 text-xs space-y-1">
                      <div className="flex items-center justify-between font-mono font-bold text-indigo-900">
                        <span>{formatTimeRange(b.startHour, b.durationHours, settings.timeFormat)}</span>
                        <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded font-sans uppercase font-bold text-slate-700">
                          {b.genre}
                        </span>
                      </div>
                      <p className="font-bold text-sm text-slate-900">{b.title}</p>
                      <div className="flex items-center justify-between text-slate-600 text-[11px] pt-1">
                        <span>Lead: <strong>{b.instructor}</strong></span>
                      </div>
                      {b.notes && <p className="text-[10px] text-slate-500 italic pt-0.5">Note: {b.notes}</p>}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Studio 2 Roster */}
            <div className="border border-slate-300 rounded-xl overflow-hidden">
              <div className="bg-slate-100 p-3 border-b border-slate-300 flex items-center justify-between">
                <h3 className="font-black text-sm text-slate-900 uppercase tracking-wide">
                  {settings.rooms['room-2'].name}
                </h3>
                <span className="text-xs text-slate-600 font-medium">
                  {room2Bookings.length} sessions
                </span>
              </div>

              <div className="divide-y divide-slate-200">
                {room2Bookings.length === 0 ? (
                  <p className="p-4 text-xs text-slate-500 italic text-center">No sessions booked</p>
                ) : (
                  room2Bookings.map((b) => (
                    <div key={b.id} className="p-3 text-xs space-y-1">
                      <div className="flex items-center justify-between font-mono font-bold text-emerald-900">
                        <span>{formatTimeRange(b.startHour, b.durationHours, settings.timeFormat)}</span>
                        <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded font-sans uppercase font-bold text-slate-700">
                          {b.genre}
                        </span>
                      </div>
                      <p className="font-bold text-sm text-slate-900">{b.title}</p>
                      <div className="flex items-center justify-between text-slate-600 text-[11px] pt-1">
                        <span>Lead: <strong>{b.instructor}</strong></span>
                      </div>
                      {b.notes && <p className="text-[10px] text-slate-500 italic pt-0.5">Note: {b.notes}</p>}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Footer for call sheet */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
            <span>Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            <span>Front Desk & Studio Reception Log</span>
          </div>
        </div>
      </div>
    </div>
  );
};
