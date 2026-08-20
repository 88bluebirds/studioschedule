import React, { useState } from 'react';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  Users,
  Layers,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Booking, RoomId, StudioSettings } from '../types';
import {
  addDays,
  formatDateDisplay,
  formatHour,
  formatShortDate,
  generateHoursArray,
  getGenreTheme,
  getTodayDateString,
  getWeekDays,
} from '../utils/dateUtils';

interface WeeklyGridViewProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  bookings: Booking[];
  settings: StudioSettings;
  onSelectBooking: (booking: Booking) => void;
  onOpenBookingModal: (prefill: { roomId: RoomId; hour: number; date: string }) => void;
}

export const WeeklyGridView: React.FC<WeeklyGridViewProps> = ({
  selectedDate,
  onDateChange,
  bookings,
  settings,
  onSelectBooking,
  onOpenBookingModal,
}) => {
  const [selectedRoomFilter, setSelectedRoomFilter] = useState<'all' | RoomId>('all');
  const weekDays = getWeekDays(selectedDate);
  const hours = generateHoursArray(settings.startHour, settings.endHour);
  const todayStr = getTodayDateString();

  const activeBookings = bookings.filter((b) => b.status !== 'cancelled');

  return (
    <div className="h-full flex flex-col bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
      {/* Weekly Top Navigation & Filters */}
      <div className="p-3 sm:p-4 border-b border-slate-200 bg-white flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white shadow-2xs">
            <button
              onClick={() => onDateChange(addDays(selectedDate, -7))}
              className="p-1.5 hover:bg-slate-50 border-r border-slate-200 text-slate-400 hover:text-slate-700 transition-colors"
              title="Previous Week"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDateChange(getTodayDateString())}
              className="px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Current Week
            </button>
            <button
              onClick={() => onDateChange(addDays(selectedDate, 7))}
              className="p-1.5 hover:bg-slate-50 border-l border-slate-200 text-slate-400 hover:text-slate-700 transition-colors"
              title="Next Week"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <span className="text-xs sm:text-sm font-bold text-slate-900">
            {formatShortDate(weekDays[0])} – {formatShortDate(weekDays[6])}
          </span>
        </div>

        {/* Room Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
          <button
            onClick={() => setSelectedRoomFilter('all')}
            className={`px-3 py-1 rounded-md font-semibold transition-all ${
              selectedRoomFilter === 'all'
                ? 'bg-white text-indigo-700 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Both Studios
          </button>
          <button
            onClick={() => setSelectedRoomFilter('room-1')}
            className={`px-3 py-1 rounded-md font-semibold transition-all ${
              selectedRoomFilter === 'room-1'
                ? 'bg-white text-indigo-700 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {settings.rooms['room-1'].name}
          </button>
          <button
            onClick={() => setSelectedRoomFilter('room-2')}
            className={`px-3 py-1 rounded-md font-semibold transition-all ${
              selectedRoomFilter === 'room-2'
                ? 'bg-white text-indigo-700 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {settings.rooms['room-2'].name}
          </button>
        </div>
      </div>

      {/* Grid Container */}
      <div className="flex-1 overflow-auto">
        <table className="w-full border-collapse min-w-[850px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 sticky top-0 z-20">
              <th className="w-16 p-2 text-center text-[10px] font-bold uppercase tracking-wider text-slate-400 border-r border-slate-200">
                Time
              </th>
              {weekDays.map((date) => {
                const isDayToday = date === todayStr;
                const dateObj = new Date(date + 'T00:00:00');
                const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
                const dayNum = dateObj.getDate();

                return (
                  <th
                    key={date}
                    className={`p-2.5 text-center border-r border-slate-200 min-w-[110px] ${
                      isDayToday ? 'bg-indigo-50/60' : ''
                    }`}
                  >
                    <div className="text-[11px] font-semibold text-slate-500 uppercase">
                      {dayName}
                    </div>
                    <div
                      className={`text-sm font-bold inline-block px-2 py-0.5 rounded-full ${
                        isDayToday ? 'bg-indigo-600 text-white shadow-2xs' : 'text-slate-900'
                      }`}
                    >
                      {dayNum}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {hours.map((hour) => (
              <tr key={hour} className="h-16 hover:bg-slate-50/40 transition-colors">
                <td className="p-1 text-center text-[11px] font-mono font-semibold text-slate-400 bg-slate-50/50 border-r border-slate-200 align-middle">
                  {formatHour(hour, settings.timeFormat)}
                </td>

                {weekDays.map((date) => {
                  // Find bookings in this day and hour
                  const slotBookings = activeBookings.filter((b) => {
                    if (selectedRoomFilter !== 'all' && b.roomId !== selectedRoomFilter) return false;
                    return (
                      b.date === date &&
                      b.startHour <= hour &&
                      b.startHour + b.durationHours > hour
                    );
                  });

                  return (
                    <td
                      key={`${date}-${hour}`}
                      className="p-1 border-r border-slate-200 align-top relative group"
                    >
                      {slotBookings.length === 0 ? (
                        <button
                          onClick={() =>
                            onOpenBookingModal({
                              roomId: selectedRoomFilter === 'all' ? 'room-1' : selectedRoomFilter,
                              hour,
                              date,
                            })
                          }
                          className="w-full h-full min-h-[52px] rounded-md border border-dashed border-transparent hover:border-indigo-300 hover:bg-indigo-50/20 text-transparent hover:text-indigo-600 flex items-center justify-center text-[10px] font-medium transition-all"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      ) : (
                        <div className="space-y-1">
                          {slotBookings.map((b) => {
                            const isRoom1 = b.roomId === 'room-1';
                            const isBallet = b.genre === 'Ballet' || b.genre === 'Ballroom';
                            const isWorkshop = b.genre === 'Contemporary' || b.genre === 'Jazz';
                            const isPrivate = b.genre === 'Hip Hop' || b.genre === 'Tap' || b.type === 'private';
                            const isMaint = b.genre === 'Maintenance' || b.type === 'maintenance';

                            let bgClass = 'bg-indigo-50 text-indigo-900 border-indigo-100';
                            if (isMaint) bgClass = 'bg-rose-50 text-rose-900 border-rose-100';
                            else if (isBallet) bgClass = 'bg-emerald-50 text-emerald-900 border-emerald-100';
                            else if (isPrivate) bgClass = 'bg-amber-50 text-amber-900 border-amber-100';

                            return (
                              <div
                                key={b.id}
                                onClick={() => onSelectBooking(b)}
                                className={`p-1.5 rounded-md border text-left cursor-pointer transition-all hover:shadow-xs ${bgClass}`}
                              >
                                <div className="flex items-center justify-between gap-1">
                                  <span className="text-[10px] font-bold truncate leading-tight">
                                    {b.title}
                                  </span>
                                  <span
                                    className={`text-[8px] font-bold px-1 rounded ${
                                      isRoom1
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-emerald-600 text-white'
                                    }`}
                                  >
                                    {isRoom1 ? 'S1' : 'S2'}
                                  </span>
                                </div>
                                <p className="text-[9px] text-slate-500 truncate mt-0.5">
                                  {b.instructor}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
