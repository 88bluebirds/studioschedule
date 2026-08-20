import React, { useState, useEffect } from 'react';
import { Clock, Activity, Users, Flame, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Booking, StudioSettings } from '../types';
import { formatTimeRange, getTodayDateString } from '../utils/dateUtils';

interface LiveStatusBarProps {
  bookings: Booking[];
  settings: StudioSettings;
  selectedDate: string;
  onSelectBooking: (booking: Booking) => void;
  onOpenBookingModal: (prefill: { roomId: 'room-1' | 'room-2'; hour: number; date: string }) => void;
}

export const LiveStatusBar: React.FC<LiveStatusBarProps> = ({
  bookings,
  settings,
  selectedDate,
  onSelectBooking,
  onOpenBookingModal,
}) => {
  const [currentHour, setCurrentHour] = useState<number>(new Date().getHours());
  const [currentMinutes, setCurrentMinutes] = useState<number>(new Date().getMinutes());
  const isToday = selectedDate === getTodayDateString();

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentHour(now.getHours());
      setCurrentMinutes(now.getMinutes());
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  // Filter bookings for the selected date
  const dayBookings = bookings.filter((b) => b.date === selectedDate && b.status !== 'cancelled');

  const getRoomLiveInfo = (roomId: 'room-1' | 'room-2') => {
    const roomBookings = dayBookings.filter((b) => b.roomId === roomId);

    // Current booking (if today)
    const current = isToday
      ? roomBookings.find((b) => currentHour >= b.startHour && currentHour < b.startHour + b.durationHours)
      : null;

    // Next upcoming booking
    const upcoming = roomBookings
      .filter((b) => (isToday ? b.startHour > currentHour : true))
      .sort((a, b) => a.startHour - b.startHour)[0];

    // Total hours booked
    const totalHours = roomBookings.reduce((sum, b) => sum + b.durationHours, 0);
    const operatingHours = Math.max(1, settings.endHour - settings.startHour + 1);
    const occupancyPercent = Math.min(100, Math.round((totalHours / operatingHours) * 100));

    return { current, upcoming, totalHours, occupancyPercent, roomBookingsCount: roomBookings.length };
  };

  const room1Info = getRoomLiveInfo('room-1');
  const room2Info = getRoomLiveInfo('room-2');

  const totalDancersToday = dayBookings.reduce((sum, b) => sum + (b.dancersCount || 0), 0);

  return (
    <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-md border border-slate-800 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 ring-1 ring-indigo-500/30">
            <Activity className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-bold text-indigo-400">
                {isToday ? 'Live Studio Overview' : 'Day Summary Overview'}
              </span>
              {isToday && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1 animate-ping" />
                  Live Now
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">
              {dayBookings.length} sessions scheduled • {totalDancersToday} total dancers expected today
            </p>
          </div>
        </div>

        {isToday && (
          <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/60 text-xs text-slate-300 self-start lg:self-auto">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span className="font-mono font-medium">
              Current Time: {String(currentHour % 12 || 12).padStart(2, '0')}:{String(currentMinutes).padStart(2, '0')} {currentHour >= 12 ? 'PM' : 'AM'}
            </span>
          </div>
        )}
      </div>

      {/* Two Rooms Live Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {/* Studio 1 Status */}
        <div className="bg-slate-800/60 rounded-xl p-3.5 border border-slate-700/50 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 ring-2 ring-indigo-500/30" />
              <h3 className="font-semibold text-sm text-slate-100">{settings.rooms['room-1'].name}</h3>
            </div>
            <span className="text-xs font-semibold text-indigo-300 bg-indigo-950/60 px-2 py-0.5 rounded-md border border-indigo-800/40">
              {room1Info.occupancyPercent}% Booked ({room1Info.totalHours}h)
            </span>
          </div>

          {room1Info.current ? (
            <div
              onClick={() => onSelectBooking(room1Info.current!)}
              className="bg-indigo-950/40 hover:bg-indigo-950/70 border border-indigo-800/60 rounded-lg p-2.5 cursor-pointer transition-colors"
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-emerald-400 uppercase tracking-wide text-[10px] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Currently In Progress
                </span>
                <span className="text-slate-300 font-mono">
                  {formatTimeRange(room1Info.current.startHour, room1Info.current.durationHours, settings.timeFormat)}
                </span>
              </div>
              <p className="font-semibold text-sm text-white truncate">{room1Info.current.title}</p>
              <p className="text-xs text-slate-300 truncate">
                Inst: {room1Info.current.instructor} • {room1Info.current.dancersCount} dancers
              </p>
            </div>
          ) : (
            <div className="bg-slate-800/40 border border-dashed border-slate-700/60 rounded-lg p-2.5 flex items-center justify-between">
              <div className="text-xs text-slate-400">
                <p className="font-medium text-slate-300">Currently Available</p>
                {room1Info.upcoming ? (
                  <p className="text-[11px] text-slate-400 truncate">
                    Next: {room1Info.upcoming.title} at {formatTimeRange(room1Info.upcoming.startHour, room1Info.upcoming.durationHours, settings.timeFormat).split('–')[0]}
                  </p>
                ) : (
                  <p className="text-[11px] text-slate-500">No more classes scheduled today</p>
                )}
              </div>
              {isToday && (
                <button
                  id="btn-quick-book-room-1"
                  onClick={() => onOpenBookingModal({ roomId: 'room-1', hour: currentHour, date: selectedDate })}
                  className="px-2.5 py-1 text-xs bg-indigo-600 hover:bg-indigo-500 text-white rounded-md font-medium transition-colors"
                >
                  + Book Now
                </button>
              )}
            </div>
          )}
        </div>

        {/* Studio 2 Status */}
        <div className="bg-slate-800/60 rounded-xl p-3.5 border border-slate-700/50 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-500/30" />
              <h3 className="font-semibold text-sm text-slate-100">{settings.rooms['room-2'].name}</h3>
            </div>
            <span className="text-xs font-semibold text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-800/40">
              {room2Info.occupancyPercent}% Booked ({room2Info.totalHours}h)
            </span>
          </div>

          {room2Info.current ? (
            <div
              onClick={() => onSelectBooking(room2Info.current!)}
              className="bg-emerald-950/40 hover:bg-emerald-950/70 border border-emerald-800/60 rounded-lg p-2.5 cursor-pointer transition-colors"
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-emerald-400 uppercase tracking-wide text-[10px] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Currently In Progress
                </span>
                <span className="text-slate-300 font-mono">
                  {formatTimeRange(room2Info.current.startHour, room2Info.current.durationHours, settings.timeFormat)}
                </span>
              </div>
              <p className="font-semibold text-sm text-white truncate">{room2Info.current.title}</p>
              <p className="text-xs text-slate-300 truncate">
                Inst: {room2Info.current.instructor} • {room2Info.current.dancersCount} dancers
              </p>
            </div>
          ) : (
            <div className="bg-slate-800/40 border border-dashed border-slate-700/60 rounded-lg p-2.5 flex items-center justify-between">
              <div className="text-xs text-slate-400">
                <p className="font-medium text-slate-300">Currently Available</p>
                {room2Info.upcoming ? (
                  <p className="text-[11px] text-slate-400 truncate">
                    Next: {room2Info.upcoming.title} at {formatTimeRange(room2Info.upcoming.startHour, room2Info.upcoming.durationHours, settings.timeFormat).split('–')[0]}
                  </p>
                ) : (
                  <p className="text-[11px] text-slate-500">No more classes scheduled today</p>
                )}
              </div>
              {isToday && (
                <button
                  id="btn-quick-book-room-2"
                  onClick={() => onOpenBookingModal({ roomId: 'room-2', hour: currentHour, date: selectedDate })}
                  className="px-2.5 py-1 text-xs bg-emerald-600 hover:bg-emerald-500 text-white rounded-md font-medium transition-colors"
                >
                  + Book Now
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
